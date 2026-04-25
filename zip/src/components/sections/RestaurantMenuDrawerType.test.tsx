import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  DEFAULT_RESTAURANT_MENU_DRAWER_TYPE_CONTENT,
  RestaurantMenuDrawerType,
} from "./RestaurantMenuDrawerType";

test("RestaurantMenuDrawerType renders the descriptive shell with intro copy, button, image and cards", () => {
  const markup = renderToStaticMarkup(<RestaurantMenuDrawerType />);

  assert.match(markup, /data-section-id="restaurant_menu_drawer_type"/);
  assert.match(markup, /Our Services/);
  assert.match(markup, /From intimate chef(?:&#x27;|')s table experiences to grand private events/);
  assert.match(markup, /VIEW ALL SERVICES/);
  assert.match(markup, /about_front\.jpg/);
  assert.equal(DEFAULT_RESTAURANT_MENU_DRAWER_TYPE_CONTENT.cards.length, 5);
  assert.equal(
    markup.match(/break-inside-avoid group relative flex w-full cursor-pointer flex-col overflow-hidden bg-surface p-10 text-left transition-colors duration-500 hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/g)?.length,
    5,
  );
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
        description: "Curated drawer preview with a single collection.",
        primaryCta: {
          text: "Browse menu",
        },
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
  assert.match(markup, /Curated drawer preview with a single collection\./);
  assert.match(markup, /custom-preview\.jpg/);
  assert.match(markup, /SEASONAL LUNCH/);
  assert.match(markup, /Short midday format with rotating weekly plates\./);
  assert.match(markup, /Open Lunch/);
  assert.doesNotMatch(markup, /Browse menu/);
  assert.doesNotMatch(markup, /FINE DINING/);
});

test("RestaurantMenuDrawerType hides the intro image and button when no url is provided", () => {
  const markup = renderToStaticMarkup(
    <RestaurantMenuDrawerType
      content={{
        title: "Drawer without media",
        description: "The intro area can collapse optional media and CTA cleanly.",
        primaryCta: {
          text: "Should stay hidden",
        },
        introImage: {
          alt: "Unused image",
        },
        cards: [
          {
            icon: "restaurant",
            title: "TASTING MENU",
            description: "Preview card content",
            ctaText: "Open drawer",
            ctaHref: "#",
          },
        ],
      }}
    />,
  );

  assert.match(markup, /Drawer without media/);
  assert.match(markup, /The intro area can collapse optional media and CTA cleanly\./);
  assert.doesNotMatch(markup, /Should stay hidden/);
  assert.doesNotMatch(markup, /Unused image/);
  assert.doesNotMatch(markup, /<img/g);
});

test("RestaurantMenuDrawerType supports image-based collections and uses block intro copy inside the drawer", () => {
  const markup = renderToStaticMarkup(
    <RestaurantMenuDrawerType
      drawerHeaderSource="block"
      content={{
        title: "Drawer Block Heading",
        description: "Drawer Block Description",
        primaryCta: {
          text: "Browse collections",
          href: "/menu",
        },
        introImage: {
          src: "/react/images/intro-drawer.jpg",
          alt: "Drawer intro image",
        },
        cards: [
          {
            title: "COLLECTION ONE",
            description: "Collection teaser copy",
            ctaText: "Open collection",
            ctaHref: "#collection-one",
            image: {
              src: "/react/images/collection-one.jpg",
              alt: "Collection one cover",
            },
            wooCategoryIds: [12, 18, 24],
          },
        ],
      }}
    />,
  );

  assert.equal(markup.match(/Drawer Block Heading/g)?.length, 2);
  assert.equal(markup.match(/Drawer Block Description/g)?.length, 2);
  assert.match(markup, /collection-one\.jpg/);
  assert.match(markup, /Collection one cover/);
});