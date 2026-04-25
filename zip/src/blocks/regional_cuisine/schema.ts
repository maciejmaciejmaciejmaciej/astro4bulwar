import { createElement, Fragment } from "react";
import { ConciergeBell, Heart } from "lucide-react";
import { z } from "zod";

import { RegionalCuisine } from "../../components/sections/RegionalCuisine";
import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

const regionalCuisineActionIconKeys = ["heart", "conciergeBell"] as const;

const regionalCuisineActionIconMap = {
  heart: Heart,
  conciergeBell: ConciergeBell,
} as const;

const regionalCuisineActionSchema = z.object({
  icon: z.enum(regionalCuisineActionIconKeys),
  titleLines: z.array(z.string().min(1)).min(1),
  description: z.string().min(1),
  href: z.string().min(1),
  linkLabel: z.string().min(1),
});

export const regionalCuisineDataSchema = z.object({
  titleLines: z.array(z.string().min(1)).min(1),
  description: z.string().min(1),
  actions: z.array(regionalCuisineActionSchema).default([]),
  image: imageAssetSchema,
});

export type RegionalCuisineData = z.infer<typeof regionalCuisineDataSchema>;

export const regionalCuisineDefaultData: RegionalCuisineData = regionalCuisineDataSchema.parse({
  titleLines: ["Kuchnia", "regionalna"],
  description:
    "Restauracja Bulwar na Starym Rynku w Poznaniu oferuje niecodzienne połączenie tradycyjnej, regionalnej kuchni z nowoczesnymi trendami w gotowaniu.",
  actions: [
    {
      icon: "heart",
      titleLines: ["Zobacz menu a'la", "carte"],
      description: "Wyjątkowe dania na bazie ekologicznych produktów z regionu",
      href: "/menu",
      linkLabel: "Zobacz menu",
    },
    {
      icon: "conciergeBell",
      titleLines: ["Zorganizujemy Twoje", "przyjęcie"],
      description: "Imprezy okolicznościowe na najwyższym poziomie",
      href: "/oferta",
      linkLabel: "Zobacz ofertę",
    },
  ],
  image: {
    src: "/react/images/widok-na-ratusz.jpg",
    alt: "Widok na Stary Rynek w Poznaniu",
  },
});

export const regionalCuisineExampleData: readonly RegionalCuisineData[] = [
  regionalCuisineDefaultData,
];

const renderLines = (lines: string[]) =>
  lines.map((line, index) =>
    createElement(
      Fragment,
      { key: `${line}-${index}` },
      line,
      index < lines.length - 1 ? createElement("br") : null,
    ),
  );

export const regionalCuisineBlockDefinition: PageBuilderBlockDefinition<typeof regionalCuisineDataSchema> = {
  blockKey: "regional_cuisine",
  version: 1,
  name: "Regional Cuisine",
  description: "Editorial two-column cuisine section with supporting links and a featured image.",
  schema: regionalCuisineDataSchema,
  defaultData: regionalCuisineDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "RegionalCuisine",
    componentImportPath: "src/components/sections/RegionalCuisine.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as RegionalCuisineData;

      return createElement(RegionalCuisine, {
        key: section.id,
        title: renderLines(data.titleLines),
        description: data.description,
        actions: data.actions.map((action) => ({
          icon: regionalCuisineActionIconMap[action.icon],
          title: renderLines(action.titleLines),
          description: action.description,
          href: action.href,
          linkLabel: action.linkLabel,
        })),
        imageSrc: data.image.src,
        imageAlt: data.image.alt,
      });
    },
  },
  exampleData: regionalCuisineExampleData,
  tags: ["editorial", "cuisine", "content"],
};