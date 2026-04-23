import {
  CalendarDays,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type StoryTeamShowcaseIcon = "calendar-days" | "utensils-crossed";

export interface StoryTeamShowcaseMemberContent {
  icon: StoryTeamShowcaseIcon;
  name: string;
  role: string;
}

export interface StoryTeamShowcaseImageContent {
  src: string;
  alt: string;
}

export interface StoryTeamShowcaseContent {
  eyebrow: string;
  title: string;
  members: StoryTeamShowcaseMemberContent[];
  story: string;
  image: StoryTeamShowcaseImageContent;
}

export interface PROMOCJA_sezonowaProps {
  content?: StoryTeamShowcaseContent;
  className?: string;
}

const storyTeamShowcaseIcons: Record<StoryTeamShowcaseIcon, LucideIcon> = {
  "calendar-days": CalendarDays,
  "utensils-crossed": UtensilsCrossed,
};

export const DEFAULT_STORY_TEAM_SHOWCASE_CONTENT: StoryTeamShowcaseContent = {
  eyebrow: "Our Crew, Our story",
  title: "Our story",
  members: [
    {
      icon: "calendar-days",
      name: "John Doe1",
      role: "Creative Director1",
    },
    {
      icon: "utensils-crossed",
      name: "John Doe2",
      role: "Creative Director2",
    },
  ],
  story:
    "We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect. Our story is built on passion, innovation, and the drive to bring meaningful ideas to life.",
  image: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri4/img10.png",
    alt: "about us image",
  },
};

const PROMOCJA_sezonowa = ({
  content = DEFAULT_STORY_TEAM_SHOWCASE_CONTENT,
  className,
}: PROMOCJA_sezonowaProps) => {
  return (
    <section className={cn("page-margin py-32", className)}>
      <div className="mx-auto max-w-screen-2xl space-y-10 lg:space-y-20">
        <div className="w-full grid-cols-6 gap-10 lg:grid">
          <div />
          <h1 className="col-span-4 font-headline text-5xl font-medium tracking-[0.2rem] uppercase leading-none lg:pr-24 lg:pl-10 lg:text-8xl">
            {content.title}
          </h1>
        </div>

        <div className="grid-cols-6 space-y-12 lg:grid lg:space-y-0 xl:gap-10">
          <p className="hidden font-label text-xs tracking-[0.16rem] uppercase text-zinc-500 lg:block">
            {content.eyebrow}
          </p>

          <div className="col-span-2 space-y-5 lg:pr-24 lg:pl-10">
            {content.members.map((member, index) => {
              const Icon = storyTeamShowcaseIcons[member.icon];

              return (
                <div key={`${member.name}-${index}`} className="flex items-center gap-4 rounded-[4px]">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-[4px] bg-surface-container-low text-on-surface">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline text-lg font-medium tracking-tight text-on-surface">
                      {member.name}
                    </h3>
                    <p className="font-body text-sm text-zinc-500">
                      {member.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-span-3 mt-32 lg:mt-0 lg:pl-10">
            <h2 className="lead-copy text-on-surface">
              {content.story}
            </h2>
          </div>
        </div>

        <div>
          <img
            src={content.image.src}
            alt={content.image.alt}
            className="mt-4 h-150 w-full rounded-[4px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export { PROMOCJA_sezonowa };