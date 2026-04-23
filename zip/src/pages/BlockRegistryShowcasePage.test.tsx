import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import App from "../App";
import { listBlocks } from "../blocks/registry";

test("App exposes a local block registry showcase route with labeled entries for every registered block", () => {
  const markup = renderToStaticMarkup(
    <MemoryRouter initialEntries={["/blocks"]}>
      <App />
    </MemoryRouter>,
  );

  assert.match(markup, /Block Registry Showcase/);
  assert.equal((markup.match(/data-block-showcase-label=/g) ?? []).length, listBlocks().length);

  for (const block of listBlocks()) {
    assert.equal(markup.includes(`data-block-key="${block.blockKey}"`), true);
    assert.equal(markup.includes(block.name), true);
  }
});