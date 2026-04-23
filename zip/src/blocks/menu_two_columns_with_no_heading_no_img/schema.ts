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

export const menuTwoColumnsWithNoHeadingNoImgSourceSchema = wooCategorySourceSchema;

export const menuTwoColumnsWithNoHeadingNoImgDataSchema = z.object({
  menuColumns: z.array(menuColumnSchema).default([]),
  emptyStateText: z.string().default("Brak pozycji w tej kategorii."),
});

export type MenuTwoColumnsWithNoHeadingNoImgData = z.infer<
  typeof menuTwoColumnsWithNoHeadingNoImgDataSchema
>;

export type MenuTwoColumnsWithNoHeadingNoImgSource = z.infer<
  typeof menuTwoColumnsWithNoHeadingNoImgSourceSchema
>;

export const menuTwoColumnsWithNoHeadingNoImgDefaultData: MenuTwoColumnsWithNoHeadingNoImgData =
  menuTwoColumnsWithNoHeadingNoImgDataSchema.parse({
    menuColumns: [
      {
        items: [
          {
            title: "Spring asparagus",
            description: "Brown butter, hazelnut",
            priceLabel: "42 zl",
            tagSlugs: ["500 ml"],
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

export const menuTwoColumnsWithNoHeadingNoImgExampleData: readonly MenuTwoColumnsWithNoHeadingNoImgData[] = [
  menuTwoColumnsWithNoHeadingNoImgDefaultData,
  menuTwoColumnsWithNoHeadingNoImgDataSchema.parse({
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

export const menuTwoColumnsWithNoHeadingNoImgBlockDefinition: PageBuilderBlockDefinition<
  typeof menuTwoColumnsWithNoHeadingNoImgDataSchema,
  typeof menuTwoColumnsWithNoHeadingNoImgSourceSchema
> = {
  blockKey: "menu_two_columns_with_no_heading_no_img",
  version: 1,
  name: "Menu Two Columns No Heading No Image",
  description:
    "Standalone Promo2 lower-menu panel rendered in two columns without a section heading or image, with Woo category sourcing via slug or id.",
  schema: menuTwoColumnsWithNoHeadingNoImgDataSchema,
  defaultData: menuTwoColumnsWithNoHeadingNoImgDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "PageBuilderMenuSection",
    componentImportPath: "src/components/sections/PageBuilderMenuSection.tsx",
    notes:
      "Uses the Promo2 lower-panel menu row styling as a standalone block with no image or editorial header.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as MenuTwoColumnsWithNoHeadingNoImgData;

      return createElement(PageBuilderMenuSection, {
        key: section.id,
        content: data,
        columns: 2,
        variant: section.variant as PageBuilderMenuSectionVariant | null,
      });
    },
  },
  variants: PAGE_BUILDER_MENU_SECTION_VARIANTS,
  sourceSchema: menuTwoColumnsWithNoHeadingNoImgSourceSchema,
  sourceResolver: {
    kind: "woo-resolver",
    supportedSourceTypes: ["woo_category"],
    notes:
      "Resolves menuColumns from a Woo category source while preserving the standalone two-column Promo2 lower-panel presentation.",
  },
  exampleData: menuTwoColumnsWithNoHeadingNoImgExampleData,
  tags: ["menu", "promo2", "content", "two-column", "woo"],
};