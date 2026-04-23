import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OurServicesCardContent {
  icon: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export interface OurServicesContent {
  title: string;
  description: string;
  primaryCta?: {
    text: string;
    href?: string;
  };
  cards: OurServicesCardContent[];
}

export interface OurServicesProps {
  content?: OurServicesContent;
  className?: string;
}

export const DEFAULT_OUR_SERVICES_CONTENT: OurServicesContent = {
  title: "Our Services",
  description:
    "From intimate chef's table experiences to grand private events, we offer a range of bespoke culinary services designed to elevate your dining experience. Every detail is meticulously crafted to ensure unforgettable moments.",
  primaryCta: {
    text: "VIEW ALL SERVICES",
  },
  cards: [
    {
      icon: "restaurant",
      title: "FINE DINING",
      description:
        "Experience our meticulously crafted tasting menus in an elegant setting, where every dish tells a story of local terroir and culinary innovation.",
      ctaText: "Explore Menu",
      ctaHref: "#",
    },
    {
      icon: "wine_bar",
      title: "WINE PAIRING",
      description:
        "Expertly curated wine selections from our master sommelier to perfectly complement every dish on our tasting menu, featuring rare vintages and local discoveries.",
      ctaText: "View Cellar",
      ctaHref: "#",
    },
    {
      icon: "celebration",
      title: "PRIVATE EVENTS",
      description:
        "Exclusive spaces and tailored menus for your most important celebrations and corporate gatherings. Our dedicated events team ensures flawless execution.",
      ctaText: "Book Event",
      ctaHref: "#",
    },
    {
      icon: "ramen_dining",
      title: "CHEF'S TABLE",
      description:
        "An intimate, interactive dining experience directly overlooking our kitchen. Watch our culinary team at work and interact directly with the executive chef.",
      ctaText: "Reserve Seat",
      ctaHref: "#",
    },
    {
      icon: "eco",
      title: "ORGANIC SOURCING",
      description:
        "We partner exclusively with local, sustainable farms to bring the freshest organic ingredients to your table, supporting our community and environment.",
      ctaText: "Our Partners",
      ctaHref: "#",
    },
  ],
};

const cardClassName =
  "break-inside-avoid group relative overflow-hidden bg-surface p-10 flex flex-col transition-colors duration-500 hover:bg-surface-container-low theme-radius-surface";

const cardLinkClassName =
  "inline-flex items-center text-xs font-label uppercase tracking-widest text-zinc-500 hover:text-black transition-colors";

const primaryButtonClassName =
  "bg-primary text-on-primary px-8 py-4 font-label tracking-[0.1em] uppercase text-sm hover:opacity-80 transition-opacity theme-radius-control mt-4";

export function OurServices({
  content = DEFAULT_OUR_SERVICES_CONTENT,
  className,
}: OurServicesProps) {
  return (
    <section className={cn("bg-white py-32", className)}>
      <div className="theme-section-wrapper">
        <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3 space-y-8 lg:sticky lg:top-32 self-start">
            <h2 className="font-headline text-4xl uppercase">
              {content.title}
            </h2>
            <div className="w-12 h-[1px] bg-primary"></div>
            <p className="text-zinc-500 font-body text-sm">
              {content.description}
            </p>
            {content.primaryCta?.href ? (
              <Button
                nativeButton={false}
                className={primaryButtonClassName}
                render={<a href={content.primaryCta.href} />}
              >
                {content.primaryCta.text}
              </Button>
            ) : content.primaryCta ? (
              <Button className={primaryButtonClassName}>
                {content.primaryCta.text}
              </Button>
            ) : null}
          </div>

          <div className="lg:w-2/3 columns-1 md:columns-2 gap-6 space-y-6">
            {content.cards.map((card, index) => (
              <div
                key={`${card.title}-${index}`}
                className={cardClassName}
              >
                <div className="relative z-10 space-y-8">
                  <span className="material-symbols-outlined text-4xl text-zinc-400 group-hover:text-black transition-colors duration-500">
                    {card.icon}
                  </span>
                  <div>
                    <h3 className="font-headline text-lg uppercase mb-4">
                      {card.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-body">
                      {card.description}
                    </p>
                  </div>
                  <div className="pt-4">
                    <a href={card.ctaHref} className={cardLinkClassName}>
                      {card.ctaText}
                      <span className="material-symbols-outlined text-sm ml-2">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
