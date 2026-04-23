import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  DEFAULT_STORY_TEAM_SHOWCASE_CONTENT,
  PROMOCJA_sezonowa,
} from "./PROMOCJA_sezonowa";

test("PROMOCJA_sezonowa preserves the default story-team showcase content and layout", () => {
  const markup = renderToStaticMarkup(<PROMOCJA_sezonowa />);

  assert.equal(DEFAULT_STORY_TEAM_SHOWCASE_CONTENT.members.length, 2);
  assert.match(markup, /Our story/);
  assert.match(markup, /Our Crew, Our story/);
  assert.match(markup, /John Doe1/);
  assert.match(markup, /Creative Director1/);
  assert.match(markup, /John Doe2/);
  assert.match(markup, /Creative Director2/);
  assert.match(markup, /We are a team of creators, thinkers, and builders/);
  assert.match(markup, /about us image/);
  assert.match(markup, /lead-copy text-on-surface/);
  assert.equal(
    markup.match(/flex items-center gap-4 rounded-\[4px\]/g)?.length,
    2,
  );
});

test("PROMOCJA_sezonowa renders custom structured content without falling back to defaults", () => {
  const markup = renderToStaticMarkup(
    <PROMOCJA_sezonowa
      className="custom-shell"
      content={{
        eyebrow: "Studio Team",
        title: "Behind the table",
        members: [
          {
            icon: "calendar-days",
            name: "Jane Smith",
            role: "Operations Lead",
          },
        ],
        story:
          "A smaller custom page-builder payload can reuse the same geometry with different copy.",
        image: {
          src: "/react/images/custom-story.jpg",
          alt: "custom story image",
        },
      }}
    />,
  );

  assert.match(markup, /custom-shell/);
  assert.match(markup, /Behind the table/);
  assert.match(markup, /Studio Team/);
  assert.match(markup, /Jane Smith/);
  assert.match(markup, /Operations Lead/);
  assert.match(markup, /A smaller custom page-builder payload can reuse the same geometry/);
  assert.match(markup, /custom story image/);
  assert.doesNotMatch(markup, /John Doe1/);
  assert.equal(
    markup.match(/flex items-center gap-4 rounded-\[4px\]/g)?.length,
    1,
  );
});