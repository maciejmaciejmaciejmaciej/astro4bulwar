import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  DEFAULT_OUR_SERVICES_CONTENT,
  OurServices,
} from "./OurServices";

test("OurServices preserves the default section copy and five-card layout", () => {
  const markup = renderToStaticMarkup(<OurServices />);

  assert.equal(DEFAULT_OUR_SERVICES_CONTENT.cards.length, 5);
  assert.match(markup, /Our Services/);
  assert.match(markup, /VIEW ALL SERVICES/);
  assert.match(markup, /FINE DINING/);
  assert.match(markup, /WINE PAIRING/);
  assert.match(markup, /PRIVATE EVENTS/);
  assert.match(markup, /CHEF&#x27;S TABLE/);
  assert.match(markup, /ORGANIC SOURCING/);
  assert.equal(
    markup.match(/break-inside-avoid group relative overflow-hidden bg-surface p-10 flex flex-col transition-colors duration-500 hover:bg-surface-container-low/g)?.length,
    5,
  );
  assert.match(markup, /restaurant/);
  assert.match(markup, /wine_bar/);
  assert.match(markup, /celebration/);
  assert.match(markup, /ramen_dining/);
  assert.match(markup, /eco/);
});

test("OurServices renders custom structured content without falling back to defaults", () => {
  const markup = renderToStaticMarkup(
    <OurServices
      className="custom-shell"
      content={{
        title: "Custom Services",
        description: "Tailored dining formats for one-off page-builder usage.",
        primaryCta: {
          text: "See custom offer",
          href: "/custom-offer",
        },
        cards: [
          {
            icon: "local_dining",
            title: "CHEF POP-UP",
            description: "A temporary tasting format for private venues.",
            ctaText: "Explore Pop-Up",
            ctaHref: "/pop-up",
          },
        ],
      }}
    />,
  );

  assert.match(markup, /custom-shell/);
  assert.match(markup, /Custom Services/);
  assert.match(markup, /Tailored dining formats for one-off page-builder usage\./);
  assert.match(markup, /See custom offer/);
  assert.match(markup, /href="\/custom-offer"/);
  assert.match(markup, /CHEF POP-UP/);
  assert.match(markup, /Explore Pop-Up/);
  assert.match(markup, /href="\/pop-up"/);
  assert.doesNotMatch(markup, /FINE DINING/);
  assert.equal(
    markup.match(/break-inside-avoid group relative overflow-hidden bg-surface p-10 flex flex-col transition-colors duration-500 hover:bg-surface-container-low/g)?.length,
    1,
  );
});