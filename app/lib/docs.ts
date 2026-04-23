import rawData from "../data/data.json";

type HeadingBlock = {
  type: "heading";
  level: number;
  content: string;
};

type SubHeadingBlock = {
  type: "subheading";
  content: string;
};

type ParagraphBlock = {
  type: "paragraph";
  content: string;
};

type ImageBlock = {
  type: "image";
  url: string;
};

type ListBlock = {
  type: "list";
  ordered: boolean;
  start?: number;
  label?: string;
  items: string[];
};

type SectionBlock = {
  type: "section";
  contents: DocContentBlock[];
};

type CollapsibleLegacyContent = {
  heading?: string;
  desc?: string;
  description?: string;
};

type CollapsibleBlock = {
  type: "collapsible";
  heading?: string;
  contents: DocContentBlock[] | CollapsibleLegacyContent;
};

export type DocContentBlock =
  | HeadingBlock
  | SubHeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ListBlock
  | SectionBlock
  | CollapsibleBlock;

type BasePage = {
  name: string;
  href: string;
  contents: DocContentBlock[];
  sidebar?: boolean;
  header?: boolean;
};

export type SinglePage = BasePage & {
  type: "singlepage";
};

export type NestedPage = Omit<BasePage, "sidebar" | "header"> & {
  sidebar?: boolean;
  header?: boolean;
};

export type MultiPage = BasePage & {
  type: "multipage";
  pages: NestedPage[];
};

export type DocumentationPage = SinglePage | MultiPage;

type DocumentationConfig = {
  title: string;
  pages: DocumentationPage[];
};

export type ResolvedDocumentationPage = {
  name: string;
  href: string;
  contents: DocContentBlock[];
  sectionName?: string;
  sectionHref?: string;
};

export type HeaderNavigationItem = {
  name: string;
  href: string;
};

export type SidebarNavigationItem = {
  name: string;
  href: string;
};

export type SidebarNavigationSection = {
  name: string;
  href?: string;
  items: SidebarNavigationItem[];
};

const docsConfig = rawData as DocumentationConfig;

function isMultiPage(page: DocumentationPage): page is MultiPage {
  return page.type === "multipage";
}

function isRoutableHref(href: string) {
  return href.startsWith("/");
}

function normalizePathname(pathname: string) {
  if (!pathname) {
    return "/";
  }

  const [pathWithoutHash] = pathname.split("#");
  const [pathWithoutQuery] = pathWithoutHash.split("?");
  const normalized = pathWithoutQuery.replace(/\/+$/, "");

  return normalized || "/";
}

function isHeaderNavigationVisible(page: Pick<BasePage, "header">) {
  return page.header !== false;
}

function isSidebarNavigationVisible(page: Pick<BasePage, "sidebar">) {
  return page.sidebar !== false;
}

function createResolvedPages() {
  const resolvedPages: ResolvedDocumentationPage[] = [];

  for (const page of docsConfig.pages) {
    if (isRoutableHref(page.href)) {
      resolvedPages.push({
        name: page.name,
        href: normalizePathname(page.href),
        contents: page.contents,
      });
    }

    if (!isMultiPage(page)) {
      continue;
    }

    for (const nestedPage of page.pages) {
      if (!isRoutableHref(nestedPage.href)) {
        continue;
      }

      resolvedPages.push({
        name: nestedPage.name,
        href: normalizePathname(nestedPage.href),
        contents: nestedPage.contents,
        sectionName: page.name,
        sectionHref: isRoutableHref(page.href)
          ? normalizePathname(page.href)
          : undefined,
      });
    }
  }

  return resolvedPages;
}

function getLinkTarget(page: DocumentationPage) {
  if (isRoutableHref(page.href)) {
    return normalizePathname(page.href);
  }

  if (!isMultiPage(page)) {
    return undefined;
  }

  return page.pages.find((nestedPage) => isRoutableHref(nestedPage.href))?.href;
}

export function getDocumentationTitle() {
  return docsConfig.title;
}

const resolvedPages = createResolvedPages();

export function getDocumentationPage(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  return resolvedPages.find((page) => page.href === normalizedPathname) ?? null;
}

export function getDefaultDocumentationPage() {
  return getDocumentationPage("/") ?? resolvedPages.at(0) ?? null;
}

export function getHeaderNavigationItems(): HeaderNavigationItem[] {
  return docsConfig.pages
    .filter((page) => isHeaderNavigationVisible(page))
    .flatMap((page) => {
      const href = getLinkTarget(page);

      if (!href) {
        return [];
      }

      return [{ name: page.name, href: normalizePathname(href) }];
    });
}

export function getSidebarNavigationSections(): SidebarNavigationSection[] {
  return docsConfig.pages.flatMap((page) => {
    if (!isMultiPage(page)) {
      if (!isRoutableHref(page.href) || !isSidebarNavigationVisible(page)) {
        return [];
      }

      return [
        {
          name: page.name,
          items: [{ name: page.name, href: normalizePathname(page.href) }],
        },
      ];
    }

    const items = [
      ...(isRoutableHref(page.href) && isSidebarNavigationVisible(page)
        ? [{ name: page.name, href: normalizePathname(page.href) }]
        : []),
      ...page.pages
        .filter(
          (nestedPage) =>
            isRoutableHref(nestedPage.href) &&
            isSidebarNavigationVisible(nestedPage),
        )
        .map((nestedPage) => ({
          name: nestedPage.name,
          href: normalizePathname(nestedPage.href),
        })),
    ];

    if (items.length === 0) {
      return [];
    }

    return [
      {
        name: page.name,
        href: isRoutableHref(page.href)
          ? normalizePathname(page.href)
          : undefined,
        items,
      },
    ];
  });
}

export function getPageDescription(page: ResolvedDocumentationPage) {
  const queue = [...page.contents];

  while (queue.length > 0) {
    const block = queue.shift();

    if (!block) {
      continue;
    }

    if (block.type === "paragraph" || block.type === "subheading") {
      return block.content.replace(/<[^>]+>/g, "");
    }

    if (block.type === "section") {
      queue.unshift(...block.contents);
      continue;
    }

    if (block.type === "collapsible") {
      if (Array.isArray(block.contents)) {
        queue.unshift(...block.contents);
        continue;
      }

      const legacyDescription =
        block.contents.desc ?? block.contents.description;

      if (legacyDescription) {
        return legacyDescription.replace(/<[^>]+>/g, "");
      }
    }
  }

  return `${page.name} documentation for ${docsConfig.title}.`;
}
