import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_OFFER_HERO_CONTENT,
  OfferHeroSection,
  type OfferHeroContent,
} from "../../components/sections/OfferHeroSection";
import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const offerHeroInfoItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  note: z.string().min(1).optional(),
});

export const offerHeroDataSchema = z.object({
  eyebrow: z.string().min(1),
  titleLines: z.array(z.string().min(1)).min(1),
  lead: z.string().min(1),
  infoItems: z.array(offerHeroInfoItemSchema).default([]),
  mainImage: imageAssetSchema,
  offerEyebrow: z.string().min(1),
  offerTitleLines: z.array(z.string().min(1)).min(1),
  offerParagraphs: z.array(z.string().min(1)).default([]),
  saleNotice: z.string().min(1).optional(),
  secondaryImages: z.array(imageAssetSchema).default([]),
});

export type OfferHeroData = OfferHeroContent;

export const offerHeroDefaultData: OfferHeroData = offerHeroDataSchema.parse(
  DEFAULT_OFFER_HERO_CONTENT,
);

export const offerHeroExampleData: readonly OfferHeroData[] = [
  offerHeroDataSchema.parse({
    ...DEFAULT_OFFER_HERO_CONTENT,
    eyebrow: "Oferta okolicznosciowa",
    titleLines: ["Oferta", "dla gosci"],
    offerTitleLines: ["Jak zamowic", "i zarezerwowac"],
  }),
];

export const offerHeroBlockDefinition: PageBuilderBlockDefinition<typeof offerHeroDataSchema> = {
  blockKey: "offer_hero",
  version: 1,
  name: "Offer Hero",
  description: "Editorial offer hero with key facts, large image, and supporting instructions.",
  schema: offerHeroDataSchema,
  defaultData: offerHeroDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "OfferHeroSection",
    componentImportPath: "src/components/sections/OfferHeroSection.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) =>
      createElement(OfferHeroSection, {
        key: section.id,
        content: section.data as OfferHeroData,
      }),
  },
  exampleData: offerHeroExampleData,
  tags: ["hero", "offer", "content"],
};