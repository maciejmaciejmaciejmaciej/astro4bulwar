import {
  about2SimpleBlockDefinition,
  about2SimpleDefaultData,
} from "../about_2_simple/schema";
import { about1BlockDefinition, about1DefaultData } from "../about-1/schema";
import {
  bigImgAndBoldedTexEditorialStyleBlockDefinition,
} from "../big_img_and_bolded_tex_editorial_style_block/schema";
import {
  blockDownloadBlockDefinition,
  blockDownloadDefaultData,
} from "../block_download/schema";
import {
  galleryMasonryStyle1BlockDefinition,
  galleryMasonryStyle1DefaultData,
} from "../gallery-masonry-style1/schema";
import {
  contact34BlockDefinition,
  contact34DefaultData,
} from "../contact34/schema";
import {
  featureGridSectionBlockDefinition,
  featureGridSectionDefaultData,
} from "../feature_grid_section/schema";
import {
  heroSimpleNoTextNormalWideBlockDefinition,
  heroSimpleNoTextNormalWideDefaultData,
} from "../hero_simple_no_text_normal_wide/schema";
import {
  heroSimpleNoTextPy32BlockDefinition,
  heroSimpleNoTextPy32DefaultData,
} from "../hero_simple_no_text_py32/schema";
import {
  justPralaxImgHorizontalBlockDefinition,
  justPralaxImgHorizontalDefaultData,
} from "../just_pralax_img_horizontal/schema";
import {
  menuThreeColumnsWithWithHeadingNoImgBlockDefinition,
  menuThreeColumnsWithWithHeadingNoImgDefaultData,
} from "../menu_three_columns_with_with_heading_no_img/schema";
import {
  menuTwoColumnsWithNoHeadingNoImgBlockDefinition,
  menuTwoColumnsWithNoHeadingNoImgDefaultData,
} from "../menu_two_columns_with_no_heading_no_img/schema";
import {
  menuTwoColumnsWithWithHeadingNoImgBlockDefinition,
  menuTwoColumnsWithWithHeadingNoImgDefaultData,
} from "../menu_two_columns_with_with_heading_no_img/schema";
import {
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockDefinition,
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData,
} from "../menu_two_columns_with_with_heading_with_img_fullwidth_paralax/schema";
import {
  menuCategoryPhotoParallaxFullWidthBlockDefinition,
  menuCategoryPhotoParallaxFullWidthDefaultData,
} from "../menu-category-photo-parallax-full-width/schema";
import {
  ofertaPostsSectionBlockDefinition,
  ofertaPostsSectionDefaultData,
} from "../oferta_posts_section/schema";
import {
  offerHeroBlockDefinition,
  offerHeroDefaultData,
} from "../offer_hero/schema";
import {
  ourServicesBlockDefinition,
  ourServicesDefaultData,
} from "../our-services/schema";
import {
  regionalCuisineBlockDefinition,
  regionalCuisineDefaultData,
} from "../regional_cuisine/schema";
import {
  restaurantMenuDrawerTypeBlockDefinition,
  restaurantMenuDrawerTypeDefaultData,
} from "../restaurant_menu_drawer_type/schema";
import {
  premiumCallToActionWithImageCarouselBlockDefinition,
  premiumCallToActionWithImageCarouselDefaultData,
} from "../premium_call_to_action_with_image_carousel/schema";
import { promo2BlockDefinition, promo2DefaultData } from "../promo2/schema";
import { promo3BlockDefinition, promo3DefaultData } from "../promo3/schema";
import {
  simpleHeadingAndParagraphBlockDefinition,
  simpleHeadingAndParagraphDefaultData,
} from "../simple_heading_and_paragraph/schema";
import {
  storyTeamShowcaseBlockDefinition,
  storyTeamShowcaseDefaultData,
} from "../story-team-showcase/schema";
import {
  testimonial7BlockDefinition,
  testimonial7DefaultData,
} from "../testimonial7/schema";
import {
  universalHeaderBlock1Definition,
  universalHeaderBlock1DefaultData,
} from "../universal_header_block_1/schema";
import {
  universalHeaderBlock2Definition,
  universalHeaderBlock2DefaultData,
} from "../universal_header_block_2/schema";
import {
  universalMultilinkBlockDefinition,
  universalMultilinkBlockDefaultData,
} from "../universal_multilink_block/schema";
import {
  universalMultilinkBlockSimpleDefinition,
  universalMultilinkBlockSimpleDefaultData,
} from "../universal_multilink_block_simple/schema";
import type {
  BlockCapabilityDescriptor,
  BlockReadinessGateSnapshot,
  BlockReadinessCapabilityKey,
  BlockReadinessDescriptor,
  BlockRefinementArtifactDescriptor,
  BlockRefinementArtifactSummary,
  BlockRefinementWorkflowRequest,
  BlockRefinementWorkflowResult,
  BlockRefinementWorkflowSummary,
  PageBuilderBlockDefinition,
  PageBuilderBlockRegistry,
  PageBuilderSectionInstance,
  RegisteredPageBuilderBlockDefinition,
  RegisteredPageBuilderBlockRegistry,
} from "./types";
import {
  blockReadinessLifecycleStatuses,
  blockReadinessRequiredCapabilities,
  blockRefinementWorkflowReadinessOutcomes,
  blockRefinementWorkflowRequestFields,
  blockRefinementWorkflowRequiredArtifacts,
  blockRefinementWorkflowSupportedTargetStatuses,
} from "./types";

const baseBlockRegistry = {
  [about2SimpleBlockDefinition.blockKey]: about2SimpleBlockDefinition,
  [about1BlockDefinition.blockKey]: about1BlockDefinition,
  [bigImgAndBoldedTexEditorialStyleBlockDefinition.blockKey]: bigImgAndBoldedTexEditorialStyleBlockDefinition,
  [blockDownloadBlockDefinition.blockKey]: blockDownloadBlockDefinition,
  [contact34BlockDefinition.blockKey]: contact34BlockDefinition,
  [featureGridSectionBlockDefinition.blockKey]: featureGridSectionBlockDefinition,
  [galleryMasonryStyle1BlockDefinition.blockKey]: galleryMasonryStyle1BlockDefinition,
  [heroSimpleNoTextNormalWideBlockDefinition.blockKey]: heroSimpleNoTextNormalWideBlockDefinition,
  [heroSimpleNoTextPy32BlockDefinition.blockKey]: heroSimpleNoTextPy32BlockDefinition,
  [justPralaxImgHorizontalBlockDefinition.blockKey]: justPralaxImgHorizontalBlockDefinition,
  [menuThreeColumnsWithWithHeadingNoImgBlockDefinition.blockKey]: menuThreeColumnsWithWithHeadingNoImgBlockDefinition,
  [menuTwoColumnsWithNoHeadingNoImgBlockDefinition.blockKey]: menuTwoColumnsWithNoHeadingNoImgBlockDefinition,
  [menuTwoColumnsWithWithHeadingNoImgBlockDefinition.blockKey]: menuTwoColumnsWithWithHeadingNoImgBlockDefinition,
  [menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockDefinition.blockKey]: menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockDefinition,
  [menuCategoryPhotoParallaxFullWidthBlockDefinition.blockKey]: menuCategoryPhotoParallaxFullWidthBlockDefinition,
  [ofertaPostsSectionBlockDefinition.blockKey]: ofertaPostsSectionBlockDefinition,
  [offerHeroBlockDefinition.blockKey]: offerHeroBlockDefinition,
  [ourServicesBlockDefinition.blockKey]: ourServicesBlockDefinition,
  [premiumCallToActionWithImageCarouselBlockDefinition.blockKey]: premiumCallToActionWithImageCarouselBlockDefinition,
  [promo2BlockDefinition.blockKey]: promo2BlockDefinition,
  [promo3BlockDefinition.blockKey]: promo3BlockDefinition,
  [regionalCuisineBlockDefinition.blockKey]: regionalCuisineBlockDefinition,
  [restaurantMenuDrawerTypeBlockDefinition.blockKey]: restaurantMenuDrawerTypeBlockDefinition,
  [simpleHeadingAndParagraphBlockDefinition.blockKey]: simpleHeadingAndParagraphBlockDefinition,
  [storyTeamShowcaseBlockDefinition.blockKey]: storyTeamShowcaseBlockDefinition,
  [testimonial7BlockDefinition.blockKey]: testimonial7BlockDefinition,
  [universalHeaderBlock1Definition.blockKey]: universalHeaderBlock1Definition,
  [universalHeaderBlock2Definition.blockKey]: universalHeaderBlock2Definition,
  [universalMultilinkBlockDefinition.blockKey]: universalMultilinkBlockDefinition,
  [universalMultilinkBlockSimpleDefinition.blockKey]: universalMultilinkBlockSimpleDefinition,
} satisfies PageBuilderBlockRegistry;

export type RegisteredBlockKey = Extract<keyof typeof baseBlockRegistry, string>;

const workflow1CanonicalDesignReference = "zip/src/pages/TemplatePage.tsx";
const workflow1SupportingDesignReferences = [
  "zip/src/pages/TemplatePage.tsx",
  "zip/src/index.css",
  "docs/plan/astro-wordpress-page-builder/global-css-adaptation-contract.md",
  "docs/plan/astro-wordpress-page-builder/design-token-and-layout-whitelist.md",
] as const;
const machineRegistryManifestUpdatedAt = "2026-04-24";

export {
  blockRefinementWorkflowRequestFields,
  blockRefinementWorkflowRequiredArtifacts,
};

const docsPathByBlockKey = {
  "about-1": "docs/block-registry/about-1.md",
  about_2_simple: "docs/block-registry/about_2_simple.md",
  big_img_and_bolded_tex_editorial_style_block:
    "docs/block-registry/big_img_and_bolded_tex_editorial_style_block.md",
  block_download: "docs/block-registry/block_download.md",
  contact34: "docs/block-registry/contact34.md",
  feature_grid_section: "docs/block-registry/feature_grid_section.md",
  "gallery-masonry-style1": "docs/block-registry/gallery-masonry-style1.md",
  hero_simple_no_text_normal_wide: "docs/block-registry/hero_simple_no_text_normal_wide.md",
  hero_simple_no_text_py32: "docs/block-registry/hero_simple_no_text_py32.md",
  just_pralax_img_horizontal: "docs/block-registry/just_pralax_img_horizontal.md",
  "menu-category-photo-parallax-full-width": "docs/block-registry/menu-category-photo-parallax-full-width.md",
  menu_three_columns_with_with_heading_no_img:
    "docs/block-registry/menu_three_columns_with_with_heading_no_img.md",
  menu_two_columns_with_no_heading_no_img:
    "docs/block-registry/menu_two_columns_with_no_heading_no_img.md",
  menu_two_columns_with_with_heading_no_img:
    "docs/block-registry/menu_two_columns_with_with_heading_no_img.md",
  menu_two_columns_with_with_heading_with_img_fullwidth_paralax:
    "docs/block-registry/menu_two_columns_with_with_heading_with_img_fullwidth_paralax.md",
  oferta_posts_section: "docs/block-registry/oferta_posts_section.md",
  offer_hero: "docs/block-registry/offer_hero.md",
  "our-services": "docs/block-registry/our-services.md",
  premium_call_to_action_with_image_carousel:
    "docs/block-registry/premium_call_to_action_with_image_carousel.md",
  promo2: "docs/block-registry/promo2.md",
  promo3: "docs/block-registry/promo3.md",
  regional_cuisine: "docs/block-registry/regional_cuisine.md",
  restaurant_menu_drawer_type: "docs/block-registry/restaurant_menu_drawer_type.md",
  simple_heading_and_paragraph: "docs/block-registry/simple_heading_and_paragraph.md",
  "story-team-showcase": "docs/block-registry/story-team-showcase.md",
  testimonial7: "docs/block-registry/testimonial7.md",
  universal_header_block_1: "docs/block-registry/universal_header_block_1.md",
  universal_header_block_2: "docs/block-registry/universal_header_block_2.md",
  universal_multilink_block: "docs/block-registry/universal_multilink_block.md",
  universal_multilink_block_simple: "docs/block-registry/universal_multilink_block_simple.md",
} satisfies Record<RegisteredBlockKey, string>;

const astroRendererPathByBlockKey: Partial<Record<RegisteredBlockKey, string>> = {
  about_2_simple: "astro-site/src/components/About2SimpleSection.astro",
  "about-1": "astro-site/src/components/AboutSection.astro",
  big_img_and_bolded_tex_editorial_style_block:
    "astro-site/src/components/BigImgAndBoldedTexEditorialStyleBlockSection.astro",
  block_download: "astro-site/src/components/BlockDownloadSection.astro",
  contact34: "astro-site/src/components/Contact34Section.astro",
  feature_grid_section: "astro-site/src/components/FeatureGridSection.astro",
  "gallery-masonry-style1": "astro-site/src/components/GallerySection.astro",
  hero_simple_no_text_normal_wide: "astro-site/src/components/HeroSimpleNoTextNormalWideSection.astro",
  hero_simple_no_text_py32: "astro-site/src/components/HeroSimpleNoTextPy32Section.astro",
  just_pralax_img_horizontal: "astro-site/src/components/JustPralaxImgHorizontalSection.astro",
  "menu-category-photo-parallax-full-width": "astro-site/src/components/MenuCategorySection.astro",
  menu_three_columns_with_with_heading_no_img: "astro-site/src/components/StandaloneMenuSection.astro",
  menu_two_columns_with_no_heading_no_img: "astro-site/src/components/StandaloneMenuSection.astro",
  menu_two_columns_with_with_heading_no_img: "astro-site/src/components/StandaloneMenuSection.astro",
  menu_two_columns_with_with_heading_with_img_fullwidth_paralax:
    "astro-site/src/components/MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection.astro",
  oferta_posts_section: "astro-site/src/components/OfertaPostsSection.astro",
  offer_hero: "astro-site/src/components/OfferHeroSection.astro",
  "our-services": "astro-site/src/components/OurServicesSection.astro",
  premium_call_to_action_with_image_carousel:
    "astro-site/src/components/PremiumCallToActionWithImageCarouselSection.astro",
  promo2: "astro-site/src/components/Promo2Section.astro",
  regional_cuisine: "astro-site/src/components/RegionalCuisineSection.astro",
  restaurant_menu_drawer_type: "astro-site/src/components/RestaurantMenuDrawerTypeSection.astro",
  simple_heading_and_paragraph: "astro-site/src/components/SimpleHeadingAndParagraphSection.astro",
  testimonial7: "astro-site/src/components/Testimonial7Section.astro",
  universal_header_block_1: "astro-site/src/components/UniversalHeaderBlock1Section.astro",
  universal_header_block_2: "astro-site/src/components/UniversalHeaderBlock2Section.astro",
  universal_multilink_block: "astro-site/src/components/UniversalMultilinkBlockSection.astro",
  universal_multilink_block_simple: "astro-site/src/components/UniversalMultilinkBlockSimpleSection.astro",
};

const createCapabilityDescriptor = (
  available: boolean,
  path?: string,
  notes?: string,
): BlockCapabilityDescriptor => {
  return {
    available,
    ...(path ? { path } : {}),
    ...(notes ? { notes } : {}),
  };
};

const createRefinementArtifactDescriptor = (
  label: string,
  available: boolean,
  path?: string,
  notes?: string,
): BlockRefinementArtifactDescriptor => {
  return {
    label,
    available,
    ...(path ? { path } : {}),
    ...(notes ? { notes } : {}),
  };
};

const createMissingReadinessGateSnapshot = (): BlockReadinessGateSnapshot => {
  return {
    lifecycle: "draft",
    capabilities: {
      reactRuntime: createCapabilityDescriptor(false, undefined, "React runtime is not registered in the shared registry yet."),
      astroRenderer: createCapabilityDescriptor(false, undefined, "Astro renderer is not registered in the shared registry yet."),
      aiDescriptor: createCapabilityDescriptor(false, undefined, "AI descriptor has not been added to the shared generator registry yet."),
      docs: createCapabilityDescriptor(false, undefined, "Block documentation has not been added to docs/block-registry yet."),
      tests: createCapabilityDescriptor(false, undefined, "Registry or smoke tests have not been added yet."),
    },
  };
};

const toReadinessGateSnapshot = (
  readiness?: BlockReadinessDescriptor,
): BlockReadinessGateSnapshot => {
  if (!readiness) {
    return createMissingReadinessGateSnapshot();
  }

  return {
    lifecycle: readiness.lifecycle,
    capabilities: readiness.capabilities,
  };
};

const buildRefinementArtifactSummary = (
  request: BlockRefinementWorkflowRequest,
  sharedReadiness: BlockReadinessGateSnapshot,
  hasBusinessBlock: boolean,
): BlockRefinementArtifactSummary => {
  const sourceComponent = request.sourceComponent.trim();
  const designReference = request.designReference.trim();
  const artifacts: Record<typeof blockRefinementWorkflowRequiredArtifacts[number], BlockRefinementArtifactDescriptor> = {
    businessBlock: createRefinementArtifactDescriptor(
      "Reusable business block registered in the shared registry.",
      hasBusinessBlock,
      sourceComponent || undefined,
      hasBusinessBlock
        ? "The block already exists as a reusable business block in the shared registry."
        : "Create and register the reusable business block before promoting Workflow 1 to ready.",
    ),
    designReference: createRefinementArtifactDescriptor(
      "Primary design reference captured for TemplatePage and global CSS validation.",
      designReference.length > 0,
      designReference || undefined,
      designReference.length > 0
        ? `Validate the adaptation against ${workflow1CanonicalDesignReference} and the shared global CSS before promotion.`
        : "Provide a design reference. TemplatePage is the canonical review surface for Workflow 1.",
    ),
    reactRuntime: createRefinementArtifactDescriptor(
      "React runtime registered through runtime.renderSection.",
      sharedReadiness.capabilities.reactRuntime.available,
      sharedReadiness.capabilities.reactRuntime.path,
      sharedReadiness.capabilities.reactRuntime.notes,
    ),
    astroRenderer: createRefinementArtifactDescriptor(
      "Astro renderer registered in the shared Astro projection.",
      sharedReadiness.capabilities.astroRenderer.available,
      sharedReadiness.capabilities.astroRenderer.path,
      sharedReadiness.capabilities.astroRenderer.notes,
    ),
    aiDescriptor: createRefinementArtifactDescriptor(
      "AI descriptor registered for page_builder_schema_for_ai generation.",
      sharedReadiness.capabilities.aiDescriptor.available,
      sharedReadiness.capabilities.aiDescriptor.path,
      sharedReadiness.capabilities.aiDescriptor.notes,
    ),
    docs: createRefinementArtifactDescriptor(
      "Human-readable block documentation exists in docs/block-registry.",
      sharedReadiness.capabilities.docs.available,
      sharedReadiness.capabilities.docs.path,
      sharedReadiness.capabilities.docs.notes,
    ),
    tests: createRefinementArtifactDescriptor(
      "Contract or smoke tests cover the block promotion path.",
      sharedReadiness.capabilities.tests.available,
      sharedReadiness.capabilities.tests.path,
      sharedReadiness.capabilities.tests.notes,
    ),
  };
  const availableArtifacts = blockRefinementWorkflowRequiredArtifacts.filter(
    (artifactKey) => artifacts[artifactKey].available,
  );
  const missingArtifacts = blockRefinementWorkflowRequiredArtifacts.filter(
    (artifactKey) => !artifacts[artifactKey].available,
  );

  return {
    requiredArtifacts: blockRefinementWorkflowRequiredArtifacts,
    availableArtifacts,
    missingArtifacts,
    artifacts,
  };
};

const resolveWorkflow1Blockers = (
  request: BlockRefinementWorkflowRequest,
): string[] => {
  const blockers: string[] = [];

  if (request.sourceComponent.trim().length === 0) {
    blockers.push("Workflow 1 requires sourceComponent before refinement can start.");
  }

  if (request.designReference.trim().length === 0) {
    blockers.push("Workflow 1 requires designReference before refinement can start.");
  }

  if (!blockRefinementWorkflowSupportedTargetStatuses.includes(request.targetStatus as "ready")) {
    blockers.push(
      `Workflow 1 only supports targetStatus \"ready\". Received \"${request.targetStatus || "(empty)"}\".`,
    );
  }

  return blockers;
};

const buildRefinementWorkflowResult = (
  request: BlockRefinementWorkflowRequest,
  readiness?: BlockReadinessDescriptor,
): BlockRefinementWorkflowResult => {
  const sharedReadiness = toReadinessGateSnapshot(readiness);
  const blockers = resolveWorkflow1Blockers(request);
  const artifactSummary = buildRefinementArtifactSummary(request, sharedReadiness, Boolean(readiness));
  let readinessOutcome: BlockRefinementWorkflowResult["readinessOutcome"] = "refining";

  if (blockers.length > 0) {
    readinessOutcome = "blocked";
  } else if (sharedReadiness.lifecycle === "ready" && artifactSummary.missingArtifacts.length === 0) {
    readinessOutcome = "ready";
  }

  return {
    blockKey: request.blockKey,
    sourceComponent: request.sourceComponent.trim(),
    designReference: request.designReference.trim(),
    targetStatus: request.targetStatus,
    readinessOutcome,
    blockers,
    sharedReadiness,
    artifactSummary,
  };
};

const toStoredRefinementWorkflowSummary = (
  workflowResult: BlockRefinementWorkflowResult,
): BlockRefinementWorkflowSummary => {
  return {
    sourceComponent: workflowResult.sourceComponent,
    designReference: workflowResult.designReference,
    targetStatus: workflowResult.targetStatus as "ready",
    readinessOutcome: workflowResult.readinessOutcome,
    blockers: workflowResult.blockers,
    artifactSummary: workflowResult.artifactSummary,
  };
};

const buildReadinessDescriptor = (block: PageBuilderBlockDefinition): BlockReadinessDescriptor => {
  const reactRuntimePath = `zip/${block.render.componentImportPath}`;
  const registeredBlockKey = block.blockKey as RegisteredBlockKey;
  const astroRendererPath = astroRendererPathByBlockKey[registeredBlockKey];

  return {
    lifecycle: astroRendererPath ? "ready" : "refining",
    capabilities: {
      reactRuntime: createCapabilityDescriptor(
        Boolean(block.runtime?.renderSection),
        reactRuntimePath,
        `${block.render.componentName} is registered through runtime.renderSection.`,
      ),
      astroRenderer: astroRendererPath
        ? createCapabilityDescriptor(true, astroRendererPath, "Astro renderer is registered in the current Astro projection.")
        : createCapabilityDescriptor(
            false,
            undefined,
            "Astro renderer is not wired into the Astro projection yet.",
          ),
      aiDescriptor: createCapabilityDescriptor(
        true,
        "zip/src/blocks/registry/ai/descriptors.cjs",
        "AI descriptor coverage is validated by the shared registry invariants test.",
      ),
      docs: createCapabilityDescriptor(
        true,
        docsPathByBlockKey[registeredBlockKey as keyof typeof docsPathByBlockKey],
        "Block documentation exists in the shared block registry docs folder.",
      ),
      tests: createCapabilityDescriptor(
        true,
        "zip/src/blocks/registry/registry-invariants.test.tsx",
        "Shared contract tests validate registry, AI schema, and readiness parity.",
      ),
    },
  };
};

const buildCanonicalRefinementWorkflowSummary = (
  block: PageBuilderBlockDefinition,
  readiness: BlockReadinessDescriptor,
): BlockRefinementWorkflowSummary => {
  return toStoredRefinementWorkflowSummary(buildRefinementWorkflowResult({
    blockKey: block.blockKey,
    sourceComponent: `zip/${block.render.componentImportPath}`,
    designReference: workflow1CanonicalDesignReference,
    targetStatus: "ready",
  }, readiness));
};

const blockReadinessRegistry = Object.fromEntries(
  Object.values(baseBlockRegistry).map((block) => [block.blockKey, buildReadinessDescriptor(block)]),
) as Record<RegisteredBlockKey, BlockReadinessDescriptor>;

const blockRefinementWorkflowRegistry = Object.fromEntries(
  Object.values(baseBlockRegistry).map((block) => [
    block.blockKey,
    buildCanonicalRefinementWorkflowSummary(
      block,
      blockReadinessRegistry[block.blockKey as RegisteredBlockKey],
    ),
  ]),
) as Record<RegisteredBlockKey, BlockRefinementWorkflowSummary>;

export const blockRegistry = Object.fromEntries(
  Object.values(baseBlockRegistry).map((block) => [
    block.blockKey,
    {
      ...block,
      readiness: blockReadinessRegistry[block.blockKey as RegisteredBlockKey],
      refinementWorkflow: blockRefinementWorkflowRegistry[block.blockKey as RegisteredBlockKey],
    },
  ]),
) as RegisteredPageBuilderBlockRegistry;

const getMissingReadinessCapabilities = (
  readiness: BlockReadinessDescriptor,
): BlockReadinessCapabilityKey[] => {
  return blockReadinessRequiredCapabilities.filter(
    (capability) => !readiness.capabilities[capability].available,
  );
};

export const listBlocks = (): RegisteredPageBuilderBlockDefinition[] => {
  return Object.values(blockRegistry);
};

export const listBlocksWithReadiness = (): RegisteredPageBuilderBlockDefinition[] => {
  return listBlocks();
};

export const getBlock = (blockKey: string): RegisteredPageBuilderBlockDefinition | null => {
  return blockRegistry[blockKey as RegisteredBlockKey] ?? null;
};

export const getBlockReadiness = (blockKey: string): BlockReadinessDescriptor | null => {
  return getBlock(blockKey)?.readiness ?? null;
};

export const runBlockRefinementWorkflow = (
  request: BlockRefinementWorkflowRequest,
): BlockRefinementWorkflowResult => {
  return buildRefinementWorkflowResult(request, getBlockReadiness(request.blockKey) ?? undefined);
};

export const emitMachineRegistryManifest = () => {
  return {
    version: 1,
    registryStatus: "seed",
    updatedAt: machineRegistryManifestUpdatedAt,
    readiness: {
      lifecycle: [...blockReadinessLifecycleStatuses],
      requiredCapabilitiesForReady: [...blockReadinessRequiredCapabilities],
      workflow1: {
        requestFields: [...blockRefinementWorkflowRequestFields],
        supportedTargetStatuses: [...blockRefinementWorkflowSupportedTargetStatuses],
        readinessOutcomes: [...blockRefinementWorkflowReadinessOutcomes],
        requiredArtifactsForReady: [...blockRefinementWorkflowRequiredArtifacts],
        designSystemReferences: [...workflow1SupportingDesignReferences],
      },
      blocks: Object.fromEntries(
        listBlocksWithReadiness().map((block) => [
          block.blockKey,
          {
            lifecycle: block.readiness.lifecycle,
            capabilities: block.readiness.capabilities,
          },
        ]),
      ),
    },
  };
};

export const assertBlockReady = (blockKey: string): BlockReadinessDescriptor => {
  const block = getBlock(blockKey);

  if (!block) {
    throw new Error(`Unknown block key: ${blockKey}`);
  }

  const missingCapabilities = getMissingReadinessCapabilities(block.readiness);

  if (block.readiness.lifecycle !== "ready" || missingCapabilities.length > 0) {
    const missingSummary = missingCapabilities.length > 0
      ? ` Missing capabilities: ${missingCapabilities.join(", ")}.`
      : "";
    throw new Error(
      `Block ${blockKey} is not ready. Lifecycle: ${block.readiness.lifecycle}.${missingSummary}`,
    );
  }

  return block.readiness;
};

export const validateBlockData = (blockKey: string, data: unknown): unknown => {
  const block = getBlock(blockKey);

  if (!block) {
    throw new Error(`Unknown block key: ${blockKey}`);
  }

  return block.schema.parse(data);
};

export const validateBlockSource = (blockKey: string, source: unknown): unknown => {
  const block = getBlock(blockKey);

  if (!block) {
    throw new Error(`Unknown block key: ${blockKey}`);
  }

  if (!block.sourceSchema) {
    if (source == null) {
      return null;
    }

    throw new Error(`Block ${blockKey} does not support an external source.`);
  }

  return block.sourceSchema.parse(source);
};

const cloneData = <T,>(value: T): T => {
  return structuredClone(value);
};

export const createDefaultBlockInstance = (
  blockKey: RegisteredBlockKey,
  sequenceNumber = 1,
): PageBuilderSectionInstance => {
  const block = blockRegistry[blockKey];
  const sequence = String(sequenceNumber).padStart(2, "0");

  return {
    id: `${block.blockKey}-${sequence}`,
    blockKey: block.blockKey,
    blockVersion: block.version,
    variant: null,
    enabled: true,
    data: cloneData(block.defaultData),
    source: null,
    meta: {},
  };
};

export const mvpBlockDefaults = {
  about_2_simple: about2SimpleDefaultData,
  about1: about1DefaultData,
  big_img_and_bolded_tex_editorial_style_block: bigImgAndBoldedTexEditorialStyleBlockDefinition.defaultData,
  block_download: blockDownloadDefaultData,
  contact34: contact34DefaultData,
  feature_grid_section: featureGridSectionDefaultData,
  galleryMasonryStyle1: galleryMasonryStyle1DefaultData,
  hero_simple_no_text_normal_wide: heroSimpleNoTextNormalWideDefaultData,
  hero_simple_no_text_py32: heroSimpleNoTextPy32DefaultData,
  just_pralax_img_horizontal: justPralaxImgHorizontalDefaultData,
  menu_three_columns_with_with_heading_no_img: menuThreeColumnsWithWithHeadingNoImgDefaultData,
  menu_two_columns_with_no_heading_no_img: menuTwoColumnsWithNoHeadingNoImgDefaultData,
  menu_two_columns_with_with_heading_no_img: menuTwoColumnsWithWithHeadingNoImgDefaultData,
  menu_two_columns_with_with_heading_with_img_fullwidth_paralax:
    menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData,
  menuCategoryPhotoParallaxFullWidth: menuCategoryPhotoParallaxFullWidthDefaultData,
  oferta_posts_section: ofertaPostsSectionDefaultData,
  offer_hero: offerHeroDefaultData,
  ourServices: ourServicesDefaultData,
  premium_call_to_action_with_image_carousel: premiumCallToActionWithImageCarouselDefaultData,
  promo2: promo2DefaultData,
  promo3: promo3DefaultData,
  regional_cuisine: regionalCuisineDefaultData,
  restaurant_menu_drawer_type: restaurantMenuDrawerTypeDefaultData,
  simple_heading_and_paragraph: simpleHeadingAndParagraphDefaultData,
  storyTeamShowcase: storyTeamShowcaseDefaultData,
  testimonial7: testimonial7DefaultData,
  universal_header_block_1: universalHeaderBlock1DefaultData,
  universal_header_block_2: universalHeaderBlock2DefaultData,
  universal_multilink_block: universalMultilinkBlockDefaultData,
  universal_multilink_block_simple: universalMultilinkBlockSimpleDefaultData,
} as const;
