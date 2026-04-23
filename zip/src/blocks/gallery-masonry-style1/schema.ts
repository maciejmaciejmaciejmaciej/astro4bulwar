import { createElement } from "react";
import { z } from "zod";

import { GallerySection } from "../../components/sections/GallerySection";
import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const galleryMasonryStyle1DataSchema = z.object({
  title: z.string().default("Galeria"),
  layoutStyle: z.literal("masonry-style1").default("masonry-style1"),
  motionPreset: z.literal("parallax-columns-soft").default("parallax-columns-soft"),
  images: z.array(imageAssetSchema).default([]),
});

export type GalleryMasonryStyle1Data = z.infer<typeof galleryMasonryStyle1DataSchema>;

export const galleryMasonryStyle1DefaultData: GalleryMasonryStyle1Data =
  galleryMasonryStyle1DataSchema.parse({
    title: "Galeria",
    layoutStyle: "masonry-style1",
    motionPreset: "parallax-columns-soft",
    images: [],
  });

export const galleryMasonryStyle1ExampleData: readonly GalleryMasonryStyle1Data[] = [
  galleryMasonryStyle1DataSchema.parse({
    title: "Galeria wydarzenia",
    images: [
      {
        src: "https://example.com/uploads/gallery-1.jpg",
        alt: "Wnetrze restauracji",
      },
      {
        src: "https://example.com/uploads/gallery-2.jpg",
        alt: "Detal zastawy",
      },
      {
        src: "https://example.com/uploads/gallery-3.jpg",
        alt: "Nakryty stol",
      },
      {
        src: "https://example.com/uploads/gallery-4.jpg",
        alt: "Oswietlenie sali",
      },
    ],
  }),
];

export const galleryMasonryStyle1BlockDefinition: PageBuilderBlockDefinition<
  typeof galleryMasonryStyle1DataSchema
> = {
  blockKey: "gallery-masonry-style1",
  version: 1,
  name: "Gallery Masonry Style 1",
  description: "Masonry-like gallery block with parallax column motion.",
  schema: galleryMasonryStyle1DataSchema,
  defaultData: galleryMasonryStyle1DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "GallerySection",
    componentImportPath: "src/components/sections/GallerySection.tsx",
    notes: "Adapter should map images[].src into the current component string[] prop shape.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as GalleryMasonryStyle1Data;

      return createElement(GallerySection, {
        key: section.id,
        title: data.title,
        images: data.images.map((image) => image.src),
      });
    },
  },
  exampleData: galleryMasonryStyle1ExampleData,
  tags: ["gallery", "masonry", "media"],
};
