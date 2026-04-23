import type { PageBuilderSchema } from "./pageBuilderSchema";
import { parsePageBuilderSchema } from "./pageBuilderSchema";
import type {
  MenuCategoryPhotoParallaxFullWidthData,
  MenuCategoryPhotoParallaxFullWidthSource,
} from "../menu-category-photo-parallax-full-width/schema";
import type {
  MenuThreeColumnsWithWithHeadingNoImgData,
  MenuThreeColumnsWithWithHeadingNoImgSource,
} from "../menu_three_columns_with_with_heading_no_img/schema";
import type {
  MenuTwoColumnsWithNoHeadingNoImgData,
  MenuTwoColumnsWithNoHeadingNoImgSource,
} from "../menu_two_columns_with_no_heading_no_img/schema";
import type {
  MenuTwoColumnsWithWithHeadingNoImgData,
  MenuTwoColumnsWithWithHeadingNoImgSource,
} from "../menu_two_columns_with_with_heading_no_img/schema";
import type {
  MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxData,
  MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSource,
} from "../menu_two_columns_with_with_heading_with_img_fullwidth_paralax/schema";
import type {
  OfertaPostsSectionData,
  OfertaPostsSectionSource,
} from "../oferta_posts_section/schema";
import type { Promo2Data, Promo2Source } from "../promo2/schema";
import {
  resolveMenuCategoryPhotoParallaxFullWidthSource,
  resolveMenuThreeColumnsWithWithHeadingNoImgSource,
  resolveMenuTwoColumnsWithNoHeadingNoImgSource,
  resolveMenuTwoColumnsWithWithHeadingNoImgSource,
  resolveMenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSource,
  resolvePromo2Source,
} from "./wooStoreApi";
import { resolveOfertaPostsSectionSource } from "./wordpressApi";

export const resolvePageBuilderSchemaSources = async (
  schema: PageBuilderSchema,
  signal?: AbortSignal,
): Promise<PageBuilderSchema> => {
  const resolvedSections = await Promise.all(
    schema.sections.map(async (section) => {
      if (!section.enabled || section.source == null) {
        return section;
      }

      switch (section.blockKey) {
        case "menu_two_columns_with_no_heading_no_img": {
          const resolvedData = await resolveMenuTwoColumnsWithNoHeadingNoImgSource(
            section.data as MenuTwoColumnsWithNoHeadingNoImgData,
            section.source as MenuTwoColumnsWithNoHeadingNoImgSource,
            signal,
          );

          return {
            ...section,
            data: resolvedData,
          };
        }

        case "menu_two_columns_with_with_heading_no_img": {
          const resolvedData = await resolveMenuTwoColumnsWithWithHeadingNoImgSource(
            section.data as MenuTwoColumnsWithWithHeadingNoImgData,
            section.source as MenuTwoColumnsWithWithHeadingNoImgSource,
            signal,
          );

          return {
            ...section,
            data: resolvedData,
          };
        }

        case "menu_three_columns_with_with_heading_no_img": {
          const resolvedData = await resolveMenuThreeColumnsWithWithHeadingNoImgSource(
            section.data as MenuThreeColumnsWithWithHeadingNoImgData,
            section.source as MenuThreeColumnsWithWithHeadingNoImgSource,
            signal,
          );

          return {
            ...section,
            data: resolvedData,
          };
        }

        case "menu-category-photo-parallax-full-width": {
          const resolvedData = await resolveMenuCategoryPhotoParallaxFullWidthSource(
            section.data as MenuCategoryPhotoParallaxFullWidthData,
            section.source as MenuCategoryPhotoParallaxFullWidthSource,
            signal,
          );

          return {
            ...section,
            data: resolvedData,
          };
        }

        case "menu_two_columns_with_with_heading_with_img_fullwidth_paralax": {
          const resolvedData = await resolveMenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSource(
            section.data as MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxData,
            section.source as MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSource,
            signal,
          );

          return {
            ...section,
            data: resolvedData,
          };
        }

        case "promo2": {
          const resolvedData = await resolvePromo2Source(
            section.data as Promo2Data,
            section.source as Promo2Source,
            signal,
          );

          return {
            ...section,
            data: resolvedData,
          };
        }

        case "oferta_posts_section": {
          const resolvedData = await resolveOfertaPostsSectionSource(
            section.data as OfertaPostsSectionData,
            section.source as OfertaPostsSectionSource,
            signal,
          );

          return {
            ...section,
            data: resolvedData,
          };
        }

        default:
          return section;
      }
    }),
  );

  return parsePageBuilderSchema({
    ...schema,
    sections: resolvedSections,
  });
};