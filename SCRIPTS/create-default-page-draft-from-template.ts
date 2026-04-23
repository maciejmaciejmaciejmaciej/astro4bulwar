/*
Usage:
  npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/create-default-page-draft-from-template.ts --slug nowa-strona
  npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/create-default-page-draft-from-template.ts --slug nowa-strona --title "Nowa Strona" --status draft
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  createDefaultPageCompositionWorkflowState,
  parseFirebasePageDraft,
  type FirebasePageDraft,
} from "../zip/src/blocks/registry/firebasePageDraft.ts";

type DraftStatus = FirebasePageDraft["status"];

type CliOptions = {
  slug: string;
  title: string | null;
  status: DraftStatus;
  templateDraftPath: string;
  outputDraftPath: string;
  outputSourceMappingsPath: string;
  pageKind: string | null;
  templateKey: string | null;
};

type SourceMappings = Record<string, unknown>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const defaultArtifactsDir = path.join(repoRoot, "docs", "plan", "astro-wordpress-page-builder");
const defaultTemplateDraftPath = path.join(defaultArtifactsDir, "testowa-blueprint.firebase-draft.json");

const cloneValue = <T,>(value: T): T => {
  return structuredClone(value);
};

const humanizeSlug = (slug: string): string => {
  return slug
    .split("-")
    .filter((segment) => segment.trim().length > 0)
    .map((segment) => {
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join(" ");
};

const resolveRepoPath = (filePath: string): string => {
  return path.resolve(repoRoot, filePath);
};

const isValidStatus = (value: string): value is DraftStatus => {
  return value === "draft" || value === "published" || value === "archived";
};

const readJsonFile = <T,>(filePath: string): T => {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
};

export const deriveSourceMappingsFromDraft = (draft: FirebasePageDraft): SourceMappings => {
  const mappings: SourceMappings = {};

  for (const blockId of draft.blocksOrder) {
    const block = draft.blocks[blockId];

    if (!block || block.source == null) {
      continue;
    }

    mappings[blockId] = cloneValue(block.source);
  }

  return mappings;
};

export const createDefaultPageDraftFromTemplate = ({
  templateDraft,
  slug,
  title,
  status = "draft",
  pageKind,
  templateKey,
}: {
  templateDraft: FirebasePageDraft;
  slug: string;
  title?: string | null;
  status?: DraftStatus;
  pageKind?: string | null;
  templateKey?: string | null;
}): {
  draft: FirebasePageDraft;
  sourceMappings: SourceMappings;
} => {
  const normalizedTemplate = parseFirebasePageDraft(cloneValue(templateDraft));
  const nextDraft = parseFirebasePageDraft({
    ...normalizedTemplate,
    pageSlug: slug,
    title: title?.trim() || humanizeSlug(slug),
    status,
    pageKind: pageKind?.trim() || normalizedTemplate.pageKind,
    templateKey: templateKey?.trim() || normalizedTemplate.templateKey,
    wordpressPostId: null,
    CompanyName: null,
    websiteUrl: null,
    sourcePath: undefined,
    sourceUrl: undefined,
    seo: undefined,
    currentSessionId: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    compiled: {
      page_builder_schema: null,
      page_builder_schema_for_ai: null,
    },
    workflow: createDefaultPageCompositionWorkflowState(),
    needsCompile: true,
    needsPublish: false,
    needsDeploy: false,
  });

  return {
    draft: nextDraft,
    sourceMappings: deriveSourceMappingsFromDraft(nextDraft),
  };
};

const parseArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = {
    slug: "",
    title: null,
    status: "draft",
    templateDraftPath: defaultTemplateDraftPath,
    outputDraftPath: "",
    outputSourceMappingsPath: "",
    pageKind: null,
    templateKey: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--slug") {
      options.slug = argv[index + 1]?.trim() ?? "";
      index += 1;
      continue;
    }

    if (token === "--title") {
      options.title = argv[index + 1]?.trim() ?? null;
      index += 1;
      continue;
    }

    if (token === "--status") {
      const status = argv[index + 1]?.trim() ?? "";

      if (!isValidStatus(status)) {
        throw new Error(`Invalid --status value: ${status}`);
      }

      options.status = status;
      index += 1;
      continue;
    }

    if (token === "--template-draft") {
      options.templateDraftPath = resolveRepoPath(argv[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (token === "--output-draft") {
      options.outputDraftPath = resolveRepoPath(argv[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (token === "--output-source-mappings") {
      options.outputSourceMappingsPath = resolveRepoPath(argv[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (token === "--page-kind") {
      options.pageKind = argv[index + 1]?.trim() ?? null;
      index += 1;
      continue;
    }

    if (token === "--template-key") {
      options.templateKey = argv[index + 1]?.trim() ?? null;
      index += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      throw new Error([
        "HELP",
        "Usage:",
        "  npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/create-default-page-draft-from-template.ts --slug nowa-strona",
        "  npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/create-default-page-draft-from-template.ts --slug nowa-strona --title \"Nowa Strona\" --status draft",
      ].join("\n"));
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!options.slug) {
    throw new Error("Missing required argument: --slug");
  }

  if (!options.outputDraftPath) {
    options.outputDraftPath = path.join(defaultArtifactsDir, `${options.slug}.firebase-draft.json`);
  }

  if (!options.outputSourceMappingsPath) {
    options.outputSourceMappingsPath = path.join(defaultArtifactsDir, `${options.slug}-source-mappings.json`);
  }

  return options;
};

export const runCreateDefaultPageDraftFromTemplateCli = (argv: string[]): {
  draftPath: string;
  sourceMappingsPath: string;
  draft: FirebasePageDraft;
  sourceMappings: SourceMappings;
} => {
  const options = parseArgs(argv);
  const templateDraft = parseFirebasePageDraft(readJsonFile<unknown>(options.templateDraftPath));
  const result = createDefaultPageDraftFromTemplate({
    templateDraft,
    slug: options.slug,
    title: options.title,
    status: options.status,
    pageKind: options.pageKind,
    templateKey: options.templateKey,
  });

  fs.mkdirSync(path.dirname(options.outputDraftPath), { recursive: true });
  fs.mkdirSync(path.dirname(options.outputSourceMappingsPath), { recursive: true });
  fs.writeFileSync(options.outputDraftPath, `${JSON.stringify(result.draft, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    options.outputSourceMappingsPath,
    `${JSON.stringify(result.sourceMappings, null, 2)}\n`,
    "utf8",
  );

  return {
    draftPath: options.outputDraftPath,
    sourceMappingsPath: options.outputSourceMappingsPath,
    draft: result.draft,
    sourceMappings: result.sourceMappings,
  };
};

const isDirectExecution = (): boolean => {
  const entrypoint = process.argv[1];

  if (!entrypoint) {
    return false;
  }

  return path.resolve(entrypoint) === __filename;
};

const main = (): void => {
  try {
    const result = runCreateDefaultPageDraftFromTemplateCli(process.argv.slice(2));

    process.stdout.write(`${JSON.stringify({
      draftPath: result.draftPath,
      sourceMappingsPath: result.sourceMappingsPath,
      pageSlug: result.draft.pageSlug,
      title: result.draft.title,
      status: result.draft.status,
    }, null, 2)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.startsWith("HELP\n")) {
      process.stdout.write(`${message.slice(5)}\n`);
      process.exit(0);
    }

    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
};

if (isDirectExecution()) {
  main();
}