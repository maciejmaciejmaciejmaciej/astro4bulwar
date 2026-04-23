import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { CateringProductListAlt } from "./CateringProductListAlt";

const products = [
  {
    id: 1,
    contentMode: "split" as const,
    productName: "Barszcz",
    productDescriptionHtml: "<p>Z uszkami</p>",
    weight: "450 ml",
    price: 29,
    priceLabel: "29 PLN",
    vegan: false,
    vegetarian: false,
    dietaryTag: null,
  },
];

test("CateringProductListAlt uses mobile overlay copy inside image and a shallower mobile card overlap", () => {
  const markup = renderToStaticMarkup(
    <CateringProductListAlt
      title="Zupy"
      description="Rozgrzewające klasyki"
      products={products}
      bgImage="/react/images/example.jpg"
    />,
  );

  assert.match(markup, /absolute inset-x-0 top-1\/2 z-10 -translate-y-1\/2 px-8 md:px-10/);
  assert.match(markup, /md:hidden font-headline text-2xl/);
  assert.match(markup, /md:hidden max-w-3xl font-body text-sm leading-relaxed text-white\/90/);
  assert.match(markup, /relative z-30 -mt-10 md:-mt-\[220px\]/);
  assert.match(markup, /translate-y-0 md:translate-y-\[var\(--category-panel-y\)\] pb-16 md:pb-24/);
  assert.match(markup, /font-headline text-2xl md:text-3xl[\s\S]*hidden md:block/);
});