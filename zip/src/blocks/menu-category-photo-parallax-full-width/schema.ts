import { createElement } from "react";
import { z } from "zod";

import {
  BreakfastSection,
  type BreakfastSectionProps,
} from "../../components/sections/BreakfastSection";
import {
  imageAssetSchema,
  menuColumnSchema,
  wooCategorySourceSchema,
  wooProductsSourceSchema,
} from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const menuCategoryPhotoParallaxFullWidthSourceSchema = z.union([
  wooCategorySourceSchema,
  wooProductsSourceSchema,
]);

export const menuCategoryPhotoParallaxFullWidthDataSchema = z.object({
  heroTitle: z.string().min(1, "Hero title is required."),
  backgroundImage: imageAssetSchema,
  overlayOpacity: z.number().min(0).max(0.8).default(0.2),
  layout: z.object({
    columns: z.number().int().positive().default(2),
    heroHeight: z.string().min(1).default("400px"),
  }).default({
    columns: 2,
    heroHeight: "400px",
  }),
  menuColumns: z.array(menuColumnSchema).default([]),
  menuAnchorId: z.string().min(1).optional(),
  emptyStateText: z.string().default("Brak pozycji w tej kategorii."),
});

export type MenuCategoryPhotoParallaxFullWidthData = z.infer<
  typeof menuCategoryPhotoParallaxFullWidthDataSchema
>;

export type MenuCategoryPhotoParallaxFullWidthSource = z.infer<
  typeof menuCategoryPhotoParallaxFullWidthSourceSchema
>;

export const menuCategoryPhotoParallaxFullWidthDefaultData: MenuCategoryPhotoParallaxFullWidthData =
  menuCategoryPhotoParallaxFullWidthDataSchema.parse({
    heroTitle: "Breakfast",
    backgroundImage: {
      src: "https://picsum.photos/seed/breakfast/1920/1080",
      alt: "Breakfast menu hero image",
    },
    overlayOpacity: 0.2,
    layout: {
      columns: 2,
      heroHeight: "400px",
    },
    menuColumns: [],
    emptyStateText: "Brak pozycji w tej kategorii.",
  });

export const menuCategoryPhotoParallaxFullWidthExampleData: readonly MenuCategoryPhotoParallaxFullWidthData[] = [
  menuCategoryPhotoParallaxFullWidthDataSchema.parse({
    heroTitle: "Breakfast",
    backgroundImage: {
      src: "https://example.com/uploads/breakfast.jpg",
      alt: "Sniadanie podane na stole",
    },
    menuColumns: [
      {
        items: [
          {
            title: "Cornish Earlies Potatoes",
            description: "Potato, toast & bacon",
            priceLabel: "$11",
          },
        ],
      },
      {
        items: [
          {
            title: "Rib-Eye On The Bone",
            description: "Scottish dry aged",
            priceLabel: "$18",
          },
        ],
      },
    ],
  }),
];

export const menuCategoryPhotoParallaxFullWidthBlockDefinition: PageBuilderBlockDefinition<
  typeof menuCategoryPhotoParallaxFullWidthDataSchema,
  typeof menuCategoryPhotoParallaxFullWidthSourceSchema
> = {
  blockKey: "menu-category-photo-parallax-full-width",
  version: 1,
  name: "Menu Category Photo Parallax Full Width",
  description: "Full-width menu category block with parallax hero image and two-column menu layout.",
  schema: menuCategoryPhotoParallaxFullWidthDataSchema,
  defaultData: menuCategoryPhotoParallaxFullWidthDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "BreakfastSection",
    componentImportPath: "src/components/sections/BreakfastSection.tsx",
    notes: "Supports static filler content by default and Woo-driven runtime data resolution for menu products.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as MenuCategoryPhotoParallaxFullWidthData;
      const breakfastProps: BreakfastSectionProps = {
        heroTitle: data.heroTitle,
        backgroundImageSrc: data.backgroundImage.src,
        backgroundImageAlt: data.backgroundImage.alt,
        overlayOpacity: data.overlayOpacity,
        heroHeight: data.layout.heroHeight,
        menuColumns: data.menuColumns,
        emptyStateText: data.emptyStateText,
      };

      return createElement(BreakfastSection, {
        key: section.id,
        ...breakfastProps,
      });
    },
  },
  sourceSchema: menuCategoryPhotoParallaxFullWidthSourceSchema,
  sourceResolver: {
    kind: "woo-resolver",
    supportedSourceTypes: ["woo_category", "woo_products"],
    notes: "For woo_category, the resolver should derive the heading from the Woo category name, keep the parallax image separate, and render products from that category.",
  },
  exampleData: menuCategoryPhotoParallaxFullWidthExampleData,
  tags: ["menu", "category", "parallax", "woo"],
};
