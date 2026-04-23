import { ArrowUpRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Feature314ver2Props {
  smallCards?: {
    image: string;
    topNote: string;
    title: string;
    summary: string;
    url: string;
  }[];
  bigCard?: {
    image: string;
    label: string;
    title: string;
    url: string;
  };
  heading?: string;
  secondaryHeading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  className?: string;
}

export function Feature314ver2({
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
        "Learn how we use unified design tokens and shared libraries to keep large projects consistent and efficient.",
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
}: Feature314ver2Props) {
  return (
    <section className={cn("bg-background py-32", className)}>
      <div className="theme-section-wrapper text-on-surface">
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="grid w-full gap-5 border-b border-outline-variant/20 pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8 md:pb-12">
            <h2 className="max-w-lg text-4xl whitespace-pre-line md:text-5xl">
              {heading}
            </h2>
            <Button
              className="theme-radius-control justify-self-start bg-primary px-6 py-4 font-label text-sm tracking-[0.1em] text-on-primary transition-opacity hover:opacity-80 md:justify-self-end md:px-8"
              render={<a href={button.url} />}
              nativeButton={false}
            >
              {button.text}
              <ArrowUpRight className="size-4" />
            </Button>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-4">
            {smallCards.map((card, id) => (
              <div
                key={`${card.title}-${id}`}
                className="theme-block-card theme-radius-surface col-span-1 p-7 md:p-8"
              >
                <a href={card.url} className="flex h-full w-full flex-col justify-between gap-6 transition-colors duration-300 hover:text-on-surface">
                  <div className="relative w-full">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="theme-radius-media size-24 object-cover lg:size-32"
                    />
                    <div className="absolute top-0 right-0 flex items-start justify-end">
                      <p className="flex items-center gap-2 text-sm">
                        <Plus
                          size={20}
                          className="theme-radius-control bg-surface-container-low p-0.5 text-zinc-500"
                        />
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div>
                      <span className="font-label text-xs tracking-[0.1em] text-zinc-500">
                        {card.topNote}
                      </span>
                      <h3 className="mt-2 font-headline text-xl text-on-surface md:text-2xl">
                        {card.title}
                      </h3>
                    </div>
                    <p className="font-body text-sm leading-relaxed text-zinc-500">{card.summary}</p>
                  </div>
                </a>
              </div>
            ))}

            <div className="theme-block-card theme-radius-surface min-h-[30rem] overflow-hidden md:col-span-2 md:min-h-[32rem]">
              <a href={bigCard.url} target="_blank" className="block h-full">
                <div className="relative h-full w-full overflow-hidden">
                  <img
                    src={bigCard.image}
                    alt={bigCard.title}
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-105"
                  />
                  <div className="absolute top-0 flex w-full items-center justify-between p-7 md:p-8">
                    <div className="font-label text-xs tracking-[0.14em] text-white">
                      {bigCard.label}
                    </div>
                    <Plus
                      size={20}
                      className="theme-radius-control bg-white/85 p-0.5 text-zinc-700"
                    />
                  </div>
                  <div className="absolute bottom-0 flex w-full items-end justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-7 text-right md:p-10">
                    <h3 className="w-2/3 font-headline text-xl text-white md:text-3xl lg:text-4xl">
                      {bigCard.title}
                    </h3>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}