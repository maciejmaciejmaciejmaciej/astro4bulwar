import test from "node:test";
import assert from "node:assert/strict";

import {
  SPECIAL_MENU_FOR_2_SCHEMA_VERSION,
  buildSpecialMenuFor2Config,
  buildSpecialMenuFor2SummaryString,
  buildSpecialMenuPersonSummary,
  cateringSpecialMenuFor2Seed,
  isSpecialMenuFor2Config,
  resolveSpecialMenuFor2UnitPrice,
  resolveSpecialMenuFor2UnitPriceLabel,
  type SpecialMenuFor2Config,
} from "./cateringSpecialMenuFor2";

test("cateringSpecialMenuFor2 exposes explicit product options for the special set", () => {
  assert.equal(cateringSpecialMenuFor2Seed.schemaVersion, SPECIAL_MENU_FOR_2_SCHEMA_VERSION);
  assert.equal(cateringSpecialMenuFor2Seed.soups.length, 3);
  assert.equal(cateringSpecialMenuFor2Seed.mains.length, 3);
  assert.ok(cateringSpecialMenuFor2Seed.soups.every((option) => option.categoryKey === "soups"));
  assert.ok(cateringSpecialMenuFor2Seed.mains.every((option) => option.categoryKey === "mains"));
  assert.equal(cateringSpecialMenuFor2Seed.shellProduct.unitPrice, 169);
  assert.equal(cateringSpecialMenuFor2Seed.shellProduct.unitPriceLabel, "169 PLN");
  assert.equal(cateringSpecialMenuFor2Seed.imageUrl, "/react/images/zestaw-obiad-dla-2-osob.webp");
  assert.match(cateringSpecialMenuFor2Seed.soups[0].optionId, /^soups:/);
  assert.match(cateringSpecialMenuFor2Seed.mains[0].optionId, /^mains:/);
  assert.deepEqual(
    cateringSpecialMenuFor2Seed.soups.map((option) => option.weight),
    ["0,25 l", "0,25 l", "0,25 l"],
  );
  assert.deepEqual(
    cateringSpecialMenuFor2Seed.mains.map((option) => option.weight),
    [
      "1 szt. / 150 gr / 150 gr",
      "1 noga z kaczki / 2 pyzy / 100 ml",
      "1 zraz / 150 gr / 100 ml / 150 gr",
    ],
  );
  assert.doesNotMatch(cateringSpecialMenuFor2Seed.mains[1].weight, /1 szt\.|2 nogi|0,5 l/);
  assert.doesNotMatch(cateringSpecialMenuFor2Seed.mains[2].weight, /1 szt\.|2 zrazy|0,5 l/);
});

test("special menu summary helpers return bridge-friendly human readable text", () => {
  const config: SpecialMenuFor2Config = {
    kind: "menu_for_2",
    schemaVersion: SPECIAL_MENU_FOR_2_SCHEMA_VERSION,
    persons: [
      {
        personIndex: 1,
        soupOptionId: cateringSpecialMenuFor2Seed.soups[0].optionId,
        soupLabel: cateringSpecialMenuFor2Seed.soups[0].label,
        mainOptionId: cateringSpecialMenuFor2Seed.mains[0].optionId,
        mainLabel: cateringSpecialMenuFor2Seed.mains[0].label,
      },
      {
        personIndex: 2,
        soupOptionId: cateringSpecialMenuFor2Seed.soups[1].optionId,
        soupLabel: cateringSpecialMenuFor2Seed.soups[1].label,
        mainOptionId: cateringSpecialMenuFor2Seed.mains[1].optionId,
        mainLabel: cateringSpecialMenuFor2Seed.mains[1].label,
      },
    ],
  };

  assert.equal(isSpecialMenuFor2Config(config), true);
  assert.match(buildSpecialMenuPersonSummary(config.persons[0]), /^Osoba 1: Zupa /);
  assert.match(buildSpecialMenuFor2SummaryString(config), /Osoba 2: Zupa /);
  assert.match(buildSpecialMenuFor2SummaryString(config), /Danie /);
});

test("buildSpecialMenuFor2Config returns a two-person versioned config from selected option ids", () => {
  const config = buildSpecialMenuFor2Config({
    person1SoupOptionId: cateringSpecialMenuFor2Seed.soups[0].optionId,
    person1MainOptionId: cateringSpecialMenuFor2Seed.mains[0].optionId,
    person2SoupOptionId: cateringSpecialMenuFor2Seed.soups[1].optionId,
    person2MainOptionId: cateringSpecialMenuFor2Seed.mains[1].optionId,
  });

  assert.ok(config);
  assert.equal(config?.persons[0].personIndex, 1);
  assert.equal(config?.persons[1].personIndex, 2);
  assert.equal(config?.persons[0].soupOptionId, cateringSpecialMenuFor2Seed.soups[0].optionId);
  assert.equal(config?.persons[1].mainOptionId, cateringSpecialMenuFor2Seed.mains[1].optionId);
});

test("resolveSpecialMenuFor2UnitPrice uses the fixed shell price for the special set", () => {
  const config = buildSpecialMenuFor2Config({
    person1SoupOptionId: cateringSpecialMenuFor2Seed.soups[0].optionId,
    person1MainOptionId: cateringSpecialMenuFor2Seed.mains[0].optionId,
    person2SoupOptionId: cateringSpecialMenuFor2Seed.soups[1].optionId,
    person2MainOptionId: cateringSpecialMenuFor2Seed.mains[1].optionId,
  });

  assert.ok(config);
  assert.equal(resolveSpecialMenuFor2UnitPrice(config as SpecialMenuFor2Config), 169);
  assert.equal(resolveSpecialMenuFor2UnitPriceLabel(config as SpecialMenuFor2Config), "169 PLN");
});