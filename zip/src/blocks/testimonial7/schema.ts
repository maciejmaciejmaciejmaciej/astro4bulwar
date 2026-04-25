import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_TESTIMONIAL7_CONTENT,
  Testimonial7,
  type Testimonial7Content,
} from "../../components/sections/Testimonial7";
import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const testimonial7ItemSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: z.string().min(1),
  content: z.string().min(1),
});

export const testimonial7DataSchema = z.object({
  badge: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  firstRow: z.array(testimonial7ItemSchema).default([]),
  secondRow: z.array(testimonial7ItemSchema).default([]),
});

export type Testimonial7Data = Testimonial7Content;

export const testimonial7DefaultData: Testimonial7Data = testimonial7DataSchema.parse(
  DEFAULT_TESTIMONIAL7_CONTENT,
);

export const testimonial7ExampleData: readonly Testimonial7Data[] = [
  testimonial7DataSchema.parse({
    ...DEFAULT_TESTIMONIAL7_CONTENT,
    badge: "Opinie",
    title: "Co mowia nasi goscie",
    description: "Karuzela opinii dzielona na dwa pasy, w pelni utrzymywana jako direct edit.",
  }),
];

export const testimonial7BlockDefinition: PageBuilderBlockDefinition<typeof testimonial7DataSchema> = {
  blockKey: "testimonial7",
  version: 1,
  name: "Testimonial 7",
  description: "Two-row testimonial carousel with editable heading and testimonial cards.",
  schema: testimonial7DataSchema,
  defaultData: testimonial7DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Testimonial7",
    componentImportPath: "src/components/sections/Testimonial7.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) =>
      createElement(Testimonial7, {
        key: section.id,
        content: section.data as Testimonial7Data,
      }),
  },
  exampleData: testimonial7ExampleData,
  tags: ["testimonials", "social-proof", "content"],
};