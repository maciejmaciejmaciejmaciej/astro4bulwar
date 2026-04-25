import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  TEMPLATE_BLOCK_ASTRO_VALIDATION_MARKER_ATTRIBUTE,
  TEMPLATE_BLOCK_ASTRO_VALIDATION_OUTPUT_PATH,
  TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS,
} from '../src/lib/templateBlockAstroValidation.ts';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(scriptDir, '..', TEMPLATE_BLOCK_ASTRO_VALIDATION_OUTPUT_PATH);

if (!existsSync(outputPath)) {
  throw new Error(`Validation output is missing: ${outputPath}`);
}

const html = readFileSync(outputPath, 'utf8');
const markerPrefix = `${TEMPLATE_BLOCK_ASTRO_VALIDATION_MARKER_ATTRIBUTE}="`;
const missingBlockKeys = TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS.filter(
  (blockKey) => !html.includes(`${markerPrefix}${blockKey}"`),
);
const markerCount = html.split(markerPrefix).length - 1;

if (markerCount !== TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS.length) {
  throw new Error(
    `Expected ${TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS.length} validation markers but found ${markerCount} in ${outputPath}.`,
  );
}

if (missingBlockKeys.length > 0) {
  throw new Error(`Missing validation markers for block keys: ${missingBlockKeys.join(', ')}`);
}

console.log(`Validated template block Astro output markers for ${TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS.length} block keys.`);