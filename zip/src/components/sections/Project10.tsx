"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Project10Props {
  content?: Project10Content;
  className?: string;
}

export interface Project10MetadataItem {
  label: string;
  value: string;
}

export interface Project10StorySection {
  number: string;
  title: string;
  content: string;
}

export interface Project10Content {
  eyebrow: string;
  title: string;
  description: string;
  metadataItems: Project10MetadataItem[];
  contactCta?: {
    label: string;
    buttonLabel: string;
    href: string;
  };
  heroImage: {
    src: string;
    alt: string;
  };
  storySections: Project10StorySection[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const DEFAULT_PROJECT10_CONTENT: Project10Content = {
  eyebrow: "Visual Sandbox",
  title: "Bulwar Photo Story",
  description:
    "Sekcja pokazuje klimat marki przez kadry wnętrza, fasady i miejskiego kontekstu. Zachowuje układ z dostarczonego bloku, ale używa lokalnych zdjęć, istniejącej typografii i rytmu spacingu z TemplatePage.",
  metadataItems: [
    {
      label: "Kategoria:",
      value: "Imprezy okolicznościowe",
    },
    {
      label: "Tel:",
      value: "+48 000 000 000",
    },
    {
      label: "Adres:",
      value: "BulwaR, Stary Rynek 37, Poznań",
    },
  ],
  contactCta: {
    label: "Wolne terminy:",
    buttonLabel: "wyślij zapytanie",
    href: "#",
  },
  heroImage: {
    src: "/react/images/home_hero.jpg",
    alt: "Widok główny restauracji Bulwar",
  },
  storySections: [
    {
      number: "01.",
      title: "Inspiration.",
      content:
        "Punktem wyjścia jest kontrast pomiędzy spokojem wnętrza a rytmem miasta widocznego wokół restauracji. Kadry mają podkreślać światło, faktury materiałów i elegancki, ale swobodny charakter miejsca.",
    },
    {
      number: "02.",
      title: "Challenges.",
      content:
        "Najtrudniejsze jest utrzymanie równowagi między detalem produktu, architekturą sali i czytelną obecnością gości. Sekcja musi wyglądać lekko na mobile i zachować spokojny, editorialowy charakter na szerokich ekranach.",
    },
    {
      number: "03.",
      title: "Reward.",
      content:
        "Efektem jest blok, który działa jak wizualny reportaż i naturalnie wpisuje się w istniejący język strony. To dobry kandydat do dalszego dopracowania przed późniejszą refaktoryzacją do bardziej reużywalnej wersji.",
    },
  ],
};

export function Project10({
  content = DEFAULT_PROJECT10_CONTENT,
  className,
}: Project10Props) {
  return (
    <section className={cn("bg-white py-24 text-on-surface page-margin md:py-32", className)}>
      <motion.div
        className="mx-auto max-w-screen-2xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.header
          className="border-b border-outline-variant/20 pb-12 md:pb-16"
          variants={itemVariants}
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.85fr)] lg:items-start lg:gap-14">
            <div className="space-y-6">
              <p className="font-label text-xs uppercase text-zinc-500">
                {content.eyebrow}
              </p>
              <div className="space-y-4">
                <h2 className="font-headline text-4xl uppercase md:text-6xl">
                  {content.title}
                </h2>
                <div className="h-px w-12 bg-primary" />
              </div>
              <p className="max-w-2xl font-body text-base text-zinc-500 md:text-lg">
                {content.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:items-end lg:text-right">
              {content.metadataItems.map((item) => (
                <div key={item.label} className="max-w-[320px] space-y-0.5 lg:ml-auto">
                  <p className="font-label text-[11px] uppercase text-zinc-500">
                    {item.label}
                  </p>
                  <p className="font-headline text-sm text-on-surface md:text-base">
                    {item.value}
                  </p>
                </div>
              ))}

              {content.contactCta ? (
                <div className="max-w-[320px] space-y-1 lg:ml-auto">
                  <p className="font-label text-[11px] uppercase text-zinc-500">
                    {content.contactCta.label}
                  </p>
                  <Button
                    nativeButton={false}
                    render={<a href={content.contactCta.href} />}
                    className="inline-flex bg-primary text-on-primary px-8 py-4 text-sm font-label uppercase hover:opacity-70 transition-opacity theme-radius-control"
                  >
                    {content.contactCta.buttonLabel}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </motion.header>

        <motion.div
          className="mt-12 overflow-hidden theme-radius-surface bg-surface-container-low md:mt-16"
          variants={imageVariants}
        >
          <img
            src={content.heroImage.src}
            alt={content.heroImage.alt}
            className="h-[380px] w-full object-cover md:h-[520px]"
          />
        </motion.div>

        <div className="mb-20 mt-12 space-y-12 md:mb-24 md:mt-16 md:space-y-16">
          {content.storySections.map((section) => (
            <motion.section key={section.number} variants={itemVariants}>
              <div className="grid items-start gap-8 border-b border-outline-variant/20 pb-8 lg:pb-12">
                <div>
                  <span className="font-headline text-4xl text-zinc-400 sm:text-5xl lg:text-6xl">
                    {section.number}
                  </span>
                  <h3 className="mt-4 font-headline text-2xl uppercase sm:text-3xl">
                    {section.title}
                  </h3>
                </div>
                <div>
                  <p className="font-body text-base text-zinc-500 md:text-lg">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </section>
  );
}