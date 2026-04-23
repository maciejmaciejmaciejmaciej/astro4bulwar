import Template2Cta from "../components/sections/Template2Cta";
import { About1 } from "../components/sections/About1";
import { About3 } from "../components/sections/About3";
import { About28 } from "../components/sections/About28";
import { Feature160 } from "../components/sections/Feature160";
import { Feature20 } from "../components/sections/Feature20";
import { Feature314 } from "../components/sections/Feature314";
import { Feature314ver2 } from "../components/sections/Feature314ver2";
import { Feature285 } from "../components/sections/Feature285";
import { Hero214 } from "../components/sections/Hero214";
import { Hero45 } from "../components/sections/Hero45";
import { Logos10 } from "../components/sections/Logos10";
import { Testimonial7 } from "../components/sections/Testimonial7";

export default function TemplatePage2() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="page-margin py-16 md:py-20">
        <div className="max-w-7xl">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Template 2
          </p>
          <h1 className="mt-4 font-headline text-4xl uppercase tracking-tight md:text-6xl">
            Empty Preview Canvas
          </h1>
          <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-muted-foreground md:text-base">
            Tu doklejamy nowe komponenty do szybkiego preview i dopasowania do aktualnego theme.
          </p>
        </div>
      </section>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            CTA
          </p>
        </div>
        <Template2Cta />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Hero45
          </p>
        </div>
        <Hero45 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Hero214
          </p>
        </div>
        <Hero214 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Feature314
          </p>
        </div>
        <Feature314 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Feature314ver2
          </p>
        </div>
        <Feature314ver2 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            About1
          </p>
        </div>
        <About1 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            About28
          </p>
        </div>
        <About28 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            About3
          </p>
        </div>
        <About3 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Feature285
          </p>
        </div>
        <Feature285 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Logos10
          </p>
        </div>
        <Logos10 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Testimonial7
          </p>
        </div>
        <Testimonial7 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Feature20
          </p>
        </div>
        <Feature20 />
      </div>

      <div>
        <div className="page-margin mb-5 md:mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            Feature160
          </p>
        </div>
        <Feature160 />
      </div>
    </main>
  );
}