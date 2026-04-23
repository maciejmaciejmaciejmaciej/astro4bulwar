import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_OFERTA_SECTION_CONTENT,
  OfertaSection,
} from "../../components/sections/OfertaSection";
import {
  imageAssetSchema,
} from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const ofertaPostsSectionLinkSchema = z.object({
  href: z.string().min(1, "Offer link href is required."),
});

export const ofertaPostsSectionItemSchema = z.object({
  image: imageAssetSchema,
  title: z.string().min(1, "Offer title is required."),
  description: z.string().min(1, "Offer description is required."),
  link: ofertaPostsSectionLinkSchema,
});

export const ofertaPostsSectionSourceSchema = z.object({
  sourceType: z.literal("wordpress_posts"),
  sourceValue: z.array(z.number().int().positive()).min(1, "At least one WordPress post id is required."),
  options: z.object({}).default({}),
});

export const ofertaPostsSectionDataSchema = z.object({
  title: z.string().min(1, "Section title is required."),
  items: z.array(ofertaPostsSectionItemSchema).default([]),
});

export type OfertaPostsSectionItem = z.infer<typeof ofertaPostsSectionItemSchema>;
export type OfertaPostsSectionData = z.infer<typeof ofertaPostsSectionDataSchema>;
export type OfertaPostsSectionSource = z.infer<typeof ofertaPostsSectionSourceSchema>;

export const ofertaPostsSectionDefaultData: OfertaPostsSectionData = ofertaPostsSectionDataSchema.parse(
  DEFAULT_OFERTA_SECTION_CONTENT,
);

export const ofertaPostsSectionExampleData: readonly OfertaPostsSectionData[] = [
  ofertaPostsSectionDefaultData,
];

export const ofertaPostsSectionBlockDefinition: PageBuilderBlockDefinition<
  typeof ofertaPostsSectionDataSchema,
  typeof ofertaPostsSectionSourceSchema
> = {
  blockKey: "oferta_posts_section",
  version: 1,
  name: "Oferta Posts Section",
  description:
    "Oferta rows rendered with the existing OfertaSection design and intended to resolve from an ordered list of WordPress post ids.",
  schema: ofertaPostsSectionDataSchema,
  defaultData: ofertaPostsSectionDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "OfertaSection",
    componentImportPath: "src/components/sections/OfertaSection.tsx",
    notes:
      "Preserves the current OfertaSection layout while allowing a page-builder source to map rows from WordPress posts.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as OfertaPostsSectionData;

      return createElement(OfertaSection, {
        key: section.id,
        content: data,
      });
    },
  },
  sourceSchema: ofertaPostsSectionSourceSchema,
  sourceResolver: {
    kind: "custom",
    supportedSourceTypes: ["wordpress_posts"],
    notes:
      "Rows resolve from WordPress posts in the same order as source.sourceValue using featured image, title, excerpt, and offer_url_link.",
  },
  exampleData: ofertaPostsSectionExampleData,
  tags: ["oferta", "posts", "wordpress"],
};