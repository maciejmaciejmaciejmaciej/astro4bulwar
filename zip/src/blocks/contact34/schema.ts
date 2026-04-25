import { createElement } from "react";
import { z } from "zod";

import {
  Contact34Section,
  DEFAULT_CONTACT34_CONTENT,
  type Contact34Content,
} from "../../components/sections/Contact34Section";
import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const contact34ContactItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  href: z.string().min(1).optional(),
});

const contact34FormSchema = z.object({
  nameLabel: z.string().min(1),
  namePlaceholder: z.string().min(1),
  emailLabel: z.string().min(1),
  emailPlaceholder: z.string().min(1),
  messageLabel: z.string().min(1),
  messagePlaceholder: z.string().min(1),
  submitLabel: z.string().min(1),
});

export const contact34DataSchema = z.object({
  tagline: z.string().min(1),
  title: z.string().min(1),
  image: imageAssetSchema,
  contactItems: z.array(contact34ContactItemSchema).default([]),
  form: contact34FormSchema,
});

export type Contact34Data = Contact34Content;

export const contact34DefaultData: Contact34Data = contact34DataSchema.parse(
  DEFAULT_CONTACT34_CONTENT,
);

export const contact34ExampleData: readonly Contact34Data[] = [
  contact34DataSchema.parse({
    ...DEFAULT_CONTACT34_CONTENT,
    tagline: "Zarezerwuj termin",
    title: "Napisz do nas w sprawie przyjecia lub cateringu",
  }),
];

export const contact34BlockDefinition: PageBuilderBlockDefinition<typeof contact34DataSchema> = {
  blockKey: "contact34",
  version: 1,
  name: "Contact 34",
  description: "Split contact section with hero image, contact cards, and direct-edit form copy.",
  schema: contact34DataSchema,
  defaultData: contact34DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Contact34Section",
    componentImportPath: "src/components/sections/Contact34Section.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) =>
      createElement(Contact34Section, {
        key: section.id,
        content: section.data as Contact34Data,
      }),
  },
  exampleData: contact34ExampleData,
  tags: ["contact", "form", "content"],
};