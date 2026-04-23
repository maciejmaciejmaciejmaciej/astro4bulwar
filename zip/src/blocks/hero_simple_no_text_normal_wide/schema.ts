import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_HERO_SIMPLE_NO_TEXT_NORMAL_WIDE_CONTENT,
  HeroSimpleNoTextNormalWide,
  type HeroSimpleNoTextNormalWideContent,
} from "../../components/sections/hero_simple_no_text_normal_wide";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const heroSimpleNoTextNormalWideDataSchema = z.object({
  imageSrc: z.string().min(1, "Image src is required."),
  alt: z.string().min(1, "Image alt is required."),
});

export type HeroSimpleNoTextNormalWideData = HeroSimpleNoTextNormalWideContent;

export const heroSimpleNoTextNormalWideDefaultData: HeroSimpleNoTextNormalWideData =
  heroSimpleNoTextNormalWideDataSchema.parse(DEFAULT_HERO_SIMPLE_NO_TEXT_NORMAL_WIDE_CONTENT);

export const heroSimpleNoTextNormalWideExampleData: readonly HeroSimpleNoTextNormalWideData[] = [
  heroSimpleNoTextNormalWideDefaultData,
  heroSimpleNoTextNormalWideDataSchema.parse({
    imageSrc: "/react/images/about_front.jpg",
    alt: "Szeroki hero z frontem restauracji",
  }),
];

export const heroSimpleNoTextNormalWideBlockDefinition: PageBuilderBlockDefinition<
  typeof heroSimpleNoTextNormalWideDataSchema
> = {
  blockKey: "hero_simple_no_text_normal_wide",
  version: 1,
  name: "Hero Simple No Text Normal Wide",
  description: "Direct-edit wide hero image block with the current normal-wide geometry and divider line.",
  schema: heroSimpleNoTextNormalWideDataSchema,
  defaultData: heroSimpleNoTextNormalWideDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "HeroSimpleNoTextNormalWide",
    componentImportPath: "src/components/sections/hero_simple_no_text_normal_wide.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as HeroSimpleNoTextNormalWideData;

      return createElement(HeroSimpleNoTextNormalWide, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: heroSimpleNoTextNormalWideExampleData,
  tags: ["hero", "image", "content"],
};