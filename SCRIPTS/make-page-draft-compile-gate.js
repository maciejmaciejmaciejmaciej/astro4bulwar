#!/usr/bin/env node

/*
Expected input JSON shape:
{
  "firebaseDraft": { ...draftDocument },
  "approvedSourceMappings": {
    "menu_two_columns_with_with_heading_no_img-01": {
      "sourceType": "woo_category",
      "sourceValue": "kolacje",
      "options": { "splitIntoColumns": 2 }
    }
  },
  "currentPageBuilderSchema": { ...optionalCurrentRenderSchema },
  "currentPageBuilderSchemaForAi": { ...optionalCurrentAiSchema }
}

Successful output JSON shape:
{
  "firebaseDraft": { ...updatedDraftWithCompiledPayloads },
  "compiled": {
    "page_builder_schema": { ...renderSchema },
    "page_builder_schema_for_ai": { ...aiSchema }
  },
  "meta": {
    "appliedSourceBlockIds": ["..."],
    "ignoredSourceBlockIds": ["..."],
    "usedCurrentPageBuilderSchema": true,
    "usedCurrentPageBuilderSchemaForAi": false
  }
}
*/

const fs = require('fs');
const path = require('path');

const { buildAiSchema } = require('./generate-page-builder-ai-schema.js');

const TODO_SOURCE_PATTERN = /^TODO_[A-Z0-9_]+$/;

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return value;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasSourcePlaceholder(source) {
  if (source == null) {
    return false;
  }

  if (typeof source === 'string') {
    return TODO_SOURCE_PATTERN.test(source.trim());
  }

  if (Array.isArray(source)) {
    return source.some((entry) => hasSourcePlaceholder(entry));
  }

  if (typeof source === 'object') {
    return Object.values(source).some((entry) => hasSourcePlaceholder(entry));
  }

  return false;
}

function buildSourceMappingNote(block) {
  if (block.source && typeof block.source === 'object' && !Array.isArray(block.source)) {
    if (block.source.sourceType === 'woo_category') {
      return 'Select a WooCommerce category slug or id for this block before compile.';
    }

    if (block.source.sourceType === 'woo_products') {
      return 'Select the WooCommerce product ids for this block before compile.';
    }
  }

  return 'Resolve this block source mapping before compile.';
}

function recomputeWorkflow(firebaseDraft) {
  const blocks = Object.values(assertObject(firebaseDraft.blocks, 'firebaseDraft.blocks'));
  const unresolvedBlocks = blocks.filter((block) => hasSourcePlaceholder(block.source));

  return {
    requiresSourceMapping: unresolvedBlocks.length > 0,
    unresolvedSourceBlockIds: unresolvedBlocks.map((block) => block.id),
    sourceMappingNotes: Object.fromEntries(
      unresolvedBlocks.map((block) => [block.id, buildSourceMappingNote(block)]),
    ),
    needsCompile: Boolean(firebaseDraft.needsCompile),
    needsPublish: Boolean(firebaseDraft.needsPublish),
    needsDeploy: Boolean(firebaseDraft.needsDeploy),
  };
}

function applyApprovedSourceMappings(firebaseDraft, approvedSourceMappings = {}) {
  const blocks = clone(assertObject(firebaseDraft.blocks, 'firebaseDraft.blocks'));
  const mappings = assertObject(approvedSourceMappings, 'approvedSourceMappings');
  const appliedSourceBlockIds = [];
  const ignoredSourceBlockIds = [];

  for (const [blockId, sourceMapping] of Object.entries(mappings)) {
    if (!blocks[blockId]) {
      ignoredSourceBlockIds.push(blockId);
      continue;
    }

    blocks[blockId] = {
      ...blocks[blockId],
      source: clone(sourceMapping),
    };
    appliedSourceBlockIds.push(blockId);
  }

  return {
    firebaseDraft: {
      ...firebaseDraft,
      blocks,
    },
    appliedSourceBlockIds,
    ignoredSourceBlockIds,
  };
}

function buildPageBuilderSchemaFromDraft(firebaseDraft) {
  const blocks = assertObject(firebaseDraft.blocks, 'firebaseDraft.blocks');

  if (!Array.isArray(firebaseDraft.blocksOrder)) {
    throw new Error('firebaseDraft.blocksOrder must be an array.');
  }

  const sections = firebaseDraft.blocksOrder.map((blockId) => {
    const block = blocks[blockId];

    if (!block) {
      throw new Error(`firebaseDraft.blocksOrder references a missing block id: ${blockId}`);
    }

    return {
      id: block.id,
      blockKey: block.blockKey,
      blockVersion: block.blockVersion,
      variant: typeof block.variant === 'string' ? block.variant : null,
      enabled: block.enabled !== false,
      data: clone(block.data),
      source: block.source == null ? null : clone(block.source),
      meta: block.meta && typeof block.meta === 'object' && !Array.isArray(block.meta)
        ? clone(block.meta)
        : {},
    };
  });

  return {
    version: 1,
    page: {
      slug: firebaseDraft.pageSlug,
      title: firebaseDraft.title,
      status: firebaseDraft.status || 'draft',
      ...(firebaseDraft.templateKey ? { templateKey: firebaseDraft.templateKey } : {}),
    },
    ...(firebaseDraft.seo ? { seo: clone(firebaseDraft.seo) } : {}),
    meta: {
      pageKind: firebaseDraft.pageKind,
      ...(firebaseDraft.sourcePath ? { sourcePath: firebaseDraft.sourcePath } : {}),
      ...(firebaseDraft.sourceUrl ? { sourceUrl: firebaseDraft.sourceUrl } : {}),
    },
    sections,
  };
}

function compilePageDraft(input) {
  const normalizedInput = assertObject(input, 'input');
  const baseDraft = clone(assertObject(normalizedInput.firebaseDraft, 'input.firebaseDraft'));
  const approvedSourceMappings = normalizedInput.approvedSourceMappings ?? {};
  const currentPageBuilderSchema = normalizedInput.currentPageBuilderSchema ?? null;
  const currentPageBuilderSchemaForAi = normalizedInput.currentPageBuilderSchemaForAi ?? null;
  const mappingResult = applyApprovedSourceMappings(baseDraft, approvedSourceMappings);
  const draftWithMappings = mappingResult.firebaseDraft;
  const workflow = recomputeWorkflow(draftWithMappings);

  if (workflow.requiresSourceMapping || Object.values(draftWithMappings.blocks).some((block) => hasSourcePlaceholder(block.source))) {
    throw new Error(
      `Compile blocked: unresolved source mappings remain for ${workflow.unresolvedSourceBlockIds.join(', ') || 'one or more blocks'}.`,
    );
  }

  const pageBuilderSchema = buildPageBuilderSchemaFromDraft(draftWithMappings);
  const pageBuilderSchemaForAi = buildAiSchema(pageBuilderSchema, {
    postId: Number.isInteger(draftWithMappings.wordpressPostId) ? draftWithMappings.wordpressPostId : null,
  });
  const compiledDraft = {
    ...draftWithMappings,
    compiled: {
      page_builder_schema: pageBuilderSchema,
      page_builder_schema_for_ai: pageBuilderSchemaForAi,
    },
    needsCompile: false,
    needsPublish: true,
    workflow: {
      ...workflow,
      needsCompile: false,
      needsPublish: true,
      needsDeploy: Boolean(draftWithMappings.needsDeploy),
    },
  };

  return {
    firebaseDraft: compiledDraft,
    compiled: compiledDraft.compiled,
    meta: {
      appliedSourceBlockIds: mappingResult.appliedSourceBlockIds,
      ignoredSourceBlockIds: mappingResult.ignoredSourceBlockIds,
      usedCurrentPageBuilderSchema: currentPageBuilderSchema != null,
      usedCurrentPageBuilderSchemaForAi: currentPageBuilderSchemaForAi != null,
    },
  };
}

function parseArgs(argv) {
  const options = {
    inputPath: null,
    outputPath: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--input') {
      options.inputPath = argv[index + 1] ? path.resolve(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === '--output') {
      options.outputPath = argv[index + 1] ? path.resolve(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === '--help' || token === '-h') {
      process.stdout.write(
        [
          'Usage:',
          '  node SCRIPTS/make-page-draft-compile-gate.js --input path/to/input.json',
          '  node SCRIPTS/make-page-draft-compile-gate.js --input path/to/input.json --output path/to/output.json',
        ].join('\n'),
      );
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!options.inputPath) {
    throw new Error('Missing required --input argument.');
  }

  if (!options.outputPath) {
    options.outputPath = options.inputPath.replace(/\.json$/i, '.compiled.json');
  }

  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = JSON.parse(fs.readFileSync(options.inputPath, 'utf8'));
  const output = compilePageDraft(input);
  fs.writeFileSync(options.outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  process.stdout.write(`Compile gate output written to ${options.outputPath}\n`);
}

module.exports = {
  applyApprovedSourceMappings,
  buildPageBuilderSchemaFromDraft,
  compilePageDraft,
  hasSourcePlaceholder,
  recomputeWorkflow,
};

if (require.main === module) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
}