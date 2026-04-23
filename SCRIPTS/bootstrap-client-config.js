const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = path.join(repoRoot, ".env.client.local");

const requiredKeys = [
  "CLIENT_SITE_URL",
  "CLIENT_WORDPRESS_BASE_URL",
  "CLIENT_ASTRO_BASE_PATH",
  "CLIENT_REACT_BASE_PATH",
  "CLIENT_SSH_HOST",
  "CLIENT_SSH_USER",
  "CLIENT_SSH_KEY_PATH",
  "CLIENT_REMOTE_ASTRO_SOURCE_ROOT",
  "CLIENT_REMOTE_ASTRO_PUBLIC_ROOT",
  "CLIENT_REMOTE_ASTRO_BACKUP_ROOT",
  "CLIENT_REMOTE_REACT_PUBLIC_ROOT",
  "CLIENT_REMOTE_WP_ROOT",
  "CLIENT_BRIDGE_GOOGLE_MAPS_API_KEY",
  "CLIENT_BRIDGE_STORE_ORIGIN_LINE1",
  "CLIENT_BRIDGE_STORE_ORIGIN_CITY",
  "CLIENT_BRIDGE_STORE_ORIGIN_POSTAL_CODE",
  "CLIENT_BRIDGE_STORE_ORIGIN_COUNTRY",
  "CLIENT_BRIDGE_DELIVERY_BASE_FEE",
  "CLIENT_BRIDGE_DELIVERY_PRICE_PER_KM",
  "CLIENT_BRIDGE_FREE_DELIVERY_THRESHOLD",
  "CLIENT_BRIDGE_TIMEZONE",
  "CLIENT_BRIDGE_SPECIAL_PRODUCT_ID",
  "CLIENT_PAGE_BUILDER_WORDPRESS_USERNAME",
  "CLIENT_PAGE_BUILDER_WORDPRESS_APPLICATION_PASSWORD",
  "CLIENT_FIREBASE_PROJECT_ID",
  "CLIENT_FIREBASE_CLIENT_EMAIL",
  "CLIENT_FIREBASE_PRIVATE_KEY",
];

const optionalKeys = [
  "CLIENT_BRIDGE_MAKE_WEBHOOK_URL",
  "CLIENT_FIREBASE_DRAFT_COLLECTION",
  "CLIENT_FIREBASE_DATABASE_ID",
  "CLIENT_FIREBASE_APP_NAME",
  "CLIENT_GEMINI_API_KEY",
  "CLIENT_APP_URL",
];

function resolveGeneratedFiles(outputRoot = repoRoot) {
  return {
    pageBuilder: path.join(outputRoot, ".env.page-builder.local"),
    astro: path.join(outputRoot, "astro-site", ".env.local"),
    react: path.join(outputRoot, "zip", ".env.local"),
    shared: path.join(outputRoot, ".client.generated.env"),
  };
}

const generatedFiles = resolveGeneratedFiles();

function decodeQuotedEnvValue(value) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function encodeEnvValue(value) {
  return `"${String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/"/g, '\\"')}"`;
}

function parseEnvFileContents(content) {
  const values = {};

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex <= 0) {
      throw new Error(`Invalid env line: ${rawLine}`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(key)) {
      throw new Error(`Invalid env key: ${key}`);
    }

    if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
      values[key] = decodeQuotedEnvValue(rawValue.slice(1, -1));
      continue;
    }

    if (rawValue.startsWith("'") && rawValue.endsWith("'")) {
      values[key] = rawValue.slice(1, -1);
      continue;
    }

    values[key] = rawValue.replace(/\s+#.*$/u, "").trim();
  }

  return values;
}

function normalizeBasePath(value, key) {
  const trimmed = String(value || "").trim();

  if (!trimmed.startsWith("/")) {
    throw new Error(`${key} must start with '/'.`);
  }

  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function normalizeUrl(value, key) {
  const trimmed = String(value || "").trim().replace(/\/$/, "");

  if (!/^https?:\/\//u.test(trimmed)) {
    throw new Error(`${key} must be an absolute http(s) URL.`);
  }

  return trimmed;
}

function validateConfig(config) {
  const missing = requiredKeys.filter((key) => {
    const value = config[key];
    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new Error(`Missing required client config keys: ${missing.join(", ")}`);
  }

  return {
    ...config,
    CLIENT_SITE_URL: normalizeUrl(config.CLIENT_SITE_URL, "CLIENT_SITE_URL"),
    CLIENT_WORDPRESS_BASE_URL: normalizeUrl(config.CLIENT_WORDPRESS_BASE_URL, "CLIENT_WORDPRESS_BASE_URL"),
    CLIENT_ASTRO_BASE_PATH: normalizeBasePath(config.CLIENT_ASTRO_BASE_PATH, "CLIENT_ASTRO_BASE_PATH"),
    CLIENT_REACT_BASE_PATH: normalizeBasePath(config.CLIENT_REACT_BASE_PATH, "CLIENT_REACT_BASE_PATH"),
    CLIENT_BRIDGE_MAKE_WEBHOOK_URL: String(config.CLIENT_BRIDGE_MAKE_WEBHOOK_URL || "").trim(),
    CLIENT_FIREBASE_DRAFT_COLLECTION: String(config.CLIENT_FIREBASE_DRAFT_COLLECTION || "").trim(),
    CLIENT_FIREBASE_DATABASE_ID: String(config.CLIENT_FIREBASE_DATABASE_ID || "").trim(),
    CLIENT_FIREBASE_APP_NAME: String(config.CLIENT_FIREBASE_APP_NAME || "").trim(),
    CLIENT_GEMINI_API_KEY: String(config.CLIENT_GEMINI_API_KEY || "").trim(),
    CLIENT_APP_URL: String(config.CLIENT_APP_URL || "").trim(),
  };
}

function renderEnvFile(headerLines, entries) {
  const lines = [...headerLines, ""];

  for (const [key, value] of entries) {
    if (typeof value !== "string" || value.length === 0) {
      continue;
    }

    lines.push(`${key}=${encodeEnvValue(value)}`);
  }

  return `${lines.join("\n")}\n`;
}

function createArtifacts(config, outputRoot = repoRoot) {
  const resolvedFiles = resolveGeneratedFiles(outputRoot);

  return {
    [resolvedFiles.pageBuilder]: renderEnvFile(
      [
        "# Generated by SCRIPTS/bootstrap-client-config.js. Do not edit manually.",
        "# Edit .env.client.local and rerun the bootstrap script.",
      ],
      [
        ["PAGE_BUILDER_WORDPRESS_BASE_URL", config.CLIENT_WORDPRESS_BASE_URL],
        ["PAGE_BUILDER_WORDPRESS_USERNAME", config.CLIENT_PAGE_BUILDER_WORDPRESS_USERNAME],
        ["PAGE_BUILDER_WORDPRESS_APPLICATION_PASSWORD", config.CLIENT_PAGE_BUILDER_WORDPRESS_APPLICATION_PASSWORD],
        ["PAGE_BUILDER_FIREBASE_PROJECT_ID", config.CLIENT_FIREBASE_PROJECT_ID],
        ["PAGE_BUILDER_FIREBASE_CLIENT_EMAIL", config.CLIENT_FIREBASE_CLIENT_EMAIL],
        ["PAGE_BUILDER_FIREBASE_PRIVATE_KEY", config.CLIENT_FIREBASE_PRIVATE_KEY],
        ["PAGE_BUILDER_FIREBASE_DRAFT_COLLECTION", config.CLIENT_FIREBASE_DRAFT_COLLECTION],
        ["PAGE_BUILDER_FIREBASE_DATABASE_ID", config.CLIENT_FIREBASE_DATABASE_ID],
        ["PAGE_BUILDER_FIREBASE_APP_NAME", config.CLIENT_FIREBASE_APP_NAME],
      ],
    ),
    [resolvedFiles.astro]: renderEnvFile(
      [
        "# Generated by SCRIPTS/bootstrap-client-config.js. Do not edit manually.",
        "# Edit .env.client.local and rerun the bootstrap script.",
      ],
      [
        ["CLIENT_SITE_URL", config.CLIENT_SITE_URL],
        ["CLIENT_ASTRO_BASE_PATH", config.CLIENT_ASTRO_BASE_PATH],
        ["PUBLIC_WORDPRESS_BASE_URL", config.CLIENT_WORDPRESS_BASE_URL],
        ["PUBLIC_SITE_URL", config.CLIENT_SITE_URL],
        ["PUBLIC_REACT_BASE_PATH", config.CLIENT_REACT_BASE_PATH],
      ],
    ),
    [resolvedFiles.react]: renderEnvFile(
      [
        "# Generated by SCRIPTS/bootstrap-client-config.js. Do not edit manually.",
        "# Edit .env.client.local and rerun the bootstrap script.",
      ],
      [
        ["VITE_WORDPRESS_BASE_URL", config.CLIENT_WORDPRESS_BASE_URL],
        ["VITE_BRIDGE_BASE_URL", config.CLIENT_WORDPRESS_BASE_URL],
        ["VITE_SITE_URL", config.CLIENT_SITE_URL],
        ["VITE_REACT_BASE_PATH", config.CLIENT_REACT_BASE_PATH],
        ["GEMINI_API_KEY", config.CLIENT_GEMINI_API_KEY],
        ["APP_URL", config.CLIENT_APP_URL],
      ],
    ),
    [resolvedFiles.shared]: renderEnvFile(
      [
        "# Generated by SCRIPTS/bootstrap-client-config.js. Do not edit manually.",
        "# Edit .env.client.local and rerun the bootstrap script.",
      ],
      [
        ["CLIENT_SITE_URL", config.CLIENT_SITE_URL],
        ["CLIENT_WORDPRESS_BASE_URL", config.CLIENT_WORDPRESS_BASE_URL],
        ["CLIENT_ASTRO_BASE_PATH", config.CLIENT_ASTRO_BASE_PATH],
        ["CLIENT_REACT_BASE_PATH", config.CLIENT_REACT_BASE_PATH],
        ["CLIENT_SSH_HOST", config.CLIENT_SSH_HOST],
        ["CLIENT_SSH_USER", config.CLIENT_SSH_USER],
        ["CLIENT_SSH_KEY_PATH", config.CLIENT_SSH_KEY_PATH],
        ["CLIENT_REMOTE_ASTRO_SOURCE_ROOT", config.CLIENT_REMOTE_ASTRO_SOURCE_ROOT],
        ["CLIENT_REMOTE_ASTRO_PUBLIC_ROOT", config.CLIENT_REMOTE_ASTRO_PUBLIC_ROOT],
        ["CLIENT_REMOTE_ASTRO_BACKUP_ROOT", config.CLIENT_REMOTE_ASTRO_BACKUP_ROOT],
        ["CLIENT_REMOTE_REACT_PUBLIC_ROOT", config.CLIENT_REMOTE_REACT_PUBLIC_ROOT],
        ["CLIENT_REMOTE_WP_ROOT", config.CLIENT_REMOTE_WP_ROOT],
        ["CLIENT_BRIDGE_GOOGLE_MAPS_API_KEY", config.CLIENT_BRIDGE_GOOGLE_MAPS_API_KEY],
        ["CLIENT_BRIDGE_STORE_ORIGIN_LINE1", config.CLIENT_BRIDGE_STORE_ORIGIN_LINE1],
        ["CLIENT_BRIDGE_STORE_ORIGIN_CITY", config.CLIENT_BRIDGE_STORE_ORIGIN_CITY],
        ["CLIENT_BRIDGE_STORE_ORIGIN_POSTAL_CODE", config.CLIENT_BRIDGE_STORE_ORIGIN_POSTAL_CODE],
        ["CLIENT_BRIDGE_STORE_ORIGIN_COUNTRY", config.CLIENT_BRIDGE_STORE_ORIGIN_COUNTRY],
        ["CLIENT_BRIDGE_DELIVERY_BASE_FEE", config.CLIENT_BRIDGE_DELIVERY_BASE_FEE],
        ["CLIENT_BRIDGE_DELIVERY_PRICE_PER_KM", config.CLIENT_BRIDGE_DELIVERY_PRICE_PER_KM],
        ["CLIENT_BRIDGE_FREE_DELIVERY_THRESHOLD", config.CLIENT_BRIDGE_FREE_DELIVERY_THRESHOLD],
        ["CLIENT_BRIDGE_TIMEZONE", config.CLIENT_BRIDGE_TIMEZONE],
        ["CLIENT_BRIDGE_SPECIAL_PRODUCT_ID", config.CLIENT_BRIDGE_SPECIAL_PRODUCT_ID],
        ["CLIENT_BRIDGE_MAKE_WEBHOOK_URL", config.CLIENT_BRIDGE_MAKE_WEBHOOK_URL],
      ],
    ),
  };
}

function bootstrapClientConfig({ inputPath = defaultInputPath, mode = "write", outputRoot = repoRoot } = {}) {
  const content = fs.readFileSync(inputPath, "utf8");
  const parsed = parseEnvFileContents(content);
  const config = validateConfig(parsed);
  const artifacts = createArtifacts(config, outputRoot);

  if (mode === "write") {
    for (const [filePath, fileContent] of Object.entries(artifacts)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, fileContent, "utf8");
    }
  }

  return {
    config,
    artifacts,
    generatedFilePaths: Object.keys(artifacts),
  };
}

function parseArgs(argv) {
  const options = {
    inputPath: defaultInputPath,
    mode: "write",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--input") {
      options.inputPath = path.resolve(argv[index + 1] || "");
      index += 1;
      continue;
    }

    if (token === "--check") {
      options.mode = "check";
      continue;
    }

    if (token === "--write") {
      options.mode = "write";
      continue;
    }

    if (token === "--help" || token === "-h") {
      options.mode = "help";
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return options;
}

function printHelp() {
  process.stdout.write(
    [
      "Usage:",
      "  node SCRIPTS/bootstrap-client-config.js --write [--input .env.client.local]",
      "  node SCRIPTS/bootstrap-client-config.js --check [--input .env.client.local]",
      "",
      "Generated files:",
      "  .env.page-builder.local",
      "  astro-site/.env.local",
      "  zip/.env.local",
      "  .client.generated.env",
    ].join("\n") + "\n",
  );
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));

    if (options.mode === "help") {
      printHelp();
      process.exit(0);
    }

    const result = bootstrapClientConfig(options);
    const verb = options.mode === "check" ? "Validated" : "Generated";
    process.stdout.write(`${verb} client config artifacts:\n${result.generatedFilePaths.join("\n")}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

module.exports = {
  bootstrapClientConfig,
  createArtifacts,
  defaultInputPath,
  generatedFiles,
  optionalKeys,
  parseEnvFileContents,
  requiredKeys,
  resolveGeneratedFiles,
  validateConfig,
};