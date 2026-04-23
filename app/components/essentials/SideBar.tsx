import { Link, useLocation } from "react-router";
import { getDocumentationTitle, getSidebarNavigationSections } from "../../lib/docs";
import { Close } from "./elements/Elements";

const navigationSections = getSidebarNavigationSections();
const siteTitle = getDocumentationTitle();

function NavigationLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={href}
      discover="render"
      prefetch="intent"
      onClick={onClick}
      className={`block rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
          : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function NavigationSection({
  name,
  items,
  currentPath,
  onLinkClick,
}: {
  name: string;
  items: Array<{ name: string; href: string }>;
  currentPath: string;
  onLinkClick?: () => void;
}) {
  const isSingleLinkSection =
    items.length === 1 && items[0] && items[0].name === name;

  if (isSingleLinkSection) {
    return (
      <NavigationLink
        href={items[0].href}
        label={name}
        isActive={currentPath === items[0].href}
        onClick={onLinkClick}
      />
    );
  }

  return (
    <section>
      <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
        {name === "Currency General" ? "Currency Page" : name === "Settings General" ? "Settings Page" : name}
      </h2>
      <div className="space-y-1">
        {items.map((item) => (
          <NavigationLink
            key={item.href}
            href={item.href}
            label={item.name}
            isActive={currentPath === item.href}
            onClick={onLinkClick}
          />
        ))}
      </div>
    </section>
  );
}

export default function SideBar({
  isMobileOpen,
  onMobileClose,
}: {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const { pathname } = useLocation();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-stone-950/45 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-[min(22rem,calc(100vw-2rem))] border-r border-stone-200/80 bg-white/95 p-4 shadow-2xl shadow-stone-900/20 backdrop-blur-xl transition-transform duration-300 dark:border-stone-800 dark:bg-stone-950/95 dark:shadow-black/40 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div className="flex h-full flex-col">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-stone-200/80 pb-4 dark:border-stone-800">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                {siteTitle}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                Navigation
              </p>
            </div>

            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-white"
              aria-label="Close sidebar"
            >
              <Close />
            </button>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
            {navigationSections.map((section) => (
              <NavigationSection
                key={section.name}
                name={section.name}
                items={section.items}
                currentPath={pathname}
                onLinkClick={onMobileClose}
              />
            ))}
          </nav>
        </div>
      </aside>

      <aside className="hidden lg:block lg:pr-2 sticky top-28">
        <div className="lg:sticky lg:top-28">
          <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-5 shadow-sm shadow-stone-200/40 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/80 dark:shadow-black/20 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <nav className="space-y-6">
              {navigationSections.map((section) => (
                <NavigationSection
                  key={section.name}
                  name={section.name}
                  items={section.items}
                  currentPath={pathname}
                />
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
