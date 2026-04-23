import {
  parseFirebasePageDraft,
  type FirebaseDraftWorkflow,
  type FirebasePageDraft,
} from "../../zip/src/blocks/registry/firebasePageDraft.ts";
import type { FirebasePageDraftStore } from "../../zip/src/blocks/registry/firebasePageDraftStore.ts";
import {
  blockReadinessRequiredCapabilities,
  type BlockReadinessDescriptor,
  type BlockRefinementWorkflowRequest,
  type BlockRefinementWorkflowResult,
} from "../../zip/src/blocks/registry/types.ts";
import {
  getBlock as getSharedBlock,
  getBlockReadiness as getSharedBlockReadiness,
  runBlockRefinementWorkflow as runSharedBlockRefinementWorkflow,
} from "../../zip/src/blocks/registry/index.ts";
import type {
  EnsuredWordPressPage,
  PageBuilderPayloads,
  WordPressSiteContext,
} from "./wordpressPageBuilderClient.ts";

export type ApprovedSourceMappings = Record<string, unknown>;

export type PageBuilderRuntimeWordPressClient = {
  fetchSiteContext(): Promise<WordPressSiteContext>;
  ensurePageExists(input: {
    slug: string;
    title: string;
    status: "draft" | "published" | "archived";
  }): Promise<EnsuredWordPressPage>;
  publishPageBuilderPayloads(input: {
    slug: string;
    schema: unknown;
    aiSchema: unknown;
  }): Promise<PageBuilderPayloads>;
  readPageBuilderPayloads(slug: string): Promise<PageBuilderPayloads>;
};

type CompilePageDraftResult = {
  firebaseDraft: FirebasePageDraft;
  compiled: {
    page_builder_schema: unknown;
    page_builder_schema_for_ai: unknown;
  };
  meta: {
    appliedSourceBlockIds: string[];
    ignoredSourceBlockIds: string[];
    usedCurrentPageBuilderSchema: boolean;
    usedCurrentPageBuilderSchemaForAi: boolean;
  };
};

export type PageBuilderRuntimeWorkflowResult = {
  draft: FirebasePageDraft;
  ensuredPage: EnsuredWordPressPage | null;
  compiled: FirebasePageDraft["compiled"];
  compileMeta: CompilePageDraftResult["meta"];
  published: PageBuilderPayloads | null;
  readback: (PageBuilderPayloads & { verified: true }) | null;
  dryRun: boolean;
};

type PageCompositionIssueReason = "missing" | "not_ready";

export type PageCompositionRefinementRequestOverrides = Record<
  string,
  Partial<Pick<BlockRefinementWorkflowRequest, "sourceComponent" | "designReference" | "targetStatus">>
>;

export type PageCompositionSubflowAttempt = {
  request: BlockRefinementWorkflowRequest;
  result: BlockRefinementWorkflowResult;
  refreshedReadiness: BlockReadinessDescriptor | null;
};

export type PageCompositionBlockedState = {
  blockId: string;
  blockKey: string;
  reason: PageCompositionIssueReason;
  blockers: string[];
};

export type PageCompositionWorkflowResult = {
  status: "completed" | "blocked";
  draft: FirebasePageDraft;
  runtimeResult: PageBuilderRuntimeWorkflowResult | null;
  blocked: PageCompositionBlockedState | null;
  subflowAttempts: PageCompositionSubflowAttempt[];
};

const cloneValue = <T,>(value: T): T => {
  return structuredClone(value);
};

const normalizeDraft = (draft: FirebasePageDraft): FirebasePageDraft => {
  return parseFirebasePageDraft(cloneValue(draft));
};

const defaultCompositionRetryBudget = {
  maxAttempts: 1,
  remainingAttempts: 1,
} as const;

const mergeWorkflowContract = (
  baseWorkflow: FirebaseDraftWorkflow | undefined,
  nextWorkflow: Partial<FirebaseDraftWorkflow> | undefined,
): FirebaseDraftWorkflow | undefined => {
  if (!baseWorkflow && !nextWorkflow) {
    return undefined;
  }

  return {
    ...(baseWorkflow ?? {}),
    ...(nextWorkflow ?? {}),
    checkpointId: nextWorkflow?.checkpointId ?? baseWorkflow?.checkpointId ?? null,
    resumeStage: nextWorkflow?.resumeStage ?? baseWorkflow?.resumeStage ?? "idle",
    retryBudget: nextWorkflow?.retryBudget ?? baseWorkflow?.retryBudget ?? {
      maxAttempts: 0,
      remainingAttempts: 0,
    },
    pendingBlockRefinementRequest:
      nextWorkflow?.pendingBlockRefinementRequest ??
      baseWorkflow?.pendingBlockRefinementRequest ??
      null,
  } as FirebaseDraftWorkflow;
};

const preserveWorkflowContract = (
  baseDraft: FirebasePageDraft,
  nextDraft: FirebasePageDraft,
): FirebasePageDraft => {
  const workflow = mergeWorkflowContract(baseDraft.workflow, nextDraft.workflow);

  if (!workflow) {
    return nextDraft;
  }

  return {
    ...nextDraft,
    workflow,
  };
};

const isReadinessReady = (readiness: BlockReadinessDescriptor | null): readiness is BlockReadinessDescriptor => {
  if (!readiness || readiness.lifecycle !== "ready") {
    return false;
  }

  return blockReadinessRequiredCapabilities.every(
    (capability) => readiness.capabilities[capability].available,
  );
};

const updateDraftWorkflowState = (
  draft: FirebasePageDraft,
  workflowPatch: Partial<FirebaseDraftWorkflow>,
): FirebasePageDraft => {
  return normalizeDraft({
    ...draft,
    workflow: {
      ...(draft.workflow ?? {}),
      ...workflowPatch,
    },
  });
};

const persistDraftIfPossible = async (
  draft: FirebasePageDraft,
  draftStore?: FirebasePageDraftStore,
): Promise<FirebasePageDraft> => {
  if (!draftStore) {
    return draft;
  }

  const persisted = await draftStore.upsertDraft(draft, {
    docId: draft.pageSlug,
  });

  return persisted.draft;
};

const resolveCompositionRetryBudget = ({
  draft,
  blockId,
  blockKey,
  reason,
}: {
  draft: FirebasePageDraft;
  blockId: string;
  blockKey: string;
  reason: PageCompositionIssueReason;
}): FirebaseDraftWorkflow["retryBudget"] => {
  const existingRetryBudget = draft.workflow?.retryBudget;
  const maxAttempts = existingRetryBudget && existingRetryBudget.maxAttempts > 0
    ? existingRetryBudget.maxAttempts
    : defaultCompositionRetryBudget.maxAttempts;
  const pendingRequest = draft.workflow?.pendingBlockRefinementRequest;
  const isSamePendingRequest = pendingRequest?.blockKey === blockKey
    && pendingRequest.sourceBlockId === blockId
    && pendingRequest.reason === reason;

  return {
    maxAttempts,
    remainingAttempts: isSamePendingRequest
      ? Math.min(existingRetryBudget?.remainingAttempts ?? 0, maxAttempts)
      : maxAttempts,
  };
};

const findFirstCompositionIssue = (
  draft: FirebasePageDraft,
  getBlockReadiness: (blockKey: string) => BlockReadinessDescriptor | null,
): {
  blockId: string;
  blockKey: string;
  reason: PageCompositionIssueReason;
  readiness: BlockReadinessDescriptor | null;
} | null => {
  for (const blockId of draft.blocksOrder) {
    const block = draft.blocks[blockId];

    if (!block) {
      continue;
    }

    const readiness = getBlockReadiness(block.blockKey);

    if (!readiness) {
      return {
        blockId,
        blockKey: block.blockKey,
        reason: "missing",
        readiness: null,
      };
    }

    if (!isReadinessReady(readiness)) {
      return {
        blockId,
        blockKey: block.blockKey,
        reason: "not_ready",
        readiness,
      };
    }
  }

  return null;
};

const buildRefinementWorkflowRequest = ({
  blockKey,
  overrides,
}: {
  blockKey: string;
  overrides: PageCompositionRefinementRequestOverrides;
}): BlockRefinementWorkflowRequest => {
  const override = overrides[blockKey] ?? {};
  const registeredBlock = getSharedBlock(blockKey);
  const refinementSummary = registeredBlock?.refinementWorkflow;

  return {
    blockKey,
    sourceComponent: typeof override.sourceComponent === "string"
      ? override.sourceComponent.trim()
      : refinementSummary?.sourceComponent ?? "",
    designReference: typeof override.designReference === "string"
      ? override.designReference.trim()
      : refinementSummary?.designReference ?? "",
    targetStatus: typeof override.targetStatus === "string"
      ? override.targetStatus.trim()
      : refinementSummary?.targetStatus ?? "ready",
  };
};

const buildBlockedCompositionResult = ({
  draft,
  blockId,
  blockKey,
  reason,
  blockers,
  subflowAttempts,
}: {
  draft: FirebasePageDraft;
  blockId: string;
  blockKey: string;
  reason: PageCompositionIssueReason;
  blockers: string[];
  subflowAttempts: PageCompositionSubflowAttempt[];
}): PageCompositionWorkflowResult => {
  return {
    status: "blocked",
    draft,
    runtimeResult: null,
    blocked: {
      blockId,
      blockKey,
      reason,
      blockers,
    },
    subflowAttempts,
  };
};

const buildFallbackSiteContext = (draft: FirebasePageDraft): WordPressSiteContext => {
  return {
    CompanyName: draft.CompanyName ?? null,
    websiteUrl: draft.websiteUrl ?? null,
  };
};

const loadCompilePageDraft = async (): Promise<
  (input: {
    firebaseDraft: FirebasePageDraft;
    approvedSourceMappings?: ApprovedSourceMappings;
    currentPageBuilderSchema?: unknown;
    currentPageBuilderSchemaForAi?: unknown;
  }) => CompilePageDraftResult
> => {
  const module = await import("../make-page-draft-compile-gate.js") as {
    compilePageDraft?: unknown;
    default?: {
      compilePageDraft?: unknown;
    };
  };
  const compilePageDraft = (
    "compilePageDraft" in module ? module.compilePageDraft : module.default?.compilePageDraft
  ) as
    | ((input: {
        firebaseDraft: FirebasePageDraft;
        approvedSourceMappings?: ApprovedSourceMappings;
        currentPageBuilderSchema?: unknown;
        currentPageBuilderSchemaForAi?: unknown;
      }) => CompilePageDraftResult)
    | undefined;

  if (typeof compilePageDraft !== "function") {
    throw new Error("compilePageDraft is not available from the compile gate module.");
  }

  return compilePageDraft;
};

const areEqual = (left: unknown, right: unknown): boolean => {
  return JSON.stringify(left) === JSON.stringify(right);
};

const assertReadbackMatches = (
  ensuredPageId: number,
  published: PageBuilderPayloads,
  readback: PageBuilderPayloads,
): void => {
  if (published.pageId !== ensuredPageId) {
    throw new Error(
      `Publish result pageId mismatch. Expected ${ensuredPageId}, received ${published.pageId}.`,
    );
  }

  if (readback.pageId !== ensuredPageId) {
    throw new Error(
      `Readback pageId mismatch. Expected ${ensuredPageId}, received ${readback.pageId}.`,
    );
  }

  if (!areEqual(published.schema, readback.schema)) {
    throw new Error("Readback schema does not match the published page_builder_schema payload.");
  }

  if (!areEqual(published.aiSchema, readback.aiSchema)) {
    throw new Error("Readback aiSchema does not match the published page_builder_schema_for_ai payload.");
  }
};

export const runPageBuilderRuntimeWorkflow = async ({
  draft,
  approvedSourceMappings = {},
  draftStore,
  wordpressClient,
  verifyReadback = false,
  dryRun = false,
}: {
  draft: FirebasePageDraft;
  approvedSourceMappings?: ApprovedSourceMappings;
  draftStore?: FirebasePageDraftStore;
  wordpressClient?: PageBuilderRuntimeWordPressClient;
  verifyReadback?: boolean;
  dryRun?: boolean;
}): Promise<PageBuilderRuntimeWorkflowResult> => {
  if (dryRun && verifyReadback) {
    throw new Error("verifyReadback cannot be enabled during dry-run.");
  }

  const compilePageDraft = await loadCompilePageDraft();
  const initialDraft = normalizeDraft(draft);

  if (dryRun) {
    const compileResult = compilePageDraft({
      firebaseDraft: initialDraft,
      approvedSourceMappings,
      currentPageBuilderSchema: initialDraft.compiled.page_builder_schema,
      currentPageBuilderSchemaForAi: initialDraft.compiled.page_builder_schema_for_ai,
    });
    const compiledDraft = normalizeDraft(
      preserveWorkflowContract(initialDraft, compileResult.firebaseDraft),
    );

    return {
      draft: compiledDraft,
      ensuredPage: null,
      compiled: compiledDraft.compiled,
      compileMeta: compileResult.meta,
      published: null,
      readback: null,
      dryRun: true,
    };
  }

  if (!draftStore) {
    throw new Error("draftStore is required when dryRun is disabled.");
  }

  if (!wordpressClient) {
    throw new Error("wordpressClient is required when dryRun is disabled.");
  }

  const initialPersist = await draftStore.upsertDraft(initialDraft, {
    docId: initialDraft.pageSlug,
  });
  const persistedDraft = initialPersist.draft;
  const [siteContext, ensuredPage] = await Promise.all([
    wordpressClient.fetchSiteContext().catch(() => buildFallbackSiteContext(persistedDraft)),
    wordpressClient.ensurePageExists({
      slug: persistedDraft.pageSlug,
      title: persistedDraft.title,
      status: persistedDraft.status,
    }),
  ]);
  const draftWithWordPressPostId = normalizeDraft({
    ...persistedDraft,
    ...siteContext,
    wordpressPostId: ensuredPage.id,
  });

  await draftStore.upsertDraft(draftWithWordPressPostId, {
    docId: draftWithWordPressPostId.pageSlug,
  });

  const compileResult = compilePageDraft({
    firebaseDraft: draftWithWordPressPostId,
    approvedSourceMappings,
    currentPageBuilderSchema: draftWithWordPressPostId.compiled.page_builder_schema,
    currentPageBuilderSchemaForAi: draftWithWordPressPostId.compiled.page_builder_schema_for_ai,
  });
  const compiledDraft = normalizeDraft({
    ...preserveWorkflowContract(draftWithWordPressPostId, compileResult.firebaseDraft),
    wordpressPostId: ensuredPage.id,
  });

  await draftStore.upsertDraft(compiledDraft, {
    docId: compiledDraft.pageSlug,
  });

  const published = await wordpressClient.publishPageBuilderPayloads({
    slug: compiledDraft.pageSlug,
    schema: compiledDraft.compiled.page_builder_schema,
    aiSchema: compiledDraft.compiled.page_builder_schema_for_ai,
  });

  let readback:
    | (PageBuilderPayloads & {
        verified: true;
      })
    | null = null;

  if (verifyReadback) {
    const readbackPayloads = await wordpressClient.readPageBuilderPayloads(compiledDraft.pageSlug);

    assertReadbackMatches(ensuredPage.id, published, readbackPayloads);
    readback = {
      ...readbackPayloads,
      verified: true,
    };
  }

  const finalizedDraft = normalizeDraft({
    ...compiledDraft,
    wordpressPostId: ensuredPage.id,
    needsPublish: false,
  });

  await draftStore.upsertDraft(finalizedDraft, {
    docId: finalizedDraft.pageSlug,
  });

  return {
    draft: finalizedDraft,
    ensuredPage,
    compiled: finalizedDraft.compiled,
    compileMeta: compileResult.meta,
    published,
    readback,
    dryRun: false,
  };
};

export const runPageCompositionWorkflow = async ({
  draft,
  approvedSourceMappings = {},
  draftStore,
  wordpressClient,
  verifyReadback = false,
  dryRun = false,
  autoRefineMissing = true,
  refinementRequestOverrides = {},
  getBlockReadiness = getSharedBlockReadiness,
  runBlockRefinementWorkflow = runSharedBlockRefinementWorkflow,
  refreshRegistry,
  runRuntimeWorkflow = runPageBuilderRuntimeWorkflow,
}: {
  draft: FirebasePageDraft;
  approvedSourceMappings?: ApprovedSourceMappings;
  draftStore?: FirebasePageDraftStore;
  wordpressClient?: PageBuilderRuntimeWordPressClient;
  verifyReadback?: boolean;
  dryRun?: boolean;
  autoRefineMissing?: boolean;
  refinementRequestOverrides?: PageCompositionRefinementRequestOverrides;
  getBlockReadiness?: (blockKey: string) => BlockReadinessDescriptor | null;
  runBlockRefinementWorkflow?: (request: BlockRefinementWorkflowRequest) => BlockRefinementWorkflowResult;
  refreshRegistry?: () => Promise<void> | void;
  runRuntimeWorkflow?: (input: {
    draft: FirebasePageDraft;
    approvedSourceMappings?: ApprovedSourceMappings;
    draftStore?: FirebasePageDraftStore;
    wordpressClient?: PageBuilderRuntimeWordPressClient;
    verifyReadback?: boolean;
    dryRun?: boolean;
  }) => Promise<PageBuilderRuntimeWorkflowResult>;
}): Promise<PageCompositionWorkflowResult> => {
  let workingDraft = normalizeDraft(draft);
  const subflowAttempts: PageCompositionSubflowAttempt[] = [];

  while (true) {
    const issue = findFirstCompositionIssue(workingDraft, getBlockReadiness);

    if (!issue) {
      const runtimeInputDraft = await persistDraftIfPossible(
        updateDraftWorkflowState(workingDraft, {
          checkpointId: null,
          resumeStage: "idle",
          pendingBlockRefinementRequest: null,
        }),
        draftStore,
      );
      const runtimeResult = await runRuntimeWorkflow({
        draft: runtimeInputDraft,
        approvedSourceMappings,
        draftStore,
        wordpressClient,
        verifyReadback,
        dryRun,
      });

      return {
        status: "completed",
        draft: runtimeResult.draft,
        runtimeResult,
        blocked: null,
        subflowAttempts,
      };
    }

    const checkpointId = `composition:${workingDraft.pageSlug}:${issue.blockId}`;
    const pendingBlockRefinementRequest = {
      blockKey: issue.blockKey,
      sourceBlockId: issue.blockId,
      reason: issue.reason,
    } as const;

    if (!autoRefineMissing) {
      const blockedDraft = await persistDraftIfPossible(
        updateDraftWorkflowState(workingDraft, {
          checkpointId,
          resumeStage: "blocked",
          pendingBlockRefinementRequest,
        }),
        draftStore,
      );

      return buildBlockedCompositionResult({
        draft: blockedDraft,
        blockId: issue.blockId,
        blockKey: issue.blockKey,
        reason: issue.reason,
        blockers: [
          `Page composition requires Workflow 1 for block ${issue.blockKey}, but autoRefineMissing is disabled.`,
        ],
        subflowAttempts,
      });
    }

    const retryBudget = resolveCompositionRetryBudget({
      draft: workingDraft,
      blockId: issue.blockId,
      blockKey: issue.blockKey,
      reason: issue.reason,
    });

    if (retryBudget.remainingAttempts <= 0) {
      const blockedDraft = await persistDraftIfPossible(
        updateDraftWorkflowState(workingDraft, {
          checkpointId,
          resumeStage: "blocked",
          retryBudget,
          pendingBlockRefinementRequest,
        }),
        draftStore,
      );

      return buildBlockedCompositionResult({
        draft: blockedDraft,
        blockId: issue.blockId,
        blockKey: issue.blockKey,
        reason: issue.reason,
        blockers: [`Retry budget exhausted for block ${issue.blockKey}.`],
        subflowAttempts,
      });
    }

    const nextRetryBudget = {
      maxAttempts: retryBudget.maxAttempts,
      remainingAttempts: retryBudget.remainingAttempts - 1,
    };

    workingDraft = await persistDraftIfPossible(
      updateDraftWorkflowState(workingDraft, {
        checkpointId,
        resumeStage: "awaiting_block_refinement",
        retryBudget: nextRetryBudget,
        pendingBlockRefinementRequest,
      }),
      draftStore,
    );

    const refinementRequest = buildRefinementWorkflowRequest({
      blockKey: issue.blockKey,
      overrides: refinementRequestOverrides,
    });
    const refinementResult = runBlockRefinementWorkflow(refinementRequest);

    if (refreshRegistry) {
      await refreshRegistry();
    }

    const refreshedReadiness = getBlockReadiness(issue.blockKey);

    subflowAttempts.push({
      request: refinementRequest,
      result: refinementResult,
      refreshedReadiness,
    });

    if (refinementResult.readinessOutcome !== "ready" || !isReadinessReady(refreshedReadiness)) {
      const blockers = [...refinementResult.blockers];

      if (refinementResult.readinessOutcome === "ready" && !isReadinessReady(refreshedReadiness)) {
        blockers.push("Shared registry did not refresh to a ready state after Workflow 1 completed.");
      }

      const blockedDraft = await persistDraftIfPossible(
        updateDraftWorkflowState(workingDraft, {
          checkpointId,
          resumeStage: nextRetryBudget.remainingAttempts > 0 ? "refinement_failed" : "blocked",
          retryBudget: nextRetryBudget,
          pendingBlockRefinementRequest,
        }),
        draftStore,
      );

      return buildBlockedCompositionResult({
        draft: blockedDraft,
        blockId: issue.blockId,
        blockKey: issue.blockKey,
        reason: issue.reason,
        blockers,
        subflowAttempts,
      });
    }

    workingDraft = await persistDraftIfPossible(
      updateDraftWorkflowState(workingDraft, {
        checkpointId,
        resumeStage: "resume_page_composition",
        retryBudget: nextRetryBudget,
        pendingBlockRefinementRequest: null,
      }),
      draftStore,
    );
  }
};