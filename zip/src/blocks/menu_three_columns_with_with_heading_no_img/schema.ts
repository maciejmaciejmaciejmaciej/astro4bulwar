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

export const menuThreeColumnsWithWithHeadingNoImgSourceSchema = wooCategorySourceSchema;

export const menuThreeColumnsWithWithHeadingNoImgDataSchema = z.object({
  title: z.string().min(1, "Section title is required."),
  menuColumns: z.array(menuColumnSchema).default([]),
  emptyStateText: z.string().default("Brak pozycji w tej kategorii."),
});

export type MenuThreeColumnsWithWithHeadingNoImgData = z.infer<
  typeof menuThreeColumnsWithWithHeadingNoImgDataSchema
>;

export type MenuThreeColumnsWithWithHeadingNoImgSource = z.infer<
  typeof menuThreeColumnsWithWithHeadingNoImgSourceSchema
>;

export const menuThreeColumnsWithWithHeadingNoImgDefaultData: MenuThreeColumnsWithWithHeadingNoImgData =
  menuThreeColumnsWithWithHeadingNoImgDataSchema.parse({
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
      {
        items: [
          {
            title: "Duck ravioli",
            description: "Burnt orange, sage",
            priceLabel: "48 zl",
          },
          {
            title: "Lemon tart",
            description: "Burnt meringue, mint",
            priceLabel: "24 zl",
          },
        ],
      },
    ],
    emptyStateText: "Brak pozycji w tej kategorii.",
  });

export const menuThreeColumnsWithWithHeadingNoImgExampleData: readonly MenuThreeColumnsWithWithHeadingNoImgData[] = [
  menuThreeColumnsWithWithHeadingNoImgDefaultData,
  menuThreeColumnsWithWithHeadingNoImgDataSchema.parse({
    title: "Chef Selection",
    menuColumns: [
      {
        items: [
          {
            title: "Spring asparagus",
            description: "Brown butter, hazelnut",
            priceLabel: "42 zl",
          },
        ],
      },
      {
        items: [
          {
            title: "Smoked trout",
            description: "Cucumber, cultured cream",
            priceLabel: "44 zl",
          },
        ],
      },
      {
        items: [
          {
            title: "Duck ravioli",
            description: "Burnt orange, sage",
            priceLabel: "48 zl",
          },
        ],
      },
    ],
    emptyStateText: "Brak pozycji w tej kategorii.",
  }),
];

export const menuThreeColumnsWithWithHeadingNoImgBlockDefinition: PageBuilderBlockDefinition<
  typeof menuThreeColumnsWithWithHeadingNoImgDataSchema,
  typeof menuThreeColumnsWithWithHeadingNoImgSourceSchema
> = {
  blockKey: "menu_three_columns_with_with_heading_no_img",
  version: 1,
  name: "Menu Three Columns With Heading No Image",
  description:
    "Standalone Promo2 lower-menu panel rendered in three columns with a centered heading and divider, with Woo category sourcing via slug or id.",
  schema: menuThreeColumnsWithWithHeadingNoImgDataSchema,
  defaultData: menuThreeColumnsWithWithHeadingNoImgDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "PageBuilderMenuSection",
    componentImportPath: "src/components/sections/PageBuilderMenuSection.tsx",
    notes:
      "Uses the Promo2 lower-panel menu row styling and expands to three columns while keeping the centered heading pattern.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as MenuThreeColumnsWithWithHeadingNoImgData;

      return createElement(PageBuilderMenuSection, {
        key: section.id,
        content: data,
        columns: 3,
        variant: section.variant as PageBuilderMenuSectionVariant | null,
        withHeading: true,
      });
    },
  },
  variants: PAGE_BUILDER_MENU_SECTION_VARIANTS,
  sourceSchema: menuThreeColumnsWithWithHeadingNoImgSourceSchema,
  sourceResolver: {
    kind: "woo-resolver",
    supportedSourceTypes: ["woo_category"],
    notes:
      "Resolves the heading from the Woo category name and menuColumns from Woo products while preserving the shared three-column standalone menu panel.",
  },
  exampleData: menuThreeColumnsWithWithHeadingNoImgExampleData,
  tags: ["menu", "promo2", "content", "three-column", "heading", "woo"],
};