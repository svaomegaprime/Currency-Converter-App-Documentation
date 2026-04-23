import type { MetaFunction } from "react-router";
import Contact from "../components/essentials/Contact";
import { getDocumentationTitle } from "../lib/docs";

export const meta: MetaFunction = () => {
  const siteTitle = getDocumentationTitle();

  return [
    { title: `Contact - ${siteTitle}` },
    {
      name: "description",
      content: `Contact the ${siteTitle} support team.`,
    },
  ];
};

export default function ContactRoute() {
  return (
    <article className="mx-auto w-full max-w-4xl pb-16">
      <section className="rounded-3xl border border-stone-200/80 bg-white/75 p-7 shadow-sm shadow-stone-200/40 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/70 dark:shadow-black/20">
        <Contact />
      </section>
    </article>
  );
}
