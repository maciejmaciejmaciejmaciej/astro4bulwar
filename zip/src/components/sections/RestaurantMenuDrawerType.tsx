import { useEffect, useRef, useState } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MenuColumn } from "@/src/blocks/registry/common";

import { PageBuilderMenuColumns } from "./PageBuilderMenuSection";

export interface RestaurantMenuDrawerTypeCardContent {
  icon: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export interface RestaurantMenuDrawerTypeContent {
  title: string;
  introImage: {
    src: string;
    alt: string;
  };
  cards: RestaurantMenuDrawerTypeCardContent[];
}

export interface RestaurantMenuDrawerTypeProps {
  content?: RestaurantMenuDrawerTypeContent;
  className?: string;
}

export const DEFAULT_RESTAURANT_MENU_DRAWER_TYPE_CONTENT: RestaurantMenuDrawerTypeContent = {
  title: "Our Services",
  introImage: {
    src: "/react/images/about_front.jpg",
    alt: "Pionowe ujęcie restauracyjnego wnętrza",
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
  "break-inside-avoid group relative flex w-full cursor-pointer flex-col overflow-hidden bg-surface p-10 text-left transition-colors duration-500 hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black";

const DRAWER_TRANSITION_MS = 450;

const DRAWER_MENU_SECTIONS: ReadonlyArray<{
  heading: string;
  menuColumns: MenuColumn[];
}> = [
  {
    heading: "STARTERS",
    menuColumns: [
      {
        items: [
          {
            title: "Beef Tartare",
            description: "Smoked yolk, pickled shallot, sourdough crisp",
            priceLabel: "48 PLN",
            tagSlugs: [],
          },
          {
            title: "Roasted Beetroot",
            description: "Goat cheese, hazelnut, brown butter vinaigrette",
            priceLabel: "34 PLN",
            tagSlugs: ["vege"],
          },
          {
            title: "Baltic Herring",
            description: "Apple, onion, cultured cream",
            priceLabel: "36 PLN",
            tagSlugs: [],
          },
          {
            title: "Wild Mushroom Broth",
            description: "Lovage oil, hand-cut noodles",
            priceLabel: "29 PLN",
            tagSlugs: ["vegan"],
          },
          {
            title: "Charred Cabbage",
            description: "Fermented chili, rye crumble",
            priceLabel: "31 PLN",
            tagSlugs: [],
          },
          {
            title: "Duck Liver Mousse",
            description: "Cherry compote, brioche",
            priceLabel: "39 PLN",
            tagSlugs: [],
          },
        ],
      },
    ],
  },
  {
    heading: "MAINS",
    menuColumns: [
      {
        items: [
          {
            title: "Pike Perch",
            description: "Burnt butter, celery puree, dill oil",
            priceLabel: "68 PLN",
            tagSlugs: [],
          },
          {
            title: "Aged Sirloin",
            description: "Pepper jus, glazed shallots, pommes anna",
            priceLabel: "86 PLN",
            tagSlugs: [],
          },
          {
            title: "Handmade Silesian Dumplings",
            description: "Braised beef cheek, root vegetables",
            priceLabel: "59 PLN",
            tagSlugs: [],
          },
          {
            title: "Cauliflower Steak",
            description: "Sunflower seed sauce, herbs, lemon",
            priceLabel: "46 PLN",
            tagSlugs: ["vegan"],
          },
          {
            title: "Slow Roasted Chicken",
            description: "Tarragon sauce, spring peas",
            priceLabel: "57 PLN",
            tagSlugs: [],
          },
          {
            title: "Potato Gnocchi",
            description: "Comte, sage, browned butter",
            priceLabel: "52 PLN",
            tagSlugs: ["vege"],
          },
          {
            title: "Chocolate Delice",
            description: "Sea salt caramel, creme fraiche",
            priceLabel: "28 PLN",
            tagSlugs: [],
          },
        ],
      },
    ],
  },
];

export function RestaurantMenuDrawerType({
  content = DEFAULT_RESTAURANT_MENU_DRAWER_TYPE_CONTENT,
  className,
}: RestaurantMenuDrawerTypeProps) {
  const [drawerCard, setDrawerCard] = useState<RestaurantMenuDrawerTypeCardContent>(content.cards[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerLeft, setDrawerLeft] = useState<number | null>(null);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const cardsColumnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cardsColumn = cardsColumnRef.current;

    if (!cardsColumn) {
      return undefined;
    }

    const updateDrawerLeft = () => {
      setDrawerLeft(cardsColumn.getBoundingClientRect().left);
      setIsDesktopViewport(window.matchMedia("(min-width: 1024px)").matches);
    };

    updateDrawerLeft();

    const resizeObserver = new ResizeObserver(updateDrawerLeft);
    resizeObserver.observe(cardsColumn);
    window.addEventListener("resize", updateDrawerLeft);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDrawerLeft);
    };
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  return (
    <section
      data-section-id="restaurant_menu_drawer_type"
      className={cn("bg-white py-32 page-margin", className)}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="space-y-8 self-start lg:sticky lg:top-32 lg:w-1/3">
            <h2 className="font-headline text-4xl uppercase">
              {content.title}
            </h2>
            <div className="h-[1px] w-12 bg-primary"></div>
            <div className="overflow-hidden bg-surface">
              <img
                src={content.introImage.src}
                alt={content.introImage.alt}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>

          <div ref={cardsColumnRef} className="relative lg:w-2/3">
            <div className="columns-1 gap-6 space-y-6 md:columns-2">
              {content.cards.map((card, index) => (
                <button
                  key={`${card.title}-${index}`}
                  type="button"
                  className={cardClassName}
                  onClick={() => {
                    setDrawerCard(card);
                    setIsDrawerOpen(true);
                  }}
                  aria-label={`Open ${card.title} drawer`}
                >
                  <div className="relative z-10 space-y-8">
                    <span className="material-symbols-outlined text-4xl text-zinc-400 transition-colors duration-500 group-hover:text-black">
                      {card.icon}
                    </span>
                    <div>
                      <h3 className="mb-4 font-headline text-lg uppercase">
                        {card.title}
                      </h3>
                      <p className="font-body text-xs text-zinc-500">
                        {card.description}
                      </p>
                    </div>
                    <div className="pt-4">
                      <span className="inline-flex items-center text-xs font-label uppercase text-zinc-500 transition-colors group-hover:text-black">
                        {card.ctaText}
                        <span className="material-symbols-outlined ml-2 text-sm">
                          arrow_forward
                        </span>
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div
              role="dialog"
              aria-modal={isDrawerOpen ? true : undefined}
              aria-hidden={isDrawerOpen ? undefined : true}
              style={{
                ...(isDesktopViewport && drawerLeft !== null ? { left: drawerLeft } : {}),
                transitionDuration: `${DRAWER_TRANSITION_MS}ms`,
              }}
              className={cn(
                "fixed inset-0 z-50 overflow-visible bg-white transition-transform ease-out will-change-transform lg:inset-y-0 lg:right-0 lg:left-auto lg:border-l lg:border-black",
                isDrawerOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none",
                drawerLeft === null ? "lg:left-0" : "",
              )}
              data-state={isDrawerOpen ? "open" : "closed"}
              data-transition="slide-horizontal"
              data-duration={DRAWER_TRANSITION_MS}
              data-direction={isDrawerOpen ? "left" : "right"}
            >
              <div className="flex h-full flex-col overflow-y-auto overscroll-contain">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="absolute right-6 top-6 z-[80] flex size-11 items-center justify-center rounded-full border border-zinc-300 bg-zinc-100 text-zinc-500 transition-colors hover:border-zinc-400 hover:text-black sm:right-8 sm:top-8 lg:left-0 lg:right-auto lg:top-12 lg:-translate-x-1/2"
                  aria-label="Close drawer"
                >
                  <X className="size-4 stroke-[1.25]" />
                </button>

                <div className="min-h-full px-8 pb-12 pt-24 sm:px-10 sm:pt-28 lg:px-12 lg:pb-16 lg:pt-16">
                  <div className="max-w-2xl space-y-4 border-b border-black/10 pb-8">
                    <h3 className="font-headline text-3xl uppercase sm:text-4xl">
                      {drawerCard.title}
                    </h3>
                    <p className="max-w-xl font-body text-sm text-zinc-500">
                      {drawerCard.description}
                    </p>
                  </div>

                  <div className="mx-auto max-w-3xl space-y-14 pt-10 lg:space-y-16 lg:pt-12">
                    {DRAWER_MENU_SECTIONS.map((section) => (
                      <div key={section.heading} className="space-y-6 lg:space-y-7">
                        <h4 className="text-left font-label text-[11px] uppercase text-zinc-500">
                          {section.heading}
                        </h4>
                        <PageBuilderMenuColumns
                          menuColumns={section.menuColumns}
                          emptyStateText="Brak pozycji w tej sekcji."
                          variant="white"
                          gridClassName="mx-auto max-w-3xl gap-y-10"
                          columnClassName="space-y-10"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}