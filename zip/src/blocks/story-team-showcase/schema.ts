import { createElement } from "react";
import { z } from "zod";

import {
  DEFAULT_STORY_TEAM_SHOWCASE_CONTENT,
  PROMOCJA_sezonowa,
  type StoryTeamShowcaseContent,
} from "../../../components/PROMOCJA_sezonowa";

import { imageAssetSchema } from "../registry/common";
import type { PageBuilderBlockDefinition } from "../registry/types";

export const storyTeamShowcaseIconSchema = z.enum([
  "calendar-days",
  "utensils-crossed",
]);

export const storyTeamShowcaseMemberSchema = z.object({
  icon: storyTeamShowcaseIconSchema,
  name: z.string().min(1, "Member name is required."),
  role: z.string().min(1, "Member role is required."),
});

export const storyTeamShowcaseDataSchema = z.object({
  eyebrow: z.string().min(1, "Section eyebrow is required."),
  title: z.string().min(1, "Section title is required."),
  members: z.array(storyTeamShowcaseMemberSchema).min(1, "At least one member is required."),
  story: z.string().min(1, "Story copy is required."),
  image: imageAssetSchema,
});

export type StoryTeamShowcaseData = StoryTeamShowcaseContent;

export const storyTeamShowcaseDefaultData: StoryTeamShowcaseData =
  storyTeamShowcaseDataSchema.parse(DEFAULT_STORY_TEAM_SHOWCASE_CONTENT);

export const storyTeamShowcaseExampleData: readonly StoryTeamShowcaseData[] = [
  storyTeamShowcaseDataSchema.parse(DEFAULT_STORY_TEAM_SHOWCASE_CONTENT),
  storyTeamShowcaseDataSchema.parse({
    eyebrow: "Meet the team",
    title: "People behind the service",
    members: [
      {
        icon: "calendar-days",
        name: "Anna Example",
        role: "Guest Experience Lead",
      },
      {
        icon: "utensils-crossed",
        name: "Piotr Example",
        role: "Executive Chef",
      },
    ],
    story:
      "Use this version when the page needs a concise editorial section that combines team credibility with a short brand narrative and one supporting image.",
    image: {
      src: "/react/images/about_1.jpg",
      alt: "Editorial team section image",
    },
  }),
];

export const storyTeamShowcaseBlockDefinition: PageBuilderBlockDefinition<typeof storyTeamShowcaseDataSchema> = {
  blockKey: "story-team-showcase",
  version: 1,
  name: "Story Team Showcase",
  description:
    "Editorial story section with crew highlights, narrative copy, and a full-width supporting image.",
  schema: storyTeamShowcaseDataSchema,
  defaultData: storyTeamShowcaseDefaultData,
  render: {
    kind: "existing-react-component",
    componentName: "PROMOCJA_sezonowa",
    componentImportPath: "components/PROMOCJA_sezonowa.tsx",
    notes: "Content-only block. Source must remain null in MVP.",
  },
  runtime: {
    renderSection: (section) => {
      const data = section.data as StoryTeamShowcaseData;

      return createElement(PROMOCJA_sezonowa, {
        key: section.id,
        content: data,
      });
    },
  },
  exampleData: storyTeamShowcaseExampleData,
  tags: ["story", "team", "editorial", "content"],
};