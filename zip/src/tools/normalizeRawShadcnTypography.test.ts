import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import * as ts from "typescript";

import { runNormalizeRawShadcnTypographyCli } from "./normalizeRawShadcnTypography";
import { normalizeSource } from "./normalizeRawShadcnTypography";

const createIo = () => {
  const stdout: string[] = [];
  const stderr: string[] = [];

  return {
    stdout,
    stderr,
    io: {
      writeStdout(message: string) {
        stdout.push(message);
      },
      writeStderr(message: string) {
        stderr.push(message);
      },
    },
  };
};

function assertCleanTsxSyntax(sourceText: string, filePath: string): void {
  const { diagnostics = [] } = ts.transpileModule(sourceText, {
    fileName: filePath,
    reportDiagnostics: true,
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.Latest,
    },
  });
  const formattedDiagnostics = diagnostics.map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

    if (!diagnostic.file || diagnostic.start === undefined) {
      return message;
    }

    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    return `${line + 1}:${character + 1} ${message}`;
  });

  assert.deepEqual(formattedDiagnostics, []);
}

test("CLI defaults to src/components/sections and exits safely when it is missing", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "normalize-raw-shadcn-"));
  const { io, stdout, stderr } = createIo();
  const previousCwd = process.cwd();

  process.chdir(tempRoot);

  const exitCode = await runNormalizeRawShadcnTypographyCli([], io);

  process.chdir(previousCwd);

  assert.equal(exitCode, 0);
  assert.match(stdout.join("\n"), /Target roots: src[\\/]components[\\/]sections/);
  assert.match(stdout.join("\n"), /No matching files found/);
  assert.equal(stderr.length, 0);
});

test("CLI scans directories recursively and ignores unsupported file types", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "normalize-raw-shadcn-"));
  const directoryPath = path.join(tempRoot, "sections");
  const nestedDirectoryPath = path.join(directoryPath, "nested");
  const tsxPath = path.join(directoryPath, "Example.tsx");
  const astroPath = path.join(nestedDirectoryPath, "Card.astro");
  const ignoredTsPath = path.join(directoryPath, "ignored.ts");

  await mkdir(directoryPath);
  await mkdir(nestedDirectoryPath);
  await writeFile(tsxPath, '<p className="text-lg leading-7 font-semibold">Hello</p>\n', "utf8");
  await writeFile(astroPath, '<h2 class="text-3xl tracking-tight font-bold">Hi</h2>\n', "utf8");
  await writeFile(ignoredTsPath, "export const noop = true;\n", "utf8");

  const { io, stdout, stderr } = createIo();
  const exitCode = await runNormalizeRawShadcnTypographyCli(["--write", directoryPath], io);

  assert.equal(exitCode, 0);
  assert.equal(stderr.length, 0);
  assert.match(stdout.join("\n"), /Files: 2/);
  assert.equal(await readFile(tsxPath, "utf8"), '<p className="text-lg">Hello</p>\n');
  assert.equal(await readFile(astroPath, "utf8"), '<h2 class="text-3xl">Hi</h2>\n');
  assert.equal(await readFile(ignoredTsPath, "utf8"), "export const noop = true;\n");
});

test("CLI defaults to dry-run and requires --write for mutation mode", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "normalize-raw-shadcn-"));
  const tsxPath = path.join(tempRoot, "Example.tsx");
  const originalSource = [
    "export function Example() {",
    "  return (",
    '    <p className="text-lg leading-7 font-semibold text-muted-foreground">Hello</p>',
    "  );",
    "}",
    "",
  ].join("\n");
  const expectedWrittenSource = [
    "export function Example() {",
    "  return (",
    '    <p className="text-lg text-muted-foreground">Hello</p>',
    "  );",
    "}",
    "",
  ].join("\n");

  await writeFile(tsxPath, originalSource, "utf8");

  const dryRunCapture = createIo();
  const dryRunExitCode = await runNormalizeRawShadcnTypographyCli([tsxPath], dryRunCapture.io);

  assert.equal(dryRunExitCode, 0);
  assert.match(dryRunCapture.stdout.join("\n"), /Mode: dry-run/);
  assert.match(dryRunCapture.stdout.join("\n"), /changed/);
  assert.equal(await readFile(tsxPath, "utf8"), originalSource);

  const writeCapture = createIo();
  const writeExitCode = await runNormalizeRawShadcnTypographyCli(["--write", tsxPath], writeCapture.io);
  const writtenSource = await readFile(tsxPath, "utf8");

  assert.equal(writeExitCode, 0);
  assert.match(writeCapture.stdout.join("\n"), /Mode: write/);
  assert.match(writeCapture.stdout.join("\n"), /changed/);
  assert.equal(writtenSource, expectedWrittenSource);
  assertCleanTsxSyntax(writtenSource, tsxPath);
});

test("normalizeSource strips only typography modifiers and preserves authored size classes", () => {
  const input = [
    'export function Example() {',
    '  return (',
    '    <section className="grid gap-6">',
    '      <h2 className="text-sm md:text-lg lg:text-5xl font-semibold tracking-tight leading-tight text-on-surface uppercase italic">Heading</h2>',
    '      <p className="mt-4 text-lg leading-7 text-muted-foreground">Body copy</p>',
    '      <small className={cn("text-[14px] font-medium tracking-normal", "text-zinc-500 uppercase font-mono")}>Meta</small>',
    '    </section>',
    '  );',
    '}',
  ].join("\n");

  const result = normalizeSource(input, "Example.tsx");

  assert.equal(result.changed, true);
  assert.match(
    result.output,
    /<h2 className="text-sm md:text-lg lg:text-5xl text-on-surface uppercase italic">Heading<\/h2>/,
  );
  assert.match(result.output, /<p className="mt-4 text-lg text-muted-foreground">Body copy<\/p>/);
  assert.match(
    result.output,
    /<small className=\{cn\("text-\[14px\]", "text-zinc-500 uppercase font-mono"\)\}>Meta<\/small>/,
  );
  assert.doesNotMatch(result.output, /type-h\d|type-body|type-meta|type-micro/);
});

test("normalizeSource handles static class attributes across tsx jsx and astro styles", () => {
  const input = [
    '<section>',
    '  <h2 class="text-3xl tracking-tight font-bold">Heading</h2>',
    '  <p className="text-base leading-7 font-normal">Body</p>',
    '</section>',
  ].join("\n");

  const result = normalizeSource(input, "Example.astro");

  assert.equal(result.changed, true);
  assert.equal(result.unresolved.length, 0);
  assert.equal(
    result.output,
    ['<section>', '  <h2 class="text-3xl">Heading</h2>', '  <p className="text-base">Body</p>', '</section>'].join("\n"),
  );
});

test("normalizeSource leaves computed class values unchanged", () => {
  const input = [
    'export function Example({ emphasized }: { emphasized: boolean }) {',
    '  return (',
    '    <p className={emphasized ? "text-lg font-semibold" : "text-sm tracking-tight font-medium text-on-surface"}>Paragraph</p>',
    '  );',
    '}',
  ].join("\n");

  const result = normalizeSource(input, "Computed.tsx");

  assert.equal(result.changed, false);
  assert.equal(result.output, input);
  assert.equal(result.unresolved.length, 0);
});