import type { Route } from "./+types/home";
import DocumentationPage from "../components/documentation/DocumentationPage";
import {
  getDefaultDocumentationPage,
  getDocumentationTitle,
  getPageDescription,
} from "../lib/docs";

export function loader(_: Route.LoaderArgs) {
  const page = getDefaultDocumentationPage();

  if (!page) {
    throw new Response("No documentation pages are configured.", {
      status: 404,
    });
  }

  return { page };
}

export function meta({ data }: Route.MetaArgs) {
  const page = data?.page;
  const siteTitle = getDocumentationTitle();

  return [
    {
      title: page ? `${page.name} - ${siteTitle}` : `${siteTitle} Documentation`,
    },
    {
      name: "description",
      content: page ? getPageDescription(page) : `${siteTitle} documentation.`,
    },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <DocumentationPage page={loaderData.page} />;
}
