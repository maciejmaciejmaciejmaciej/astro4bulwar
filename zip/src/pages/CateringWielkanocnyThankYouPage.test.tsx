import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import CateringWielkanocnyThankYouPage from "./CateringWielkanocnyThankYouPage";
import { CATERING_WIELKANOCNY_THANK_YOU_PATH } from "../lib/cateringThankYou";
import { writeCheckoutSuccessSnapshot } from "../lib/checkoutSuccessSnapshot";

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

const buildWindowStub = (localStorage: MemoryStorage) => ({ localStorage });

test("CateringWielkanocnyThankYouPage renders the persisted order summary when a valid snapshot exists", () => {
  const storage = new MemoryStorage();
  const now = new Date();

  writeCheckoutSuccessSnapshot(
    storage,
    {
      orderNumber: "BUL/555/2026",
      items: [
        {
          lineId: "simple:14",
          lineType: "simple",
          name: "Barszcz czerwony",
          quantity: 2,
          weight: "500 ml",
          lineTotal: 38,
        },
      ],
      itemCount: 2,
      itemsSubtotal: 38,
      deliveryFee: 0,
      grandTotal: 38,
      paymentMethodLabel: "Płatność przy odbiorze",
      fulfillmentTypeLabel: "Odbiór osobisty",
      fulfillmentTermLabel: "piątek, 27.03",
      fulfillmentSlotLabel: "12:00-13:00",
      customerEmail: "jan@example.com",
    },
    now,
  );

  const previousWindow = (globalThis as { window?: unknown }).window;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: buildWindowStub(storage),
  });

  try {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={[CATERING_WIELKANOCNY_THANK_YOU_PATH]}>
        <CateringWielkanocnyThankYouPage />
      </MemoryRouter>,
    );

    assert.match(markup, /Zamówienie potwierdzone/);
    assert.match(markup, /BUL\/555\/2026/);
    assert.match(markup, /Barszcz czerwony/);
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: previousWindow,
    });
  }
});

test("CateringWielkanocnyThankYouPage shows a controlled fallback when snapshot is missing", () => {
  const previousWindow = (globalThis as { window?: unknown }).window;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: buildWindowStub(new MemoryStorage()),
  });

  try {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={[CATERING_WIELKANOCNY_THANK_YOU_PATH]}>
        <CateringWielkanocnyThankYouPage />
      </MemoryRouter>,
    );

    assert.match(markup, /Dziekujemy za zamowienie/);
    assert.match(markup, /Szczegolowe podsumowanie nie jest juz dostepne w tej przegladarce/);
    assert.match(markup, /WROC DO CATERINGU/);
    assert.doesNotMatch(markup, /Brak aktywnego podsumowania zamówienia/);
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: previousWindow,
    });
  }
});

test("CateringWielkanocnyThankYouPage shows the same positive fallback when snapshot is stale", () => {
  const storage = new MemoryStorage();

  writeCheckoutSuccessSnapshot(
    storage,
    {
      orderNumber: "BUL/556/2026",
      items: [
        {
          lineId: "simple:15",
          lineType: "simple",
          name: "Pasztet",
          quantity: 1,
          weight: "500 g",
          lineTotal: 29,
        },
      ],
      itemCount: 1,
      itemsSubtotal: 29,
      deliveryFee: 0,
      grandTotal: 29,
      paymentMethodLabel: "Płatność przy odbiorze",
      fulfillmentTypeLabel: "Odbiór osobisty",
      fulfillmentTermLabel: "piątek, 27.03",
      fulfillmentSlotLabel: "12:00-13:00",
      customerEmail: "jan@example.com",
    },
    new Date("2020-03-26T10:00:00.000Z"),
  );

  const previousWindow = (globalThis as { window?: unknown }).window;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: buildWindowStub(storage),
  });

  try {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={[CATERING_WIELKANOCNY_THANK_YOU_PATH]}>
        <CateringWielkanocnyThankYouPage />
      </MemoryRouter>,
    );

    assert.match(markup, /Dziekujemy za zamowienie/);
    assert.match(markup, /Zapisane podsumowanie wygaslo w tej przegladarce/);
    assert.match(markup, /WROC DO CATERINGU/);
    assert.doesNotMatch(markup, /To podsumowanie wygasło/);
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: previousWindow,
    });
  }
});