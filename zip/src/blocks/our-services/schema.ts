import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_OUR_SERVICES_CONTENT,
  OurServices,
  type OurServicesContent,
} from "../../components/sections/OurServices";
import type { PageBuilderBlockDefinition } from "../registry/types";

const ourServicesPrimaryCtaSchema = z.object({
  text: z.string().min(1, "Primary CTA text is required."),
  href: z.string().min(1, "Primary CTA href must be a non-empty string.").optional(),
});

const ourServicesCardSchema = z.object({
  icon: z.string().min(1, "Card icon is required."),
  title: z.string().min(1, "Card title is required."),
  description: z.string().min(1, "Card description is required."),
  ctaText: z.string().min(1, "Card CTA text is required."),
  ctaHref: z.string().min(1, "Card CTA href is required."),
});

export const ourServicesDataSchema = z.object({
  title: z.string().min(1, "Section title is required."),
  description: z.string().min(1, "Section description is required."),
  primaryCta: ourServicesPrimaryCtaSchema.optional(),
  cards: z.array(ourServicesCardSchema).default([]),
});

export type OurServicesData = OurServicesContent;

export const ourServicesDefaultData: OurServicesData = ourServicesDataSchema.parse(
  DEFAULT_OUR_SERVICES_CONTENT,
);

export const ourServicesExampleData: readonly OurServicesData[] = [
  ourServicesDataSchema.parse({
    title: "Nasze uslugi",
    description:
      "Od kameralnych kolacji po duze przyjecia firmowe, Bulwar przygotowuje format spotkania, menu i obsluge dopasowane do okazji.",
    primaryCta: {
      text: "Poznaj cala oferte",
      href: "/oferta",
    },
    cards: [
      {
        icon: "celebration",
        title: "PRZYJECIA OKOLICZNOSCIOWE",
        description:
          "Kompletna oprawa rodzinnych uroczystosci z indywidualnym menu, obsluga sali i wsparciem organizacyjnym.",
        ctaText: "Zobacz szczegoly",
        ctaHref: "/przyjecia-okolicznosciowe",
      },
      {
        icon: "local_shipping",
        title: "CATERING BULWAR",
        description:
          "Dostarczamy gotowe zestawy i indywidualne menu na eventy firmowe, swieta i spotkania domowe.",
        ctaText: "Sprawdz catering",
        ctaHref: "/catering",
      },
    ],
  }),
];

export const ourServicesBlockDefinition: PageBuilderBlockDefinition<typeof ourServicesDataSchema> = {
  blockKey: "our-services",
  version: 1,
  name: "Our Services",
  description: "Sticky-intro services section with a masonry-like grid of editorial service cards.",
  schema: ourServicesDataSchema,
  defaultData: ourServicesDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "OurServices",
    componentImportPath: "src/components/sections/OurServices.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as OurServicesData;

      return createElement(OurServices, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: ourServicesExampleData,
  tags: ["services", "editorial", "content"],
};