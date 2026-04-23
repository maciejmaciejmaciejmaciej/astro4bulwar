import { fetchWordPressPageBuilderSchema } from './wordpress';
import { resolveMenuBlock } from './woo';
import { resolveAstroRenderer } from './astroRegistry';
import type {
  MenuBlock,
  MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlock,
  PageBuilderSchema,
} from './types';

export const resolveAstroPageSections = async (
  sections: PageBuilderSchema['sections'],
): Promise<PageBuilderSchema['sections']> => {
  return Promise.all(sections.map(async (section) => {
    if (!section.enabled) {
      return section;
    }

    resolveAstroRenderer(section.blockKey);

    if (
      section.blockKey === 'menu-category-photo-parallax-full-width'
      || section.blockKey === 'menu_two_columns_with_with_heading_with_img_fullwidth_paralax'
    ) {
      return resolveMenuBlock(
        section as MenuBlock | MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlock,
      );
    }

    return section;
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