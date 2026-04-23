import assert from "node:assert/strict";
import test from "node:test";

import {
  CHECKOUT_SUCCESS_SNAPSHOT_MAX_AGE_MS,
  CHECKOUT_SUCCESS_SNAPSHOT_STORAGE_KEY,
  clearCheckoutSuccessSnapshot,
  loadCheckoutSuccessSnapshot,
  readCheckoutSuccessSnapshot,
  serializeCheckoutSuccessSnapshot,
  writeCheckoutSuccessSnapshot,
  type CheckoutSuccessSnapshotData,
  type PersistedCheckoutSuccessSnapshot,
} from "./checkoutSuccessSnapshot";

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

const buildSnapshotData = (): CheckoutSuccessSnapshotData => ({
  orderNumber: "BUL/123/2026",
  items: [
    {
      lineId: "simple:14",
      lineType: "simple",
      name: "Barszcz czerwony",
      quantity: 2,
      weight: "500 ml",
      lineTotal: 38,
    },
    {
      lineId: "special_menu_for_2:abc",
      lineType: "special_menu_for_2",
      name: "Menu dla dwojga",
      quantity: 1,
      lineTotal: 169,
      summaryLines: ["Osoba 1: Zupa A / Danie A", "Osoba 2: Zupa B / Danie B"],
    },
  ],
  itemCount: 3,
  itemsSubtotal: 207,
  deliveryFee: 12,
  grandTotal: 219,
  paymentMethodLabel: "Płatność przy odbiorze",
  fulfillmentTypeLabel: "Dostawa",
  fulfillmentTermLabel: "piątek, 27.03",
  fulfillmentSlotLabel: "12:00-13:00",
  customerEmail: "jan@example.com",
  address: "ul. Główna 12",
});

test("loadCheckoutSuccessSnapshot returns missing when storage is empty", () => {
  assert.deepEqual(loadCheckoutSuccessSnapshot(null), {
    status: "missing",
    snapshot: null,
    shouldClear: false,
  });
});

test("serialize and load hydrate a minimal persisted success snapshot with derived copy text", () => {
  const persistedSnapshot: PersistedCheckoutSuccessSnapshot = {
    ...buildSnapshotData(),
    createdAt: "2026-03-26T10:00:00.000Z",
  };

  const rawValue = serializeCheckoutSuccessSnapshot(persistedSnapshot);
  const parsedRawValue = JSON.parse(rawValue) as Record<string, unknown>;
  const result = loadCheckoutSuccessSnapshot(rawValue, new Date("2026-03-26T10:30:00.000Z"));

  assert.equal(parsedRawValue.createdAt, persistedSnapshot.createdAt);
  assert.equal("copyText" in parsedRawValue, false);
  assert.equal("phone" in parsedRawValue, false);
  assert.equal("fullName" in parsedRawValue, false);
  assert.equal(result.status, "ready");
  assert.ok(result.snapshot);
  assert.equal(result.snapshot.createdAt, persistedSnapshot.createdAt);
  assert.match(result.snapshot.copyText, /Numer zamówienia: BUL\/123\/2026/);
  assert.match(result.snapshot.copyText, /Adres: ul\. Główna 12/);
});

test("readCheckoutSuccessSnapshot clears stale snapshots after the retention window", () => {
  const storage = new MemoryStorage();
  const snapshot = buildSnapshotData();
  const staleNow = new Date("2026-03-25T10:00:00.001Z");

  writeCheckoutSuccessSnapshot(storage, snapshot, new Date("2026-03-24T10:00:00.000Z"));

  const result = readCheckoutSuccessSnapshot(storage, staleNow);

  assert.equal(result.status, "stale");
  assert.equal(result.snapshot, null);
  assert.equal(storage.getItem(CHECKOUT_SUCCESS_SNAPSHOT_STORAGE_KEY), null);
});

test("writeCheckoutSuccessSnapshot replaces any previous snapshot under the dedicated key", () => {
  const storage = new MemoryStorage();

  const firstSnapshot = writeCheckoutSuccessSnapshot(
    storage,
    buildSnapshotData(),
    new Date("2026-03-26T10:00:00.000Z"),
  );

  const secondSnapshot = writeCheckoutSuccessSnapshot(
    storage,
    {
      ...buildSnapshotData(),
      orderNumber: "BUL/124/2026",
      fulfillmentTypeLabel: "Odbiór osobisty",
      address: undefined,
    },
    new Date("2026-03-26T10:05:00.000Z"),
  );

  const result = readCheckoutSuccessSnapshot(storage, new Date("2026-03-26T10:06:00.000Z"));

  assert.equal(firstSnapshot.orderNumber, "BUL/123/2026");
  assert.equal(secondSnapshot.orderNumber, "BUL/124/2026");
  assert.equal(result.status, "ready");
  assert.equal(result.snapshot?.orderNumber, "BUL/124/2026");
  assert.equal(result.snapshot?.address, undefined);
});

test("clearCheckoutSuccessSnapshot removes the dedicated storage key", () => {
  const storage = new MemoryStorage();

  writeCheckoutSuccessSnapshot(storage, buildSnapshotData(), new Date("2026-03-26T10:00:00.000Z"));
  clearCheckoutSuccessSnapshot(storage);

  assert.equal(storage.getItem(CHECKOUT_SUCCESS_SNAPSHOT_STORAGE_KEY), null);
});