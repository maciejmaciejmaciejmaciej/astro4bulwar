import {
  ArrowDownToLine,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OccasionalMenuPdfDownloadFeature {
  icon: "groups" | "quality" | "format" | "events";
  title: string;
}

export interface OccasionalMenuPdfDownloadContent {
  title: string;
  subtitle: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  helperText: string;
  versionLabel: string;
  fileMeta: string;
  panelCaption: string;
  features: OccasionalMenuPdfDownloadFeature[];
}

export interface OccasionalMenuPdfDownloadSectionProps {
  content?: OccasionalMenuPdfDownloadContent;
  className?: string;
}

const featureIcons = {
  groups: Users,
  quality: ShieldCheck,
  format: FileText,
  events: Users,
} as const;

export const DEFAULT_OCCASIONAL_MENU_PDF_DOWNLOAD_CONTENT: OccasionalMenuPdfDownloadContent = {
  title: "Menu okolicznościowe",
  subtitle: "Pobierz aktualne menu w PDF i sprawdź propozycje na przyjęcia rodzinne, bankiety oraz spotkania firmowe.",
  primaryCta: {
    label: "Pobierz PDF",
    href: "#",
  },
  secondaryCta: {
    label: "Zobacz online",
    href: "/menu-okolicznosciowe-2025-skrocone",
  },
  helperText: "Bez logowania • Szybki podgląd • Gotowe do wysłania gościom",
  versionLabel: "PDF 2025",
  fileMeta: "2.3 MB",
  panelCaption: "Aktualne menu okolicznościowe restauracji",
  features: [
    {
      icon: "quality",
      title: "Jasno rozpisane zestawy, dodatki i serwis w standardzie Bulwar",
    },
    {
      icon: "format",
      title: "Wygodny plik PDF do wysyłki, druku i szybkiej konsultacji z gośćmi",
    },
  ],
};

export function OccasionalMenuPdfDownloadSection({
  content = DEFAULT_OCCASIONAL_MENU_PDF_DOWNLOAD_CONTENT,
  className,
}: OccasionalMenuPdfDownloadSectionProps) {
  return (
    <section className={cn("bg-white py-24 page-margin md:py-32", className)}>
      <div className="theme-radius-surface mx-auto max-w-screen-2xl border border-zinc-200 bg-white p-7 md:p-10 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.88fr)] lg:items-center lg:gap-18 lg:p-12 xl:px-14 xl:py-12">
          <div className="space-y-8 md:space-y-10 lg:pr-12">
            <div className="space-y-5 md:space-y-6">
              <h2 className="font-headline text-3xl uppercase md:text-4xl lg:text-5xl">
                {content.title}
              </h2>
              <div className="h-[1px] w-16 bg-black" />
              <p className="max-w-xl font-body text-sm text-zinc-500">
                {content.subtitle}
              </p>
            </div>

            <div className="space-y-5 md:space-y-6">
              {content.features.map((feature) => {
                const Icon = featureIcons[feature.icon];

                return (
                  <div key={feature.title} className="flex items-start gap-4 md:gap-5">
                    <div className="theme-radius-control flex size-11 shrink-0 items-center justify-center bg-surface-container-low text-zinc-500">
                      <Icon className="size-4 stroke-[1.35]" />
                    </div>
                    <p className="pt-2 font-body text-sm text-on-surface">
                      {feature.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:flex lg:justify-end">
            <div className="theme-radius-surface w-full border border-zinc-200 bg-surface p-7 text-center shadow-[0_6px_24px_rgba(15,23,42,0.06)] md:p-9 lg:max-w-[420px] lg:p-10">
              <div className="space-y-4 border-b border-zinc-200 pb-7 md:pb-8">
                <div className="flex items-center justify-center gap-3">
                  <span className="font-headline text-4xl text-on-surface">
                    {content.versionLabel}
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="font-body text-sm text-zinc-500">
                    {content.fileMeta}
                  </span>
                </div>
                <p className="font-body text-sm text-zinc-500">
                  {content.panelCaption}
                </p>
              </div>

              <div className="space-y-4 pt-7 md:pt-8">
                <Button
                  nativeButton={false}
                  className="theme-radius-control h-auto w-full bg-primary px-6 py-4 font-label text-base text-on-primary transition-opacity hover:opacity-80 md:px-8"
                  render={<a href={content.primaryCta.href} />}
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowDownToLine className="size-4" />
                    {content.primaryCta.label}
                  </span>
                </Button>

                <div className="space-y-3">
                  <a
                    href={content.secondaryCta.href}
                    className="inline-flex font-label text-xs uppercase text-on-surface transition-opacity hover:opacity-70"
                  >
                    {content.secondaryCta.label}
                  </a>
                  <p className="font-body text-xs text-zinc-500">
                    {content.helperText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}