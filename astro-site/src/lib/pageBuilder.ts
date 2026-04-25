import {
  fetchWordPressPageBuilderSchema,
  resolveOfertaPostsSectionSource,
} from './wordpress.ts';
import { resolveMenuBlock } from './woo.ts';
import { resolveAstroRenderer } from './astroRegistry.ts';
import type {
  MenuBlock,
  MenuThreeColumnsWithWithHeadingNoImgBlock,
  MenuTwoColumnsWithNoHeadingNoImgBlock,
  MenuTwoColumnsWithWithHeadingNoImgBlock,
  MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlock,
  OfertaPostsSectionBlock,
  PageBuilderSchema,
  PageBuilderSection,
  Promo2Block,
} from './types.ts';

type SourceBackedAstroSection =
  | MenuBlock
  | MenuThreeColumnsWithWithHeadingNoImgBlock
  | MenuTwoColumnsWithNoHeadingNoImgBlock
  | MenuTwoColumnsWithWithHeadingNoImgBlock
  | MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlock
  | OfertaPostsSectionBlock
  | Promo2Block;

const resolveAstroSectionSource = async <T extends PageBuilderSection>(section: T): Promise<T> => {
  if (!section.enabled || !section.source) {
    return section;
  }

  switch (section.blockKey) {
    case 'menu-category-photo-parallax-full-width':
    case 'menu_three_columns_with_with_heading_no_img':
    case 'menu_two_columns_with_no_heading_no_img':
    case 'menu_two_columns_with_with_heading_no_img':
    case 'menu_two_columns_with_with_heading_with_img_fullwidth_paralax':
    case 'promo2':
      return resolveMenuBlock(section as Extract<SourceBackedAstroSection, { blockKey: T['blockKey'] }>) as Promise<T>;
    case 'oferta_posts_section': {
      const resolvedData = await resolveOfertaPostsSectionSource(
        (section as OfertaPostsSectionBlock).data,
        (section as OfertaPostsSectionBlock).source,
      );

      return {
        ...section,
        data: resolvedData,
      } as T;
    }
    default:
      return section;
  }
};

export const resolveAstroSectionSources = async (
  sections: PageBuilderSchema['sections'],
): Promise<PageBuilderSchema['sections']> => {
  return Promise.all(sections.map((section) => resolveAstroSectionSource(section)));
};

export const resolveAstroPageSections = async (
  sections: PageBuilderSchema['sections'],
): Promise<PageBuilderSchema['sections']> => {
  return Promise.all(sections.map(async (section) => {
    if (!section.enabled) {
      return section;
    }

    resolveAstroRenderer(section.blockKey);

    return resolveAstroSectionSource(section);
  }));
};

export const buildStaticPage = async (slug: string): Promise<PageBuilderSchema> => {
  const schema = await fetchWordPressPageBuilderSchema(slug);
  const sections = await resolveAstroPageSections(schema.sections);

  return {
    ...schema,
    sections,
  };
};