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
  'about-1': {
    blockKey: 'about-1',
    componentPath: 'astro-site/src/components/AboutSection.astro',
  },
  block_download: {
    blockKey: 'block_download',
    componentPath: 'astro-site/src/components/BlockDownloadSection.astro',
  },
  'gallery-masonry-style1': {
    blockKey: 'gallery-masonry-style1',
    componentPath: 'astro-site/src/components/GallerySection.astro',
  },
  'menu-category-photo-parallax-full-width': {
    blockKey: 'menu-category-photo-parallax-full-width',
    componentPath: 'astro-site/src/components/MenuCategorySection.astro',
  },
  menu_two_columns_with_with_heading_with_img_fullwidth_paralax: {
    blockKey: 'menu_two_columns_with_with_heading_with_img_fullwidth_paralax',
    componentPath: 'astro-site/src/components/MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection.astro',
  },
  'our-services': {
    blockKey: 'our-services',
    componentPath: 'astro-site/src/components/OurServicesSection.astro',
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