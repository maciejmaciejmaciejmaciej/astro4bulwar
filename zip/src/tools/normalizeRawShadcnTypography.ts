import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_TARGET_DIRECTORIES = [path.join("src", "components", "sections")];
const SUPPORTED_EXTENSIONS = new Set([".tsx", ".jsx", ".astro"]);
const REMOVED_FONT_WEIGHT_TOKENS = new Set([
  "font-thin",
  "font-extralight",
  "font-light",
  "font-normal",
  "font-medium",
  "font-semibold",
  "font-bold",
  "font-extrabold",
  "font-black",
]);

type CliIo = {
  writeStdout: (message: string) => void;
  writeStderr: (message: string) => void;
};

type UnresolvedEntry = {
  filePath: string;
  element: string;
  reasonCode: "unsupported_syntax";
  message: string;
  location: {
    line: number;
    column: number;
  };
};

export type NormalizeResult = {
  output: string;
  changed: boolean;
  unresolved: UnresolvedEntry[];
};

type StaticStringArgument = {
  quote: string;
  value: string;
};

const defaultIo: CliIo = {
  writeStdout: (message) => {
    process.stdout.write(`${message}\n`);
  },
  writeStderr: (message) => {
    process.stderr.write(`${message}\n`);
  },
};

function renderUsage(): string {
  return [
    "Usage: npm run normalize:raw-shadcn-typography -- [--write] [target ...]",
    `Defaults to scanning ${DEFAULT_TARGET_DIRECTORIES.join(", ")} recursively when no target is provided.`,
    "Targets may be files or directories. Supported files: .tsx, .jsx, .astro.",
    "The cleaner only removes leading-*, tracking-*, and font-weight classes.",
  ].join("\n");
}

function splitClassTokens(className: string): string[] {
  return className
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function getVariantBaseToken(token: string): string {
  const segments = token.split(":");
  return segments[segments.length - 1] ?? token;
}

function shouldStripToken(token: string): boolean {
  const baseToken = getVariantBaseToken(token);

  return (
    baseToken.startsWith("leading-") ||
    baseToken.startsWith("tracking-") ||
    REMOVED_FONT_WEIGHT_TOKENS.has(baseToken)
  );
}

function cleanClassValue(classValue: string): string {
  return splitClassTokens(classValue)
    .filter((token) => !shouldStripToken(token))
    .join(" ");
}

function escapeForQuote(value: string, quote: string): string {
  return value.replace(/\\/g, "\\\\").replaceAll(quote, `\\${quote}`);
}

function replaceDirectStringAttributes(sourceText: string): string {
  return sourceText.replace(
    /\b(className|class)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,
    (fullMatch, attributeName, doubleQuotedValue, singleQuotedValue) => {
      const quote = doubleQuotedValue !== undefined ? '"' : "'";
      const classValue = doubleQuotedValue ?? singleQuotedValue ?? "";
      const cleanedValue = cleanClassValue(classValue);

      if (cleanedValue === classValue) {
        return fullMatch;
      }

      return `${attributeName}=${quote}${escapeForQuote(cleanedValue, quote)}${quote}`;
    },
  );
}

function replaceExpressionStringAttributes(sourceText: string): string {
  return sourceText.replace(
    /\b(className|class)\s*=\s*{\s*(?:"([^"]*)"|'([^']*)')\s*}/g,
    (fullMatch, attributeName, doubleQuotedValue, singleQuotedValue) => {
      const quote = doubleQuotedValue !== undefined ? '"' : "'";
      const classValue = doubleQuotedValue ?? singleQuotedValue ?? "";
      const cleanedValue = cleanClassValue(classValue);

      if (cleanedValue === classValue) {
        return fullMatch;
      }

      return `${attributeName}={${quote}${escapeForQuote(cleanedValue, quote)}${quote}}`;
    },
  );
}

function parseStaticStringArguments(argumentList: string): StaticStringArgument[] | null {
  const parsedArguments: StaticStringArgument[] = [];
  let index = 0;

  while (index < argumentList.length) {
    while (index < argumentList.length && /[\s,]/.test(argumentList[index] ?? "")) {
      index += 1;
    }

    if (index >= argumentList.length) {
      break;
    }

    const quote = argumentList[index];

    if (quote !== '"' && quote !== "'") {
      return null;
    }

    index += 1;
    let value = "";

    while (index < argumentList.length) {
      const character = argumentList[index];

      if (character === "\\") {
        const nextCharacter = argumentList[index + 1];

        if (nextCharacter === undefined) {
          return null;
        }

        value += nextCharacter;
        index += 2;
        continue;
      }

      if (character === quote) {
        index += 1;
        break;
      }

      value += character;
      index += 1;
    }

    parsedArguments.push({ quote, value });

    while (index < argumentList.length && /\s/.test(argumentList[index] ?? "")) {
      index += 1;
    }

    if (index < argumentList.length) {
      if (argumentList[index] !== ",") {
        return null;
      }

      index += 1;
    }
  }

  return parsedArguments;
}

function replaceStaticCnAttributes(sourceText: string): string {
  return sourceText.replace(/\b(className|class)\s*=\s*{\s*cn\(([\s\S]*?)\)\s*}/g, (fullMatch, attributeName, argumentList) => {
    const parsedArguments = parseStaticStringArguments(argumentList);

    if (!parsedArguments || parsedArguments.length === 0) {
      return fullMatch;
    }

    const cleanedArguments = parsedArguments.map((argument) => ({
      ...argument,
      value: cleanClassValue(argument.value),
    }));
    const changed = cleanedArguments.some((argument, index) => argument.value !== parsedArguments[index]?.value);

    if (!changed) {
      return fullMatch;
    }

    const renderedArguments = cleanedArguments
      .map((argument) => `${argument.quote}${escapeForQuote(argument.value, argument.quote)}${argument.quote}`)
      .join(", ");

    return `${attributeName}={cn(${renderedArguments})}`;
  });
}

export function normalizeSource(sourceText: string, _filePath: string): NormalizeResult {
  const output = replaceStaticCnAttributes(replaceExpressionStringAttributes(replaceDirectStringAttributes(sourceText)));

  return {
    output,
    changed: output !== sourceText,
    unresolved: [],
  };
}

async function collectSupportedFiles(entryPath: string, collectedFiles: string[]): Promise<void> {
  let entryStat;

  try {
    entryStat = await stat(entryPath);
  } catch {
    return;
  }

  if (entryStat.isFile()) {
    if (SUPPORTED_EXTENSIONS.has(path.extname(entryPath).toLowerCase())) {
      collectedFiles.push(entryPath);
    }

    return;
  }

  if (!entryStat.isDirectory()) {
    return;
  }

  const directoryEntries = await readdir(entryPath, { withFileTypes: true });

  for (const directoryEntry of directoryEntries) {
    await collectSupportedFiles(path.join(entryPath, directoryEntry.name), collectedFiles);
  }
}

async function resolveTargetFiles(targets: string[]): Promise<string[]> {
  const collectedFiles: string[] = [];

  for (const target of targets) {
    await collectSupportedFiles(path.resolve(target), collectedFiles);
  }

  return [...new Set(collectedFiles)].sort((left, right) => left.localeCompare(right));
}

export async function runNormalizeRawShadcnTypographyCli(
  argv: string[],
  io: CliIo = defaultIo,
): Promise<number> {
  let write = false;
  const targets: string[] = [];

  for (const argument of argv) {
    if (argument === "--write") {
      write = true;
      continue;
    }

    if (argument === "--help" || argument === "-h") {
      io.writeStdout(renderUsage());
      return 0;
    }

    if (argument.startsWith("-")) {
      io.writeStderr(`Unknown option: ${argument}`);
      io.writeStdout(renderUsage());
      return 1;
    }

    targets.push(argument);
  }

  const effectiveTargets = targets.length > 0 ? targets : DEFAULT_TARGET_DIRECTORIES;
  const files = await resolveTargetFiles(effectiveTargets);

  io.writeStdout(`Mode: ${write ? "write" : "dry-run"}`);
  io.writeStdout(`Target roots: ${effectiveTargets.join(", ")}`);

  if (files.length === 0) {
    io.writeStdout("No matching files found.");
    return 0;
  }

  io.writeStdout(`Files: ${files.length}`);

  for (const filePath of files) {
    const sourceText = await readFile(filePath, "utf8");
    const result = normalizeSource(sourceText, filePath);

    if (write && result.changed) {
      await writeFile(filePath, result.output, "utf8");
    }

    io.writeStdout(`- ${filePath}: ${result.changed ? "changed" : "no changes"}`);
  }

  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runNormalizeRawShadcnTypographyCli(process.argv.slice(2)).then(
    (exitCode) => {
      process.exitCode = exitCode;
    },
    (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown CLI failure";
      defaultIo.writeStderr(message);
      process.exitCode = 1;
    },
  );
}