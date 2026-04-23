import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { CateringStickyCartControls } from "./CateringStickyCartControls";

test("CateringStickyCartControls renders fixed desktop and mobile cart triggers with total count", () => {
  const markup = renderToStaticMarkup(
    <CateringStickyCartControls onOpenCart={() => {}} itemCount={7} totalPrice={213.4} />,
  );

  assert.match(markup, /fixed inset-x-0 bottom-0/);
  assert.match(markup, /fixed bottom-5 right-5/);
  assert.match(markup, /absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600/);
  assert.match(markup, /font-label text-\[10px\] font-bold leading-6 text-white/);
  assert.match(markup, />7 szt\.<\/span>/);
  assert.match(markup, />7<\/span>/);
  assert.match(markup, /213\.40 zł/);
});

test("CateringStickyCartControls hides the mobile FAB badge when the cart is empty", () => {
  const markup = renderToStaticMarkup(
    <CateringStickyCartControls onOpenCart={() => {}} itemCount={0} totalPrice={0} />,
  );

  assert.doesNotMatch(markup, /absolute -right-1 -top-1/);
});