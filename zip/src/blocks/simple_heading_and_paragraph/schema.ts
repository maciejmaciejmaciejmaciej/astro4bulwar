import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_SIMPLE_HEADING_AND_PARAGRAPH_CONTENT,
  SimpleHeadingAndParagraph,
  type SimpleHeadingAndParagraphContent,
} from "../../components/sections/SimpleHeadingAndParagraph";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const simpleHeadingAndParagraphDataSchema = z.object({
  eyebrow: z.string().min(1, "Eyebrow is required."),
  title: z.string().min(1, "Title is required."),
  richTextHtml: z.string().min(1, "Rich-text HTML is required."),
});

export type SimpleHeadingAndParagraphData = SimpleHeadingAndParagraphContent;

export const simpleHeadingAndParagraphDefaultData: SimpleHeadingAndParagraphData =
  simpleHeadingAndParagraphDataSchema.parse(DEFAULT_SIMPLE_HEADING_AND_PARAGRAPH_CONTENT);

export const simpleHeadingAndParagraphExampleData: readonly SimpleHeadingAndParagraphData[] = [
  simpleHeadingAndParagraphDefaultData,
  simpleHeadingAndParagraphDataSchema.parse({
    eyebrow: "Polityka prywatności",
    title: "Informacja o przetwarzaniu danych",
    richTextHtml:
      "<p><strong>Dbamy o przejrzystosc</strong> zasad przetwarzania danych osobowych i opisujemy je bezposrednio w tej sekcji.</p><p>Blok jest direct-edit only, dlatego caly tekst pozostaje w jednym polu rich-text HTML.</p><ol><li>cele przetwarzania</li><li>podstawy prawne</li><li>czas przechowywania danych</li></ol>",
  }),
];

export const simpleHeadingAndParagraphBlockDefinition: PageBuilderBlockDefinition<
  typeof simpleHeadingAndParagraphDataSchema
> = {
  blockKey: "simple_heading_and_paragraph",
  version: 1,
  name: "Simple Heading And Paragraph",
  description:
    "Direct-edit editorial/privacy block with eyebrow, large heading, darker divider, and one rich-text HTML body.",
  schema: simpleHeadingAndParagraphDataSchema,
  defaultData: simpleHeadingAndParagraphDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "SimpleHeadingAndParagraph",
    componentImportPath: "src/components/sections/SimpleHeadingAndParagraph.tsx",
    notes:
      "Derived from the Project10 header geometry, but reduced to a single-column direct-edit contract with one HTML content body.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as SimpleHeadingAndParagraphData;

      return createElement(SimpleHeadingAndParagraph, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: simpleHeadingAndParagraphExampleData,
  tags: ["header", "editorial", "legal", "content"],
};