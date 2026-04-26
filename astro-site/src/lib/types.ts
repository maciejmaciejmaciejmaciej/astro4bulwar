import { z } from 'zod';

import { isSharedRegistryBlockKey } from './astroRegistry.ts';

export const imageAssetSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export const menuItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priceLabel: z.string().min(1),
  tagSlugs: z.array(z.string().min(1)).default([]),
});

export const menuColumnSchema = z.object({
  items: z.array(menuItemSchema).default([]),
});

const sourceOptionsSchema = z.object({
  limit: z.number().int().positive().optional(),
  sort: z.string().min(1).optional(),
  includeOutOfStock: z.boolean().optional(),
  splitIntoColumns: z.number().int().positive().optional(),
  preserveOrder: z.boolean().optional(),
}).default({});

export const wooProductsSourceSchema = z.object({
  sourceType: z.literal('woo_products'),
  sourceValue: z.array(z.number().int().positive()).min(1),
  options: sourceOptionsSchema,
});

export const wooCategorySourceSchema = z.object({
  sourceType: z.literal('woo_category'),
  sourceValue: z.union([z.string().min(1), z.number().int().positive()]),
  options: sourceOptionsSchema,
});

export const menuCategorySourceSchema = z.union([
  wooProductsSourceSchema,
  wooCategorySourceSchema,
]);

const ctaLinkSchema = z.object({
  href: z.string().min(1),
  text: z.string().min(1),
});

const labeledLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const optionalLabeledLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1).optional(),
});

const ofertaPostsSectionLinkSchema = z.object({
  href: z.string().min(1),
});

const optionalCtaLinkSchema = z.object({
  text: z.string().min(1),
  href: z.string().min(1).optional(),
});

const aboutTextContentSchema = z.object({
  title: z.string().min(1).optional(),
  paragraphs: z.array(z.string().min(1)).default([]),
  ctaButton: ctaLinkSchema.optional(),
});

const serviceCardSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  ctaText: z.string().min(1),
  ctaHref: z.string().min(1),
});

const offerHeroInfoItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  note: z.string().min(1).optional(),
});

const testimonial7ItemSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: z.string().min(1),
  content: z.string().min(1),
});

const storyTeamShowcaseIconSchema = z.enum([
  'calendar-days',
  'utensils-crossed',
]);

const storyTeamShowcaseMemberSchema = z.object({
  icon: storyTeamShowcaseIconSchema,
  name: z.string().min(1),
  role: z.string().min(1),
});

const contact34ContactItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  href: z.string().min(1).optional(),
});

const contact34FormSchema = z.object({
  nameLabel: z.string().min(1),
  namePlaceholder: z.string().min(1),
  emailLabel: z.string().min(1),
  emailPlaceholder: z.string().min(1),
  messageLabel: z.string().min(1),
  messagePlaceholder: z.string().min(1),
  submitLabel: z.string().min(1),
});

const featureGridIconSchema = z.enum(['globe', 'rocket', 'expand', 'wrench']);

const featureGridItemSchema = z.object({
  icon: featureGridIconSchema,
  title: z.string().min(1),
  description: z.string().min(1),
});

const regionalCuisineActionSchema = z.object({
  icon: z.enum(['heart', 'conciergeBell']),
  titleLines: z.array(z.string().min(1)).min(1),
  description: z.string().min(1),
  href: z.string().min(1),
  linkLabel: z.string().min(1),
});

const universalHeaderBlock2MetadataItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const universalHeaderBlock2ContactCtaSchema = z.object({
  label: z.string().min(1),
  buttonLabel: z.string().min(1),
  href: z.string().min(1),
});

const universalHeaderBlock2StorySectionSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
});

const universalMultilinkCardSchema = z.object({
  meta: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  linkLabel: z.string().min(1),
  linkHref: z.string().min(1),
});

const universalMultilinkSimpleCardSchema = z.object({
  title: z.string().min(1),
  linkLabel: z.string().min(1),
  linkHref: z.string().min(1),
});

const blockDownloadFeatureSchema = z.object({
  icon: z.enum(['groups', 'quality', 'format', 'events']),
  title: z.string().min(1),
});

const ofertaPostsSectionItemSchema = z.object({
  image: imageAssetSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  link: ofertaPostsSectionLinkSchema,
});

const ofertaPostsSectionSourceSchema = z.object({
  sourceType: z.literal('wordpress_posts'),
  sourceValue: z.array(z.number().int().positive()).min(1),
  options: z.object({}).default({}),
});

const dedicatedAstroBlockKeys = new Set([
  'about-1',
  'about_2_simple',
  'big_img_and_bolded_tex_editorial_style_block',
  'block_download',
  'contact34',
  'feature_grid_section',
  'gallery-masonry-style1',
  'hero_simple_no_text_normal_wide',
  'hero_simple_no_text_py32',
  'just_pralax_img_horizontal',
  'menu-category-photo-parallax-full-width',
  'menu_three_columns_with_with_heading_no_img',
  'menu_two_columns_with_no_heading_no_img',
  'menu_two_columns_with_with_heading_no_img',
  'menu_two_columns_with_with_heading_with_img_fullwidth_paralax',
  'oferta_posts_section',
  'offer_hero',
  'our-services',
  'premium_call_to_action_with_image_carousel',
  'promo2',
  'regional_cuisine',
  'restaurant_menu_drawer_type',
  'simple_heading_and_paragraph',
  'testimonial7',
  'universal_header_block_1',
  'universal_header_block_2',
  'universal_multilink_block',
  'universal_multilink_block_simple',
] as const);

export const aboutBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('about-1'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    leftImages: z.array(imageAssetSchema).default([]),
    leftText: aboutTextContentSchema.default({ paragraphs: [] }),
    rightText: aboutTextContentSchema.default({ paragraphs: [] }),
    rightImages: z.array(imageAssetSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const ourServicesBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('our-services'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    primaryCta: optionalCtaLinkSchema.optional(),
    cards: z.array(serviceCardSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const offerHeroBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('offer_hero'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    eyebrow: z.string().min(1),
    titleLines: z.array(z.string().min(1)).min(1),
    lead: z.string().min(1),
    infoItems: z.array(offerHeroInfoItemSchema).default([]),
    mainImage: imageAssetSchema,
    offerEyebrow: z.string().min(1),
    offerTitleLines: z.array(z.string().min(1)).min(1),
    offerParagraphs: z.array(z.string().min(1)).default([]),
    saleNotice: z.string().min(1).optional(),
    secondaryImages: z.array(imageAssetSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const testimonial7BlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('testimonial7'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    badge: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    firstRow: z.array(testimonial7ItemSchema).default([]),
    secondRow: z.array(testimonial7ItemSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const contact34BlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('contact34'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    tagline: z.string().min(1),
    title: z.string().min(1),
    image: imageAssetSchema,
    contactItems: z.array(contact34ContactItemSchema).default([]),
    form: contact34FormSchema,
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const featureGridSectionBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('feature_grid_section'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    items: z.array(featureGridItemSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const regionalCuisineBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('regional_cuisine'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    titleLines: z.array(z.string().min(1)).min(1),
    description: z.string().min(1),
    actions: z.array(regionalCuisineActionSchema).default([]),
    image: imageAssetSchema,
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const galleryBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('gallery-masonry-style1'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    title: z.string().min(1).default('Galeria'),
    images: z.array(imageAssetSchema),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const menuBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('menu-category-photo-parallax-full-width'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    heroTitle: z.string().min(1),
    backgroundImage: imageAssetSchema,
    overlayOpacity: z.number().min(0).max(0.8).default(0.2),
    layout: z.object({
      columns: z.number().int().positive().default(2),
      heroHeight: z.string().min(1).default('400px'),
    }).default({ columns: 2, heroHeight: '400px' }),
    menuColumns: z.array(menuColumnSchema).default([]),
    emptyStateText: z.string().default('Brak pozycji w tej kategorii.'),
  }),
  source: menuCategorySourceSchema.nullable(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const universalHeaderBlock2SectionBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('universal_header_block_2'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    metadataItems: z.array(universalHeaderBlock2MetadataItemSchema).default([]),
    contactCta: universalHeaderBlock2ContactCtaSchema.optional(),
    heroImage: imageAssetSchema,
    storySections: z.array(universalHeaderBlock2StorySectionSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const universalMultilinkSectionBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('universal_multilink_block'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    leftColumn: z.object({
      title: z.string().min(1),
      primaryCta: labeledLinkSchema,
    }),
    cards: z.array(universalMultilinkCardSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const universalMultilinkSimpleSectionBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('universal_multilink_block_simple'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    leftColumn: z.object({
      title: z.string().min(1),
      primaryCta: optionalLabeledLinkSchema,
    }),
    cards: z.array(universalMultilinkSimpleCardSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const universalHeaderBlock1SectionBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('universal_header_block_1'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    links: z.array(labeledLinkSchema).default([]),
    gallery: z.object({
      primaryImage: imageAssetSchema,
      secondaryImage: imageAssetSchema,
    }),
    detailSection: z.object({
      title: z.string().min(1),
      body: z.string().min(1),
    }),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const blockDownloadSectionBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('block_download'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    primaryCta: labeledLinkSchema,
    secondaryCta: labeledLinkSchema,
    helperText: z.string().min(1),
    versionLabel: z.string().min(1),
    fileMeta: z.string().min(1),
    panelCaption: z.string().min(1),
    features: z.array(blockDownloadFeatureSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('menu_two_columns_with_with_heading_with_img_fullwidth_paralax'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    heroTitle: z.string().min(1),
    backgroundImage: imageAssetSchema,
    overlayOpacity: z.number().min(0).max(0.8).default(0.2),
    layout: z.object({
      heroHeight: z.string().min(1).default('400px'),
    }).default({ heroHeight: '400px' }),
    menuColumns: z.array(menuColumnSchema).default([]),
    emptyStateText: z.string().default('Brak pozycji w tej kategorii.'),
  }),
  source: wooCategorySourceSchema.nullable(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const heroSimpleNoTextPy32BlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('hero_simple_no_text_py32'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    imageSrc: z.string().min(1),
    alt: z.string().min(1),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const heroSimpleNoTextNormalWideBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('hero_simple_no_text_normal_wide'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    imageSrc: z.string().min(1),
    alt: z.string().min(1),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const about2SimpleBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('about_2_simple'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    title: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
    buttonText: z.string().min(1),
    buttonLink: z.string().min(1),
    image1: imageAssetSchema,
    image2: imageAssetSchema,
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const promo2BlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('promo2'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    members: z.array(storyTeamShowcaseMemberSchema).min(1),
    story: z.string().min(1),
    image: imageAssetSchema,
    menuColumns: z.array(menuColumnSchema).default([]),
    emptyStateText: z.string().default('Brak pozycji w tej kategorii.'),
  }),
  source: wooCategorySourceSchema.nullable(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const simpleHeadingAndParagraphBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('simple_heading_and_paragraph'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    richTextHtml: z.string().min(1),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const bigImgAndBoldedTexEditorialStyleBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('big_img_and_bolded_tex_editorial_style_block'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    title: z.string().min(1),
    story: z.string().min(1),
    buttonLabel: z.string().min(1).default('przycisk'),
    buttonHref: z.string().min(1).default('#'),
    image: imageAssetSchema,
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const menuTwoColumnsWithNoHeadingNoImgBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('menu_two_columns_with_no_heading_no_img'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    menuColumns: z.array(menuColumnSchema).default([]),
    emptyStateText: z.string().default('Brak pozycji w tej kategorii.'),
  }),
  source: wooCategorySourceSchema.nullable(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const menuTwoColumnsWithWithHeadingNoImgBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('menu_two_columns_with_with_heading_no_img'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    title: z.string().min(1),
    menuColumns: z.array(menuColumnSchema).default([]),
    emptyStateText: z.string().default('Brak pozycji w tej kategorii.'),
  }),
  source: wooCategorySourceSchema.nullable(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const justPralaxImgHorizontalBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('just_pralax_img_horizontal'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    imageUrl: z.string().min(1),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const menuThreeColumnsWithWithHeadingNoImgBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('menu_three_columns_with_with_heading_no_img'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    title: z.string().min(1),
    menuColumns: z.array(menuColumnSchema).default([]),
    emptyStateText: z.string().default('Brak pozycji w tej kategorii.'),
  }),
  source: wooCategorySourceSchema.nullable(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const restaurantMenuDrawerTypeBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('restaurant_menu_drawer_type'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    intro: z.object({
      heading: z.string().min(1),
      description: z.string().min(1),
      buttonLabel: z.string().default(''),
      buttonTarget: z.string().default(''),
      imageUrl: z.string().default(''),
      imageAlt: z.string().default(''),
    }),
    collections: z.array(z.object({
      visualUrl: z.string().optional(),
      collectionTitle: z.string().min(1),
      collectionDescription: z.string().min(1),
      buttonLabel: z.string().min(1),
      wooCategoryIds: z.array(z.number().int().positive()).min(1),
    })).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const premiumCallToActionWithImageCarouselBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('premium_call_to_action_with_image_carousel'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    heading: z.string().min(1),
    description: z.string().min(1),
    buttonText: z.string().min(1),
    buttonHref: z.string().min(1),
    images: z.array(imageAssetSchema).default([]),
  }),
  source: z.null(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const ofertaPostsSectionBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal('oferta_posts_section'),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.object({
    title: z.string().min(1),
    items: z.array(ofertaPostsSectionItemSchema).default([]),
  }),
  source: ofertaPostsSectionSourceSchema.nullable(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const sharedRegistryBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.string().min(1).refine(
    (value) => isSharedRegistryBlockKey(value) && !dedicatedAstroBlockKeys.has(value as never),
    {
    message: 'Unknown shared registry block key.',
    },
  ),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable(),
  enabled: z.boolean(),
  data: z.unknown(),
  source: z.unknown().nullable(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export const pageBuilderSectionSchema = z.union([
  aboutBlockSchema,
  about2SimpleBlockSchema,
  bigImgAndBoldedTexEditorialStyleBlockSchema,
  blockDownloadSectionBlockSchema,
  contact34BlockSchema,
  featureGridSectionBlockSchema,
  heroSimpleNoTextNormalWideBlockSchema,
  heroSimpleNoTextPy32BlockSchema,
  justPralaxImgHorizontalBlockSchema,
  ourServicesBlockSchema,
  menuThreeColumnsWithWithHeadingNoImgBlockSchema,
  offerHeroBlockSchema,
  menuTwoColumnsWithNoHeadingNoImgBlockSchema,
  menuTwoColumnsWithWithHeadingNoImgBlockSchema,
  ofertaPostsSectionBlockSchema,
  premiumCallToActionWithImageCarouselBlockSchema,
  promo2BlockSchema,
  regionalCuisineBlockSchema,
  restaurantMenuDrawerTypeBlockSchema,
  simpleHeadingAndParagraphBlockSchema,
  testimonial7BlockSchema,
  galleryBlockSchema,
  menuBlockSchema,
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockSchema,
  universalHeaderBlock1SectionBlockSchema,
  universalHeaderBlock2SectionBlockSchema,
  universalMultilinkSectionBlockSchema,
  universalMultilinkSimpleSectionBlockSchema,
  sharedRegistryBlockSchema,
]);

const optionalSeoStringSchema = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().min(1).optional(),
);

// Minimal editorial SEO contract stored in page_builder_schema:
// title, description, canonical, noindex, and og.image.
// Additional nested robots/og fields remain optional so builds can fall back safely.
export const pageSeoRobotsSchema = z.object({
  index: z.boolean().optional(),
  follow: z.boolean().optional(),
}).partial();

export const pageSeoOpenGraphSchema = z.object({
  title: optionalSeoStringSchema,
  description: optionalSeoStringSchema,
  image: optionalSeoStringSchema,
  type: optionalSeoStringSchema,
}).partial();

export const pageSeoSchema = z.object({
  title: optionalSeoStringSchema,
  description: optionalSeoStringSchema,
  canonical: optionalSeoStringSchema,
  robots: pageSeoRobotsSchema.optional(),
  og: pageSeoOpenGraphSchema.optional(),
  noindex: z.boolean().optional(),
}).partial();

export const pageBuilderSchema = z.object({
  version: z.number().int().positive(),
  page: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    status: z.enum(['draft', 'published', 'archived']),
    templateKey: z.string().min(1).optional(),
  }),
  sections: z.array(pageBuilderSectionSchema),
  meta: z.record(z.string(), z.unknown()).optional(),
  seo: pageSeoSchema.default({}),
  build: z.record(z.string(), z.unknown()).optional(),
});

export type PageBuilderSchema = z.infer<typeof pageBuilderSchema>;
export type PageBuilderSection = z.infer<typeof pageBuilderSectionSchema>;
export type AboutBlock = z.infer<typeof aboutBlockSchema>;
export type About2SimpleBlock = z.infer<typeof about2SimpleBlockSchema>;
export type BigImgAndBoldedTexEditorialStyleBlock = z.infer<
  typeof bigImgAndBoldedTexEditorialStyleBlockSchema
>;
export type HeroSimpleNoTextNormalWideBlock = z.infer<typeof heroSimpleNoTextNormalWideBlockSchema>;
export type HeroSimpleNoTextPy32Block = z.infer<typeof heroSimpleNoTextPy32BlockSchema>;
export type JustPralaxImgHorizontalBlock = z.infer<typeof justPralaxImgHorizontalBlockSchema>;
export type GalleryBlock = z.infer<typeof galleryBlockSchema>;
export type MenuBlock = z.infer<typeof menuBlockSchema>;
export type MenuThreeColumnsWithWithHeadingNoImgBlock = z.infer<
  typeof menuThreeColumnsWithWithHeadingNoImgBlockSchema
>;
export type MenuTwoColumnsWithNoHeadingNoImgBlock = z.infer<
  typeof menuTwoColumnsWithNoHeadingNoImgBlockSchema
>;
export type MenuTwoColumnsWithWithHeadingNoImgBlock = z.infer<
  typeof menuTwoColumnsWithWithHeadingNoImgBlockSchema
>;
export type MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlock = z.infer<
  typeof menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockSchema
>;
export type OfertaPostsSectionBlock = z.infer<typeof ofertaPostsSectionBlockSchema>;
export type OfferHeroBlock = z.infer<typeof offerHeroBlockSchema>;
export type PremiumCallToActionWithImageCarouselBlock = z.infer<
  typeof premiumCallToActionWithImageCarouselBlockSchema
>;
export type Promo2Block = z.infer<typeof promo2BlockSchema>;
export type RestaurantMenuDrawerTypeBlock = z.infer<typeof restaurantMenuDrawerTypeBlockSchema>;
export type Testimonial7Block = z.infer<typeof testimonial7BlockSchema>;
export type Contact34Block = z.infer<typeof contact34BlockSchema>;
export type FeatureGridSectionBlock = z.infer<typeof featureGridSectionBlockSchema>;
export type RegionalCuisineBlock = z.infer<typeof regionalCuisineBlockSchema>;
export type OurServicesBlock = z.infer<typeof ourServicesBlockSchema>;
export type BlockDownloadSectionBlock = z.infer<typeof blockDownloadSectionBlockSchema>;
export type SimpleHeadingAndParagraphBlock = z.infer<typeof simpleHeadingAndParagraphBlockSchema>;
export type UniversalHeaderBlock1SectionBlock = z.infer<typeof universalHeaderBlock1SectionBlockSchema>;
export type UniversalHeaderBlock2SectionBlock = z.infer<typeof universalHeaderBlock2SectionBlockSchema>;
export type UniversalMultilinkSectionBlock = z.infer<typeof universalMultilinkSectionBlockSchema>;
export type UniversalMultilinkSimpleSectionBlock = z.infer<typeof universalMultilinkSimpleSectionBlockSchema>;
export type SharedRegistryBlock = z.infer<typeof sharedRegistryBlockSchema>;
export type MenuSource = z.infer<typeof menuCategorySourceSchema>;
export type ParallaxMenuSource = z.infer<typeof wooCategorySourceSchema>;
export type MenuColumn = z.infer<typeof menuColumnSchema>;
export type OfertaPostsSectionSource = z.infer<typeof ofertaPostsSectionSourceSchema>;
export type PageSeo = z.infer<typeof pageSeoSchema>;
export type PageSeoRobots = z.infer<typeof pageSeoRobotsSchema>;
export type PageSeoOpenGraph = z.infer<typeof pageSeoOpenGraphSchema>;
export type ResolvedPageSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  og: {
    title: string;
    description: string;
    image?: string;
    type: string;
    url: string;
  };
  twitter: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    image?: string;
  };
};

export * from './globalLayoutContract.ts';