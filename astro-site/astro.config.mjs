import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';

const astroRoot = fileURLToPath(new URL('.', import.meta.url));
const localEnvPath = fileURLToPath(new URL('./.env.local', import.meta.url));

const parseEnvFile = (filePath) => {
  const values = {};
  const content = readFileSync(filePath, 'utf8');

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
      values[key] = rawValue.slice(1, -1)
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
      continue;
    }

    values[key] = rawValue;
  }

  return values;
};

const localEnv = existsSync(localEnvPath) ? parseEnvFile(localEnvPath) : {};

const getRequiredEnvValue = (key) => {
  const value = localEnv[key] ?? process.env[key];

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required Astro config value: ${key}. Run node SCRIPTS/bootstrap-client-config.js --write first.`);
  }

  return value.trim();
};

const normalizeBasePath = (value) => {
  if (!value.startsWith('/')) {
    throw new Error('CLIENT_ASTRO_BASE_PATH must start with "/".');
  }

  return value.endsWith('/') ? value : `${value}/`;
};

const site = getRequiredEnvValue('CLIENT_SITE_URL').replace(/\/$/, '');
const base = normalizeBasePath(getRequiredEnvValue('CLIENT_ASTRO_BASE_PATH'));

export default defineConfig({
  root: astroRoot,
  base,
  output: 'static',
  site,
});