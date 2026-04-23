import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { DocContentBlock, ResolvedDocumentationPage } from "../../lib/docs";
import { DocumentationImage } from "../essentials/elements/Elements";

function renderHtml(content: string) {
  return { __html: content };
}

function Collapsible({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="mb-8 rounded-3xl border border-stone-200/80 bg-white/75 p-6 shadow-sm shadow-stone-200/40 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/70 dark:shadow-black/20">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 transition-colors duration-200 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <motion.svg
          className="h-4 w-4 shrink-0"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <path
            d="M6 8L10 12L14 8"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function DocumentationContent({
  blocks,
}: {
  blocks: DocContentBlock[] | unknown;
}) {
  const safeBlocks = Array.isArray(blocks)
    ? (blocks as DocContentBlock[])
    : [];
  const firstCollapsibleIndex = useMemo(
    () => safeBlocks.findIndex((block) => block.type === "collapsible"),
    [safeBlocks],
  );
  const [openCollapsibleIndex, setOpenCollapsibleIndex] = useState<
    number | null
  >(firstCollapsibleIndex >= 0 ? firstCollapsibleIndex : null);

  useEffect(() => {
    setOpenCollapsibleIndex(
      firstCollapsibleIndex >= 0 ? firstCollapsibleIndex : null,
    );
  }, [firstCollapsibleIndex]);

  return (
    <>
      {safeBlocks.map((block, index) => (
        <ContentBlock
          key={`${block.type}-${index}`}
          block={block}
          isOpen={openCollapsibleIndex === index}
          onToggle={() =>
            setOpenCollapsibleIndex((current) =>
              current === index ? null : index,
            )
          }
        />
      ))}
    </>
  );
}

function ContentBlock({
  block,
  isOpen,
  onToggle,
}: {
  block: DocContentBlock;
  isOpen: boolean;
  onToggle: () => void;
}) {
  switch (block.type) {
    case "heading": {
      const className =
        block.level === 1
          ? "text-4xl font-semibold tracking-tight text-stone-950 dark:text-white"
          : block.level === 2
            ? "text-2xl font-semibold tracking-tight text-stone-950 dark:text-white"
            : "text-xl font-semibold text-stone-950 dark:text-white";

      return (
        <div className="mb-5">
          {block.level === 1 ? (
            <h1 className={className}>{block.content}</h1>
          ) : block.level === 2 ? (
            <h2 className={className}>{block.content}</h2>
          ) : (
            <h3 className={className}>{block.content}</h3>
          )}
        </div>
      );
    }

    case "subheading":
      return (
        <p
          className="mb-6 max-w-3xl text-lg leading-8 text-stone-600 dark:text-stone-300"
          dangerouslySetInnerHTML={renderHtml(block.content)}
        />
      );

    case "paragraph":
      return (
        <p
          className="mb-5 text-base leading-8 text-stone-700 dark:text-stone-300"
          dangerouslySetInnerHTML={renderHtml(block.content)}
        />
      );

    case "image":
      return (
        <div className="mb-6">
          <DocumentationImage url={block.url} />
        </div>
      );

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";

      return (
        <div className="mb-6">
          {block.label ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
              {block.label}
            </p>
          ) : null}
          <ListTag
            className={`space-y-3 pl-5 text-base leading-7 text-stone-700 dark:text-stone-300 ${
              block.ordered ? "list-decimal" : "list-disc"
            }`}
            start={block.ordered ? block.start : undefined}
          >
            {block.items.map((item, index) => (
              <li
                key={`${item}-${index}`}
                dangerouslySetInnerHTML={renderHtml(item)}
              />
            ))}
          </ListTag>
        </div>
      );
    }

    case "section":
      return (
        <section className="mb-8 rounded-3xl border border-stone-200/80 bg-white/75 p-6 shadow-sm shadow-stone-200/40 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/70 dark:shadow-black/20">
          <DocumentationContent blocks={block.contents} />
        </section>
      );
    case "collapsible": {
      if (Array.isArray(block.contents)) {
        const summary = block.heading || "Details";

        return (
          <Collapsible title={summary} isOpen={isOpen} onToggle={onToggle}>
            <DocumentationContent blocks={block.contents} />
          </Collapsible>
        );
      }

      const summary = block.heading || block.contents.heading || "Details";
      const legacyDescription =
        block.contents.desc ?? block.contents.description;

      return (
        <Collapsible title={summary} isOpen={isOpen} onToggle={onToggle}>
          {legacyDescription ? (
            <p
              className="text-base leading-8 text-stone-700 dark:text-stone-300"
              dangerouslySetInnerHTML={renderHtml(legacyDescription)}
            />
          ) : null}
        </Collapsible>
      );
    }

    default:
      return null;
  }
}

export default function DocumentationPage({
  page,
}: {
  page: ResolvedDocumentationPage;
}) {
  const firstBlock = page.contents[0];
  const hasPrimaryHeading =
    firstBlock?.type === "heading" && firstBlock.level === 1;

  return (
    <article className="mx-auto w-full max-w-4xl pb-16">
      {!hasPrimaryHeading ? (
        <header className="mb-8 rounded-3xl border border-stone-200/80 bg-linear-to-br from-white via-emerald-50 to-stone-50 p-7 shadow-sm shadow-stone-200/50 dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 dark:shadow-black/20">
          {page.sectionName ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              {page.sectionName}
            </p>
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 dark:text-white">
            {page.name}
          </h1>
        </header>
      ) : null}

      {page.contents.length > 0 ? (
        <DocumentationContent blocks={page.contents} />
      ) : (
        <section className="rounded-3xl border border-dashed border-stone-300 bg-white/70 p-8 text-stone-600 dark:border-stone-700 dark:bg-stone-900/70 dark:text-stone-300">
          This section does not have any content yet.
        </section>
      )}
    </article>
  );
}
