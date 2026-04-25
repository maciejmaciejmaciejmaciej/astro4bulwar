import { createElement } from "react";
import { z } from "zod";

import { AboutSection } from "../../components/sections/AboutSection";
import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const about1CtaButtonSchema = z.object({
  href: z.string().min(1, "CTA href is required."),
  text: z.string().min(1, "CTA text is required."),
});

const about1LeftTextSchema = z.object({
  title: z.string().min(1).optional(),
  paragraphs: z.array(z.string().min(1, "Paragraph text is required.")).default([]),
  ctaButton: about1CtaButtonSchema.optional(),
});

const about1RightTextSchema = z.object({
  paragraphs: z.array(z.string().min(1, "Paragraph text is required.")).default([]),
});

export const about1DataSchema = z.object({
  leftImages: z.array(imageAssetSchema).default([]),
  leftText: about1LeftTextSchema.default({
    paragraphs: [],
  }),
  rightText: about1RightTextSchema.default({
    paragraphs: [],
  }),
  rightImages: z.array(imageAssetSchema).default([]),
});

export type About1Data = z.infer<typeof about1DataSchema>;

export const about1DefaultData: About1Data = about1DataSchema.parse({
  leftImages: [
    {
      src: "/images/about-left-1.webp",
      alt: "Sala restauracji",
    },
  ],
  leftText: {
    title: "Nasza historia",
    paragraphs: [
      "Bulwar łączy kuchnię i atmosferę miejsca.",
      "Ta sekcja otwiera narrację strony.",
    ],
    ctaButton: {
      href: "/kontakt",
      text: "Skontaktuj się",
    },
  },
  rightText: {
    paragraphs: [
      "Druga kolumna rozwija główny przekaz sekcji.",
    ],
  },
  rightImages: [
    {
      src: "/images/about-right-1.webp",
      alt: "Detal wnętrza",
    },
  ],
});

export const about1ExampleData: readonly About1Data[] = [
  about1DataSchema.parse({
    leftImages: [
      {
        src: "/images/about-left-1.webp",
        alt: "Sala restauracji",
      },
    ],
    leftText: {
      title: "Nasza historia",
      paragraphs: [
        "Bulwar laczy kuchnie i atmosfere miejsca.",
        "Ta sekcja otwiera narracje strony.",
      ],
      ctaButton: {
        href: "/kontakt",
        text: "Skontaktuj sie",
      },
    },
    rightText: {
      paragraphs: [
        "Druga kolumna rozwija glowny przekaz sekcji.",
      ],
    },
    rightImages: [
      {
        src: "/images/about-right-1.webp",
        alt: "Detal wnetrza",
      },
    ],
  }),
];

export const about1BlockDefinition: PageBuilderBlockDefinition<typeof about1DataSchema> = {
  blockKey: "about-1",
  version: 1,
  name: "About 1",
  description: "Editorial two-column about section with optional image stacks and CTA.",
  schema: about1DataSchema,
  defaultData: about1DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "AboutSection",
    componentImportPath: "src/components/sections/AboutSection.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as About1Data;

      return createElement(AboutSection, {
        key: section.id,
        leftImages: data.leftImages,
        leftText: data.leftText,
        rightText: data.rightText,
        rightImages: data.rightImages,
      });
    },
  },
  exampleData: about1ExampleData,
  tags: ["about", "editorial", "content"],
};