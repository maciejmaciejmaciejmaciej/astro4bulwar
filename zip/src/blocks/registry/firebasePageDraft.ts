import { z } from "zod";

const TODO_SOURCE_PATTERN = /^TODO_[A-Z0-9_]+$/;

const lifecycleFlagsSchema = z.object({
  needsCompile: z.boolean().default(true),
  needsPublish: z.boolean().default(false),
  needsDeploy: z.boolean().default(false),
});

const pageCompositionResumeStageSchema = z.enum([
  "idle",
  "awaiting_block_refinement",
  "resume_page_composition",
  "refinement_failed",
  "blocked",
]);

const pageCompositionRetryBudgetSchema = z.object({
  maxAttempts: z.number().int().min(0).default(0),
  remainingAttempts: z.number().int().min(0).default(0),
});

const pendingBlockRefinementRequestSchema = z.object({
  blockKey: z.string().min(1),
  sourceBlockId: z.string().min(1).nullable().default(null),
  reason: z.enum(["missing", "not_ready"]),
});

export const sourceMappingWorkflowSchema = z.object({
  requiresSourceMapping: z.boolean().default(false),
  unresolvedSourceBlockIds: z.array(z.string().min(1)).default([]),
  sourceMappingNotes: z.record(z.string(), z.string()).default({}),
  needsCompile: z.boolean().default(true),
  needsPublish: z.boolean().default(false),
  needsDeploy: z.boolean().default(false),
  checkpointId: z.string().min(1).nullable().default(null),
  resumeStage: pageCompositionResumeStageSchema.default("idle"),
  retryBudget: pageCompositionRetryBudgetSchema.default({
    maxAttempts: 0,
    remainingAttempts: 0,
  }),
  pendingBlockRefinementRequest: pendingBlockRefinementRequestSchema.nullable().default(null),
});

export const firebaseDraftBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.string().min(1),
  blockVersion: z.number().int().positive(),
  variant: z.string().nullable().default(null),
  enabled: z.boolean().default(true),
  data: z.unknown(),
  source: z.unknown().nullable().default(null),
  meta: z.record(z.string(), z.unknown()).default({}),
});

const firebaseDraftBlocksSchema = z.record(z.string(), firebaseDraftBlockSchema);

const firebaseDraftCompiledSchema = z.object({
  page_builder_schema: z.unknown().nullable().default(null),
  page_builder_schema_for_ai: z.unknown().nullable().default(null),
});

export const firebasePageDraftSchema = z.object({
  pageSlug: z.string().min(1),
  pageKind: z.string().min(1),
  wordpressPostId: z.number().int().positive().nullable().optional(),
  CompanyName: z.string().nullable().default(null),
  websiteUrl: z.string().nullable().default(null),
  title: z.string().min(1),
  templateKey: z.string().min(1).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  sourcePath: z.string().min(1).optional(),
  sourceUrl: z.string().min(1).optional(),
  seo: z.record(z.string(), z.unknown()).optional(),
  currentSessionId: z.string().min(1).optional(),
  blocksOrder: z.array(z.string().min(1)),
  blocks: firebaseDraftBlocksSchema,
  compiled: firebaseDraftCompiledSchema.default({
    page_builder_schema: null,
    page_builder_schema_for_ai: null,
  }),
  workflow: sourceMappingWorkflowSchema.optional(),
  createdAt: z.string().min(1).optional(),
  updatedAt: z.string().min(1).optional(),
  ...lifecycleFlagsSchema.shape,
}).superRefine((draft, ctx) => {
  const seenIds = new Set<string>();

  for (const blockId of draft.blocksOrder) {
    if (seenIds.has(blockId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `blocksOrder contains a duplicate block id: ${blockId}`,
        path: ["blocksOrder"],
      });
      continue;
    }

    seenIds.add(blockId);

    if (!draft.blocks[blockId]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `blocksOrder references a missing block id: ${blockId}`,
        path: ["blocksOrder"],
      });
    }
  }

  for (const [recordKey, block] of Object.entries(draft.blocks)) {
    if (block.id !== recordKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Block id ${block.id} must match its record key ${recordKey}.`,
        path: ["blocks", recordKey, "id"],
      });
    }

    if (!seenIds.has(recordKey)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Block ${recordKey} is missing from blocksOrder.`,
        path: ["blocksOrder"],
      });
    }
  }
});

export type PageCompositionResumeStage = z.infer<typeof pageCompositionResumeStageSchema>;
export type PageCompositionRetryBudget = z.infer<typeof pageCompositionRetryBudgetSchema>;
export type PendingBlockRefinementRequest = z.infer<typeof pendingBlockRefinementRequestSchema>;
export type FirebaseDraftWorkflow = z.infer<typeof sourceMappingWorkflowSchema>;
export type SourceMappingWorkflow = FirebaseDraftWorkflow;
export type FirebaseDraftBlock = z.infer<typeof firebaseDraftBlockSchema>;
export type FirebasePageDraft = z.infer<typeof firebasePageDraftSchema>;

const createDefaultRetryBudget = (): PageCompositionRetryBudget => {
  return {
    maxAttempts: 0,
    remainingAttempts: 0,
  };
};

export const createDefaultPageCompositionWorkflowState = (): Pick<
  FirebaseDraftWorkflow,
  "checkpointId" | "resumeStage" | "retryBudget" | "pendingBlockRefinementRequest"
> => {
  return {
    checkpointId: null,
    resumeStage: "idle",
    retryBudget: createDefaultRetryBudget(),
    pendingBlockRefinementRequest: null,
  };
};

const cloneValue = <T,>(value: T): T => {
  return structuredClone(value);
};

const hasPlaceholderToken = (value: unknown): boolean => {
  if (typeof value === "string") {
    return TODO_SOURCE_PATTERN.test(value.trim());
  }

  if (Array.isArray(value)) {
    return value.some((entry) => hasPlaceholderToken(entry));
  }

  if (value && typeof value === "object") {
    return Object.values(value).some((entry) => hasPlaceholderToken(entry));
  }

  return false;
};

export const hasSourcePlaceholder = (source: unknown): boolean => {
  if (source == null) {
    return false;
  }

  return hasPlaceholderToken(source);
};

const isStructuredSource = (
  source: unknown,
): source is {
  sourceType?: unknown;
  sourceValue?: unknown;
  options?: unknown;
} => {
  return Boolean(source) && typeof source === "object" && !Array.isArray(source);
};

const validateSectionVariant = (blockKey: string, variant: string | null): string | null => {
  void blockKey;

  if (variant == null) {
    return null;
  }

  return variant;
};

const validateDraftSource = (block: FirebaseDraftBlock): unknown | null => {
  if (block.source == null) {
    return null;
  }

  if (hasSourcePlaceholder(block.source)) {
    if (!isStructuredSource(block.source) || typeof block.source.sourceType !== "string") {
      throw new Error(`Source placeholder for block ${block.id} must preserve sourceType.`);
    }

    return cloneValue(block.source);
  }

  return cloneValue(block.source);
};

const buildSourceMappingNote = (block: FirebaseDraftBlock): string => {
  if (isStructuredSource(block.source) && block.source.sourceType === "woo_category") {
    return "Select a WooCommerce category slug or id for this block before compile.";
  }

  if (isStructuredSource(block.source) && block.source.sourceType === "woo_products") {
    return "Select the WooCommerce product ids for this block before compile.";
  }

  return "Resolve this block source mapping before compile.";
};

const normalizeRetryBudget = (
  retryBudget: Partial<PageCompositionRetryBudget> | null | undefined,
): PageCompositionRetryBudget => {
  if (!retryBudget) {
    return createDefaultRetryBudget();
  }

  const maxAttempts =
    typeof retryBudget.maxAttempts === "number" && Number.isInteger(retryBudget.maxAttempts)
      ? Math.max(0, retryBudget.maxAttempts)
      : 0;
  const requestedRemainingAttempts =
    typeof retryBudget.remainingAttempts === "number" && Number.isInteger(retryBudget.remainingAttempts)
      ? Math.max(0, retryBudget.remainingAttempts)
      : 0;

  return {
    maxAttempts,
    remainingAttempts: Math.min(requestedRemainingAttempts, maxAttempts),
  };
};

const normalizePageCompositionWorkflowState = (
  workflow: Partial<FirebaseDraftWorkflow> | null | undefined,
): Pick<
  FirebaseDraftWorkflow,
  "checkpointId" | "resumeStage" | "retryBudget" | "pendingBlockRefinementRequest"
> => {
  const defaults = createDefaultPageCompositionWorkflowState();

  if (!workflow) {
    return defaults;
  }

  return {
    checkpointId: workflow.checkpointId ?? defaults.checkpointId,
    resumeStage: workflow.resumeStage ?? defaults.resumeStage,
    retryBudget: normalizeRetryBudget(workflow.retryBudget),
    pendingBlockRefinementRequest:
      workflow.pendingBlockRefinementRequest ?? defaults.pendingBlockRefinementRequest,
  };
};

export const computeSourceMappingWorkflow = (
  blocks: Record<string, FirebaseDraftBlock>,
  lifecycleFlags: Pick<FirebasePageDraft, "needsCompile" | "needsPublish" | "needsDeploy">,
  existingWorkflow?: Partial<FirebaseDraftWorkflow> | null,
): SourceMappingWorkflow => {
  const unresolvedBlocks = Object.values(blocks).filter((block) => hasSourcePlaceholder(block.source));
  const unresolvedSourceBlockIds = unresolvedBlocks.map((block) => block.id);
  const sourceMappingNotes = Object.fromEntries(
    unresolvedBlocks.map((block) => [block.id, buildSourceMappingNote(block)]),
  );
  const pageCompositionWorkflowState = normalizePageCompositionWorkflowState(existingWorkflow);

  return {
    requiresSourceMapping: unresolvedSourceBlockIds.length > 0,
    unresolvedSourceBlockIds,
    sourceMappingNotes,
    needsCompile: lifecycleFlags.needsCompile,
    needsPublish: lifecycleFlags.needsPublish,
    needsDeploy: lifecycleFlags.needsDeploy,
    ...pageCompositionWorkflowState,
  };
};

export const parseFirebasePageDraft = (value: unknown): FirebasePageDraft => {
  const parsed = firebasePageDraftSchema.parse(value);
  const validatedBlocks = Object.fromEntries(
    Object.entries(parsed.blocks).map(([blockId, block]) => {
      return [
        blockId,
        {
          ...block,
          variant: validateSectionVariant(block.blockKey, block.variant),
          data: cloneValue(block.data),
          source: validateDraftSource(block),
          meta: block.meta ?? {},
        },
      ];
    }),
  ) as Record<string, FirebaseDraftBlock>;

  const workflow = computeSourceMappingWorkflow(validatedBlocks, {
    needsCompile: parsed.needsCompile,
    needsPublish: parsed.needsPublish,
    needsDeploy: parsed.needsDeploy,
  }, parsed.workflow);

  return {
    ...parsed,
    blocks: validatedBlocks,
    workflow,
  };
};