import test from "node:test";
import assert from "node:assert/strict";

import { parseSpecialMenuFor2SummaryLine } from "./specialMenuFor2Summary";

test("parseSpecialMenuFor2SummaryLine returns grouped bullet-ready content", () => {
  assert.deepEqual(
    parseSpecialMenuFor2SummaryLine("Osoba 1: Zupa Barszcz czerwony / Danie Kaczka pieczona"),
    {
      personLabel: "Osoba 1",
      items: ["Zupa: Barszcz czerwony", "Danie główne: Kaczka pieczona"],
    },
  );
});

test("parseSpecialMenuFor2SummaryLine returns null for non-special text", () => {
  assert.equal(parseSpecialMenuFor2SummaryLine("Dowolna linia opisu produktu"), null);
});