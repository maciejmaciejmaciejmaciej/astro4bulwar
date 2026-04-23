export interface CateringPageFooterLink {
  label: string;
  url: string;
}

export interface CateringPageFooterProps {
  logoSrc: string;
  socialLinks: readonly CateringPageFooterLink[];
  legalLinks: readonly CateringPageFooterLink[];
}

export function CateringPageFooter({
  logoSrc,
  socialLinks,
  legalLinks,
}: CateringPageFooterProps) {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50">
      <div className="page-margin py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center md:px-0">
          <a
            href="https://bulwarrestauracja.pl"
            aria-label="Restauracja Bulwar Poznań"
            className="inline-flex items-center justify-center"
          >
            <img
              src={logoSrc}
              alt="Restauracja Bulwar Poznań"
              className="h-20 w-auto object-contain"
            />
          </a>

          <a
            href="https://www.bulwarrestauracja.pl"
            className="mt-4 font-label text-[10px] uppercase text-zinc-500 underline underline-offset-4 transition-colors hover:text-black"
          >
            www.bulwarrestauracja.pl
          </a>

          <div className="mt-10 grid w-full gap-12 font-body text-sm text-zinc-500 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="mb-4 font-label text-xs uppercase text-on-surface">
                Adres
              </h4>
              <p>Restauracja &quot;BulwaR&quot;</p>
              <p>Stary Rynek 37</p>
              <p>Poznań</p>
            </div>

            <div className="space-y-2">
              <h4 className="mb-4 font-label text-xs uppercase text-on-surface">
                Kontakt
              </h4>
              <p>
                <a href="tel:+48533181171" className="transition-colors hover:text-black">
                  +48 533 181 171
                </a>
              </p>
              <p>
                <a
                  href="mailto:rezerwacje@bulwarrestauracja.pl"
                  className="transition-colors hover:text-black"
                >
                  rezerwacje@bulwarrestauracja.pl
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="mb-4 font-label text-xs uppercase text-on-surface">
                Godziny
              </h4>
              <p>Codziennie od 09.00 do 23.00</p>
            </div>
          </div>

          <div className="mt-10 flex w-full flex-wrap justify-center gap-x-8 gap-y-3 border-y border-outline-variant/20 py-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                className="font-label text-xs uppercase text-zinc-500 underline underline-offset-4 transition-colors hover:text-black"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-6 flex w-full flex-wrap justify-center gap-x-8 gap-y-3">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                className="font-label text-xs uppercase text-zinc-500 underline underline-offset-4 transition-colors hover:text-black"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="mt-8 font-label text-xs uppercase text-zinc-400">
            Restauracja BulwaR 2026 wszelkie prawa zastrzeżone
          </p>
        </div>
      </div>
    </footer>
  );
}