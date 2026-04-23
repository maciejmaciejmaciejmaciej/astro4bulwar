import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface Hero166Props {
  className?: string;
}

const Hero166 = ({ className }: Hero166Props) => {
  return (
    <section className={cn("relative overflow-hidden bg-background pt-20 pb-8 md:pt-28 md:pb-10", className)}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 32px, var(--muted) 32px, var(--muted) 33px),
            repeating-linear-gradient(135deg, transparent, transparent 32px, var(--muted) 32px, var(--muted) 33px)
          `,
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
        }}
      />
      <div className="container relative z-10 max-w-[111rem]">
        <div className="grid w-full grid-cols-1 items-center justify-between gap-14 lg:grid-cols-2">
          <div className="flex flex-col items-center py-10 text-center lg:items-start lg:px-0 lg:text-left xl:pl-[100px]">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Akademia Nowa</p>
            <h1 className="my-6 max-w-3xl text-4xl font-bold text-pretty text-foreground lg:text-6xl">
              Nowoczesna przestrzen dla pasjonatow gotowania.
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              Warsztaty, kursy i kulinarne doswiadczenia zebrane w szybkim, nowoczesnym serwisie opartym o Astro i modularne bloki.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button className="w-full sm:w-auto" size="lg">
                <ArrowRight className="mr-2 size-4" />
                Zobacz warsztaty
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" size="lg">
                Sprawdz oferte
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[52.875rem] lg:mx-0">
            <AspectRatio ratio={1.049627792 / 1}>
              <div className="grid w-full grid-cols-2 items-center justify-center gap-4">
                <div className="flex flex-col items-end justify-center gap-4">
                  <div className="relative animate-[transform1_15s_ease-in-out_infinite] overflow-hidden rounded-lg">
                    <img
                      src="/images/hero166/cooking-1.jpg"
                      alt="Dwie osoby gotujace razem w kuchni"
                      className="absolute block h-full w-full animate-[image1_15s_ease-in-out_infinite] object-cover object-center"
                    />
                    <img
                      src="/images/hero166/cooking-2.jpg"
                      alt="Kobieta probujaca potrawy podczas gotowania"
                      className="absolute block h-full w-full animate-[image2_15s_ease-in-out_infinite] object-cover object-center"
                    />
                  </div>
                  <div className="relative animate-[transform2_15s_ease-in-out_infinite] overflow-hidden rounded-lg">
                    <img
                      src="/images/hero166/cooking-3.jpg"
                      alt="Kobieta przygotowujaca ciasto do pieczenia"
                      className="absolute block h-full w-full animate-[image1_15s_ease-in-out_infinite] object-cover object-center"
                    />
                    <img
                      src="/images/hero166/cooking-4.jpg"
                      alt="Dwie kobiety gotujace razem przy kuchence"
                      className="absolute block h-full w-full animate-[image2_15s_ease-in-out_infinite] object-cover object-center"
                    />
                    <img
                      src="/images/hero166/cooking-5.jpg"
                      alt="Dwaj kucharze przygotowujacy dania w restauracyjnej kuchni"
                      className="absolute block h-full w-full animate-[image3_15s_ease-in-out_infinite] object-cover object-center"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center gap-4">
                  <div className="relative animate-[transform4_15s_ease-in-out_infinite] overflow-hidden rounded-lg">
                    <img
                      src="/images/hero166/cooking-6.jpg"
                      alt="Kucharz probujacy potrawy w nowoczesnej kuchni"
                      className="absolute block h-full w-full animate-[image3_15s_ease-in-out_infinite] object-cover object-center"
                    />
                  </div>
                  <div className="relative animate-[transform3_15s_ease-in-out_infinite] overflow-hidden rounded-lg">
                    <img
                      src="/images/hero166/cooking-7.jpg"
                      alt="Ojciec i syn piekacy razem w kuchni"
                      className="absolute block h-full w-full animate-[image1_15s_ease-in-out_infinite] object-cover object-center"
                    />
                    <img
                      src="/images/hero166/cooking-8.jpg"
                      alt="Ojciec z dzieckiem gotujacy wspolnie w kuchni"
                      className="absolute block h-full w-full animate-[image2_15s_ease-in-out_infinite] object-cover object-center"
                    />
                    <img
                      src="/images/hero166/cooking-2.jpg"
                      alt="Kobieta probujaca potrawy podczas gotowania"
                      className="absolute block h-full w-full animate-[image3_15s_ease-in-out_infinite] object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero166 };
