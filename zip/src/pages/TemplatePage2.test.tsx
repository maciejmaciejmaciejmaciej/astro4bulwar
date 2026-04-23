import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import TemplatePage2 from "./TemplatePage2";

test("TemplatePage2 renders the ready-now previews after the existing sections", () => {
  const markup = renderToStaticMarkup(<TemplatePage2 />);

  assert.match(markup, /CTA/);
  assert.match(markup, /Hero45/);
  assert.match(markup, /Hero214/);
  assert.match(markup, /Feature314/);
  assert.match(markup, /Feature314ver2/);
  assert.match(markup, /About1/);
  assert.match(markup, /About28/);
  assert.match(markup, /About3/);
  assert.match(markup, /Feature285/);
  assert.match(markup, /Logos10/);
  assert.match(markup, /Testimonial7/);
  assert.match(markup, /Feature20/);
  assert.match(markup, /Feature160/);
  assert.match(markup, /Vouchery prezentowe\./);
  assert.match(markup, /About Us/);
  assert.match(markup, /Our Achievements in Numbers/);
  assert.match(markup, /The Kitchen/);
  assert.match(markup, /Built by Developers for Developers/);
  assert.match(markup, /Zaufali nam/);
  assert.match(markup, /Meet Our Happy Clients/);
  assert.match(markup, /Sarah Chen/);
  assert.match(markup, /What you can do with our utilities\?/);
  assert.match(markup, /A CRM created to be your own\./);
  assert.match(
    markup,
    /CTA[\s\S]*Hero45[\s\S]*Hero214[\s\S]*Feature314[\s\S]*Feature314ver2[\s\S]*About1[\s\S]*About28[\s\S]*About3[\s\S]*Feature285[\s\S]*Logos10[\s\S]*Testimonial7[\s\S]*Feature20[\s\S]*Feature160/,
  );
});

test("TemplatePage2 uses the shared section wrapper contract", () => {
  const markup = renderToStaticMarkup(<TemplatePage2 />);
  const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");
  const blogSectionSource = readFileSync(
    new URL("../components/sections/BlogSection.tsx", import.meta.url),
    "utf8",
  );

  assert.equal((markup.match(/theme-section-wrapper/g) ?? []).length, 10);
  assert.match(blogSectionSource, /theme-section-wrapper/);
  assert.match(css, /--theme-section-wrapper-width:\s*calc\(100% - 16rem\);/);
  assert.match(
    css,
    /\.theme-section-wrapper\s*\{[\s\S]*width:\s*100%;[\s\S]*margin-left:\s*auto;[\s\S]*margin-right:\s*auto;[\s\S]*padding-left:\s*2rem;[\s\S]*padding-right:\s*2rem;/,
  );
  assert.match(
    css,
    /@media \(min-width:\s*1024px\)\s*\{[\s\S]*\.theme-section-wrapper\s*\{[\s\S]*width:\s*var\(--theme-section-wrapper-width\);[\s\S]*padding-left:\s*0;[\s\S]*padding-right:\s*0;/,
  );
});