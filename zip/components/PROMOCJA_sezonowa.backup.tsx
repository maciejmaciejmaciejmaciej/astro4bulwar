import { CalendarDays, UtensilsCrossed } from "lucide-react";

import { cn } from "@/lib/utils";

interface PROMOCJA_sezonowaProps {
  className?: string;
}

const PROMOCJA_sezonowa = ({ className }: PROMOCJA_sezonowaProps) => {
  return (
    <section className={cn("page-margin py-32", className)}>
      <div className="mx-auto max-w-screen-2xl space-y-10 lg:space-y-20">
        <div className="w-full grid-cols-6 gap-10 lg:grid">
          <div />
          <h1 className="col-span-4 font-headline text-5xl font-medium tracking-[0.2rem] uppercase leading-none lg:pr-24 lg:pl-10 lg:text-8xl">
            Our story
          </h1>
        </div>

        <div className="grid-cols-6 space-y-12 lg:grid lg:space-y-0 xl:gap-10">
          <p className="hidden font-label text-xs tracking-[0.16rem] uppercase text-zinc-500 lg:block">
            Our Crew, Our story
          </p>

          <div className="col-span-2 space-y-5 lg:pr-24 lg:pl-10">
            <div className="flex items-center gap-4 rounded-[4px]">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[4px] bg-surface-container-low text-on-surface">
                <CalendarDays className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline text-lg font-medium tracking-tight text-on-surface">
                  John Doe1
                </h3>
                <p className="font-body text-sm text-zinc-500">
                  Creative Director1
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[4px]">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[4px] bg-surface-container-low text-on-surface">
                <UtensilsCrossed className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline text-lg font-medium tracking-tight text-on-surface">
                  John Doe2
                </h3>
                <p className="font-body text-sm text-zinc-500">
                  Creative Director2
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-3 mt-32 lg:mt-0 lg:pl-10">
            <h2 className="font-body text-2xl font-medium leading-snug text-on-surface lg:text-3xl">
              We are a team of creators, thinkers, and builders who believe in
              crafting experiences that truly connect. Our story is built on
              passion, innovation, and the drive to bring meaningful ideas to
              life.
            </h2>
          </div>
        </div>

        <div>
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri4/img10.png"
            alt="about us image"
            className="mt-4 h-150 w-full rounded-[4px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export { PROMOCJA_sezonowa };