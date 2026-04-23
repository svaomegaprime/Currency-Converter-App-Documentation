import { useEffect, useState, type ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import Header from "./components/essentials/Header";
import SideBar from "./components/essentials/SideBar";
import "./app.css";

const themeInitScript = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const mode =
        savedTheme === "light" || savedTheme === "dark"
          ? savedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";

      document.documentElement.classList.toggle("dark", mode === "dark");
      document.documentElement.setAttribute("data-theme", mode);
    } catch {}
  })();
`;

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isSidebarOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_55%)]" />

        <Header
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-[8.75rem] lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-6 lg:pt-28">
          <SideBar
            isMobileOpen={isSidebarOpen}
            onMobileClose={() => setIsSidebarOpen(false)}
          />
          <main className="min-w-0">{children}</main>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 lg:px-6">
      <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-8 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900/80 dark:shadow-black/20">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-stone-950 dark:text-white">
          {message}
        </h1>
        <p className="text-stone-600 dark:text-stone-300">{details}</p>
        {stack ? (
          <pre className="mt-6 overflow-x-auto rounded-2xl bg-stone-950 p-4 text-sm text-stone-100">
            <code>{stack}</code>
          </pre>
        ) : null}
      </div>
    </main>
  );
}
