import { createElement } from "react";
import { z } from "zod";

import {
  CateringSection,
} from "../../components/sections/CateringSection";
import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const premiumCallToActionWithImageCarouselDataSchema = z.object({
  heading: z.string().min(1, "Heading is required."),
  description: z.string().min(1, "Description is required."),
  buttonText: z.string().min(1, "Button text is required."),
  buttonHref: z.string().min(1, "Button href is required."),
  images: z.array(imageAssetSchema).default([]),
});

export type PremiumCallToActionWithImageCarouselData = z.infer<
  typeof premiumCallToActionWithImageCarouselDataSchema
>;

export const premiumCallToActionWithImageCarouselDefaultData:
  PremiumCallToActionWithImageCarouselData = premiumCallToActionWithImageCarouselDataSchema.parse({
    heading: "Catering Wielkanocny",
    description:
      "Zamów z dostawą lub odbiorem w contained sekcji zgodnej z rytmem Promo2. Najwyższa jakość i starannie wyselekcjonowane świąteczne propozycje trafiają prosto na stół.",
    buttonText: "ZAMÓW ONLINE",
    buttonHref: "/catering-wielkanocny",
    images: [
      {
        src: "/react/images/zupy-catering.jpg",
        alt: "Zupy cateringowe",
      },
      {
        src: "/react/images/sniadanie-wielkanocne.jpg",
        alt: "Sniadanie wielkanocne",
      },
      {
        src: "/react/images/ciasta-catering.jpg",
        alt: "Ciasta cateringowe",
      },
      {
        src: "/react/images/dla-dzieci.jpg",
        alt: "Menu dla dzieci",
      },
      {
        src: "/react/images/chleb-pieczywo.jpg",
        alt: "Chleb i pieczywo",
      },
      {
        src: "/react/images/dania-glowne.jpg",
        alt: "Dania glowne",
      },
    ],
  });

export const premiumCallToActionWithImageCarouselExampleData: readonly PremiumCallToActionWithImageCarouselData[] = [
  premiumCallToActionWithImageCarouselDefaultData,
  premiumCallToActionWithImageCarouselDataSchema.parse({
    heading: "Catering premium",
    description:
      "Ten wariant zachowuje contained shell, jeden glowny komunikat CTA oraz stabilna kolekcje szesciu obrazow w karuzeli.",
    buttonText: "POZNAJ OFERTE",
    buttonHref: "/oferta/catering-premium",
    images: [
      {
        src: "/react/images/zupy-catering.jpg",
        alt: "Przystawki premium",
      },
      {
        src: "/react/images/sniadanie-wielkanocne.jpg",
        alt: "Sniadanie premium",
      },
      {
        src: "/react/images/ciasta-catering.jpg",
        alt: "Desery premium",
      },
      {
        src: "/react/images/dla-dzieci.jpg",
        alt: "Bufet rodzinny",
      },
      {
        src: "/react/images/chleb-pieczywo.jpg",
        alt: "Wypieki rzemieslnicze",
      },
      {
        src: "/react/images/dania-glowne.jpg",
        alt: "Dania glowne premium",
      },
    ],
  }),
];

export const premiumCallToActionWithImageCarouselBlockDefinition: PageBuilderBlockDefinition<
  typeof premiumCallToActionWithImageCarouselDataSchema
> = {
  blockKey: "premium_call_to_action_with_image_carousel",
  version: 1,
  name: "Premium Call To Action With Image Carousel",
  description:
    "Direct-edit contained CTA section with one lead message, one button, and a six-image marquee-style carousel.",
  schema: premiumCallToActionWithImageCarouselDataSchema,
  defaultData: premiumCallToActionWithImageCarouselDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "CateringSection",
    componentImportPath: "src/components/sections/CateringSection.tsx",
    notes:
      "Content-only block. Uses the contained Promo2-style width mode and intentionally omits decorative lower-right graphics.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as PremiumCallToActionWithImageCarouselData;

      return createElement(CateringSection, {
        key: section.id,
        heading: data.heading,
        description: data.description,
        buttonText: data.buttonText,
        buttonHref: data.buttonHref,
        images: data.images,
        widthMode: "promo2-contained",
      });
    },
  },
  exampleData: premiumCallToActionWithImageCarouselExampleData,
  tags: ["cta", "carousel", "catering", "content"],
};