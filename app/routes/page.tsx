import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import DocumentationPage from "../components/documentation/DocumentationPage";
import {
  getDocumentationPage,
  getDocumentationTitle,
  getPageDescription,
} from "../lib/docs";

export function loader({ params }: LoaderFunctionArgs) {
  const pathname = `/${params["*"] ?? ""}`;
  const page = getDocumentationPage(pathname);

  if (!page) {
    throw new Response("Page not found", { status: 404 });
  }

  return { page };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const siteTitle = getDocumentationTitle();

  if (!data?.page) {
    return [{ title: `${siteTitle} Documentation` }];
  }

  return [
    { title: `${data.page.name} - ${siteTitle}` },
    { name: "description", content: getPageDescription(data.page) },
  ];
};

export default function DocumentationRoute() {
  const { page } = useLoaderData<typeof loader>();

  return <DocumentationPage page={page} />;
}
