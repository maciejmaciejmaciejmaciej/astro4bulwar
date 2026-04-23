import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  DEFAULT_PROMO3_CONTENT,
  Promo3,
} from "./Promo3";

test("Promo3 keeps a portrait image on the left and the main story copy on the right", () => {
  const markup = renderToStaticMarkup(<Promo3 />);

  assert.match(markup, /Portrait editorial image/);
  assert.match(markup, /grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16/);
  assert.match(markup, /w-1\/2 max-w-\[400px\] aspect-\[1\/2\] rounded-\[4px\] object-cover/);
  assert.match(markup, /lead-copy text-on-surface/);
  assert.doesNotMatch(markup, /<h1/);
  assert.doesNotMatch(markup, /Our Crew, Our story/);
  assert.doesNotMatch(markup, /John Doe/);
  assert.equal(DEFAULT_PROMO3_CONTENT.title, "Our story");
});

test("Promo3 renders custom content without the legacy team rows", () => {
  const markup = renderToStaticMarkup(
    <Promo3
      className="promo3-shell"
      content={{
        title: "Seasonal story",
        story: "This variant keeps only the editorial copy block and a portrait image.",
        image: {
          src: "/react/images/promo3.jpg",
          alt: "Seasonal portrait",
        },
      }}
    />,
  );

  assert.match(markup, /promo3-shell/);
  assert.match(markup, /Seasonal portrait/);
  assert.match(markup, /This variant keeps only the editorial copy block and a portrait image\./);
  assert.doesNotMatch(markup, /Seasonal story/);
  assert.doesNotMatch(markup, /Creative Director/);
});