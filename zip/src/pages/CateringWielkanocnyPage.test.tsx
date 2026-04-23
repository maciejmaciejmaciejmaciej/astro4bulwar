import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import App from "../App";
import {
  cateringWielkanocnyCategories,
  cateringWielkanocnySource,
} from "../data/cateringWielkanocny";
import {
  CATERING_WIELKANOCNY_PATH,
  CATERING_WIELKANOCNY_TEST_PATH,
} from "../lib/cateringThankYou";

for (const routePath of [CATERING_WIELKANOCNY_PATH, CATERING_WIELKANOCNY_TEST_PATH]) {
  test(`CateringWielkanocnyPage renders the same chrome for ${routePath}`, () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={[routePath]}>
        <App />
      </MemoryRouter>,
    );

    assert.match(markup, /Restauracja Bulwar Poznań/);
    assert.match(markup, /Stary Rynek 37/);
    assert.match(markup, /www\.bulwarrestauracja\.pl/);
    assert.match(markup, /&lt;-powrót do strony głównej/);
    assert.doesNotMatch(markup, /ANDÉ|LOCATION|CONTACT|HOURS|hello@andecurator|787 5th Avenue/);
  });
}

test("cateringWielkanocny data prepends the breakfast-for-two category as a split-mode entry", () => {
  const firstRawCategory = cateringWielkanocnySource[0];
  const firstCategory = cateringWielkanocnyCategories[0];
  const firstProduct = firstCategory?.products[0];

  assert.equal(firstRawCategory?.category_id, 26);
  assert.equal(firstRawCategory?.nazwa_kategorii, "zestaw dla 2 osób");
  assert.equal(firstRawCategory?.pozycje.length, 1);
  assert.equal(firstRawCategory?.pozycje[0]?.product_id, 88);
  assert.equal(firstCategory?.title, "zestaw dla 2 osób");
  assert.equal(firstCategory?.products.length, 1);
  assert.ok(firstProduct);
  assert.equal(firstProduct.contentMode, "split");
  assert.equal(firstProduct.productName, "Śniadanie Wielkanocne dla 2 osób");
});

test("CateringWielkanocnyPage renders the breakfast-for-two category immediately after the standalone menu block", () => {
  const markup = renderToStaticMarkup(
    <MemoryRouter initialEntries={[CATERING_WIELKANOCNY_PATH]}>
      <App />
    </MemoryRouter>,
  );

  const standaloneIndex = markup.indexOf("Obiad Wielkanocny dla 2 osób");
  const breakfastIndex = markup.indexOf("zestaw dla 2 osób");
  const pieczywoIndex = markup.indexOf("Pieczywo");

  assert.notEqual(standaloneIndex, -1);
  assert.notEqual(breakfastIndex, -1);
  assert.notEqual(pieczywoIndex, -1);
  assert.ok(standaloneIndex < breakfastIndex);
  assert.ok(breakfastIndex < pieczywoIndex);
});