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

const blockDownloadFeatureSchema = z.object({
  icon: z.enum(['groups', 'quality', 'format', 'events']),
  title: z.string().min(1),
});

const dedicatedAstroBlockKeys = new Set([
  'about-1',
  'block_download',
  'gallery-masonry-style1',
  'menu-category-photo-parallax-full-width',
  'menu_two_columns_with_with_heading_with_img_fullwidth_paralax',
  'our-services',
  'universal_header_block_1',
  'universal_header_block_2',
  'universal_multilink_block',
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
  blockDownloadSectionBlockSchema,
  ourServicesBlockSchema,
  galleryBlockSchema,
  menuBlockSchema,
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockSchema,
  universalHeaderBlock1SectionBlockSchema,
  universalHeaderBlock2SectionBlockSchema,
  universalMultilinkSectionBlockSchema,
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
export type GalleryBlock = z.infer<typeof galleryBlockSchema>;
export type MenuBlock = z.infer<typeof menuBlockSchema>;
export type MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlock = z.infer<
  typeof menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockSchema
>;
export type OurServicesBlock = z.infer<typeof ourServicesBlockSchema>;
export type BlockDownloadSectionBlock = z.infer<typeof blockDownloadSectionBlockSchema>;
export type UniversalHeaderBlock1SectionBlock = z.infer<typeof universalHeaderBlock1SectionBlockSchema>;
export type UniversalHeaderBlock2SectionBlock = z.infer<typeof universalHeaderBlock2SectionBlockSchema>;
export type UniversalMultilinkSectionBlock = z.infer<typeof universalMultilinkSectionBlockSchema>;
export type SharedRegistryBlock = z.infer<typeof sharedRegistryBlockSchema>;
export type MenuSource = z.infer<typeof menuCategorySourceSchema>;
export type ParallaxMenuSource = z.infer<typeof wooCategorySourceSchema>;
export type MenuColumn = z.infer<typeof menuColumnSchema>;
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