import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  DEFAULT_OCCASIONAL_MENU_PDF_DOWNLOAD_CONTENT,
  OccasionalMenuPdfDownloadSection,
} from "./OccasionalMenuPdfDownloadSection";

test("OccasionalMenuPdfDownloadSection renders the default PDF download promo", () => {
  const markup = renderToStaticMarkup(<OccasionalMenuPdfDownloadSection />);

  assert.match(markup, /Menu okolicznosciowe/);
  assert.match(markup, /Pobierz PDF/);
  assert.match(markup, /PDF 2025/);
  assert.match(markup, /2\.3 MB/);
  assert.equal(DEFAULT_OCCASIONAL_MENU_PDF_DOWNLOAD_CONTENT.features.length, 2);
  assert.equal(markup.match(/rounded-\[4px\] bg-surface-container-low/g)?.length, 2);
  assert.match(markup, /Zobacz online/);
  assert.match(markup, /Bez logowania/);
});

test("OccasionalMenuPdfDownloadSection renders custom structured content", () => {
  const markup = renderToStaticMarkup(
    <OccasionalMenuPdfDownloadSection
      className="pdf-shell"
      content={{
        title: "Pakiet bankietowy",
        subtitle: "Pobierz wersje PDF przygotowana dla eventow firmowych.",
        primaryCta: {
          label: "Pobierz pakiet",
          href: "/pdf/bankiet.pdf",
        },
        secondaryCta: {
          label: "Zobacz szczegoly",
          href: "/menu-okolicznosciowe-platerowe-2025",
        },
        helperText: "PDF gotowy do wysylki klientom",
        versionLabel: "PDF PRO",
        fileMeta: "4.1 MB",
        panelCaption: "Rozszerzona oferta dla wydarzen premium",
        features: [
          {
            icon: "events",
            title: "Rozbudowane propozycje dla gali i jubileuszy",
          },
        ],
      }}
    />,
  );

  assert.match(markup, /pdf-shell/);
  assert.match(markup, /Pakiet bankietowy/);
  assert.match(markup, /Pobierz pakiet/);
  assert.match(markup, /Zobacz szczegoly/);
  assert.match(markup, /PDF PRO/);
  assert.match(markup, /4\.1 MB/);
  assert.match(markup, /PDF gotowy do wysylki klientom/);
  assert.match(markup, /Rozbudowane propozycje dla gali i jubileuszy/);
  assert.doesNotMatch(markup, /Menu okolicznosciowe/);
});