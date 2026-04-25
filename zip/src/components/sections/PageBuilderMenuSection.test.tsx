import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { PageBuilderMenuSection } from "./PageBuilderMenuSection";

test("PageBuilderMenuSection uses the shared mobile-safe menu row layout", () => {
  const markup = renderToStaticMarkup(
    <PageBuilderMenuSection
      columns={2}
      variant="surface"
      content={{
        title: "Menu",
        emptyStateText: "Brak pozycji w tej kategorii.",
        menuColumns: [
          {
            items: [
              {
                title: "Duck ravioli",
                description: "   ",
                priceLabel: "48 zł",
                tagSlugs: ["vegan", "bardzo ostre", "500 ml"],
              },
            ],
          },
        ],
      }}
    />,
  );

  assert.match(markup, /data-section-variant="surface"/);
  assert.match(markup, /theme-radius-surface/);
  assert.match(markup, /flex items-end gap-1 md:gap-3/);
  assert.match(markup, /flex min-w-0 w-fit max-w-\[calc\(100%-6rem\)\] flex-col md:max-w-none md:flex-1/);
  assert.match(markup, /flex min-w-0 flex-1 items-end gap-1 md:gap-3/);
  assert.match(markup, /menu-leader !m-0 min-w-\[20px\] flex-1 !mb-\[0\.3rem\] border-outline-variant/);
  assert.match(markup, /block break-words font-label text-base leading-snug tracking-wider mb-1 text-on-surface/);
  assert.match(markup, /shrink-0 whitespace-nowrap text-right font-label text-base leading-snug tracking-wider text-on-surface/);
  assert.match(markup, /data-menu-item-pills/);
  assert.match(markup, /flex flex-wrap gap-1.5/);
  assert.match(markup, /Vegan/);
  assert.match(markup, /Bardzo ostre/);
  assert.match(markup, /500 ml/);
  assert.doesNotMatch(markup, /<p class="break-words font-label text-base text-zinc-500"><\/p>/);
  assert.doesNotMatch(markup, /grid-cols-\[minmax\(0,1fr\)_minmax\(20px,1fr\)_auto\]/);
  assert.doesNotMatch(markup, /max-w-\[65%\]/);
  assert.doesNotMatch(markup, /pl-1 text-right/);
});