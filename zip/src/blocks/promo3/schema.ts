import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_PROMO3_CONTENT,
  Promo3,
  type Promo3Content,
} from "../../../components/Promo3";

import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const promo3DataSchema = z.object({
  title: z.string().min(1, "Section title is required."),
  story: z.string().min(1, "Story copy is required."),
  image: imageAssetSchema,
});

export type Promo3Data = Promo3Content;

export const promo3DefaultData: Promo3Data =
  promo3DataSchema.parse(DEFAULT_PROMO3_CONTENT);

export const promo3ExampleData: readonly Promo3Data[] = [
  promo3DataSchema.parse(DEFAULT_PROMO3_CONTENT),
  promo3DataSchema.parse({
    title: "Seasonal story",
    story:
      "Use this version when the section should keep only one portrait image and the primary editorial copy, without extra eyebrow rows or team cards.",
    image: {
      src: "/react/images/about_1.jpg",
      alt: "Seasonal portrait image",
    },
  }),
];

export const promo3BlockDefinition: PageBuilderBlockDefinition<typeof promo3DataSchema> = {
  blockKey: "promo3",
  version: 1,
  name: "Promo 3",
  description:
    "Simplified promo/story section with a centered portrait image on the left and one editorial copy block on the right.",
  schema: promo3DataSchema,
  defaultData: promo3DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Promo3",
    componentImportPath: "components/Promo3.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as Promo3Data;

      return createElement(Promo3, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: promo3ExampleData,
  tags: ["story", "editorial", "image", "content"],
};