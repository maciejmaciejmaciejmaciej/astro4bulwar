import { getBlock } from "./index";
import type { PageBuilderSchema } from "./pageBuilderSchema";

const renderSection = (section: PageBuilderSchema["sections"][number]) => {
  if (!section.enabled) {
    return null;
  }

  const block = getBlock(section.blockKey);

  if (!block?.runtime?.renderSection) {
    return null;
  }

  return block.runtime.renderSection(section);
};

export const renderPageBuilderSections = (schema: PageBuilderSchema) => {
  return schema.sections.map((section) => renderSection(section));
};
