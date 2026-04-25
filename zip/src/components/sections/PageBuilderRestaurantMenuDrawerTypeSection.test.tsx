import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { PageBuilderRestaurantMenuDrawerTypeSection } from "./PageBuilderRestaurantMenuDrawerTypeSection";

test("PageBuilderRestaurantMenuDrawerTypeSection maps block intro and collections into the shared drawer component", () => {
  const markup = renderToStaticMarkup(
    <PageBuilderRestaurantMenuDrawerTypeSection
      content={{
        intro: {
          heading: "Drawer Block Heading",
          description: "Drawer Block Description",
          buttonLabel: "Should stay hidden",
          buttonTarget: "",
          imageUrl: "",
          imageAlt: "",
        },
        collections: [
          {
            visualUrl: "/react/images/collection-breakfast.jpg",
            collectionTitle: "BREAKFAST",
            collectionDescription: "Morning menu section",
            buttonLabel: "Open breakfast",
            wooCategoryIds: [18, 24],
          },
        ],
      }}
      resolveSectionsByCategoryIds={async () => []}
    />,
  );

  assert.equal(markup.match(/Drawer Block Heading/g)?.length, 2);
  assert.equal(markup.match(/Drawer Block Description/g)?.length, 2);
  assert.match(markup, /collection-breakfast\.jpg/);
  assert.match(markup, /Open breakfast/);
  assert.doesNotMatch(markup, /Should stay hidden/);
});