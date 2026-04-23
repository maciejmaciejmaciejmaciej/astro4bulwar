import { z } from 'zod';

export const SHARED_FOOTER_BLOCK_KEY = 'shared_footer' as const;
export const SHARED_FOOTER_BLOCK_VERSION = 1 as const;

export const globalLayoutLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
}).strict();

export type GlobalLayoutLink = z.infer<typeof globalLayoutLinkSchema>;

export const globalLayoutBrandSchema = z.object({
  name: z.string().trim().min(1),
  href: z.string().min(1).default('/'),
  logoSrc: z.string().min(1).nullable().default(null),
  logoAlt: z.string().min(1).nullable().default(null),
}).strict();

export interface GlobalLayoutNavigationItem {
  label: string;
  href: string;
  description: string | null;
  children: GlobalLayoutNavigationItem[];
}

export const globalLayoutNavigationItemSchema: z.ZodType<GlobalLayoutNavigationItem> = z.lazy(() => z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  description: z.string().min(1).nullable().default(null),
  children: z.array(globalLayoutNavigationItemSchema).default([]),
}).strict());

export const globalLayoutNavbarSchema = z.object({
  brand: globalLayoutBrandSchema,
  primaryItems: z.array(globalLayoutNavigationItemSchema).default([]),
  companyLinks: z.array(globalLayoutLinkSchema).default([]),
  legalLinks: z.array(globalLayoutLinkSchema).default([]),
}).strict();

export const globalLayoutTextGroupSchema = z.object({
  heading: z.string().min(1),
  lines: z.array(z.string().min(1)).default([]),
}).strict();

export const globalLayoutContactGroupSchema = z.object({
  heading: z.string().min(1),
  items: z.array(globalLayoutLinkSchema).default([]),
}).strict();

export const globalLayoutFooterSchema = z.object({
  brand: globalLayoutBrandSchema,
  address: globalLayoutTextGroupSchema,
  contact: globalLayoutContactGroupSchema,
  hours: globalLayoutTextGroupSchema,
  socialLinks: z.array(globalLayoutLinkSchema).default([]),
  legalLinks: z.array(globalLayoutLinkSchema).default([]),
  copyright: z.string().min(1),
}).strict();

export const globalLayoutDataSchema = z.object({
  navbar: globalLayoutNavbarSchema,
  footer: globalLayoutFooterSchema,
}).strict();

export const globalLayoutResponseMetaSchema = z.object({
  layout_option_status: z.string().min(1),
  footer_status: z.string().min(1),
}).passthrough();

export const globalLayoutApiResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    globalLayout: globalLayoutDataSchema,
  }).strict(),
  meta: globalLayoutResponseMetaSchema,
}).strict();

const globalLayoutStorageSettingsSchema = z.object({
  navbar: globalLayoutNavbarSchema,
  footerPageId: z.number().int().positive(),
}).strict();

export const sharedFooterSectionDataSchema = globalLayoutFooterSchema;

export const sharedFooterSectionBlockSchema = z.object({
  id: z.string().min(1),
  blockKey: z.literal(SHARED_FOOTER_BLOCK_KEY),
  blockVersion: z.literal(SHARED_FOOTER_BLOCK_VERSION),
  variant: z.string().nullable().default(null),
  enabled: z.boolean(),
  data: sharedFooterSectionDataSchema,
  source: z.null().default(null),
  meta: z.record(z.string(), z.unknown()).default({}),
}).strict();

export type GlobalLayoutBrand = z.infer<typeof globalLayoutBrandSchema>;
export type GlobalLayoutNavbar = z.infer<typeof globalLayoutNavbarSchema>;
export type GlobalLayoutFooter = z.infer<typeof globalLayoutFooterSchema>;
export type GlobalLayoutData = z.infer<typeof globalLayoutDataSchema>;
export type GlobalLayoutResponseMeta = z.infer<typeof globalLayoutResponseMetaSchema>;
export type GlobalLayoutApiResponse = z.infer<typeof globalLayoutApiResponseSchema>;
type GlobalLayoutStorageSettings = z.infer<typeof globalLayoutStorageSettingsSchema>;
export type SharedFooterSectionData = z.infer<typeof sharedFooterSectionDataSchema>;
export type SharedFooterSectionBlock = z.infer<typeof sharedFooterSectionBlockSchema>;

export const parseGlobalLayoutData = (value: unknown): GlobalLayoutData =>
  globalLayoutDataSchema.parse(value);

export const parseGlobalLayoutApiResponse = (value: unknown): GlobalLayoutApiResponse =>
  globalLayoutApiResponseSchema.parse(value);

const parseGlobalLayoutStorageSettings = (value: unknown): GlobalLayoutStorageSettings =>
  globalLayoutStorageSettingsSchema.parse(value);

export const parseSharedFooterSectionBlock = (value: unknown): SharedFooterSectionBlock =>
  sharedFooterSectionBlockSchema.parse(value);