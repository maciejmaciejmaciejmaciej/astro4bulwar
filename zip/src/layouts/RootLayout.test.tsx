import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { GlobalLayoutData } from "../blocks/registry/globalLayoutContract";
import { GlobalLayoutFetchError } from "../lib/fetchWordPressGlobalLayout";
import {
  GLOBAL_LAYOUT_CACHE_KEY,
  RootLayout,
  resolveInitialGlobalLayout,
  shouldRetryGlobalLayoutLoad,
} from "./RootLayout";

const customGlobalLayout: GlobalLayoutData = {
  navbar: {
    brand: {
      name: "Bulwar Route Test",
      href: "/",
      logoSrc: null,
      logoAlt: null,
    },
    primaryItems: [
      {
        label: "Start testowy",
        href: "/",
        description: "Start dla testu layoutu.",
        children: [],
      },
    ],
    companyLinks: [],
    legalLinks: [],
  },
  footer: {
    brand: {
      name: "Bulwar Route Test",
      href: "/",
      logoSrc: null,
      logoAlt: null,
    },
    address: {
      heading: "Adres",
      lines: ["Aleja Route 9"],
    },
    contact: {
      heading: "Kontakt",
      items: [],
    },
    hours: {
      heading: "Godziny",
      lines: ["Codziennie"],
    },
    socialLinks: [],
    legalLinks: [
      {
        label: "Polityka routingu",
        href: "/polityka-routingu",
      },
    ],
    copyright: "(c) 2026 Bulwar Route Test.",
  },
};

type StorageStub = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

test("RootLayout renders one shared navbar footer and cart shell around nested route content", () => {
  const markup = renderToStaticMarkup(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<RootLayout initialGlobalLayout={customGlobalLayout} />}>
          <Route index element={<main><h1>Nested shared page</h1></main>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  assert.match(markup, /Nested shared page/);
  assert.match(markup, /Aleja Route 9/);
  assert.equal((markup.match(/Rozwiń koszyk/g) ?? []).length, 1);
  assert.equal((markup.match(/Polityka routingu/g) ?? []).length, 1);
});

test("RootLayout does not render placeholder business chrome before global layout fetch resolves", () => {
  const markup = renderToStaticMarkup(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<main><h1>Neutral shell route</h1></main>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  assert.match(markup, /Neutral shell route/);
  assert.equal((markup.match(/Rozwiń koszyk/g) ?? []).length, 1);
  assert.doesNotMatch(markup, /Stary Rynek 37/);
  assert.doesNotMatch(markup, /Przyjecia/);
  assert.doesNotMatch(markup, /rezerwacje@bulwarrestauracja\.pl/);
});

test("resolveInitialGlobalLayout restores the last known good session snapshot when available", () => {
  const storage: StorageStub = {
    getItem(key) {
      return key === GLOBAL_LAYOUT_CACHE_KEY ? JSON.stringify(customGlobalLayout) : null;
    },
    setItem() {
      throw new Error("setItem should not run during initial resolution");
    },
    removeItem() {
      throw new Error("removeItem should not run for a valid cached layout");
    },
  };

  assert.deepEqual(resolveInitialGlobalLayout(undefined, storage), customGlobalLayout);
});

test("resolveInitialGlobalLayout drops invalid cached layout snapshots instead of fabricating chrome", () => {
  const removedKeys: string[] = [];
  const storage: StorageStub = {
    getItem(key) {
      return key === GLOBAL_LAYOUT_CACHE_KEY ? '{"footer":{}}' : null;
    },
    setItem() {
      throw new Error("setItem should not run for an invalid cached layout");
    },
    removeItem(key) {
      removedKeys.push(key);
    },
  };

  assert.equal(resolveInitialGlobalLayout(undefined, storage), null);
  assert.deepEqual(removedKeys, [GLOBAL_LAYOUT_CACHE_KEY]);
});

test("shouldRetryGlobalLayoutLoad allows one delayed retry only for unresolved transient failures", () => {
  const transportError = new GlobalLayoutFetchError("fetch failed", {
    kind: "transport",
    retryable: true,
  });
  const metaStatusError = new GlobalLayoutFetchError("meta mismatch", {
    kind: "meta-status",
    retryable: false,
  });

  assert.equal(shouldRetryGlobalLayoutLoad({
    globalLayout: null,
    hasRetried: false,
    error: transportError,
  }), true);

  assert.equal(shouldRetryGlobalLayoutLoad({
    globalLayout: customGlobalLayout,
    hasRetried: false,
    error: transportError,
  }), false);

  assert.equal(shouldRetryGlobalLayoutLoad({
    globalLayout: null,
    hasRetried: true,
    error: transportError,
  }), false);

  assert.equal(shouldRetryGlobalLayoutLoad({
    globalLayout: null,
    hasRetried: false,
    error: metaStatusError,
  }), false);
});