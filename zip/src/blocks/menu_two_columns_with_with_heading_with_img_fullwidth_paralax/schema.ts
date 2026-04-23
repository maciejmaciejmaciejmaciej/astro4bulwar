import { createElement } from "react";
import { z } from "zod";

import {
  MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection,
} from "../../components/sections/MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection";
import {
  PAGE_BUILDER_MENU_SECTION_VARIANTS,
  type PageBuilderMenuSectionVariant,
} from "../../components/sections/PageBuilderMenuSection";
import {
  imageAssetSchema,
  menuColumnSchema,
} from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSourceOptionsSchema = z.object({
  limit: z.number().int().positive().optional(),
  sort: z.string().min(1).optional(),
  includeOutOfStock: z.boolean().optional(),
}).default({});

export const menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSourceSchema = z.object({
  sourceType: z.literal("woo_category"),
  sourceValue: z.union([
    z.string().min(1, "Woo category slug is required."),
    z.number().int().positive("Woo category id must be a positive integer."),
  ]),
  options: menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSourceOptionsSchema,
});

export const menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDataSchema = z.object({
  heroTitle: z.string().min(1, "Hero title is required."),
  backgroundImage: imageAssetSchema,
  overlayOpacity: z.number().min(0).max(0.8).default(0.2),
  layout: z.object({
    heroHeight: z.string().min(1).default("400px"),
  }).default({
    heroHeight: "400px",
  }),
  menuColumns: z.array(menuColumnSchema).default([]),
  emptyStateText: z.string().default("Brak pozycji w tej kategorii."),
});

export type MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxData = z.infer<
  typeof menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDataSchema
>;

export type MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSource = z.infer<
  typeof menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSourceSchema
>;

export const menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData: MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxData =
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDataSchema.parse({
    heroTitle: "Kolacje",
    backgroundImage: {
      src: "https://example.com/uploads/kolacje-hero.jpg",
      alt: "Kolacje w Bulwarze",
    },
    overlayOpacity: 0.2,
    layout: {
      heroHeight: "400px",
    },
    menuColumns: [
      {
        items: [
          {
            title: "Stek z kalafiora",
            description: "Maslo z tymiankiem",
            priceLabel: "42 zl",
          },
        ],
      },
      {
        items: [
          {
            title: "Pstrag wedzony",
            description: "Ogorek, kremowy sos",
            priceLabel: "44 zl",
          },
        ],
      },
    ],
    emptyStateText: "Brak pozycji w tej kategorii.",
  });

export const menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxExampleData: readonly MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxData[] = [
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData,
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDataSchema.parse({
    heroTitle: "Desery",
    backgroundImage: {
      src: "https://example.com/uploads/desery-hero.jpg",
      alt: "Desery w Bulwarze",
    },
    overlayOpacity: 0.3,
    layout: {
      heroHeight: "420px",
    },
    menuColumns: [
      {
        items: [
          {
            title: "Sernik baskijski",
            description: "Wisnia, wanilia",
            priceLabel: "28 zl",
          },
        ],
      },
      {
        items: [
          {
            title: "Tarta cytrynowa",
            description: "Beza palona, mieta",
            priceLabel: "24 zl",
          },
        ],
      },
    ],
    emptyStateText: "Brak pozycji w tej kategorii.",
  }),
];

export const menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockDefinition: PageBuilderBlockDefinition<
  typeof menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDataSchema,
  typeof menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSourceSchema
> = {
  blockKey: "menu_two_columns_with_with_heading_with_img_fullwidth_paralax",
  version: 1,
  name: "Menu Two Columns With Heading With Image Fullwidth Paralax",
  description:
    "Full-width parallax hero with the Woo category name over the image and an attached shared two-column menu panel below.",
  schema: menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDataSchema,
  defaultData: menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection",
    componentImportPath:
      "src/components/sections/MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection.tsx",
    notes:
      "Keeps the full-width parallax hero from the category photo block and docks the shared standalone menu panel directly below it.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxData;

      return createElement(
        MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSection,
        {
          key: section.id,
          content: data,
          variant: section.variant as PageBuilderMenuSectionVariant | null,
        },
      );
    },
  },
  variants: PAGE_BUILDER_MENU_SECTION_VARIANTS,
  sourceSchema: menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSourceSchema,
  sourceResolver: {
    kind: "woo-resolver",
    supportedSourceTypes: ["woo_category"],
    notes:
      "Hero title resolves from the Woo category name, the background image remains explicit block data, and the attached lower menu panel resolves products from the same category in two columns.",
  },
  exampleData: menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxExampleData,
  tags: ["menu", "category", "parallax", "attached-panel", "woo"],
};