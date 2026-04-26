import {
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Feature18CardContent {
  meta: string;
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
}

export interface Feature18SimpleCardContent {
  title: string;
  linkLabel: string;
  linkHref: string;
}

export interface Feature18Content {
  leftColumn: {
    title: string;
    primaryCta: {
      label: string;
      href: string;
    };
  };
  cards: Feature18CardContent[];
}

export interface Feature18SimpleContent {
  leftColumn: {
    title: string;
    primaryCta: {
      label: string;
      href?: string;
    };
  };
  cards: Feature18SimpleCardContent[];
}

interface Feature18Props {
  content?: Feature18Content;
  className?: string;
}

interface Feature18SimpleProps {
  content?: Feature18SimpleContent;
  className?: string;
}

export const DEFAULT_FEATURE18_CONTENT: Feature18Content = {
  leftColumn: {
    title: "Menu",
    primaryCta: {
      label: "Zobacz menu",
      href: "/menu",
    },
  },
  cards: [
    {
      meta: "09:00 - 17:00",
      title: "Customizable",
      description:
        "You can easily customize our UI blocks to fit your needs. Change colors, fonts, and more with our easy-to-use interface.",
      linkLabel: "Learn more",
      linkHref: "#",
    },
    {
      meta: "09:00 - 17:00",
      title: "Responsive",
      description:
        "Our UI blocks are fully responsive and look great on any device. No matter the screen size, your website will look amazing.",
      linkLabel: "Learn more",
      linkHref: "#",
    },
    {
      meta: "09:00 - 17:00",
      title: "Fast",
      description:
        "Our UI blocks are optimized for speed and performance. Your website will load fast and provide a great user experience.",
      linkLabel: "Learn more",
      linkHref: "#",
    },
    {
      meta: "09:00 - 17:00",
      title: "Modern",
      description:
        "Our UI blocks are designed with modern trends in mind. Your website will look fresh and up-to-date with our blocks.",
      linkLabel: "Learn more",
      linkHref: "#",
    },
  ],
};

export const DEFAULT_FEATURE18_SIMPLE_CONTENT: Feature18SimpleContent = {
  leftColumn: {
    title: DEFAULT_FEATURE18_CONTENT.leftColumn.title,
    primaryCta: {
      ...DEFAULT_FEATURE18_CONTENT.leftColumn.primaryCta,
    },
  },
  cards: DEFAULT_FEATURE18_CONTENT.cards.map(({ title, linkLabel, linkHref }) => ({
    title,
    linkLabel,
    linkHref,
  })),
};

export function Feature18({
  content = DEFAULT_FEATURE18_CONTENT,
  className,
}: Feature18Props) {

  return (
    <section
      className={cn(
        "relative py-32 before:absolute before:inset-0 before:bg-primary/10 before:[mask-image:url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/waves.svg')] before:[mask-size:64px_32px] before:[mask-repeat:repeat]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-transparent to-background" />
      <div className="relative page-margin">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)] lg:gap-10 xl:gap-16">
          <div className="mb-10 lg:mb-0 lg:flex lg:items-start">
            <div className="space-y-6">
              <h2 className="font-headline text-5xl uppercase lg:text-8xl">
                {content.leftColumn.title}
              </h2>
              <div className="h-[1px] w-16 bg-black" />
              <Button
                nativeButton={false}
                className="theme-radius-control bg-primary px-8 py-4 font-label text-sm uppercase text-on-primary transition-opacity hover:opacity-80"
                render={<a href={content.leftColumn.primaryCta.href} />}
              >
                {content.leftColumn.primaryCta.label}
              </Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {content.cards.map((card) => (
              <div
                key={`${card.title}-${card.linkHref}`}
                className="theme-radius-surface flex min-h-[240px] flex-col justify-between border border-zinc-200 bg-white p-8"
              >
                <div className="space-y-6">
                  <p className="font-body text-sm text-zinc-500">
                    {card.meta}
                  </p>
                  <div>
                    <h3 className="mb-3 font-headline text-lg uppercase">
                      {card.title}
                    </h3>
                    <p className="font-body text-sm text-zinc-500">
                      {card.description}
                    </p>
                  </div>
                </div>
                <a
                  href={card.linkHref}
                  className="inline-flex items-center gap-2 pt-6 font-label text-xs uppercase text-zinc-500 transition-colors hover:text-black"
                >
                  {card.linkLabel}
                  <ChevronRight className="size-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Feature18Simple({
  content = DEFAULT_FEATURE18_SIMPLE_CONTENT,
  className,
}: Feature18SimpleProps) {
  const { leftColumn, cards } = content;
  const shouldRenderPrimaryCta = Boolean(leftColumn.primaryCta.href);

  return (
    <section
      className={cn(
        "relative py-32 before:absolute before:inset-0 before:bg-primary/10 before:[mask-image:url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/waves.svg')] before:[mask-size:64px_32px] before:[mask-repeat:repeat]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-transparent to-background" />
      <div className="relative page-margin">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)] lg:gap-10 xl:gap-16">
          <div className="mb-10 lg:mb-0 lg:flex lg:items-start">
            <div className="space-y-6">
              <h2 className="font-headline text-5xl uppercase lg:text-8xl">
                {leftColumn.title}
              </h2>
              <div className="h-[1px] w-16 bg-black" />
              {shouldRenderPrimaryCta ? (
                <Button
                  nativeButton={false}
                  className="theme-radius-control bg-primary px-8 py-4 font-label text-sm uppercase text-on-primary transition-opacity hover:opacity-80"
                  render={<a href={leftColumn.primaryCta.href} />}
                >
                  {leftColumn.primaryCta.label}
                </Button>
              ) : null}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {cards.map((card) => (
              <div
                key={`${card.title}-${card.linkHref}`}
                className="theme-radius-surface flex min-h-[240px] flex-col justify-between border border-zinc-200 bg-white p-8"
              >
                <div>
                  <h3 className="font-headline text-lg uppercase">
                    {card.title}
                  </h3>
                </div>
                <a
                  href={card.linkHref}
                  className="inline-flex items-center gap-2 pt-6 font-label text-xs uppercase text-zinc-500 transition-colors hover:text-black"
                >
                  {card.linkLabel}
                  <ChevronRight className="size-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}