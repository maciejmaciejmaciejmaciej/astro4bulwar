import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_HERO_SIMPLE_NO_TEXT_PY32_CONTENT,
  HeroSimpleNoTextPy32,
  type HeroSimpleNoTextPy32Content,
} from "../../components/sections/hero_simple_no_text_py32";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const heroSimpleNoTextPy32DataSchema = z.object({
  imageSrc: z.string().min(1, "Image src is required."),
  alt: z.string().min(1, "Image alt is required."),
});

export type HeroSimpleNoTextPy32Data = HeroSimpleNoTextPy32Content;

export const heroSimpleNoTextPy32DefaultData: HeroSimpleNoTextPy32Data =
  heroSimpleNoTextPy32DataSchema.parse(DEFAULT_HERO_SIMPLE_NO_TEXT_PY32_CONTENT);

export const heroSimpleNoTextPy32ExampleData: readonly HeroSimpleNoTextPy32Data[] = [
  heroSimpleNoTextPy32DefaultData,
  heroSimpleNoTextPy32DataSchema.parse({
    imageSrc: "/react/images/about_1.jpg",
    alt: "Hero obraz sali restauracyjnej",
  }),
];

export const heroSimpleNoTextPy32BlockDefinition: PageBuilderBlockDefinition<
  typeof heroSimpleNoTextPy32DataSchema
> = {
  blockKey: "hero_simple_no_text_py32",
  version: 1,
  name: "Hero Simple No Text Py32",
  description: "Direct-edit hero image block with the current py32 spacing and divider line.",
  schema: heroSimpleNoTextPy32DataSchema,
  defaultData: heroSimpleNoTextPy32DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "HeroSimpleNoTextPy32",
    componentImportPath: "src/components/sections/hero_simple_no_text_py32.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as HeroSimpleNoTextPy32Data;

      return createElement(HeroSimpleNoTextPy32, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: heroSimpleNoTextPy32ExampleData,
  tags: ["hero", "image", "content"],
};