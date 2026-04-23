import test from "node:test";
import assert from "node:assert/strict";

import { cateringWielkanocnyCategories } from "../data/cateringWielkanocny";
import {
  SPECIAL_MENU_FOR_2_SCHEMA_VERSION,
  cateringSpecialMenuFor2Seed,
  type SpecialMenuFor2Config,
} from "../data/cateringSpecialMenuFor2";
import {
  addSimpleProductLine,
  addSpecialMenuFor2Line,
  buildCheckoutDrawerItems,
  createCateringProductLookup,
  createEmptyCateringCartState,
  getSimpleProductQuantities,
  loadCateringCartState,
  setCartLineQuantity,
} from "./cateringCart";

const productLookup = createCateringProductLookup(cateringWielkanocnyCategories);
const firstSoup = cateringSpecialMenuFor2Seed.soups[0];
const secondSoup = cateringSpecialMenuFor2Seed.soups[1];
const firstMain = cateringSpecialMenuFor2Seed.mains[0];
const secondMain = cateringSpecialMenuFor2Seed.mains[1];

const buildConfig = (): SpecialMenuFor2Config => ({
  kind: "menu_for_2",
  schemaVersion: SPECIAL_MENU_FOR_2_SCHEMA_VERSION,
  persons: [
    {
      personIndex: 1,
      soupOptionId: firstSoup.optionId,
      soupLabel: firstSoup.label,
      mainOptionId: firstMain.optionId,
      mainLabel: firstMain.label,
    },
    {
      personIndex: 2,
      soupOptionId: secondSoup.optionId,
      soupLabel: secondSoup.label,
      mainOptionId: secondMain.optionId,
      mainLabel: secondMain.label,
    },
  ],
});

test("loadCateringCartState migrates the legacy productId quantity map into v2 lines", () => {
  const migrated = loadCateringCartState(JSON.stringify({ 14: 2, 27: 1, bad: 0 }), productLookup);

  assert.equal(migrated.version, 2);
  assert.equal(migrated.lines.length, 2);
  assert.deepEqual(getSimpleProductQuantities(migrated), { 14: 2, 27: 1 });

  const drawerItems = buildCheckoutDrawerItems(migrated);

  assert.equal(drawerItems[0]?.lineId, "simple:14");
  assert.equal(drawerItems[0]?.quantity, 2);
  assert.equal(drawerItems[1]?.lineId, "simple:27");
});

test("simple products still aggregate into one predictable line per product", () => {
  const product = productLookup.get(14);

  assert.ok(product);

  const once = addSimpleProductLine(createEmptyCateringCartState(), product, 1);
  const twice = addSimpleProductLine(once, product, 2);

  assert.equal(twice.lines.length, 1);
  assert.equal(getSimpleProductQuantities(twice)[14], 3);

  const updated = setCartLineQuantity(twice, "simple:14", 1);

  assert.equal(getSimpleProductQuantities(updated)[14], 1);
});

test("split-mode simple products fall back to productName for cart display items", () => {
  const product = productLookup.get(15);

  assert.ok(product);
  assert.equal(product.contentMode, "split");

  const cartState = addSimpleProductLine(createEmptyCateringCartState(), product, 1);
  const drawerItems = buildCheckoutDrawerItems(cartState);

  assert.equal(cartState.lines[0]?.displayName, "Barszcz bardzo czerwony");
  assert.equal(drawerItems[0]?.name, "Barszcz bardzo czerwony");
});

test("special menu lines stay distinct even when they share the same shell product", () => {
  const baseState = createEmptyCateringCartState();
  const withFirst = addSpecialMenuFor2Line(baseState, buildConfig(), cateringSpecialMenuFor2Seed);
  const withSecond = addSpecialMenuFor2Line(withFirst, buildConfig(), cateringSpecialMenuFor2Seed);

  assert.equal(withSecond.lines.length, 2);
  assert.notEqual(withSecond.lines[0]?.lineId, withSecond.lines[1]?.lineId);
  assert.equal(withSecond.lines[0]?.unitPrice, 169);
  assert.equal(withSecond.lines[1]?.unitPrice, 169);

  const drawerItems = buildCheckoutDrawerItems(withSecond);

  assert.ok(drawerItems.every((item) => item.quantity === 1));
  assert.ok(drawerItems.every((item) => item.quantityAdjustable === false));
  assert.ok(drawerItems.every((item) => item.summaryLines?.length === 2));
});