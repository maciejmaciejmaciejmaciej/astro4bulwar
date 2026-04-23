import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { CateringProductSpecialMenuFor2 } from "./CateringProductSpecialMenuFor2";
import { cateringSpecialMenuFor2Seed } from "@/src/data/cateringSpecialMenuFor2";

test("CateringProductSpecialMenuFor2 renders the configured product image when available", () => {
  const markup = renderToStaticMarkup(
    <CateringProductSpecialMenuFor2
      seed={cateringSpecialMenuFor2Seed}
      configuredCount={0}
      onCommitConfiguredSet={() => {}}
    />,
  );

  assert.match(markup, /zestaw-obiad-dla-2-osob\.webp/);
  assert.match(markup, /object-cover/);
  assert.match(markup, /-mt-\[140px\]/);
  assert.match(markup, /Porcje widoczne przy opcjach podajemy na 1 osobę, np\./);
  assert.match(markup, /0,25 l zupy, 1 noga z kaczki, 1 zraz/);
});