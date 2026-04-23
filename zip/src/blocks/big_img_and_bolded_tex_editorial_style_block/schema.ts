import { createElement } from "react";

import { Promo3 } from "../../../components/Promo3";

import {
  promo3DataSchema,
  promo3DefaultData,
  promo3ExampleData,
  type Promo3Data,
} from "../promo3/schema";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const bigImgAndBoldedTexEditorialStyleBlockDefinition: PageBuilderBlockDefinition<
  typeof promo3DataSchema
> = {
  blockKey: "big_img_and_bolded_tex_editorial_style_block",
  version: 1,
  name: "Big Img And Bolded Text Editorial Style Block",
  description:
    "Direct-edit editorial block with one tall portrait image and one bold lead text block using the Promo3 composition.",
  schema: promo3DataSchema,
  defaultData: promo3DefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "Promo3",
    componentImportPath: "components/Promo3.tsx",
    notes:
      "Content-only block that reuses the Promo3 image-plus-editorial-copy composition under the requested business key.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as Promo3Data;

      return createElement(Promo3, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: promo3ExampleData,
  tags: ["editorial", "image", "story", "content"],
};