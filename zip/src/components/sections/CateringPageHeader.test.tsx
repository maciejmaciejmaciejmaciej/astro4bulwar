import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { CateringPageHeader } from "./CateringPageHeader";

test("CateringPageHeader renders the sticky BulwaR return header", () => {
  const markup = renderToStaticMarkup(
    <CateringPageHeader
      logoSrc="/react/images/logo.png"
      homeHref="https://bulwarrestauracja.pl"
      returnLabel="<-powrót do strony głównej"
    />,
  );

  assert.match(markup, /sticky top-0/);
  assert.match(markup, /https:\/\/bulwarrestauracja\.pl/);
  assert.match(markup, /&lt;-powrót do strony głównej/);
  assert.match(markup, /Restauracja Bulwar Poznań/);
});