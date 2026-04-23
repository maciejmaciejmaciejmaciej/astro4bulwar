import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselPlugins,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Logos10Props {
  className?: string;
}

const logos = [
  {
    id: "logo-1",
    description: "Logo 1",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
    className: "h-7 w-auto dark:invert",
  },
  {
    id: "logo-2",
    description: "Logo 2",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
    className: "h-7 w-auto dark:invert",
  },
  {
    id: "logo-3",
    description: "Logo 3",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
    className: "h-7 w-auto dark:invert",
  },
  {
    id: "logo-4",
    description: "Logo 4",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
    className: "h-7 w-auto dark:invert",
  },
  {
    id: "logo-5",
    description: "Logo 5",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
    className: "h-7 w-auto dark:invert",
  },
  {
    id: "logo-6",
    description: "Logo 6",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
    className: "h-5 w-auto dark:invert",
  },
  {
    id: "logo-7",
    description: "Logo 7",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
    className: "h-7 w-auto dark:invert",
  },
  {
    id: "logo-8",
    description: "Logo 8",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg",
    className: "h-7 w-auto dark:invert",
  },
];

export const Logos10 = ({ className }: Logos10Props) => {
  const [plugins, setPlugins] = React.useState<CarouselPlugins>([]);

  React.useEffect(() => {
    let isMounted = true;

    import("embla-carousel-auto-scroll")
      .then((module) => {
        if (!isMounted) {
          return;
        }

        setPlugins([
          module.default({
            playOnInit: true,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setPlugins([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={cn("pt-4 pb-24", className)}>
      <div className="theme-section-wrapper">
        <h2 className="mb-6 max-w-4xl text-4xl text-foreground md:text-5xl lg:mb-10">
          Zaufali nam
        </h2>
        <div className="relative flex items-center justify-center">
          <Carousel opts={{ loop: true }} plugins={plugins}>
            <CarouselContent className="ml-0">
              {logos.map((logo, index) => (
                <CarouselItem
                  key={logo.id}
                  className="relative flex h-35 basis-1/2 justify-center border border-r-0 border-border pl-0 sm:basis-1/4 md:basis-1/3 lg:basis-1/6"
                >
                  <div className="flex flex-col items-center justify-center lg:mx-10">
                    <p className="absolute top-2 left-2 text-xs">
                      {(index + 1).toString().padStart(2, "0")}
                    </p>
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={logo.className}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
};