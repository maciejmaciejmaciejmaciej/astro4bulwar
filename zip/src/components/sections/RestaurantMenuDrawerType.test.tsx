import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  DEFAULT_RESTAURANT_MENU_DRAWER_TYPE_CONTENT,
  RestaurantMenuDrawerType,
} from "./RestaurantMenuDrawerType";

test("RestaurantMenuDrawerType renders the duplicated section shell with intro image and cards", () => {
  const markup = renderToStaticMarkup(<RestaurantMenuDrawerType />);

  assert.match(markup, /data-section-id="restaurant_menu_drawer_type"/);
  assert.match(markup, /Our Services/);
  assert.match(markup, /about_front\.jpg/);
  assert.equal(DEFAULT_RESTAURANT_MENU_DRAWER_TYPE_CONTENT.cards.length, 5);
  assert.equal(
    markup.match(/break-inside-avoid group relative flex w-full cursor-pointer flex-col overflow-hidden bg-surface p-10 text-left transition-colors duration-500 hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/g)?.length,
    5,
  );
  assert.doesNotMatch(markup, /VIEW ALL SERVICES/);
  assert.equal(markup.match(/<img/g)?.length, 1);
  assert.match(markup, /role="dialog"/);
  assert.match(markup, /translate-x-full pointer-events-none/);
  assert.match(markup, /STARTERS/);
  assert.match(markup, /MAINS/);
  assert.match(markup, /Beef Tartare/);
  assert.match(markup, /Chocolate Delice/);
});

test("RestaurantMenuDrawerType renders custom content without falling back to defaults", () => {
  const markup = renderToStaticMarkup(
    <RestaurantMenuDrawerType
      className="preview-shell"
      content={{
        title: "Restaurant Menu Drawer Type",
        introImage: {
          src: "/react/images/custom-preview.jpg",
          alt: "Custom preview image",
        },
        cards: [
          {
            icon: "lunch_dining",
            title: "SEASONAL LUNCH",
            description: "Short midday format with rotating weekly plates.",
            ctaText: "Open Lunch",
            ctaHref: "/lunch",
          },
        ],
      }}
    />,
  );

  assert.match(markup, /preview-shell/);
  assert.match(markup, /Restaurant Menu Drawer Type/);
  assert.match(markup, /custom-preview\.jpg/);
  assert.match(markup, /SEASONAL LUNCH/);
  assert.match(markup, /Short midday format with rotating weekly plates\./);
  assert.match(markup, /Open Lunch/);
  assert.doesNotMatch(markup, /FINE DINING/);
});