/*
Usage:
  npx --prefix zip tsx --tsconfig zip/tsconfig.json SCRIPTS/generate-page-draft-from-scrape.ts --input zip/SRIPTS/wp-seo-scraper/output/menu-dania-glowne/content.md
  npx --prefix zip tsx --tsconfig zip/tsconfig.json SCRIPTS/generate-page-draft-from-scrape.ts --input zip/SRIPTS/wp-seo-scraper/output/menu-dania-glowne/content.md --output docs/plan/astro-wordpress-page-builder/menu-dania-glowne.firebase-draft.json
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  createPageDraftFromScrape,
  type NormalizedScrapeDocument,
} from "../zip/src/blocks/registry/createPageDraftFromScrape.ts";

type CliOptions = {
  inputPath: string;
  outputPath: string;
};

type FrontmatterMap = Record<string, string>;

type ScrapeSeoData = {
  url?: unknown;
  title?: unknown;
  description?: unknown;
  canonical?: unknown;
  ogTags?: unknown;
  headers?: unknown;
};

type ScrapeHeaders = {
  h1?: unknown;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const TITLE_SUFFIX_SEPARATOR = /\s+[\u2013-]\s+/;
const GENERIC_MENU_HEADING_PATTERN = /\b(kuchnia|menu|restauracja)\b/i;

const toRepoRelativePath = (filePath: string): string => {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
};

const toComparableText = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

const readJsonFile = <T,>(filePath: string): T | null => {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
};

const parseFrontmatter = (markdown: string): FrontmatterMap => {
  const lines = markdown.split(/\r?\n/);

  if (lines[0] !== "---") {
    return {};
  }

  const result: FrontmatterMap = {};

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (line === "---") {
      break;
    }

    const separatorIndex = line.indexOf(":");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (key.length > 0 && value.length > 0) {
      result[key] = value;
    }
  }

  return result;
};

const toNonEmptyString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
};

const uniqueNonEmptyStrings = (values: string[]): string[] => {
  const seenValues = new Set<string>();

  return values.filter((value) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0 || seenValues.has(trimmedValue)) {
      return false;
    }

    seenValues.add(trimmedValue);
    return true;
  });
};

const extractMarkdownH1Titles = (markdown: string): string[] => {
  const matches = markdown.matchAll(/^# \[H1\] (.+)$/gm);

  return uniqueNonEmptyStrings(
    Array.from(matches, (match) => {
      return match[1]?.trim() ?? "";
    }),
  );
};

const extractSeoH1Titles = (seoData: ScrapeSeoData | null): string[] => {
  const rawHeaders = seoData?.headers;

  if (!rawHeaders || typeof rawHeaders !== "object" || Array.isArray(rawHeaders)) {
    return [];
  }

  const h1Values = (rawHeaders as ScrapeHeaders).h1;

  if (!Array.isArray(h1Values)) {
    return [];
  }

  return uniqueNonEmptyStrings(
    h1Values.map((value) => {
      return toNonEmptyString(value) ?? "";
    }),
  );
};

const extractPageTitle = (
  seoData: ScrapeSeoData | null,
  frontmatter: FrontmatterMap,
  pageSlug: string,
): string => {
  const rawTitle =
    toNonEmptyString(seoData?.title) ??
    toNonEmptyString(frontmatter.TITLE) ??
    pageSlug.replace(/-/g, " ");

  const simplifiedTitle = rawTitle.split(TITLE_SUFFIX_SEPARATOR)[0]?.trim() ?? rawTitle;

  return simplifiedTitle.length > 0 ? simplifiedTitle : rawTitle;
};

const derivePageKind = (pageSlug: string, sourceUrl: string | null): string => {
  if (pageSlug.startsWith("menu-") || (sourceUrl ?? "").includes("/menu/")) {
    return "restaurant_menu";
  }

  return "generic_page";
};

const extractRestaurantMenuSectionTitles = (
  pageTitle: string,
  seoData: ScrapeSeoData | null,
  markdown: string,
): string[] => {
  const headingTitles = uniqueNonEmptyStrings([
    ...extractSeoH1Titles(seoData),
    ...extractMarkdownH1Titles(markdown),
  ]);
  const comparablePageTitle = toComparableText(pageTitle);
  const filteredTitles = headingTitles.filter((headingTitle) => {
    return toComparableText(headingTitle) !== comparablePageTitle;
  });

  if (filteredTitles.length > 1 && GENERIC_MENU_HEADING_PATTERN.test(filteredTitles[0])) {
    return filteredTitles.slice(1);
  }

  return filteredTitles;
};

const buildSeoPayload = (seoData: ScrapeSeoData | null): Record<string, unknown> | undefined => {
  if (!seoData) {
    return undefined;
  }

  const seoPayload: Record<string, unknown> = {};
  const title = toNonEmptyString(seoData.title);
  const description = toNonEmptyString(seoData.description);
  const canonical = toNonEmptyString(seoData.canonical) ?? toNonEmptyString(seoData.url);

  if (title) {
    seoPayload.title = title;
  }

  if (description) {
    seoPayload.description = description;
  }

  if (canonical) {
    seoPayload.canonical = canonical;
  }

  if (seoData.ogTags && typeof seoData.ogTags === "object" && !Array.isArray(seoData.ogTags)) {
    seoPayload.ogTags = seoData.ogTags;
  }

  return Object.keys(seoPayload).length > 0 ? seoPayload : undefined;
};

const resolveScrapePaths = (inputPath: string): { contentPath: string; seoDataPath: string } => {
  const resolvedInputPath = path.resolve(inputPath);
  const stats = fs.statSync(resolvedInputPath);

  if (stats.isDirectory()) {
    return {
      contentPath: path.join(resolvedInputPath, "content.md"),
      seoDataPath: path.join(resolvedInputPath, "seo-data.json"),
    };
  }

  if (path.basename(resolvedInputPath).toLowerCase() === "seo-data.json") {
    return {
      contentPath: path.join(path.dirname(resolvedInputPath), "content.md"),
      seoDataPath: resolvedInputPath,
    };
  }

  return {
    contentPath: resolvedInputPath,
    seoDataPath: path.join(path.dirname(resolvedInputPath), "seo-data.json"),
  };
};

const normalizeScrapeDocument = (contentPath: string, seoDataPath: string): NormalizedScrapeDocument => {
  const markdown = fs.readFileSync(contentPath, "utf8");
  const frontmatter = parseFrontmatter(markdown);
  const seoData = readJsonFile<ScrapeSeoData>(seoDataPath);
  const pageSlug = path.basename(path.dirname(contentPath));
  const sourceUrl =
    toNonEmptyString(seoData?.canonical) ??
    toNonEmptyString(seoData?.url) ??
    toNonEmptyString(frontmatter.URL);
  const title = extractPageTitle(seoData, frontmatter, pageSlug);
  const pageKind = derivePageKind(pageSlug, sourceUrl);
  const seo = buildSeoPayload(seoData);
  const structureHints =
    pageKind === "restaurant_menu"
      ? {
          headingTextHints: [],
          sectionHeadingHints: [],
          templateKey: "restaurant-menu",
          requiresWooMenu: true,
          menuSectionTitles: extractRestaurantMenuSectionTitles(title, seoData, markdown),
        }
      : {
          headingTextHints: [],
          menuSectionTitles: [],
          sectionHeadingHints: [],
          templateKey: "generic-page",
        };

  return {
    pageSlug,
    pageKind,
    title,
    sourcePath: toRepoRelativePath(contentPath),
    ...(sourceUrl ? { sourceUrl } : {}),
    ...(seo ? { seo } : {}),
    structureHints,
  };
};

const parseArgs = (argv: string[]): CliOptions => {
  let inputPath: string | null = null;
  let outputPath: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--input") {
      inputPath = argv[index + 1] ? path.resolve(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === "--output") {
      outputPath = argv[index + 1] ? path.resolve(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      process.stdout.write(
        [
          "Usage:",
          "  npx --prefix zip tsx --tsconfig zip/tsconfig.json SCRIPTS/generate-page-draft-from-scrape.ts --input zip/SRIPTS/wp-seo-scraper/output/menu-dania-glowne/content.md",
          "  npx --prefix zip tsx --tsconfig zip/tsconfig.json SCRIPTS/generate-page-draft-from-scrape.ts --input zip/SRIPTS/wp-seo-scraper/output/menu-dania-glowne/content.md --output docs/plan/astro-wordpress-page-builder/menu-dania-glowne.firebase-draft.json",
        ].join("\n"),
      );
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!inputPath) {
    throw new Error("Missing required --input argument.");
  }

  const { contentPath } = resolveScrapePaths(inputPath);
  const pageSlug = path.basename(path.dirname(contentPath));

  return {
    inputPath,
    outputPath:
      outputPath ??
      path.resolve(
        repoRoot,
        "docs",
        "plan",
        "astro-wordpress-page-builder",
        `${pageSlug}.firebase-draft.json`,
      ),
  };
};

const main = (): void => {
  const options = parseArgs(process.argv.slice(2));
  const { contentPath, seoDataPath } = resolveScrapePaths(options.inputPath);

  if (!fs.existsSync(contentPath)) {
    throw new Error(`Missing scrape content file: ${contentPath}`);
  }

  const normalizedDocument = normalizeScrapeDocument(contentPath, seoDataPath);
  const firebaseDraft = createPageDraftFromScrape(normalizedDocument);

  fs.mkdirSync(path.dirname(options.outputPath), { recursive: true });
  fs.writeFileSync(options.outputPath, `${JSON.stringify(firebaseDraft, null, 2)}\n`, "utf8");
  process.stdout.write(`Draft artifact written to ${options.outputPath}\n`);
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  process.stderr.write(`${message}\n`);
  process.exit(1);
}