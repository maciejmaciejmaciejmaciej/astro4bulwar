import { createElement } from "react";
import { z } from "zod";

import {
  PAGE_BUILDER_MENU_SECTION_VARIANTS,
  PageBuilderMenuSection,
  type PageBuilderMenuSectionVariant,
} from "../../components/sections/PageBuilderMenuSection";

import {
  menuColumnSchema,
  wooCategorySourceSchema,
} from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const menuTwoColumnsWithWithHeadingNoImgSourceSchema = wooCategorySourceSchema;

export const menuTwoColumnsWithWithHeadingNoImgDataSchema = z.object({
  title: z.string().min(1, "Section title is required."),
  menuColumns: z.array(menuColumnSchema).default([]),
  emptyStateText: z.string().default("Brak pozycji w tej kategorii."),
});

export type MenuTwoColumnsWithWithHeadingNoImgData = z.infer<
  typeof menuTwoColumnsWithWithHeadingNoImgDataSchema
>;

export type MenuTwoColumnsWithWithHeadingNoImgSource = z.infer<
  typeof menuTwoColumnsWithWithHeadingNoImgSourceSchema
>;

export const menuTwoColumnsWithWithHeadingNoImgDefaultData: MenuTwoColumnsWithWithHeadingNoImgData =
  menuTwoColumnsWithWithHeadingNoImgDataSchema.parse({
    title: "The Menu",
    menuColumns: [
      {
        items: [
          {
            title: "Spring asparagus",
            description: "Brown butter, hazelnut",
            priceLabel: "42 zl",
          },
          {
            title: "Charred cabbage",
            description: "Apple glaze, dill oil",
            priceLabel: "36 zl",
          },
        ],
      },
      {
        items: [
          {
            title: "Burnt cheesecake",
            description: "Cherry, vanilla",
            priceLabel: "28 zl",
          },
          {
            title: "Smoked trout",
            description: "Cucumber, cultured cream",
            priceLabel: "44 zl",
          },
        ],
      },
    ],
    emptyStateText: "Brak pozycji w tej kategorii.",
  });

export const menuTwoColumnsWithWithHeadingNoImgExampleData: readonly MenuTwoColumnsWithWithHeadingNoImgData[] = [
  menuTwoColumnsWithWithHeadingNoImgDefaultData,
  menuTwoColumnsWithWithHeadingNoImgDataSchema.parse({
    title: "Seasonal Plates",
    menuColumns: [
      {
        items: [
          {
            title: "Duck ravioli",
            description: "Burnt orange, sage",
            priceLabel: "48 zl",
          },
        ],
      },
      {
        items: [
          {
            title: "Lemon tart",
            description: "Burnt meringue, mint",
            priceLabel: "24 zl",
          },
        ],
      },
    ],
    emptyStateText: "Brak pozycji w tej kategorii.",
  }),
];

export const menuTwoColumnsWithWithHeadingNoImgBlockDefinition: PageBuilderBlockDefinition<
  typeof menuTwoColumnsWithWithHeadingNoImgDataSchema,
  typeof menuTwoColumnsWithWithHeadingNoImgSourceSchema
> = {
  blockKey: "menu_two_columns_with_with_heading_no_img",
  version: 1,
  name: "Menu Two Columns With Heading No Image",
  description:
    "Standalone Promo2 lower-menu panel rendered in two columns with a centered heading and divider, with Woo category sourcing via slug or id.",
  schema: menuTwoColumnsWithWithHeadingNoImgDataSchema,
  defaultData: menuTwoColumnsWithWithHeadingNoImgDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "PageBuilderMenuSection",
    componentImportPath: "src/components/sections/PageBuilderMenuSection.tsx",
    notes:
      "Uses the Promo2 lower-panel menu row styling and adds the centered heading pattern from TheMenuSection.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as MenuTwoColumnsWithWithHeadingNoImgData;

      return createElement(PageBuilderMenuSection, {
        key: section.id,
        content: data,
        columns: 2,
        variant: section.variant as PageBuilderMenuSectionVariant | null,
        withHeading: true,
      });
    },
  },
  variants: PAGE_BUILDER_MENU_SECTION_VARIANTS,
  sourceSchema: menuTwoColumnsWithWithHeadingNoImgSourceSchema,
  sourceResolver: {
    kind: "woo-resolver",
    supportedSourceTypes: ["woo_category"],
    notes:
      "Resolves the heading from the Woo category name and menuColumns from Woo products while preserving the shared two-column standalone menu panel.",
  },
  exampleData: menuTwoColumnsWithWithHeadingNoImgExampleData,
  tags: ["menu", "promo2", "content", "two-column", "heading", "woo"],
};