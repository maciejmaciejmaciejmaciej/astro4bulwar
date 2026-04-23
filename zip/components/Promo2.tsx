import {
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import type { MenuColumn } from "@/src/blocks/registry/common";
import { cn } from "@/lib/utils";
import {
  getMenuItemPills,
  getOptionalMenuText,
} from "@/src/components/sections/menuItemMetadata";

import type {
  StoryTeamShowcaseIcon,
  StoryTeamShowcaseImageContent,
  StoryTeamShowcaseMemberContent,
} from "./PROMOCJA_sezonowa";

export interface Promo2Content {
  eyebrow: string;
  title: string;
  members: StoryTeamShowcaseMemberContent[];
  story: string;
  image: StoryTeamShowcaseImageContent;
  menuColumns: MenuColumn[];
  emptyStateText: string;
}

export interface Promo2Props {
  content?: Promo2Content;
  className?: string;
}

const promo2Icons: Record<StoryTeamShowcaseIcon, LucideIcon> = {
  "calendar-days": ArrowRight,
  "utensils-crossed": ArrowRight,
};

export const DEFAULT_PROMO2_CONTENT: Promo2Content = {
  eyebrow: "Our Crew, Our story",
  title: "Our story",
  members: [
    {
      icon: "calendar-days",
      name: "John Doe1",
      role: "Creative Director1",
    },
    {
      icon: "utensils-crossed",
      name: "John Doe2",
      role: "Creative Director2",
    },
  ],
  story:
    "We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect. Our story is built on passion, innovation, and the drive to bring meaningful ideas to life.",
  image: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri4/img10.png",
    alt: "about us image",
  },
  menuColumns: [
    {
      items: [
        {
          title: "Spring asparagus",
          description: "Brown butter, hazelnut",
          priceLabel: "42 zł",
          tagSlugs: [],
        },
        {
          title: "Charred cabbage",
          description: "Apple glaze, dill oil",
          priceLabel: "36 zł",
          tagSlugs: [],
        },
      ],
    },
    {
      items: [
        {
          title: "Burnt cheesecake",
          description: "Cherry, vanilla",
          priceLabel: "28 zł",
          tagSlugs: [],
        },
        {
          title: "Smoked trout",
          description: "Cucumber, cultured cream",
          priceLabel: "44 zł",
          tagSlugs: [],
        },
      ],
    },
  ],
  emptyStateText: "Brak pozycji w tej kategorii.",
};

export function Promo2({
  content = DEFAULT_PROMO2_CONTENT,
  className,
}: Promo2Props) {
  const safeMenuColumns = content.menuColumns.filter((column) => column.items.length > 0);

  return (
    <section className={cn("page-margin py-32", className)}>
      <div className="mx-auto max-w-screen-2xl space-y-10 lg:space-y-20">
        <div className="w-full grid-cols-6 gap-10 lg:grid">
          <div />
          <h1 className="col-span-4 font-headline text-5xl font-medium tracking-[0.2rem] uppercase leading-none lg:text-8xl">
            {content.title}
          </h1>
        </div>

        <div className="grid-cols-6 space-y-12 lg:grid lg:space-y-0 xl:gap-10">
          <p className="hidden font-label text-xs tracking-[0.16rem] uppercase text-zinc-500 lg:block">
            {content.eyebrow}
          </p>

          <div className="col-span-2 space-y-5">
            {content.members.map((member, index) => {
              const Icon = promo2Icons[member.icon];

              return (
                <div key={`${member.name}-${index}`} className="flex items-center gap-4 rounded-[4px]">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-[4px] bg-surface-container-low text-on-surface">
                    <Icon className="size-5 stroke-[1.25] text-black" />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-medium tracking-tight text-on-surface">
                      {member.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-span-3 mt-32 lg:mt-0">
            <h2 className="lead-copy text-on-surface">{content.story}</h2>
          </div>
        </div>

        <div className="mt-4 w-full">
          <img
            src={content.image.src}
            alt={content.image.alt}
            className="h-150 w-full rounded-t-[4px] rounded-b-none object-cover"
          />
          <div className="w-full bg-surface py-32">
            {safeMenuColumns.length > 0 ? (
              <div className="max-w-5xl mx-auto grid gap-y-12 px-4 md:grid-cols-2 md:gap-x-20 md:gap-y-12 md:px-0">
                {safeMenuColumns.map((column, columnIndex) => (
                  <div key={columnIndex} className="space-y-12">
                    {column.items.map((item, itemIndex) => {
                      const description = getOptionalMenuText(item.description);
                      const pills = getMenuItemPills(item.tagSlugs);
                      const hasDetails = Boolean(description) || pills.length > 0;

                      return (
                        <div
                          key={`${columnIndex}-${itemIndex}`}
                          className="flex items-end gap-1 md:gap-3"
                        >
                          <div className="flex min-w-0 w-fit max-w-[calc(100%-6rem)] flex-col md:max-w-none md:flex-1">
                            <span
                              className={cn(
                                "block break-words font-headline text-base leading-tight tracking-widest text-on-surface",
                                hasDetails ? "mb-1" : null,
                              )}
                            >
                              {item.title}
                            </span>
                            {hasDetails ? (
                              <div className="space-y-2">
                                {description ? (
                                  <p className="break-words font-label text-base leading-snug tracking-wider text-zinc-500">
                                    {description}
                                  </p>
                                ) : null}
                                {pills.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5" data-menu-item-pills>
                                    {pills.map((pill) => (
                                      <span
                                        key={pill.slug}
                                        className="inline-flex items-center rounded-full border border-outline-variant px-2 py-1 font-label text-[10px] leading-none tracking-[0.12em] uppercase text-zinc-500"
                                      >
                                        {pill.label}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>

                          <div className="flex min-w-0 flex-1 items-end gap-1 md:gap-3">
                            <div className="menu-leader !m-0 min-w-[20px] flex-1 !mb-[0.3rem]" />
                            <span className="shrink-0 whitespace-nowrap font-headline text-lg text-right text-on-surface">
                              {item.priceLabel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-5xl mx-auto px-4 md:px-0">
                <p className="font-body text-sm text-zinc-500">{content.emptyStateText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}