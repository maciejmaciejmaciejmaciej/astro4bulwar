const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  bootstrapClientConfig,
  parseEnvFileContents,
  validateConfig,
} = require("./bootstrap-client-config.js");

const sampleConfig = `
CLIENT_SITE_URL="https://example-client.pl"
CLIENT_WORDPRESS_BASE_URL="https://example-client.pl"
CLIENT_ASTRO_BASE_PATH="/astro/"
CLIENT_REACT_BASE_PATH="/react/"
CLIENT_SSH_HOST="example-client.ssh.dhosting.pl"
CLIENT_SSH_USER="example-user"
CLIENT_SSH_KEY_PATH="./id_rsa"
CLIENT_REMOTE_ASTRO_SOURCE_ROOT="/remote/astro-source"
CLIENT_REMOTE_ASTRO_PUBLIC_ROOT="/remote/public/astro"
CLIENT_REMOTE_ASTRO_BACKUP_ROOT="/remote/backups/astro"
CLIENT_REMOTE_REACT_PUBLIC_ROOT="/remote/public/react"
CLIENT_REMOTE_WP_ROOT="/remote/public"
CLIENT_BRIDGE_GOOGLE_MAPS_API_KEY="maps-key"
CLIENT_BRIDGE_STORE_ORIGIN_LINE1="Line 1"
CLIENT_BRIDGE_STORE_ORIGIN_CITY="Poznan"
CLIENT_BRIDGE_STORE_ORIGIN_POSTAL_CODE="61-001"
CLIENT_BRIDGE_STORE_ORIGIN_COUNTRY="PL"
CLIENT_BRIDGE_DELIVERY_BASE_FEE="10"
CLIENT_BRIDGE_DELIVERY_PRICE_PER_KM="9"
CLIENT_BRIDGE_FREE_DELIVERY_THRESHOLD="800"
CLIENT_BRIDGE_TIMEZONE="Europe/Warsaw"
CLIENT_BRIDGE_SPECIAL_PRODUCT_ID="53"
CLIENT_BRIDGE_MAKE_WEBHOOK_URL="https://hook.make.com/example"
CLIENT_PAGE_BUILDER_WORDPRESS_USERNAME="wp-user"
CLIENT_PAGE_BUILDER_WORDPRESS_APPLICATION_PASSWORD="wp-app-password"
CLIENT_FIREBASE_PROJECT_ID="firebase-project"
CLIENT_FIREBASE_CLIENT_EMAIL="firebase@example.iam.gserviceaccount.com"
CLIENT_FIREBASE_PRIVATE_KEY="line-1\\nline-2"
CLIENT_FIREBASE_DRAFT_COLLECTION="drafts"
CLIENT_FIREBASE_DATABASE_ID="(default)"
CLIENT_FIREBASE_APP_NAME="page-builder-runtime"
CLIENT_GEMINI_API_KEY="gemini-key"
CLIENT_APP_URL="https://example-client.pl/react/"
`.trim();

test("parseEnvFileContents decodes escaped newlines", () => {
  const parsed = parseEnvFileContents('CLIENT_FIREBASE_PRIVATE_KEY="line-1\\nline-2"');
  assert.equal(parsed.CLIENT_FIREBASE_PRIVATE_KEY, "line-1\nline-2");
});

test("validateConfig normalizes URLs and base paths", () => {
  const validated = validateConfig(parseEnvFileContents(sampleConfig));
  assert.equal(validated.CLIENT_SITE_URL, "https://example-client.pl");
  assert.equal(validated.CLIENT_WORDPRESS_BASE_URL, "https://example-client.pl");
  assert.equal(validated.CLIENT_ASTRO_BASE_PATH, "/astro/");
  assert.equal(validated.CLIENT_REACT_BASE_PATH, "/react/");
});

test("bootstrapClientConfig writes all generated artifacts", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bulwar-client-bootstrap-"));
  const inputPath = path.join(tempDir, ".env.client.local");
  fs.writeFileSync(inputPath, sampleConfig, "utf8");

  try {
    const output = bootstrapClientConfig({ inputPath, mode: "write", outputRoot: tempDir });
    assert.equal(output.generatedFilePaths.length, 4);
    assert.match(fs.readFileSync(path.join(tempDir, ".env.page-builder.local"), "utf8"), /PAGE_BUILDER_WORDPRESS_BASE_URL="https:\/\/example-client.pl"/);
    const astroEnv = fs.readFileSync(path.join(tempDir, "astro-site", ".env.local"), "utf8");
    assert.match(astroEnv, /PUBLIC_WORDPRESS_BASE_URL="https:\/\/example-client.pl"/);
    assert.match(astroEnv, /PUBLIC_REACT_BASE_PATH="\/react\/"/);
    assert.match(fs.readFileSync(path.join(tempDir, "zip", ".env.local"), "utf8"), /VITE_WORDPRESS_BASE_URL="https:\/\/example-client.pl"/);
    assert.match(fs.readFileSync(path.join(tempDir, ".client.generated.env"), "utf8"), /CLIENT_REMOTE_WP_ROOT="\/remote\/public"/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});