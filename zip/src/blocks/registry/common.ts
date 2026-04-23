import { z } from "zod";

export const imageAssetSchema = z.object({
  src: z.string().min(1, "Image src is required."),
  alt: z.string().min(1, "Image alt is required."),
});

export const ctaLinkSchema = z.object({
  label: z.string().min(1, "CTA label is required."),
  href: z.string().min(1, "CTA href is required."),
});

export const menuItemSchema = z.object({
  title: z.string().min(1, "Menu item title is required."),
  description: z.string().optional(),
  priceLabel: z.string().min(1, "Menu item price label is required."),
  tagSlugs: z.array(z.string().min(1)).default([]),
});

export const menuColumnSchema = z.object({
  items: z.array(menuItemSchema).default([]),
});

const sourceOptionsSchema = z.object({
  limit: z.number().int().positive().optional(),
  sort: z.string().min(1).optional(),
  includeOutOfStock: z.boolean().optional(),
  splitIntoColumns: z.number().int().positive().optional(),
  preserveOrder: z.boolean().optional(),
}).default({});

export const wooCategorySourceSchema = z.object({
  sourceType: z.literal("woo_category"),
  sourceValue: z.union([
    z.string().min(1, "Woo category slug is required."),
    z.number().int().positive("Woo category id must be a positive integer."),
  ]),
  options: sourceOptionsSchema,
});

export const wooProductsSourceSchema = z.object({
  sourceType: z.literal("woo_products"),
  sourceValue: z.array(z.number().int().positive()).min(1, "At least one Woo product id is required."),
  options: sourceOptionsSchema,
});

export const wooTagSourceSchema = z.object({
  sourceType: z.literal("woo_tag"),
  sourceValue: z.string().min(1, "Woo tag slug is required."),
  options: sourceOptionsSchema,
});

export const sharedWooSourceSchema = z.union([
  wooCategorySourceSchema,
  wooProductsSourceSchema,
  wooTagSourceSchema,
]);

export type ImageAsset = z.infer<typeof imageAssetSchema>;
export type CtaLink = z.infer<typeof ctaLinkSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuColumn = z.infer<typeof menuColumnSchema>;
export type SharedWooSource = z.infer<typeof sharedWooSourceSchema>;
