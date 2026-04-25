import { createElement } from "react";
import { z } from "zod";

import { PageBuilderRestaurantMenuDrawerTypeSection } from "../../components/sections/PageBuilderRestaurantMenuDrawerTypeSection";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const restaurantMenuDrawerTypeIntroSchema = z.object({
  heading: z.string().min(1, "Section heading is required."),
  description: z.string().min(1, "Section description is required."),
  buttonLabel: z.string().default(""),
  buttonTarget: z.string().default(""),
  imageUrl: z.string().default(""),
  imageAlt: z.string().default(""),
});

export const restaurantMenuDrawerTypeCollectionSchema = z.object({
  visualUrl: z.string().optional(),
  collectionTitle: z.string().min(1, "Collection title is required."),
  collectionDescription: z.string().min(1, "Collection description is required."),
  buttonLabel: z.string().min(1, "Collection button label is required."),
  wooCategoryIds: z.array(z.number().int().positive()).min(1, "At least one Woo category id is required."),
});

export const restaurantMenuDrawerTypeDataSchema = z.object({
  intro: restaurantMenuDrawerTypeIntroSchema,
  collections: z.array(restaurantMenuDrawerTypeCollectionSchema).default([]),
});

export type RestaurantMenuDrawerTypeData = z.infer<typeof restaurantMenuDrawerTypeDataSchema>;

export const restaurantMenuDrawerTypeDefaultData: RestaurantMenuDrawerTypeData =
  restaurantMenuDrawerTypeDataSchema.parse({
    intro: {
      heading: "Our Services",
      description:
        "From intimate chef's table experiences to grand private events, we offer a range of curated menu collections that open into live WooCommerce-powered drawers.",
      buttonLabel: "VIEW ALL SERVICES",
      buttonTarget: "/oferta",
      imageUrl: "/react/images/about_front.jpg",
      imageAlt: "Pionowe ujecie restauracyjnego wnetrza",
    },
    collections: [
      {
        visualUrl: "/react/images/about_front.jpg",
        collectionTitle: "TASTING MENU",
        collectionDescription:
          "Seasonal tasting sequences presented as curated drawer collections sourced from WooCommerce categories.",
        buttonLabel: "Open tasting menu",
        wooCategoryIds: [84, 85],
      },
      {
        visualUrl: "/react/images/about_front.jpg",
        collectionTitle: "WINE PAIRINGS",
        collectionDescription:
          "Pairing-focused collections that can stack multiple categories in one drawer flow.",
        buttonLabel: "Open pairings",
        wooCategoryIds: [86],
      },
      {
        collectionTitle: "PRIVATE EVENTS",
        collectionDescription:
          "Event collections can omit the card image and still open the same drawer treatment without empty visual placeholders.",
        buttonLabel: "Open events",
        wooCategoryIds: [87, 88, 89],
      },
    ],
  });

export const restaurantMenuDrawerTypeExampleData: readonly RestaurantMenuDrawerTypeData[] = [
  restaurantMenuDrawerTypeDefaultData,
  restaurantMenuDrawerTypeDataSchema.parse({
    intro: {
      heading: "Collection Drawer",
      description:
        "Top-level intro copy stays constant while each clicked collection drives the WooCommerce categories rendered below the divider.",
      buttonLabel: "",
      buttonTarget: "",
      imageUrl: "",
      imageAlt: "",
    },
    collections: [
      {
        visualUrl: "/react/images/about_front.jpg",
        collectionTitle: "BRUNCH",
        collectionDescription: "Two Woo categories can appear as two sequential drawer sections.",
        buttonLabel: "Open brunch",
        wooCategoryIds: [21, 22],
      },
    ],
  }),
];

export const restaurantMenuDrawerTypeBlockDefinition: PageBuilderBlockDefinition<
  typeof restaurantMenuDrawerTypeDataSchema
> = {
  blockKey: "restaurant_menu_drawer_type",
  version: 1,
  name: "Restaurant Menu Drawer Type",
  description:
    "Sticky descriptive intro with repeatable collection cards that open a side drawer populated by ordered WooCommerce category ids.",
  schema: restaurantMenuDrawerTypeDataSchema,
  defaultData: restaurantMenuDrawerTypeDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "PageBuilderRestaurantMenuDrawerTypeSection",
    componentImportPath: "src/components/sections/PageBuilderRestaurantMenuDrawerTypeSection.tsx",
    notes:
      "Wraps the standalone RestaurantMenuDrawerType UI and resolves drawer sections from collection-level Woo category ids.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as RestaurantMenuDrawerTypeData;

      return createElement(PageBuilderRestaurantMenuDrawerTypeSection, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: restaurantMenuDrawerTypeExampleData,
  tags: ["menu", "drawer", "collections", "woo", "content"],
};