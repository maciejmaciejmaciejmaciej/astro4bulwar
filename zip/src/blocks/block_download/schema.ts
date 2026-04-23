import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_OCCASIONAL_MENU_PDF_DOWNLOAD_CONTENT,
  OccasionalMenuPdfDownloadSection,
  type OccasionalMenuPdfDownloadContent,
} from "../../components/sections/OccasionalMenuPdfDownloadSection";
import { ctaLinkSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const blockDownloadFeatureSchema = z.object({
  icon: z.enum(["groups", "quality", "format", "events"]),
  title: z.string().min(1, "Feature title is required."),
});

export const blockDownloadDataSchema = z.object({
  title: z.string().min(1, "Section title is required."),
  subtitle: z.string().min(1, "Section subtitle is required."),
  primaryCta: ctaLinkSchema,
  secondaryCta: ctaLinkSchema,
  helperText: z.string().min(1, "Helper text is required."),
  versionLabel: z.string().min(1, "Version label is required."),
  fileMeta: z.string().min(1, "File meta is required."),
  panelCaption: z.string().min(1, "Panel caption is required."),
  features: z.array(blockDownloadFeatureSchema).default([]),
});

export type BlockDownloadData = OccasionalMenuPdfDownloadContent;

export const blockDownloadDefaultData: BlockDownloadData =
  blockDownloadDataSchema.parse(DEFAULT_OCCASIONAL_MENU_PDF_DOWNLOAD_CONTENT);

export const blockDownloadExampleData: readonly BlockDownloadData[] = [
  blockDownloadDefaultData,
  blockDownloadDataSchema.parse({
    title: "Pakiet bankietowy",
    subtitle: "Pobierz przygotowany plik PDF dla eventow firmowych i przyjec premium.",
    primaryCta: {
      label: "Pobierz pakiet",
      href: "/pdf/pakiet-bankietowy.pdf",
    },
    secondaryCta: {
      label: "Zobacz online",
      href: "/menu-okolicznosciowe-premium",
    },
    helperText: "PDF gotowy do wysylki klientom, druku i szybkiej konsultacji z zespolem.",
    versionLabel: "PDF PRO",
    fileMeta: "4.1 MB",
    panelCaption: "Rozszerzona oferta dla wydarzen premium",
    features: [
      {
        icon: "events",
        title: "Rozbudowane propozycje dla gali, jubileuszy i spotkan firmowych",
      },
      {
        icon: "format",
        title: "Jedna karta PDF do wysylki gosciom, wydruku i pracy z organizatorem",
      },
    ],
  }),
];

export const blockDownloadBlockDefinition: PageBuilderBlockDefinition<
  typeof blockDownloadDataSchema
> = {
  blockKey: "block_download",
  version: 1,
  name: "Block Download",
  description:
    "Direct-edit PDF download section with editorial intro copy, feature list, and a two-CTA download card.",
  schema: blockDownloadDataSchema,
  defaultData: blockDownloadDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "OccasionalMenuPdfDownloadSection",
    componentImportPath: "src/components/sections/OccasionalMenuPdfDownloadSection.tsx",
    notes:
      "Content-only block. Keep source null and edit all visible copy, CTA labels, and helper text directly in page-builder data.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as BlockDownloadData;

      return createElement(OccasionalMenuPdfDownloadSection, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: blockDownloadExampleData,
  tags: ["download", "pdf", "cta", "content"],
};