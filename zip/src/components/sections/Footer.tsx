import type { GlobalLayoutFooter } from "../../blocks/registry/globalLayoutContract";

interface FooterProps {
  footer: GlobalLayoutFooter;
}

const renderBrandWordmark = (brandName: string) => {
  const normalizedBrand = brandName.trim();

  return {
    leading: normalizedBrand.slice(0, 1).toUpperCase(),
    trailing: normalizedBrand.slice(1).toUpperCase(),
  };
};

export function Footer({ footer }: FooterProps) {
  const wordmark = renderBrandWordmark(footer.brand.name);

  return (
    <footer className="w-full py-20 border-t border-zinc-200 bg-zinc-50 page-margin">
      <div className="flex flex-col items-center text-center space-y-8 w-full">
        <div className="font-headline text-3xl mb-4 flex items-center">
          <span>{wordmark.leading}</span>
          <div className="w-[1px] h-8 bg-primary mx-2"></div>
          <span>{wordmark.trailing}</span>
        </div>
        <div className="grid md:grid-cols-3 gap-12 w-full max-w-4xl font-body text-sm text-zinc-500">
          <div className="space-y-2">
            <h4 className="font-label text-on-surface uppercase text-xs mb-4">{footer.address.heading}</h4>
            {footer.address.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="font-label text-on-surface uppercase text-xs mb-4">{footer.contact.heading}</h4>
            {footer.contact.items.map((item) => (
              <p key={`${item.label}:${item.href}`}>
                <a className="transition-colors hover:text-black" href={item.href}>
                  {item.label}
                </a>
              </p>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="font-label text-on-surface uppercase text-xs mb-4">{footer.hours.heading}</h4>
            {footer.hours.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 py-8 border-y border-outline-variant/20 w-full max-w-4xl">
          {[...footer.socialLinks, ...footer.legalLinks].map((item) => (
            <a
              key={`${item.label}:${item.href}`}
              className="font-label uppercase text-xs md:text-xs text-zinc-500 hover:text-black transition-colors underline underline-offset-4"
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          ))}
        </div>
        <p className="font-label uppercase text-xs text-zinc-400">{footer.copyright}</p>
      </div>
    </footer>
  );
}
