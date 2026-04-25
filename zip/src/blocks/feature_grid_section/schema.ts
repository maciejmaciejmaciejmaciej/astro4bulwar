import { createElement } from "react";
import type { ReactNode } from "react";
import { Expand, Globe, Rocket, Wrench } from "lucide-react";
import { z } from "zod";

import { FeatureGridSection } from "../../components/sections/FeatureGridSection";
import type { PageBuilderBlockDefinition } from "../registry/types";

const featureGridIconKeys = ["globe", "rocket", "expand", "wrench"] as const;

const featureGridIconMap = {
  globe: Globe,
  rocket: Rocket,
  expand: Expand,
  wrench: Wrench,
} as const;

const featureGridItemSchema = z.object({
  icon: z.enum(featureGridIconKeys),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const featureGridSectionDataSchema = z.object({
  items: z.array(featureGridItemSchema).default([]),
});

export type FeatureGridSectionData = z.infer<typeof featureGridSectionDataSchema>;

export const featureGridSectionDefaultData: FeatureGridSectionData = featureGridSectionDataSchema.parse({
  items: [
    {
      icon: "globe",
      title: "Robust Infrastructure",
      description: "Reliable and scalable infrastructure, easy to manage.",
    },
    {
      icon: "rocket",
      title: "Easy Setup",
      description: "Quick and simple configuration for any use case.",
    },
    {
      icon: "expand",
      title: "Effortless Scaling",
      description: "Built to handle increased demand with ease.",
    },
    {
      icon: "wrench",
      title: "Low Maintenance",
      description: "Focus on building, not on maintenance tasks.",
    },
  ],
});

export const featureGridSectionExampleData: readonly FeatureGridSectionData[] = [
  featureGridSectionDefaultData,
];

export const featureGridSectionBlockDefinition: PageBuilderBlockDefinition<typeof featureGridSectionDataSchema> = {
  blockKey: "feature_grid_section",
  version: 1,
  name: "Feature Grid Section",
  description: "Four-card feature grid with editable titles, descriptions, and icon keys.",
  schema: featureGridSectionDataSchema,
  defaultData: featureGridSectionDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "FeatureGridSection",
    componentImportPath: "src/components/sections/FeatureGridSection.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as FeatureGridSectionData;

      return createElement(FeatureGridSection, {
        key: section.id,
        items: data.items.map((item) => ({
          icon: featureGridIconMap[item.icon],
          title: item.title,
          description: item.description as ReactNode,
        })),
      });
    },
  },
  exampleData: featureGridSectionExampleData,
  tags: ["features", "grid", "content"],
};