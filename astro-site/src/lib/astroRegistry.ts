import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type SharedRegistryCapabilityDescriptor = {
  available: boolean;
  path?: string;
  notes?: string;
};

type SharedRegistryBlockReadiness = {
  lifecycle: string;
  capabilities: {
    astroRenderer: SharedRegistryCapabilityDescriptor;
  } & Record<string, SharedRegistryCapabilityDescriptor>;
};

export type SharedRegistryReadinessManifest = {
  lifecycle: string[];
  requiredCapabilitiesForReady: string[];
  blocks: Record<string, SharedRegistryBlockReadiness>;
};

export type AstroRendererDescriptor = {
  blockKey: string;
  componentPath: string;
};

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const sharedRegistryManifestPath = path.resolve(moduleDir, '../../../docs/block-registry/registry.machine.json');

const astroRendererProjection = {
  about_2_simple: {
    blockKey: 'about_2_simple',
    componentPath: 'astro-site/src/components/About2SimpleSection.astro',
  },
  'about-1': {
    blockKey: 'about-1',
    componentPath: 'astro-site/src/components/AboutSection.astro',
  },
  big_img_and_bolded_tex_editorial_style_block: {
    blockKey: 'big_img_and_bolded_tex_editorial_style_block',
    componentPath: 'astro-site/src/components/BigImgAndBoldedTexEditorialStyleBlockSection.astro',
  },
  block_download: {
    blockKey: 'block_download',
    componentPath: 'astro-site/src/components/BlockDownloadSection.astro',
  },
  contact34: {
    blockKey: 'contact34',
    componentPath: 'astro-site/src/components/Contact34Section.astro',
  },
  feature_grid_section: {
    blockKey: 'feature_grid_section',
    componentPath: 'astro-site/src/components/FeatureGridSection.astro',
  },
  'gallery-masonry-style1': {
    blockKey: 'gallery-masonry-style1',
    componentPath: 'astro-site/src/components/GallerySection.astro',
  },
  hero_simple_no_text_normal_wide: {
    blockKey: 'hero_simple_no_text_normal_wide',
    componentPath: 'astro-site/src/components/HeroSimpleNoTextNormalWideSection.astro',
  },
  hero_simple_no_text_py32: {
    blockKey: 'hero_simple_no_text_py32',
    componentPath: 'astro-site/src/components/HeroSimpleNoTextPy32Section.astro',
  },
  just_pralax_img_horizontal: {
    blockKey: 'just_pralax_img_horizontal',
    componentPath: 'astro-site/src/components/JustPralaxImgHorizontalSection.astro',
  },
  'menu-category-photo-parallax-full-width': {
    blockKey: 'menu-category-photo-parallax-full-width',
    componentPath: 'astro-site/src/components/MenuCategorySection.astro',
  },
  menu_three_columns_with_with_heading_no_img: {
    blockKey: 'menu_three_columns_with_with_heading_no_img',
    componentPath: 'astro-site/src/components/StandaloneMenuSection.astro',
  },
  menu_two_columns_with_no_heading_no_img: {
    blockKey: 'menu_two_columns_with_no_heading_no_img',
    componentPath: 'astro-site/src/components/StandaloneMenuSection.astro',
  },
  menu_two_columns_with_with_heading_no_img: {
    blockKey: 'menu_two_columns_with_with_heading_no_img',
    componentPath: 'astro-site/src/components/StandaloneMenuSection.astro',
  },
  menu_two_columns_with_with_heading_with_img_fullwidth_paralax: {
    blockKey: 'menu_two_columns_with_with_heading_with_img_fullwidth_paralax',
    componentPath: 'astro-site/src/components/MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection.astro',
  },
  oferta_posts_section: {
    blockKey: 'oferta_posts_section',
    componentPath: 'astro-site/src/components/OfertaPostsSection.astro',
  },
  offer_hero: {
    blockKey: 'offer_hero',
    componentPath: 'astro-site/src/components/OfferHeroSection.astro',
  },
  'our-services': {
    blockKey: 'our-services',
    componentPath: 'astro-site/src/components/OurServicesSection.astro',
  },
  premium_call_to_action_with_image_carousel: {
    blockKey: 'premium_call_to_action_with_image_carousel',
    componentPath: 'astro-site/src/components/PremiumCallToActionWithImageCarouselSection.astro',
  },
  promo2: {
    blockKey: 'promo2',
    componentPath: 'astro-site/src/components/Promo2Section.astro',
  },
  regional_cuisine: {
    blockKey: 'regional_cuisine',
    componentPath: 'astro-site/src/components/RegionalCuisineSection.astro',
  },
  restaurant_menu_drawer_type: {
    blockKey: 'restaurant_menu_drawer_type',
    componentPath: 'astro-site/src/components/RestaurantMenuDrawerTypeSection.astro',
  },
  simple_heading_and_paragraph: {
    blockKey: 'simple_heading_and_paragraph',
    componentPath: 'astro-site/src/components/SimpleHeadingAndParagraphSection.astro',
  },
  testimonial7: {
    blockKey: 'testimonial7',
    componentPath: 'astro-site/src/components/Testimonial7Section.astro',
  },
  universal_header_block_1: {
    blockKey: 'universal_header_block_1',
    componentPath: 'astro-site/src/components/UniversalHeaderBlock1Section.astro',
  },
  'universal_header_block_2': {
    blockKey: 'universal_header_block_2',
    componentPath: 'astro-site/src/components/UniversalHeaderBlock2Section.astro',
  },
  universal_multilink_block: {
    blockKey: 'universal_multilink_block',
    componentPath: 'astro-site/src/components/UniversalMultilinkBlockSection.astro',
  },
  universal_multilink_block_simple: {
    blockKey: 'universal_multilink_block_simple',
    componentPath: 'astro-site/src/components/UniversalMultilinkBlockSimpleSection.astro',
  },
} as const satisfies Record<string, AstroRendererDescriptor>;

const sharedRegistryReadiness = (() => {
  const parsed = JSON.parse(readFileSync(sharedRegistryManifestPath, 'utf8')) as {
    readiness?: SharedRegistryReadinessManifest;
  };

  if (!parsed.readiness) {
    throw new Error('Shared registry manifest is missing readiness data.');
  }

  return parsed.readiness;
})();

export const getSharedRegistryReadiness = (): SharedRegistryReadinessManifest => {
  return sharedRegistryReadiness;
};

export const isSharedRegistryBlockKey = (blockKey: string): boolean => {
  return Object.prototype.hasOwnProperty.call(sharedRegistryReadiness.blocks, blockKey);
};

export const listAstroRendererBlockKeys = (): string[] => {
  return Object.keys(astroRendererProjection).sort((left, right) => left.localeCompare(right));
};

export const resolveAstroRenderer = (blockKey: string): AstroRendererDescriptor => {
  const readiness = sharedRegistryReadiness.blocks[blockKey];

  if (!readiness) {
    throw new Error(`Block ${blockKey} is not registered in the shared readiness manifest.`);
  }

  if (readiness.lifecycle !== 'ready' || !readiness.capabilities.astroRenderer.available) {
    throw new Error(`Block ${blockKey} is not Astro-ready. Lifecycle: ${readiness.lifecycle}.`);
  }

  const renderer = astroRendererProjection[blockKey as keyof typeof astroRendererProjection];

  if (!renderer) {
    throw new Error(`Block ${blockKey} is Astro-ready in the shared registry but missing from the Astro projection.`);
  }

  if (readiness.capabilities.astroRenderer.path !== renderer.componentPath) {
    throw new Error(
      `Astro projection parity mismatch for ${blockKey}. Shared registry path: ${readiness.capabilities.astroRenderer.path}; Astro projection path: ${renderer.componentPath}.`,
    );
  }

  return renderer;
};