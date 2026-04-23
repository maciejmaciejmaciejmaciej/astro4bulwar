#!/usr/bin/env node

/*
Usage:
  node SCRIPTS/generate-page-builder-ai-schema.js --input path/to/page_builder_schema.json
  node SCRIPTS/generate-page-builder-ai-schema.js --input path/to/page_builder_schema.json --output path/to/page_builder_schema_for_ai.json
  node SCRIPTS/generate-page-builder-ai-schema.js --input path/to/page_builder_schema.json --post-id 118

This generator creates the AI-oriented page_builder_schema_for_ai payload from the render-oriented
page_builder_schema and adds instance-level descriptions plus edit guidance for each supported block.
*/

const fs = require('fs');
const path = require('path');
const { createAiBlockRegistry } = require(path.join(__dirname, '../zip/src/blocks/registry/ai/descriptors.cjs'));

function printUsage() {
  process.stdout.write(
    [
      'Usage:',
      '  node SCRIPTS/generate-page-builder-ai-schema.js --input path/to/page_builder_schema.json',
      '  node SCRIPTS/generate-page-builder-ai-schema.js --input path/to/page_builder_schema.json --output path/to/page_builder_schema_for_ai.json',
      '  node SCRIPTS/generate-page-builder-ai-schema.js --input path/to/page_builder_schema.json --post-id 118',
    ].join('\n'),
  );
}

function parseArgs(argv) {
  const options = {
    inputPath: null,
    outputPath: null,
    postId: null,
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

    if (token === '--post-id') {
      const value = argv[index + 1];
      options.postId = value ? Number.parseInt(value, 10) : Number.NaN;
      index += 1;
      continue;
    }

    if (token === '--help' || token === '-h') {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!options.inputPath) {
    throw new Error('Missing required --input argument.');
  }

  if (!options.outputPath) {
    options.outputPath = options.inputPath.replace(/\.page_builder_schema\.json$/i, '.page_builder_schema_for_ai.json');
  }

  if (options.postId !== null && !Number.isInteger(options.postId)) {
    throw new Error('The --post-id value must be an integer.');
  }

  return options;
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return value;
}

function getArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }

  return value;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getStructuredSource(section) {
  return section.source && typeof section.source === 'object' && !Array.isArray(section.source)
    ? section.source
    : null;
}

const AI_BLOCK_REGISTRY = createAiBlockRegistry({
  assertObject,
  getArray,
  clone,
  getStructuredSource,
});

function resolveDescriptorValue(value, section) {
  return typeof value === 'function' ? value(section) : value;
}

function getStructuredMeta(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value
    : null;
}

function getSectionInstanceDescription(section) {
  const meta = getStructuredMeta(section.meta);
  const ai = meta ? getStructuredMeta(meta.ai) : null;
  const description = ai && typeof ai.description === 'string'
    ? ai.description.trim()
    : '';

  return description.length > 0 ? description : null;
}

function buildKnownBlockDescriptionFallback(section) {
  return `Instancja bloku ${section.blockKey} bez opisu AI. Edytuj tylko pola wskazane przez editableFields i respektuj contentSource oraz doNotEditDirectly.`;
}

function buildGenericBlockDescriptionFallback(section) {
  return `Instancja bloku ${section.blockKey} nie ma dedykowanego descriptora AI. Edytuj tylko pola wskazane przez editableFields i respektuj contentSource oraz doNotEditDirectly.`;
}

function resolveBlockDescription(section, hasDedicatedDescriptor) {
  const instanceDescription = getSectionInstanceDescription(section);

  if (instanceDescription) {
    return instanceDescription;
  }

  return hasDedicatedDescriptor
    ? buildKnownBlockDescriptionFallback(section)
    : buildGenericBlockDescriptionFallback(section);
}

function buildGenericAiContent(section) {
  return {
    data: clone(assertObject(section.data, `${section.id}.data`)),
    source: section.source == null ? null : clone(section.source),
    variant: typeof section.variant === 'string' ? section.variant : null,
  };
}

function buildGenericEditableFields(section) {
  const data = assertObject(section.data, `${section.id}.data`);
  const source = getStructuredSource(section);
  const editableFields = [];

  if (typeof section.variant === 'string') {
    editableFields.push('content.variant');
  }

  if (source) {
    editableFields.push('content.source.sourceValue');

    if (typeof data.title === 'string') {
      editableFields.push('content.data.title');
    }

    if (typeof data.eyebrow === 'string') {
      editableFields.push('content.data.eyebrow');
    }

    if (typeof data.description === 'string') {
      editableFields.push('content.data.description');
    }

    if (typeof data.emptyStateText === 'string') {
      editableFields.push('content.data.emptyStateText');
    }

    if (data.image && typeof data.image === 'object' && !Array.isArray(data.image)) {
      editableFields.push('content.data.image.src', 'content.data.image.alt');
    }

    if (data.backgroundImage && typeof data.backgroundImage === 'object' && !Array.isArray(data.backgroundImage)) {
      editableFields.push('content.data.backgroundImage.src', 'content.data.backgroundImage.alt');
    }

    if (data.heroImage && typeof data.heroImage === 'object' && !Array.isArray(data.heroImage)) {
      editableFields.push('content.data.heroImage.src', 'content.data.heroImage.alt');
    }

    return [...new Set(editableFields)];
  }

  editableFields.push('content.data');
  return [...new Set(editableFields)];
}

function buildGenericDoNotEditDirectly(section) {
  const source = getStructuredSource(section);

  if (source) {
    return [
      'content.data.menuColumns',
      'content.data.items',
      'content.data.products',
      'layout',
      'meta',
    ];
  }

  return ['source', 'meta', 'layout'];
}

function buildGenericDescriptor(section) {
  const source = getStructuredSource(section);
  const contentSource = source && typeof source.sourceType === 'string'
    ? source.sourceType
    : 'page_schema';

  return {
    contentSource,
    editableFields: buildGenericEditableFields(section),
    editRoute: source
      ? 'Zmiany bindingu zrodla wykonuj przez content.source.sourceValue. Zmiany prostych pol strukturalnych wykonuj w content.data. Nie edytuj recznie kolekcji runtime-resolved pochodzacych z zewnetrznego source.'
      : 'Zmiany wykonuj ostroznie bezposrednio w content.data oraz ewentualnie w content.variant. Ten blok korzysta z generycznego fallbacku AI do czasu dodania dedykowanego descriptora.',
    doNotEditDirectly: buildGenericDoNotEditDirectly(section),
    build() {
      return {
        content: buildGenericAiContent(section),
      };
    },
  };
}

function buildAiBlock(section) {
  if (!section || typeof section !== 'object' || Array.isArray(section)) {
    throw new Error('Each section must be an object.');
  }

  if (typeof section.id !== 'string' || section.id.trim() === '') {
    throw new Error('Each section must have a non-empty id.');
  }

  const hasDedicatedDescriptor = Object.prototype.hasOwnProperty.call(AI_BLOCK_REGISTRY, section.blockKey);
  const descriptor = hasDedicatedDescriptor
    ? AI_BLOCK_REGISTRY[section.blockKey]
    : buildGenericDescriptor(section);

  return {
    id: section.id,
    blockKey: section.blockKey,
    variant: typeof section.variant === 'string' ? section.variant : null,
    description: resolveBlockDescription(section, hasDedicatedDescriptor),
    contentSource: resolveDescriptorValue(descriptor.contentSource, section),
    editableFields: resolveDescriptorValue(descriptor.editableFields, section),
    editRoute: resolveDescriptorValue(descriptor.editRoute, section),
    doNotEditDirectly: resolveDescriptorValue(descriptor.doNotEditDirectly, section),
    ...descriptor.build(section),
  };
}

function buildAiSchema(renderSchema, options) {
  const page = assertObject(renderSchema.page, 'page');
  const sections = getArray(renderSchema.sections, 'sections');

  return {
    version: Number.isInteger(renderSchema.version) ? renderSchema.version : 1,
    postId: options.postId,
    slug: typeof page.slug === 'string' ? page.slug : '',
    title: typeof page.title === 'string' ? page.title : '',
    blocks: sections.map(buildAiBlock),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const renderSchema = readJsonFile(options.inputPath);
  const aiSchema = buildAiSchema(renderSchema, options);
  writeJsonFile(options.outputPath, aiSchema);
  process.stdout.write(`AI schema written to ${options.outputPath}\n`);
}

module.exports = {
  buildAiBlock,
  buildAiSchema,
  parseArgs,
  readJsonFile,
  writeJsonFile,
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
