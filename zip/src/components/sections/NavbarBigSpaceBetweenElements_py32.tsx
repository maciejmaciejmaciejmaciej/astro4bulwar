import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { GlobalLayoutNavbar } from "../../blocks/registry/globalLayoutContract";

const NAV_ITEMS = [
  {
    label: "Start",
    href: "#",
    items: [
      { label: "Strona glowna", href: "#" },
      { label: "O restauracji", href: "#" },
      { label: "Aktualnosci", href: "#" },
      { label: "Galeria", href: "#" },
    ],
  },
  {
    label: "Menu",
    href: "#",
    items: [
      { label: "Sniadania", href: "#" },
      { label: "Lunch", href: "#" },
      { label: "Kolacje", href: "#" },
      { label: "Desery i wina", href: "#" },
    ],
  },
  {
    label: "Catering",
    href: "#",
    items: [
      { label: "Catering firmowy", href: "#" },
      { label: "Przyjecia rodzinne", href: "#" },
      { label: "Menu swiateczne", href: "#" },
      { label: "Dostawa i odbior", href: "#" },
    ],
  },
  {
    label: "Przyjecia",
    href: "#",
    items: [
      { label: "Eventy prywatne", href: "#" },
      { label: "Wesela i komunie", href: "#" },
      { label: "Spotkania firmowe", href: "#" },
      { label: "Sala i taras", href: "#" },
    ],
  },
  {
    label: "Kontakt",
    href: "#",
    items: [
      { label: "Dane kontaktowe", href: "#" },
      { label: "Dojazd", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Newsletter", href: "#" },
    ],
  },
] as const;

const FOOTER_LINKS = [
  { label: "Polityka prywatnosci", href: "#" },
  { label: "Regulamin", href: "#" },
];

const COMPANY_LINKS = [
  { label: "+48 500 200 300", href: "#" },
  { label: "Bulwar Poznan 2026", href: "#" },
];

interface NavbarBigSpaceBetweenElements_py32Props {
  className?: string;
  logoSrc?: string;
  navbar?: GlobalLayoutNavbar;
}

export function NavbarBigSpaceBetweenElements_py32({
  className,
  logoSrc,
  navbar,
}: NavbarBigSpaceBetweenElements_py32Props) {
  const [isOpen, setIsOpen] = useState(false);
  const brandName = navbar?.brand.name ?? "BULWAR";
  const brandHref = navbar?.brand.href ?? "#";
  const brandLogoSrc = navbar?.brand.logoSrc ?? logoSrc;
  const brandLogoAlt = navbar?.brand.logoAlt ?? brandName;
  const primaryItems = navbar?.primaryItems ?? NAV_ITEMS;
  const companyLinks = navbar?.companyLinks ?? COMPANY_LINKS;
  const footerLinks = navbar?.legalLinks ?? FOOTER_LINKS;

  return (
    <section className={clsx("bg-white text-on-surface", className)}>
      <div className="theme-section-wrapper">
          <nav className={clsx("relative transition-colors duration-200", isOpen ? "bg-surface-container-low" : "bg-white")}>
          <div
            className={clsx(
              "relative z-10 px-6 py-8 md:px-10 xl:py-9 transition-colors duration-200 lg:px-0",
              isOpen ? "bg-surface-container-low" : "bg-white",
            )}
          >
            <div className="flex items-center justify-between gap-4 lg:hidden">
              <div className="min-w-[132px]">
                <a href={brandHref} className="inline-flex items-center transition-opacity hover:opacity-70">
                  {brandLogoSrc ? (
                    <img
                      src={brandLogoSrc}
                      alt={brandLogoAlt}
                      className="h-12 w-auto object-contain md:h-14"
                    />
                  ) : (
                    <span className="font-headline text-4xl text-black">
                      {brandName.toUpperCase()}
                    </span>
                  )}
                </a>
              </div>

              <div className="flex min-w-[132px] justify-end">
                <MenuToggle setIsOpen={setIsOpen} isOpen={isOpen} />
              </div>
            </div>

            <div className="hidden lg:grid lg:grid-cols-[180px_minmax(0,1fr)_80px] lg:items-center lg:gap-10">
              <div className="flex items-center justify-start">
                <a href={brandHref} className="inline-flex items-center transition-opacity hover:opacity-70">
                  {brandLogoSrc ? (
                    <img
                      src={brandLogoSrc}
                      alt={brandLogoAlt}
                      className="h-14 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-headline text-4xl text-black">
                      {brandName.toUpperCase()}
                    </span>
                  )}
                </a>
              </div>

              <div className="grid grid-cols-5 gap-10 xl:gap-14">
                {primaryItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="justify-self-start font-label uppercase text-sm text-black transition-opacity hover:opacity-70"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="flex items-center justify-end">
                <MenuToggle setIsOpen={setIsOpen} isOpen={isOpen} />
              </div>
            </div>
          </div>

          <AnimatePresence initial={false} mode="wait">
            {isOpen ? (
              <motion.div
                className="relative z-20 bg-surface-container-low px-6 pb-10 pt-10 shadow-[0_18px_40px_rgba(15,23,42,0.10)] md:px-10 lg:px-0 xl:pb-12"
                initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.55 }}
                animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
                exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0.55 }}
                transition={{
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <div className="flex lg:hidden">
                  <ul className="flex w-full flex-col gap-6 sm:gap-7">
                    {primaryItems.map((item) => (
                      <li key={item.label}>
                        <a href={item.href} className="inline-flex items-center gap-3 font-headline text-2xl uppercase transition-opacity hover:opacity-70 sm:text-3xl">
                          <span>{item.label}</span>
                          <ArrowUpRight className="size-4" />
                        </a>
                        <ul className="mt-3 space-y-2 border-l border-zinc-200 pl-4">
                          {item.items.map((childItem) => (
                            <li key={childItem.label}>
                              <a href={childItem.href} className="font-body text-sm text-zinc-500 transition-colors hover:text-black">
                                {childItem.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden lg:grid lg:grid-cols-[180px_minmax(0,1fr)_80px] lg:items-start lg:gap-10">
                  <div aria-hidden="true" />

                  <div className="grid grid-cols-5 gap-10 xl:gap-14">
                    {primaryItems.map((section) => (
                      <ul key={section.label} className="space-y-4 text-left">
                        {section.items.map((item) => (
                          <li
                            key={item.label}
                            className="group flex items-center gap-2 text-zinc-500 transition-colors hover:text-black"
                          >
                            <a
                              href={item.href}
                              className="font-body text-sm transition-colors group-hover:text-black"
                            >
                              {item.label}
                            </a>
                            <ArrowUpRight className="size-3.5 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100" />
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>

                  <div aria-hidden="true" />
                </div>

                <div className="mt-10 flex w-full flex-col gap-3 border-t border-zinc-200 pt-6 text-sm text-secondary lg:mt-24 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
                    {companyLinks.map((item) => (
                      <a key={item.label} href={item.href} className="font-label text-[11px] uppercase transition-colors hover:text-on-surface">
                        {item.label}
                      </a>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
                    {footerLinks.map((item) => (
                      <a key={item.label} href={item.href} className="font-label text-[11px] uppercase transition-colors hover:text-on-surface">
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </nav>
      </div>
    </section>
  );
}

interface MenuToggleProps {
  className?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

function MenuToggle({ className, setIsOpen, isOpen }: MenuToggleProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Zamknij menu" : "Otworz menu"}
      className={clsx(
        "relative flex h-10 w-10 items-center justify-center lg:w-14",
        className,
      )}
      onClick={() => setIsOpen((previousValue) => !previousValue)}
    >
      <motion.span
        animate={{ y: isOpen ? 0 : -4, rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute h-px w-8 bg-on-surface lg:w-10"
      />
      <motion.span
        animate={{ y: isOpen ? 0 : 4, rotate: isOpen ? -45 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute h-px w-8 bg-on-surface lg:w-10"
      />
    </button>
  );
}