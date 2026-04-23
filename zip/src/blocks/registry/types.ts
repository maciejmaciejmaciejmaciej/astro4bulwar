import type { ReactNode } from "react";
import type { z, ZodTypeAny } from "zod";

export const blockReadinessLifecycleStatuses = ["draft", "refining", "ready", "blocked"] as const;

export type BlockReadinessLifecycleStatus = (typeof blockReadinessLifecycleStatuses)[number];

export const blockReadinessRequiredCapabilities = [
  "reactRuntime",
  "astroRenderer",
  "aiDescriptor",
  "docs",
  "tests",
] as const;

export type BlockReadinessCapabilityKey = (typeof blockReadinessRequiredCapabilities)[number];

export const blockRefinementWorkflowRequestFields = [
  "blockKey",
  "sourceComponent",
  "designReference",
  "targetStatus",
] as const;

export const blockRefinementWorkflowRequiredArtifacts = [
  "businessBlock",
  "designReference",
  "reactRuntime",
  "astroRenderer",
  "aiDescriptor",
  "docs",
  "tests",
] as const;

export const blockRefinementWorkflowSupportedTargetStatuses = ["ready"] as const;

export const blockRefinementWorkflowReadinessOutcomes = [
  "ready",
  "blocked",
  "refining",
] as const;

export type BlockRefinementWorkflowArtifactKey =
  (typeof blockRefinementWorkflowRequiredArtifacts)[number];

export type BlockRefinementWorkflowSupportedTargetStatus =
  (typeof blockRefinementWorkflowSupportedTargetStatuses)[number];

export type BlockRefinementWorkflowReadinessOutcome =
  (typeof blockRefinementWorkflowReadinessOutcomes)[number];

export interface BlockCapabilityDescriptor {
  available: boolean;
  path?: string;
  notes?: string;
}

export interface BlockRefinementArtifactDescriptor extends BlockCapabilityDescriptor {
  label: string;
}

export interface BlockRefinementArtifactSummary {
  requiredArtifacts: readonly BlockRefinementWorkflowArtifactKey[];
  availableArtifacts: BlockRefinementWorkflowArtifactKey[];
  missingArtifacts: BlockRefinementWorkflowArtifactKey[];
  artifacts: Record<BlockRefinementWorkflowArtifactKey, BlockRefinementArtifactDescriptor>;
}

export interface BlockRefinementWorkflowSummary {
  sourceComponent: string;
  designReference: string;
  targetStatus: BlockRefinementWorkflowSupportedTargetStatus;
  readinessOutcome: BlockRefinementWorkflowReadinessOutcome;
  blockers: string[];
  artifactSummary: BlockRefinementArtifactSummary;
}

export interface BlockRefinementWorkflowRequest {
  blockKey: string;
  sourceComponent: string;
  designReference: string;
  targetStatus: string;
}

export interface BlockReadinessGateSnapshot {
  lifecycle: BlockReadinessLifecycleStatus;
  capabilities: BlockCapabilityMatrix;
}

export interface BlockRefinementWorkflowResult extends BlockRefinementWorkflowRequest {
  readinessOutcome: BlockRefinementWorkflowReadinessOutcome;
  blockers: string[];
  sharedReadiness: BlockReadinessGateSnapshot;
  artifactSummary: BlockRefinementArtifactSummary;
}

export interface BlockCapabilityMatrix {
  reactRuntime: BlockCapabilityDescriptor;
  astroRenderer: BlockCapabilityDescriptor;
  aiDescriptor: BlockCapabilityDescriptor;
  docs: BlockCapabilityDescriptor;
  tests: BlockCapabilityDescriptor;
}

export interface BlockReadinessDescriptor {
  lifecycle: BlockReadinessLifecycleStatus;
  capabilities: BlockCapabilityMatrix;
}

export interface BlockRenderDescriptor {
  kind: "existing-react-component" | "future-astro-renderer";
  componentName: string;
  componentImportPath: string;
  notes?: string;
}

export interface BlockSourceResolverDescriptor {
  kind: "woo-resolver" | "custom";
  supportedSourceTypes: readonly string[];
  notes?: string;
}

export interface BlockRuntimeDescriptor {
  renderSection: (section: PageBuilderSectionInstance) => ReactNode;
}

export interface PageBuilderBlockDefinition<
  TDataSchema extends ZodTypeAny = ZodTypeAny,
  TSourceSchema extends ZodTypeAny | undefined = ZodTypeAny | undefined,
> {
  blockKey: string;
  version: number;
  name: string;
  description: string;
  schema: TDataSchema;
  defaultData: z.output<TDataSchema>;
  render: BlockRenderDescriptor;
  runtime?: BlockRuntimeDescriptor;
  variants?: readonly string[];
  sourceSchema?: TSourceSchema;
  sourceResolver?: BlockSourceResolverDescriptor;
  exampleData?: readonly z.output<TDataSchema>[];
  tags?: readonly string[];
  deprecated?: boolean;
}

export interface PageBuilderSectionInstance {
  id: string;
  blockKey: string;
  blockVersion: number;
  variant: string | null;
  enabled: boolean;
  data: unknown;
  source: unknown | null;
  meta: Record<string, unknown>;
}

export type PageBuilderBlockRegistry = Record<string, PageBuilderBlockDefinition>;

export type RegisteredPageBuilderBlockDefinition<
  TDataSchema extends ZodTypeAny = ZodTypeAny,
  TSourceSchema extends ZodTypeAny | undefined = ZodTypeAny | undefined,
> = PageBuilderBlockDefinition<TDataSchema, TSourceSchema> & {
  readiness: BlockReadinessDescriptor;
  refinementWorkflow: BlockRefinementWorkflowSummary;
};

export type RegisteredPageBuilderBlockRegistry = Record<string, RegisteredPageBuilderBlockDefinition>;
