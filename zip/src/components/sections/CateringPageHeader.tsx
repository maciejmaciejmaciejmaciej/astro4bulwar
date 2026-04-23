export interface CateringPageHeaderProps {
  logoSrc: string;
  homeHref: string;
  returnLabel: string;
}

export function CateringPageHeader({ logoSrc, homeHref, returnLabel }: CateringPageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="page-margin">
        <div className="mx-auto flex h-[88px] w-full max-w-7xl items-center justify-between gap-6 px-4 md:h-[96px] md:px-0">
          <a
            href={homeHref}
            aria-label="Restauracja Bulwar Poznań"
            className="inline-flex shrink-0 items-center"
          >
            <img
              src={logoSrc}
              alt="Restauracja Bulwar Poznań"
              className="h-14 w-auto object-contain md:h-16"
            />
          </a>

          <a
            href={homeHref}
            className="text-right font-label text-[10px] uppercase text-zinc-500 transition-colors hover:text-black"
          >
            {returnLabel}
          </a>
        </div>
      </div>
    </header>
  );
}