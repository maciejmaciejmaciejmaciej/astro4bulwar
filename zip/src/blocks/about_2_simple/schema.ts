import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_MODERN_INTERIOR_CONTENT,
  ModernInterior,
  type ModernInteriorContent,
} from "../../components/sections/ModernInterior";
import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const about2SimpleDataSchema = z.object({
  title: z.string().min(1, "Section title is required."),
  paragraphs: z.array(z.string().min(1, "Paragraph text is required.")).min(1),
  buttonText: z.string().min(1, "Button text is required."),
  buttonLink: z.string().min(1, "Button link is required."),
  image1: imageAssetSchema,
  image2: imageAssetSchema,
});

export type About2SimpleData = ModernInteriorContent;

export const about2SimpleDefaultData: About2SimpleData =
  about2SimpleDataSchema.parse(DEFAULT_MODERN_INTERIOR_CONTENT);

export const about2SimpleExampleData: readonly About2SimpleData[] = [
  about2SimpleDefaultData,
  about2SimpleDataSchema.parse({
    title: "Przestrzen Bulwaru",
    paragraphs: [
      "Sekcja pokazuje eleganckie wnetrze, spokoj marki i rytm spotkan przy stole.",
      "Dwa kadry zachowuja obecny uklad parallax i podkreslaja charakter restauracji.",
    ],
    buttonText: "POZNAJ WNETRZE",
    buttonLink: "/galeria",
    image1: {
      src: "/react/images/about_1.jpg",
      alt: "Sala restauracyjna Bulwar",
    },
    image2: {
      src: "/react/images/about_front.jpg",
      alt: "Detal dekoracji i swiatla",
    },
  }),
];

export const about2SimpleBlockDefinition: PageBuilderBlockDefinition<typeof about2SimpleDataSchema> = {
  blockKey: "about_2_simple",
  version: 1,
  name: "About 2 Simple",
  description: "Direct-edit about section with editorial copy, CTA, and two parallax interior images.",
  schema: about2SimpleDataSchema,
  defaultData: about2SimpleDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "ModernInterior",
    componentImportPath: "src/components/sections/ModernInterior.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as About2SimpleData;

      return createElement(ModernInterior, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: about2SimpleExampleData,
  tags: ["about", "interior", "content"],
};