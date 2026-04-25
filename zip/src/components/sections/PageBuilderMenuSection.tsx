import type { MenuColumn } from "@/src/blocks/registry/common";
import { cn } from "@/lib/utils";
import {
  getMenuItemPills,
  getOptionalMenuText,
} from "./menuItemMetadata";

export const PAGE_BUILDER_MENU_SECTION_VARIANTS = [
  "white",
  "surface",
  "white-outlined",
  "inverted",
] as const;

export type PageBuilderMenuSectionVariant =
  (typeof PAGE_BUILDER_MENU_SECTION_VARIANTS)[number];

export interface PageBuilderMenuSectionContent {
  title?: string;
  menuColumns: MenuColumn[];
  emptyStateText: string;
}

export interface PageBuilderMenuSectionProps {
  content: PageBuilderMenuSectionContent;
  columns: 2 | 3;
  variant?: PageBuilderMenuSectionVariant | null;
  withHeading?: boolean;
  className?: string;
  panelClassName?: string;
}

export interface PageBuilderMenuColumnsProps {
  menuColumns: MenuColumn[];
  emptyStateText: string;
  variant?: PageBuilderMenuSectionVariant | null;
  className?: string;
  gridClassName?: string;
  columnClassName?: string;
}

const MENU_SECTION_VARIANT_STYLES: Record<
  PageBuilderMenuSectionVariant,
  {
    panelClassName: string;
    headingClassName: string;
    dividerClassName: string;
    titleClassName: string;
    descriptionClassName: string;
    priceClassName: string;
    emptyStateClassName: string;
    leaderClassName: string;
    pillClassName: string;
  }
> = {
  white: {
    panelClassName: "bg-white text-on-surface",
    headingClassName: "text-on-surface",
    dividerClassName: "bg-black",
    titleClassName: "text-on-surface",
    descriptionClassName: "text-zinc-500",
    priceClassName: "text-on-surface",
    emptyStateClassName: "text-zinc-500",
    leaderClassName: "border-outline-variant",
    pillClassName: "border-outline-variant text-zinc-500",
  },
  surface: {
    panelClassName: "bg-surface text-on-surface",
    headingClassName: "text-on-surface",
    dividerClassName: "bg-black",
    titleClassName: "text-on-surface",
    descriptionClassName: "text-zinc-500",
    priceClassName: "text-on-surface",
    emptyStateClassName: "text-zinc-500",
    leaderClassName: "border-outline-variant",
    pillClassName: "border-outline-variant text-zinc-500",
  },
  "white-outlined": {
    panelClassName: "border border-black/50 bg-white text-on-surface",
    headingClassName: "text-on-surface",
    dividerClassName: "bg-black",
    titleClassName: "text-on-surface",
    descriptionClassName: "text-zinc-500",
    priceClassName: "text-on-surface",
    emptyStateClassName: "text-zinc-500",
    leaderClassName: "border-outline-variant",
    pillClassName: "border-outline-variant text-zinc-500",
  },
  inverted: {
    panelClassName: "bg-black text-white",
    headingClassName: "text-white",
    dividerClassName: "bg-white",
    titleClassName: "text-white",
    descriptionClassName: "text-white/70",
    priceClassName: "text-white",
    emptyStateClassName: "text-white/70",
    leaderClassName: "border-white/40",
    pillClassName: "border-white/40 text-white/70",
  },
};

const getGridClassName = (columns: 2 | 3) => {
  if (columns === 3) {
    return "max-w-7xl gap-y-12 md:grid-cols-2 md:gap-x-16 lg:grid-cols-3 lg:gap-x-12";
  }

  return "max-w-5xl gap-y-12 md:grid-cols-2 md:gap-x-20";
};

const menuItemPrimaryTextClassName = "font-label text-base leading-snug tracking-wider";

export function PageBuilderMenuColumns({
  menuColumns,
  emptyStateText,
  variant = "surface",
  className,
  gridClassName,
  columnClassName,
}: PageBuilderMenuColumnsProps) {
  const safeVariant = variant ?? "surface";
  const styles = MENU_SECTION_VARIANT_STYLES[safeVariant];
  const safeMenuColumns = menuColumns.filter((column) => column.items.length > 0);

  if (safeMenuColumns.length === 0) {
    return (
      <p className={cn("font-body text-sm", styles.emptyStateClassName, className)}>
        {emptyStateText}
      </p>
    );
  }

  return (
    <div className={cn("grid", gridClassName, className)}>
      {safeMenuColumns.map((column, columnIndex) => (
        <div key={columnIndex} className={cn("space-y-12", columnClassName)}>
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
                      "block break-words",
                      menuItemPrimaryTextClassName,
                      hasDetails ? "mb-1" : null,
                      styles.titleClassName,
                    )}
                  >
                    {item.title}
                  </span>
                  {hasDetails ? (
                    <div className="space-y-2">
                      {description ? (
                        <p
                          className={cn(
                            "break-words",
                            menuItemPrimaryTextClassName,
                            styles.descriptionClassName,
                          )}
                        >
                          {description}
                        </p>
                      ) : null}
                      {pills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5" data-menu-item-pills>
                          {pills.map((pill) => (
                            <span
                              key={pill.slug}
                              className={cn(
                                "inline-flex items-center rounded-full border px-2 py-1 font-label text-[10px] leading-none tracking-[0.12em] uppercase",
                                styles.pillClassName,
                              )}
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
                  <div
                    className={cn(
                      "menu-leader !m-0 min-w-[20px] flex-1 !mb-[0.3rem]",
                      styles.leaderClassName,
                    )}
                  />
                  <span
                    className={cn(
                      "shrink-0 whitespace-nowrap text-right",
                      menuItemPrimaryTextClassName,
                      styles.priceClassName,
                    )}
                  >
                    {item.priceLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function PageBuilderMenuSection({
  content,
  columns,
  variant = "surface",
  withHeading = false,
  className,
  panelClassName = "theme-radius-surface",
}: PageBuilderMenuSectionProps) {
  const safeVariant = variant ?? "surface";
  const styles = MENU_SECTION_VARIANT_STYLES[safeVariant];
  const shouldRenderHeading = withHeading && Boolean(content.title);

  return (
    <section
      className={cn("page-margin py-32", className)}
      data-section-variant={safeVariant}
    >
      <div className="mx-auto max-w-screen-2xl">
        <div
          className={cn(
            "px-4 py-24 md:px-8 lg:px-12 lg:py-32",
            styles.panelClassName,
            panelClassName,
          )}
        >
          {shouldRenderHeading ? (
            <div className="mb-20 text-center lg:mb-24">
              <h2
                className={cn(
                  "mb-4 font-headline text-4xl leading-tight tracking-[0.3rem] uppercase",
                  styles.headingClassName,
                )}
              >
                {content.title}
              </h2>
              <div className={cn("mx-auto h-[1px] w-16", styles.dividerClassName)} />
            </div>
          ) : null}

          <PageBuilderMenuColumns
            menuColumns={content.menuColumns}
            emptyStateText={content.emptyStateText}
            variant={safeVariant}
            className="mx-auto"
            gridClassName={getGridClassName(columns)}
          />
        </div>
      </div>
    </section>
  );
}