import { createElement } from "react";
import { z } from "zod";

import { Promo3 } from "../../../components/Promo3";

import {
  promo3DefaultData,
  type Promo3Data,
} from "../promo3/schema";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const bigImgAndBoldedTexEditorialStyleBlockDataSchema = z.object({
  title: z.string().min(1, "Section title is required."),
  story: z.string().min(1, "Story copy is required."),
  buttonLabel: z.string().min(1, "Button label is required.").default("przycisk"),
  buttonHref: z.string().min(1, "Button href is required.").default("#"),
  image: z.object({
    src: z.string().min(1, "Image source is required."),
    alt: z.string().min(1, "Image alt text is required."),
  }),
});

export type BigImgAndBoldedTexEditorialStyleBlockData = z.infer<
  typeof bigImgAndBoldedTexEditorialStyleBlockDataSchema
>;

export const bigImgAndBoldedTexEditorialStyleBlockDefaultData:
  BigImgAndBoldedTexEditorialStyleBlockData =
  bigImgAndBoldedTexEditorialStyleBlockDataSchema.parse({
    ...promo3DefaultData,
    buttonLabel: "przycisk",
    buttonHref: "#",
  });

export const bigImgAndBoldedTexEditorialStyleBlockExampleData: readonly BigImgAndBoldedTexEditorialStyleBlockData[] = [
  bigImgAndBoldedTexEditorialStyleBlockDefaultData,
  bigImgAndBoldedTexEditorialStyleBlockDataSchema.parse({
    title: "Seasonal story",
    story:
      "Use this version when the section should keep one portrait image, one bold editorial text block, and one outlined CTA directly beneath the copy.",
    buttonLabel: "poznaj historie",
    buttonHref: "/o-nas",
    image: {
      src: "/react/images/about_1.jpg",
      alt: "Seasonal portrait image",
    },
  }),
];

export const bigImgAndBoldedTexEditorialStyleBlockDefinition: PageBuilderBlockDefinition<
  typeof bigImgAndBoldedTexEditorialStyleBlockDataSchema
> = {
  blockKey: "big_img_and_bolded_tex_editorial_style_block",
  version: 1,
  name: "Big Img And Bolded Text Editorial Style Block",
  description:
    "Direct-edit editorial block with one tall portrait image, one bold lead text block, and one outlined CTA using the Promo3 composition.",
  schema: bigImgAndBoldedTexEditorialStyleBlockDataSchema,
  defaultData: bigImgAndBoldedTexEditorialStyleBlockDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Promo3",
    componentImportPath: "components/Promo3.tsx",
    notes:
      "Content-only block that reuses the Promo3 image-plus-editorial-copy composition under the requested business key, with a block-specific outlined CTA under the copy.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as BigImgAndBoldedTexEditorialStyleBlockData;

      return createElement(Promo3, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: bigImgAndBoldedTexEditorialStyleBlockExampleData,
  tags: ["editorial", "image", "story", "content", "cta"],
};