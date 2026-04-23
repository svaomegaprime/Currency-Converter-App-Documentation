import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  getDocumentationPage,
  getDocumentationTitle,
  getHeaderNavigationItems,
} from "../../lib/docs";
import { Close, Email, Menu, Moon, Sun } from "./elements/Elements";

type ThemeMode = "light" | "dark";

const navigation = getHeaderNavigationItems();
const siteTitle = getDocumentationTitle();

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);
}

export default function Header({
  isSidebarOpen,
  onSidebarToggle,
}: {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}) {
  const { pathname } = useLocation();
  const currentPage = getDocumentationPage(pathname);
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const preferredMode: ThemeMode =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    setMode(preferredMode);
    applyTheme(preferredMode);
  }, []);

  const handleModeToggle = () => {
    const newMode: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    applyTheme(newMode);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/85">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4 py-3 lg:py-4">
          <div className="flex min-w-0 items-center gap-4 lg:gap-10">
            {/* <Link
              to="/"
              discover="render"
              prefetch="intent"
              className="truncate text-lg font-semibold tracking-tight text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 sm:text-xl"
            >
              {siteTitle}
            </Link> */}
            <Link to="/">
              <img src="/favicon.png" width={40} />
            </Link>

            {navigation.length > 0 ? (
              <nav className="hidden items-center gap-2 lg:flex">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      discover="render"
                      prefetch="intent"
                      className={`rounded-full px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {currentPage?.sectionName ? (
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 xl:inline-flex">
                {currentPage.sectionName}
              </span>
            ) : null}

            <a
              href="/contact"
              className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white"
              aria-label="Send an email"
            >
              <Email />
            </a>

            <button
              type="button"
              onClick={handleModeToggle}
              className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white"
              aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              {mode === "light" ? <Moon /> : <Sun />}
            </button>

            <button
              type="button"
              onClick={onSidebarToggle}
              className={`rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white lg:hidden ${
                isSidebarOpen
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : ""
              }`}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={isSidebarOpen}
              aria-controls="mobile-sidebar"
            >
              {isSidebarOpen ? <Close /> : <Menu />}
            </button>
          </div>
        </div>

        {navigation.length > 0 ? (
          <div className="border-t border-stone-200/80 py-3 dark:border-stone-800 lg:hidden">
            <nav className="flex gap-2 overflow-x-auto pb-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    discover="render"
                    prefetch="intent"
                    className={`shrink-0 rounded-full px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
