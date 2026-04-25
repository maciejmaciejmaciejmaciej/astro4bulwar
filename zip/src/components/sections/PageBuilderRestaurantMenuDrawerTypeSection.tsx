import {
  RestaurantMenuDrawerType,
  type RestaurantMenuDrawerTypeContent,
  type RestaurantMenuDrawerTypeMenuSection,
} from "./RestaurantMenuDrawerType";
import { resolveWooMenuSectionsByCategoryIds } from "@/src/blocks/registry/wooStoreApi";
import type { RestaurantMenuDrawerTypeData } from "@/src/blocks/restaurant_menu_drawer_type/schema";

export interface PageBuilderRestaurantMenuDrawerTypeSectionProps {
  content: RestaurantMenuDrawerTypeData;
  className?: string;
  resolveSectionsByCategoryIds?: (
    categoryIds: readonly number[],
    signal: AbortSignal,
  ) => Promise<readonly RestaurantMenuDrawerTypeMenuSection[]>;
}

const toRestaurantMenuDrawerTypeContent = (
  content: RestaurantMenuDrawerTypeData,
): RestaurantMenuDrawerTypeContent => {
  const shouldRenderPrimaryCta =
    content.intro.buttonLabel.trim().length > 0 && content.intro.buttonTarget.trim().length > 0;
  const shouldRenderIntroImage = content.intro.imageUrl.trim().length > 0;

  return {
    title: content.intro.heading,
    description: content.intro.description,
    primaryCta: shouldRenderPrimaryCta
      ? {
          text: content.intro.buttonLabel,
          href: content.intro.buttonTarget,
        }
      : undefined,
    introImage: shouldRenderIntroImage
      ? {
          src: content.intro.imageUrl,
          alt: content.intro.imageAlt.trim().length > 0 ? content.intro.imageAlt : content.intro.heading,
        }
      : undefined,
    cards: content.collections.map((collection) => ({
      title: collection.collectionTitle,
      description: collection.collectionDescription,
      ctaText: collection.buttonLabel,
      ctaHref: "#drawer",
      image: collection.visualUrl?.trim()
        ? {
            src: collection.visualUrl,
            alt: collection.collectionTitle,
          }
        : undefined,
      wooCategoryIds: collection.wooCategoryIds,
    })),
  };
};

export function PageBuilderRestaurantMenuDrawerTypeSection({
  content,
  className,
  resolveSectionsByCategoryIds = resolveWooMenuSectionsByCategoryIds,
}: PageBuilderRestaurantMenuDrawerTypeSectionProps) {
  return (
    <RestaurantMenuDrawerType
      content={toRestaurantMenuDrawerTypeContent(content)}
      className={className}
      drawerHeaderSource="block"
      resolveMenuSections={(card, signal) => resolveSectionsByCategoryIds(card.wooCategoryIds ?? [], signal)}
    />
  );
}