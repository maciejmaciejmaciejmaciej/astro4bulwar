import { createElement } from "react";
import { z } from "zod";

import { JustPralaxImgHorizontalSection } from "../../components/sections/JustPralaxImgHorizontalSection";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const justPralaxImgHorizontalDataSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required."),
});

export type JustPralaxImgHorizontalData = z.infer<typeof justPralaxImgHorizontalDataSchema>;

export const justPralaxImgHorizontalDefaultData: JustPralaxImgHorizontalData =
  justPralaxImgHorizontalDataSchema.parse({
    imageUrl: "https://example.com/uploads/parallax-horizontal.jpg",
  });

export const justPralaxImgHorizontalExampleData: readonly JustPralaxImgHorizontalData[] = [
  justPralaxImgHorizontalDefaultData,
  justPralaxImgHorizontalDataSchema.parse({
    imageUrl: "https://example.com/uploads/parallax-horizontal-2.jpg",
  }),
];

export const justPralaxImgHorizontalBlockDefinition: PageBuilderBlockDefinition<
  typeof justPralaxImgHorizontalDataSchema
> = {
  blockKey: "just_pralax_img_horizontal",
  version: 1,
  name: "Just Pralax Img Horizontal",
  description:
    "Standalone horizontal parallax image block with the same contained desktop width as Promo2 and no heading or attached menu content.",
  schema: justPralaxImgHorizontalDataSchema,
  defaultData: justPralaxImgHorizontalDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "JustPralaxImgHorizontalSection",
    componentImportPath: "src/components/sections/JustPralaxImgHorizontalSection.tsx",
    notes:
      "Renders only the parallax image shell. The only editable content field is the image URL.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as JustPralaxImgHorizontalData;

      return createElement(JustPralaxImgHorizontalSection, {
        key: section.id,
        content: data,
      });
    },
  },
  sourceSchema: null,
  exampleData: justPralaxImgHorizontalExampleData,
  tags: ["image", "parallax", "hero"],
};