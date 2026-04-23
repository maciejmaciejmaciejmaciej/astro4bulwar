import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import type { GlobalLayoutData } from "../../blocks/registry/globalLayoutContract";
import { Footer } from "./Footer";
import { Navbar2 } from "./NavbarBigSpaceBetweenElements";

const customGlobalLayout: GlobalLayoutData = {
  navbar: {
    brand: {
      name: "Bulwar Test",
      href: "/start-test",
      logoSrc: "/assets/logo-custom.svg",
      logoAlt: "Bulwar Test Logo",
    },
    primaryItems: [
      {
        label: "Menu degustacyjne",
        href: "/menu-degustacyjne",
        description: "Autorska karta degustacyjna.",
        children: [
          {
            label: "Kolacja chef's table",
            href: "/menu-degustacyjne/chef-table",
            description: "Wieczorny serwis degustacyjny.",
            children: [],
          },
        ],
      },
      {
        label: "Kontakt premium",
        href: "/kontakt-premium",
        description: "Kontakt dla rezerwacji prywatnych.",
        children: [],
      },
    ],
    companyLinks: [
      {
        label: "+48 111 222 333",
        href: "tel:+48111222333",
      },
    ],
    legalLinks: [
      {
        label: "Polityka testowa",
        href: "/polityka-testowa",
      },
    ],
  },
  footer: {
    brand: {
      name: "Bulwar Test",
      href: "/start-test",
      logoSrc: null,
      logoAlt: null,
    },
    address: {
      heading: "Adres testowy",
      lines: ["Aleja Testowa 12", "00-001 Warszawa"],
    },
    contact: {
      heading: "Kontakt testowy",
      items: [
        {
          label: "kontakt@test.example",
          href: "mailto:kontakt@test.example",
        },
      ],
    },
    hours: {
      heading: "Godziny testowe",
      lines: ["Pn-Sb 12:00-22:00"],
    },
    socialLinks: [
      {
        label: "Instagram Test",
        href: "https://example.com/instagram-test",
      },
    ],
    legalLinks: [
      {
        label: "Regulamin testowy",
        href: "https://example.com/regulamin-testowy",
      },
    ],
    copyright: "(c) 2026 Bulwar Test.",
  },
};

test("Navbar2 renders external global layout data instead of local navigation fixtures", () => {
  const markup = renderToStaticMarkup(<Navbar2 navbar={customGlobalLayout.navbar} />);

  assert.match(markup, /Menu degustacyjne/);
  assert.match(markup, /Kontakt premium/);
  assert.match(markup, /assets\/logo-custom\.svg/);
  assert.doesNotMatch(markup, /Przyjecia/);
});

test("Footer renders external global layout data instead of local footer fixtures", () => {
  const markup = renderToStaticMarkup(<Footer footer={customGlobalLayout.footer} />);

  assert.match(markup, /Adres testowy/);
  assert.match(markup, /Aleja Testowa 12/);
  assert.match(markup, /kontakt@test\.example/);
  assert.match(markup, /Instagram Test/);
  assert.doesNotMatch(markup, /Stary Rynek 37/);
});

test("Footer does not synthesize a Bulwar placeholder wordmark when invalid data bypasses the contract", () => {
  const markup = renderToStaticMarkup(
    <Footer
      footer={{
        ...customGlobalLayout.footer,
        brand: {
          ...customGlobalLayout.footer.brand,
          name: "   ",
        },
      }}
    />,
  );

  assert.doesNotMatch(markup, /<span>B<\/span><div class="w-\[1px\] h-8 bg-primary mx-2"><\/div><span>ULWAR<\/span>/);
});

test("Navbar2 and Footer fail closed when a guard point does not provide real layout data", () => {
  assert.throws(() => renderToStaticMarkup(<Navbar2 navbar={undefined as never} />));
  assert.throws(() => renderToStaticMarkup(<Footer footer={undefined as never} />));
});