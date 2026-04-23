import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  DEFAULT_PROMO2_CONTENT,
  Promo2,
} from "./Promo2";

test("Promo2 preserves the default story layout while attaching a lower menu panel to the image", () => {
  const markup = renderToStaticMarkup(<Promo2 />);

  assert.match(markup, /Our story/);
  assert.match(markup, /Our Crew, Our story/);
  assert.match(markup, /John Doe1/);
  assert.match(markup, /John Doe2/);
  assert.doesNotMatch(markup, /Creative Director1/);
  assert.doesNotMatch(markup, /Creative Director2/);
  assert.match(markup, /Spring asparagus/);
  assert.match(markup, /Brown butter, hazelnut/);
  assert.match(markup, /42 zł/);
  assert.doesNotMatch(markup, /The Selection/);
  assert.match(markup, /rounded-t-\[4px\] rounded-b-none/);
  assert.match(markup, /w-full bg-surface py-32/);
  assert.match(markup, /max-w-5xl mx-auto grid gap-y-12 px-4 md:grid-cols-2 md:gap-x-20 md:gap-y-12 md:px-0/);
  assert.match(markup, /space-y-12/);
  assert.match(markup, /font-headline text-base leading-tight tracking-widest text-on-surface/);
  assert.match(markup, /font-label text-base leading-snug tracking-wider text-zinc-500/);
  assert.match(markup, /flex items-end gap-1 md:gap-3/);
  assert.match(markup, /flex min-w-0 w-fit max-w-\[calc\(100%-6rem\)\] flex-col md:max-w-none md:flex-1/);
  assert.match(markup, /break-words/);
  assert.match(markup, /flex min-w-0 flex-1 items-end gap-1 md:gap-3/);
  assert.match(markup, /menu-leader !m-0 min-w-\[20px\] flex-1 !mb-\[0\.3rem\]/);
  assert.match(markup, /shrink-0 whitespace-nowrap font-headline text-lg text-right text-on-surface/);
  assert.doesNotMatch(markup, /grid-cols-\[minmax\(0,1fr\)_minmax\(20px,1fr\)_auto\]/);
  assert.doesNotMatch(markup, /max-w-\[65%\] flex-1 flex-col/);
  assert.doesNotMatch(markup, /menu-leader min-w-\[20px\] m-0 mb-\[0\.3rem\]/);
  assert.doesNotMatch(markup, /border-black\/10/);
  assert.equal(markup.match(/stroke-\[1\.25\] text-black/g)?.length, 2);
  assert.match(markup, /menu-leader/);
  assert.equal(DEFAULT_PROMO2_CONTENT.menuColumns.length, 2);
});

test("Promo2 renders custom menu content without forcing uppercase menu typography", () => {
  const markup = renderToStaticMarkup(
    <Promo2
      className="promo2-shell"
      content={{
        eyebrow: "Chef notes",
        title: "Seasonal menu",
        members: [
          {
            icon: "calendar-days",
            name: "Anna Example",
            role: "Guest Experience Lead",
          },
        ],
        story: "A promo block can keep the editorial top section and switch only the attached menu content.",
        image: {
          src: "/react/images/custom-promo2.jpg",
          alt: "custom promo image",
        },
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
        emptyStateText: "Brak pozycji w tej kategorii.",
      }}
    />,
  );

  assert.match(markup, /promo2-shell/);
  assert.match(markup, /Seasonal menu/);
  assert.match(markup, /Anna Example/);
  assert.doesNotMatch(markup, /Guest Experience Lead/);
  assert.match(markup, /Duck ravioli/);
  assert.match(markup, /48 zł/);
  assert.match(markup, /data-menu-item-pills/);
  assert.match(markup, /flex flex-wrap gap-1.5/);
  assert.match(markup, /Vegan/);
  assert.match(markup, /Bardzo ostre/);
  assert.match(markup, /500 ml/);
  assert.doesNotMatch(markup, /<p class="break-words font-label text-base leading-snug tracking-wider text-zinc-500"><\/p>/);
  assert.doesNotMatch(markup, /DUCK RAVIOLI/);
  assert.doesNotMatch(markup, /THE SELECTION/);
});