import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { ProductItemAlt } from "./ProductItemAlt";

test("ProductItemAlt widens the structured desktop split layout while keeping mobile stacking", () => {
  const markup = renderToStaticMarkup(
    <ProductItemAlt
      productId={101}
      productName="Żurek"
      productDescriptionHtml="<p>Z białą kiełbasą</p>"
      weight="500 ml"
      price="39 PLN"
      cartQuantity={2}
      onAddToCart={() => {}}
    />,
  );

  assert.match(markup, /md:grid-cols-\[minmax\(0,1\.7fr\)_56px_minmax\(0,1fr\)\]/);
  assert.match(markup, /flex flex-col pr-0 md:pr-0/);
  assert.match(markup, /md:hidden mt-4 flex w-full flex-col gap-4/);
  assert.match(markup, /flex flex-wrap items-center justify-between gap-x-4 gap-y-2/);
  assert.match(markup, /hidden md:flex flex-row items-center w-full mb-4/);
  assert.doesNotMatch(markup, /items-end shrink-0 md:hidden ml-4/);
});

test("ProductItemAlt keeps the combined desktop layout unchanged", () => {
  const markup = renderToStaticMarkup(
    <ProductItemAlt
      productId={202}
      combinedText="Schab pieczony z dodatkami"
      weight="250 g"
      price="29 PLN"
      onAddToCart={() => {}}
    />,
  );

  assert.match(markup, /md:grid-cols-3/);
  assert.match(markup, /menu-leader/);
  assert.doesNotMatch(markup, /md:grid-cols-\[minmax\(0,1\.7fr\)_56px_minmax\(0,1fr\)\]/);
});