import assert from "node:assert/strict";
import test from "node:test";

import sharedFooterPageBuilderSchema from "../../../../SCRIPTS/shared-footer.page_builder_schema.json";

import {
  SHARED_FOOTER_BLOCK_KEY,
  parseGlobalLayoutApiResponse,
  parseSharedFooterSectionBlock,
} from "./globalLayoutContract";

const globalLayoutPayload = {
  success: true,
  data: {
    globalLayout: {
      navbar: {
        brand: {
          name: "Bulwar",
          href: "/",
          logoSrc: "/react/images/logo.png",
        },
        primaryItems: [
          {
            label: "Menu",
            href: "/menu",
            description: "Pelna karta restauracji.",
            children: [
              {
                label: "Lunch",
                href: "/menu/lunch",
              },
            ],
          },
          {
            label: "Kontakt",
            href: "/kontakt",
          },
        ],
        companyLinks: [
          {
            label: "+48 533 181 171",
            href: "tel:+48533181171",
          },
        ],
        legalLinks: [
          {
            label: "Regulamin",
            href: "/regulamin",
          },
        ],
      },
      footer: {
        brand: {
          name: "Bulwar",
          href: "/",
          logoSrc: null,
          logoAlt: null,
        },
        address: {
          heading: "Adres",
          lines: ["Restauracja \"BulwaR\"", "Stary Rynek 37", "Poznan"],
        },
        contact: {
          heading: "Kontakt",
          items: [
            {
              label: "+48 533 181 171",
              href: "tel:+48533181171",
            },
            {
              label: "rezerwacje@bulwarrestauracja.pl",
              href: "mailto:rezerwacje@bulwarrestauracja.pl",
            },
          ],
        },
        hours: {
          heading: "Godziny",
          lines: ["Codziennie od 09.00 do 23.00"],
        },
        socialLinks: [
          {
            label: "Instagram",
            href: "https://www.instagram.com/bulwar/",
          },
        ],
        legalLinks: [
          {
            label: "Polityka prywatnosci",
            href: "https://bulwarrestauracja.pl/polityka-prywatnosci/",
          },
        ],
        copyright: "(c) 2026 Restauracja BulwaR. All rights reserved.",
      },
    },
  },
  meta: {
    layout_option_status: "resolved",
    footer_status: "resolved",
  },
} as const;

test("parseGlobalLayoutApiResponse normalizes the public global layout contract", () => {
  const parsed = parseGlobalLayoutApiResponse(globalLayoutPayload);

  assert.equal(parsed.data.globalLayout.navbar.brand.logoAlt, null);
  assert.deepEqual(parsed.data.globalLayout.navbar.primaryItems[1]?.children, []);
  assert.equal(parsed.data.globalLayout.footer.contact.items[1]?.label, "rezerwacje@bulwarrestauracja.pl");
});

test("parseGlobalLayoutApiResponse rejects internal footerPageId from the public payload", () => {
  assert.throws(
    () => parseGlobalLayoutApiResponse({
      success: true,
      data: {
        globalLayout: {
          ...globalLayoutPayload.data.globalLayout,
          footerPageId: 37,
        },
      },
    }),
    /footerPageId|Unrecognized key/i,
  );
});

test("parseSharedFooterSectionBlock validates the dedicated shared footer block shape", () => {
  const parsed = parseSharedFooterSectionBlock({
    id: "shared-footer-main",
    blockKey: SHARED_FOOTER_BLOCK_KEY,
    blockVersion: 1,
    variant: null,
    enabled: true,
    data: globalLayoutPayload.data.globalLayout.footer,
    source: null,
    meta: {},
  });

  assert.equal(parsed.blockKey, SHARED_FOOTER_BLOCK_KEY);
  assert.equal(parsed.data.address.heading, "Adres");
  assert.equal(parsed.data.legalLinks[0]?.label, "Polityka prywatnosci");
});

test("checked-in shared footer payload stays compatible with the shared footer block contract", () => {
  assert.equal(sharedFooterPageBuilderSchema.version, 1);
  assert.ok(Array.isArray(sharedFooterPageBuilderSchema.sections));

  const enabledSharedFooterSections = sharedFooterPageBuilderSchema.sections.filter(
    (section) => section.blockKey === SHARED_FOOTER_BLOCK_KEY && section.enabled === true,
  );

  assert.equal(enabledSharedFooterSections.length, 1);

  const parsed = parseSharedFooterSectionBlock(enabledSharedFooterSections[0]);

  assert.equal(parsed.blockVersion, 1);
  assert.equal(parsed.source, null);
  assert.equal(parsed.id, "shared-footer-main");
});

test("parseGlobalLayoutApiResponse rejects whitespace-only brand names after trim", () => {
  assert.throws(
    () => parseGlobalLayoutApiResponse({
      ...globalLayoutPayload,
      data: {
        globalLayout: {
          ...globalLayoutPayload.data.globalLayout,
          footer: {
            ...globalLayoutPayload.data.globalLayout.footer,
            brand: {
              ...globalLayoutPayload.data.globalLayout.footer.brand,
              name: "   ",
            },
          },
        },
      },
    }),
    /name/i,
  );
});