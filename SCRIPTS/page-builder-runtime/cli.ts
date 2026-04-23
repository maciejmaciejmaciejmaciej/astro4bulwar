import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parseFirebasePageDraft, type FirebasePageDraft } from "../../zip/src/blocks/registry/firebasePageDraft.ts";
import type { FirebasePageDraftStore } from "../../zip/src/blocks/registry/firebasePageDraftStore.ts";
import {
  createLiveFirestoreFirebasePageDraftStore,
  parsePageBuilderFirestoreEnv,
  type PageBuilderFirestoreEnv,
} from "./liveFirestoreDraftStore.ts";
import {
  createWordPressPageBuilderClient,
  parsePageBuilderWordPressEnv,
  type PageBuilderWordPressEnv,
} from "./wordpressPageBuilderClient.ts";
import {
  runPageCompositionWorkflow,
  runPageBuilderRuntimeWorkflow,
  type PageCompositionRefinementRequestOverrides,
  type PageCompositionWorkflowResult,
  type PageBuilderRuntimeWorkflowResult,
} from "./runtimeWorkflow.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const defaultRuntimeEnvFilePath = path.join(repoRoot, ".env.page-builder.local");

type CliOptions = {
  draftFilePath: string | null;
  draftDocId: string | null;
  sourceMappingsPath: string | null;
  refinementOverridesPath: string | null;
  outputPath: string | null;
  envFilePath: string | null;
  dryRun: boolean;
  verifyReadback: boolean;
  compose: boolean;
};

type CliOutput = {
  mode: "dry-run" | "publish";
  workflow: "runtime" | "composition";
  input: {
    draftFilePath?: string;
    draftDocId?: string;
  };
  sourceMappingsPath: string | null;
  result: PageBuilderRuntimeWorkflowResult | PageCompositionWorkflowResult;
};

type CliDeps = {
  env: NodeJS.ProcessEnv;
  readTextFile(filePath: string): string;
  writeTextFile(filePath: string, content: string): void;
  parseDraft(value: unknown): FirebasePageDraft;
  createDraftStore(env: PageBuilderFirestoreEnv): Promise<FirebasePageDraftStore>;
  createWordPressClient(env: PageBuilderWordPressEnv): ReturnType<typeof createWordPressPageBuilderClient>;
  runWorkflow(input: {
    draft: FirebasePageDraft;
    approvedSourceMappings?: Record<string, unknown>;
    draftStore?: FirebasePageDraftStore;
    wordpressClient?: ReturnType<typeof createWordPressPageBuilderClient>;
    verifyReadback?: boolean;
    dryRun?: boolean;
  }): Promise<PageBuilderRuntimeWorkflowResult>;
  runCompositionWorkflow(input: {
    draft: FirebasePageDraft;
    approvedSourceMappings?: Record<string, unknown>;
    draftStore?: FirebasePageDraftStore;
    wordpressClient?: ReturnType<typeof createWordPressPageBuilderClient>;
    verifyReadback?: boolean;
    dryRun?: boolean;
    refinementRequestOverrides?: PageCompositionRefinementRequestOverrides;
  }): Promise<PageCompositionWorkflowResult>;
  stdout: Pick<NodeJS.WriteStream, "write">;
  stderr: Pick<NodeJS.WriteStream, "write">;
};

const defaultDeps: CliDeps = {
  env: process.env,
  readTextFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
  },
  writeTextFile(filePath, content) {
    fs.writeFileSync(filePath, content, "utf8");
  },
  parseDraft: parseFirebasePageDraft,
  createDraftStore(env) {
    return createLiveFirestoreFirebasePageDraftStore({ env });
  },
  createWordPressClient(env) {
    return createWordPressPageBuilderClient(env);
  },
  runWorkflow: runPageBuilderRuntimeWorkflow,
  runCompositionWorkflow: runPageCompositionWorkflow,
  stdout: process.stdout,
  stderr: process.stderr,
};

const resolveJsonPath = (rawPath: string): string => {
  return path.resolve(rawPath);
};

const parseArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = {
    draftFilePath: null,
    draftDocId: null,
    sourceMappingsPath: null,
    refinementOverridesPath: null,
    outputPath: null,
    envFilePath: null,
    dryRun: false,
    verifyReadback: false,
    compose: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--draft-file") {
      options.draftFilePath = argv[index + 1] ? resolveJsonPath(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === "--draft-doc-id") {
      options.draftDocId = argv[index + 1]?.trim() ?? null;
      index += 1;
      continue;
    }

    if (token === "--source-mappings") {
      options.sourceMappingsPath = argv[index + 1] ? resolveJsonPath(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === "--output") {
      options.outputPath = argv[index + 1] ? resolveJsonPath(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === "--refinement-overrides") {
      options.refinementOverridesPath = argv[index + 1] ? resolveJsonPath(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === "--env-file") {
      options.envFilePath = argv[index + 1] ? resolveJsonPath(argv[index + 1]) : null;
      index += 1;
      continue;
    }

    if (token === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (token === "--verify-readback") {
      options.verifyReadback = true;
      continue;
    }

    if (token === "--compose") {
      options.compose = true;
      continue;
    }

    if (token === "--help" || token === "-h") {
      throw new Error([
        "HELP",
        "Usage:",
        "  npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/page-builder-runtime/cli.ts --draft-file <path> [--source-mappings <path>] [--env-file <path>] [--dry-run] [--output <path>]",
        "  npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/page-builder-runtime/cli.ts --draft-doc-id <docId> [--source-mappings <path>] [--env-file <path>] [--verify-readback] [--output <path>]",
        "  npx --prefix zip tsx --tsconfig SCRIPTS/tsconfig.json SCRIPTS/page-builder-runtime/cli.ts --draft-file <path> --compose [--refinement-overrides <path>] [--dry-run] [--output <path>]",
      ].join("\n"));
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!options.draftFilePath && !options.draftDocId) {
    throw new Error("Provide either --draft-file or --draft-doc-id.");
  }

  if (options.draftFilePath && options.draftDocId) {
    throw new Error("--draft-file and --draft-doc-id are mutually exclusive.");
  }

  if (options.verifyReadback && options.dryRun) {
    throw new Error("--verify-readback cannot be combined with --dry-run.");
  }

  return options;
};

const decodeQuotedEnvValue = (value: string): string => {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
};

export const parseEnvFileContents = (content: string): Record<string, string> => {
  const values: Record<string, string> = {};

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (line.length === 0 || line.startsWith("#")) {
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
};

export const loadRuntimeEnv = ({
  baseEnv,
  explicitEnvFilePath,
  readTextFile,
}: {
  baseEnv: NodeJS.ProcessEnv;
  explicitEnvFilePath: string | null;
  readTextFile(filePath: string): string;
}): NodeJS.ProcessEnv => {
  const targetEnvFilePath = explicitEnvFilePath ?? defaultRuntimeEnvFilePath;

  try {
    const fileValues = parseEnvFileContents(readTextFile(targetEnvFilePath));

    return {
      ...fileValues,
      ...baseEnv,
    };
  } catch (error) {
    const errorCode = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : null;

    if (errorCode === "ENOENT" && !explicitEnvFilePath) {
      return { ...baseEnv };
    }

    if (errorCode === "ENOENT" && explicitEnvFilePath) {
      throw new Error(`Env file was not found: ${explicitEnvFilePath}`);
    }

    throw error;
  }
};

const readJsonFile = <T,>(filePath: string, deps: CliDeps): T => {
  return JSON.parse(deps.readTextFile(filePath)) as T;
};

const loadDraftFromFile = (filePath: string, deps: CliDeps): FirebasePageDraft => {
  return deps.parseDraft(readJsonFile<unknown>(filePath, deps));
};

const loadSourceMappings = (filePath: string | null, deps: CliDeps): Record<string, unknown> => {
  if (!filePath) {
    return {};
  }

  return readJsonFile<Record<string, unknown>>(filePath, deps);
};

const loadRefinementOverrides = (
  filePath: string | null,
  deps: CliDeps,
): PageCompositionRefinementRequestOverrides => {
  if (!filePath) {
    return {};
  }

  return readJsonFile<PageCompositionRefinementRequestOverrides>(filePath, deps);
};

const writeOutput = (output: CliOutput, options: CliOptions, deps: CliDeps): void => {
  const rendered = `${JSON.stringify(output, null, 2)}\n`;

  if (options.outputPath) {
    deps.writeTextFile(options.outputPath, rendered);
    return;
  }

  deps.stdout.write(rendered);
};

export const runPageBuilderRuntimeCli = async (
  argv: string[],
  overrides: Partial<CliDeps> = {},
): Promise<CliOutput> => {
  const deps: CliDeps = {
    ...defaultDeps,
    ...overrides,
  };
  const options = parseArgs(argv);
  const effectiveEnv = loadRuntimeEnv({
    baseEnv: deps.env,
    explicitEnvFilePath: options.envFilePath,
    readTextFile: deps.readTextFile,
  });
  const sourceMappings = loadSourceMappings(options.sourceMappingsPath, deps);
  const refinementOverrides = loadRefinementOverrides(options.refinementOverridesPath, deps);

  let firestoreEnv: PageBuilderFirestoreEnv | null = null;
  let draftStore: FirebasePageDraftStore | null = null;

  if (options.draftDocId || !options.dryRun) {
    firestoreEnv = parsePageBuilderFirestoreEnv(effectiveEnv);
    draftStore = await deps.createDraftStore(firestoreEnv);
  }

  const draft = options.draftFilePath
    ? loadDraftFromFile(options.draftFilePath, deps)
    : await (async () => {
        const loadedDraft = await draftStore?.loadDraft(options.draftDocId!);

        if (!loadedDraft) {
          throw new Error(`Firebase draft document was not found: ${options.draftDocId}`);
        }

        return loadedDraft;
      })();

  const wordpressClient = options.dryRun
    ? undefined
    : deps.createWordPressClient(parsePageBuilderWordPressEnv(effectiveEnv));
  const result = options.compose
    ? await deps.runCompositionWorkflow({
        draft,
        approvedSourceMappings: sourceMappings,
        draftStore: draftStore ?? undefined,
        wordpressClient,
        verifyReadback: options.verifyReadback,
        dryRun: options.dryRun,
        refinementRequestOverrides: refinementOverrides,
      })
    : await deps.runWorkflow({
        draft,
        approvedSourceMappings: sourceMappings,
        draftStore: draftStore ?? undefined,
        wordpressClient,
        verifyReadback: options.verifyReadback,
        dryRun: options.dryRun,
      });
  const output: CliOutput = {
    mode: options.dryRun ? "dry-run" : "publish",
    workflow: options.compose ? "composition" : "runtime",
    input: options.draftFilePath
      ? { draftFilePath: options.draftFilePath }
      : { draftDocId: options.draftDocId! },
    sourceMappingsPath: options.sourceMappingsPath,
    result,
  };

  writeOutput(output, options, deps);

  return output;
};

const main = async (): Promise<void> => {
  try {
    await runPageBuilderRuntimeCli(process.argv.slice(2));
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

const isDirectCliExecution = (): boolean => {
  const entrypoint = process.argv[1];

  if (!entrypoint) {
    return false;
  }

  return import.meta.url === pathToFileURL(path.resolve(entrypoint)).href;
};

if (isDirectCliExecution()) {
  void main();
}