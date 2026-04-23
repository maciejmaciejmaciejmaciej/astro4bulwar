import { ArrowUpRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Feature314Props {
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

export function Feature314({
  heading = "Vouchery prezentowe.",
  button = {
    text: "Zobacz wszystkie",
    url: "#vouchery",
  },
  smallCards = [
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      topNote: "Voucher prezentowy",
      title: "Voucher 1",
      summary:
        "Idealny na wspolne gotowanie, warsztaty kulinarne i prezent dla kogos, kto kocha dobre jedzenie.",
      url: "#vouchery",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
      topNote: "Voucher prezentowy",
      title: "Voucher 2",
      summary:
        "Elegancka karta podarunkowa na kulinarne przezycia, degustacje i zajecia prowadzone przez pasjonatow kuchni.",
      url: "#vouchery",
    },
  ],
  bigCard = {
    image:
      "https://thebestfood.pl/wp-content/uploads/2024/11/voucher-akademia-gotowania-the-best-food-poznan-karta.jpg",
    label: "Akademia Nowa",
    title: "Podaruj kulinarne doswiadczenie",
    url: "#vouchery",
  },
  className,
}: Feature314Props) {
  return (
    <section id="vouchery" className={cn("bg-muted py-32 dark:bg-background", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col gap-12">
          <div className="grid w-full gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
            <h2 className="max-w-lg text-4xl whitespace-pre-line md:text-5xl">
              {heading}
            </h2>
            <Button
              className="justify-self-start md:justify-self-end"
              render={<a href={button.url} />}
              nativeButton={false}
            >
              {button.text}
              <ArrowUpRight className="size-4" />
            </Button>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-4">
            {smallCards.map((card, id) => (
              <div
                key={`${card.title}-${id}`}
                className="col-span-1 rounded-xl border-0 bg-card p-4 shadow-none"
              >
                <a href={card.url} className="flex h-full w-full flex-col justify-between gap-4">
                  <div className="relative w-full">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="size-24 rounded-xl object-cover lg:size-32 dark:invert"
                    />
                    <div className="absolute top-0 right-0 flex items-start justify-end">
                      <p className="flex items-center gap-2 text-sm">
                        <Plus size={20} className="rounded-full bg-secondary p-0.5" />
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">{card.topNote}</span>
                      <h3 className="mt-0.5 text-xl md:text-xl">{card.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{card.summary}</p>
                  </div>
                </a>
              </div>
            ))}

            <div className="min-h-[30rem] rounded-xl border-0 bg-card py-0 pt-0 shadow-none md:col-span-2 md:min-h-[32rem]">
              <a href={bigCard.url} target="_blank" className="block h-full">
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <img
                    src={bigCard.image}
                    alt={bigCard.title}
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-105"
                  />
                  <div className="absolute top-0 flex w-full items-center justify-between p-8">
                    <div className="text-lg">{bigCard.label}</div>
                    <Plus size={20} className="rounded-full bg-secondary p-0.5" />
                  </div>
                  <div className="absolute bottom-0 flex w-full items-end justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-10 text-right">
                    <h3 className="w-2/3 text-xl text-white md:text-3xl lg:text-4xl">
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