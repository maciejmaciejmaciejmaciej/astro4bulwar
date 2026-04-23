"use client";

import { ArrowUpRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Feature314Props {
  smallCards: {
    image: string;
    topNote: string;
    title: string;
    summary: string;
    url: string;
  }[];
  bigCard: {
    image: string;
    label: string;
    title: string;
    url: string;
  };
  heading: string;
  secondaryHeading: string;
  description: string;
  button: {
    text: string;
    url: string;
  };
  className?: string;
}

const Feature314 = ({
  heading = "Explore our creative studio.",
  button = {
    text: "Contact us",
    url: "#",
  },
  smallCards = [
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      topNote: "March 10, 2025",
      title: "The Future of User Experience in 2025",
      summary:
        "Discover how motion design, accessibility, and micro-interactions are shaping the next generation of interfaces.",
      url: "#",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
      topNote: "February 22, 2025",
      title: "Design Systems that Scale Across Teams",
      summary:
        "Learn how we use unified design tokens and shared libraries to keep large projects consistent and efficient. ",
      url: "#",
    },
  ],
  bigCard = {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/artistic-portrait-glitch-yqp6z.png",
    label: "studio®",
    title: "Inside our design process",
    url: "#",
  },
  className,
}: Feature314Props) => {
  return (
    <section className={cn("bg-muted py-32 dark:bg-background", className)}>
      <div className="container">
        <div className="flex flex-col gap-12">
          {/* Header Section */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end md:gap-8">
            <h2 className="max-w-lg flex-1 justify-between text-3xl font-bold whitespace-pre-line md:text-5xl">
              {heading}
            </h2>
            <Button asChild>
              <a href={button.url}>
                {button.text}
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </div>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            {smallCards.map((card, id) => (
              <Card
                key={id}
                className="col-span-1 rounded-xl border-0 p-4 shadow-none"
              >
                <div className="flex h-full w-full flex-col justify-between gap-4">
                  <div className="relative w-full">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="size-24 rounded-xl lg:size-32 dark:invert"
                    />
                    <div className="absolute top-0 right-0 flex items-start justify-end">
                      <p className="flex items-center gap-2 text-sm font-bold">
                        <Plus
                          size={20}
                          className="rounded-full bg-secondary p-0.5"
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        {card.topNote}
                      </span>
                      <h1 className="mt-0.5 text-xl font-medium md:text-xl">
                        {card.title}
                      </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {card.summary}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            <Card className="min-h-[30rem] rounded-xl border-0 py-0 pt-0 shadow-none md:col-span-2 md:min-h-[32rem]">
              <a href={bigCard.url} target="_blank" className="block h-full">
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <img
                    src={bigCard.image}
                    alt={bigCard.title}
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-105"
                  />
                  <div className="absolute top-0 flex w-full items-center justify-between p-8">
                    <div className="text-lg font-bold">{bigCard.label}</div>
                    <Plus
                      size={20}
                      className="rounded-full bg-secondary p-0.5"
                    />
                  </div>
                  <div className="absolute bottom-0 flex w-full items-end justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-10 text-right">
                    <h1 className="w-2/3 text-xl font-semibold text-white md:text-3xl lg:text-4xl">
                      {bigCard.title}
                    </h1>
                  </div>
                </div>
              </a>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature314 };
