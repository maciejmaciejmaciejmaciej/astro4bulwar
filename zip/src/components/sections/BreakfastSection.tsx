import { Flame, Leaf, Sprout } from "lucide-react";

export interface BreakfastMenuItem {
  title: string;
  description?: string;
  priceLabel: string;
  tagSlugs?: string[];
}

export interface BreakfastMenuColumn {
  items: BreakfastMenuItem[];
}

export interface BreakfastSectionProps {
  heroTitle?: string;
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  overlayOpacity?: number;
  heroHeight?: string;
  menuColumns?: BreakfastMenuColumn[];
  emptyStateText?: string;
}

const DEFAULT_MENU_COLUMNS: BreakfastMenuColumn[] = [
  {
    items: [
      {
        title: "Cornish Earlies Potatoes",
        description: "Potato, toast & bacon",
        priceLabel: "$11",
        tagSlugs: ["vege"],
      },
      {
        title: "Parmesan-Fried Zucchini",
        description: "Tomato relish",
        priceLabel: "$13",
      },
      {
        title: "Young Leeks & Asparagus",
        description: "Crispy black garlic",
        priceLabel: "$15",
        tagSlugs: ["vegan"],
      },
    ],
  },
  {
    items: [
      {
        title: "Sage Roasted Veal Fillet",
        description: "Tomato & walnutss",
        priceLabel: "$16",
      },
      {
        title: "BBQ Spring Chicken",
        description: "Pinenut, chilli & garlic",
        priceLabel: "$14",
        tagSlugs: ["ostre"],
      },
      {
        title: "Rib-Eye On The Bone",
        description: "Scottish dry aged",
        priceLabel: "$18",
        tagSlugs: ["bardzo-ostre"],
      },
    ],
  },
];

const TAG_ICON_KEYS = ["vegan", "vege", "ostre", "bardzo-ostre"] as const;

type TagIconKey = (typeof TAG_ICON_KEYS)[number];

const TAG_ICON_MAP: Record<TagIconKey, typeof Leaf> = {
  vegan: Leaf,
  vege: Sprout,
  ostre: Flame,
  "bardzo-ostre": Flame,
};

const normalizeTagSlug = (value: string): TagIconKey | null => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return TAG_ICON_KEYS.includes(normalized as TagIconKey)
    ? (normalized as TagIconKey)
    : null;
};

const getDisplayTags = (tagSlugs: readonly string[] | undefined): TagIconKey[] => {
  if (!tagSlugs || tagSlugs.length === 0) {
    return [];
  }

  const unique = new Set<TagIconKey>();

  for (const tagSlug of tagSlugs) {
    const normalized = normalizeTagSlug(tagSlug);

    if (normalized) {
      unique.add(normalized);
    }
  }

  return Array.from(unique);
};

export function BreakfastSection({
  heroTitle = "BREAKFAST",
  backgroundImageSrc = "https://picsum.photos/seed/breakfast/1920/1080",
  backgroundImageAlt = "Breakfast menu hero image",
  overlayOpacity = 0.2,
  heroHeight = "400px",
  menuColumns = DEFAULT_MENU_COLUMNS,
  emptyStateText = "Brak pozycji w tej kategorii.",
}: BreakfastSectionProps) {
  const safeMenuColumns = menuColumns.length > 0 ? menuColumns : [];

  return (
    <section className="w-full">
      <div
        className="relative flex w-full items-center justify-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImageSrc}')`, height: heroHeight }}
        aria-label={backgroundImageAlt}
      >
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}></div>
        <h2 className="relative z-10 font-headline text-5xl md:text-7xl text-white uppercase">
          {heroTitle}
        </h2>
      </div>

      <div className="bg-white py-24">
        <div className="theme-section-wrapper">
          <div className="mx-auto max-w-5xl">
          {safeMenuColumns.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
              {safeMenuColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-10">
                  {column.items.map((item, itemIndex) => {
                    const displayTags = getDisplayTags(item.tagSlugs);

                    return (
                      <div key={`${columnIndex}-${itemIndex}`} className="flex items-end gap-3 group">
                        <div className="max-w-[70%] min-w-0 shrink-0">
                          <div className="flex items-start gap-2">
                            {displayTags.length > 0 ? (
                              <div className="flex shrink-0 items-center gap-1 pt-[1px] text-on-surface/80">
                                {displayTags.map((tag) => {
                                  const Icon = TAG_ICON_MAP[tag];

                                  return <Icon key={tag} className="size-4 shrink-0" aria-hidden="true" />;
                                })}
                              </div>
                            ) : null}

                            <div className="min-w-0">
                              <span className="mb-1 block font-headline text-sm break-words">
                                {item.title}
                              </span>
                              {item.description ? (
                                <p className="text-xs text-zinc-500 font-label break-words">
                                  {item.description}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="menu-leader min-w-0"></div>
                        <span className="shrink-0 pl-1 font-headline text-base text-right">{item.priceLabel}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-zinc-500">{emptyStateText}</p>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
