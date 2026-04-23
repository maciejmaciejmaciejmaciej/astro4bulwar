import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepDef {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface StepsGridProps {
  steps: StepDef[];
  className?: string;
}

export function StepsGrid({ steps, className }: StepsGridProps) {
  return (
    <section className={cn("w-full bg-white text-on-surface py-16", className)}>
      <div className="theme-section-wrapper">
        <div className="mx-auto max-w-4xl">
        <div className="grid gap-px overflow-hidden rounded-[4px] border border-zinc-200 bg-zinc-200 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex flex-col gap-3 bg-white p-6 md:gap-6">
                <Icon className="size-6 shrink-0 text-zinc-400" strokeWidth={1} />
                <div>
                  <h2 className="text-sm font-headline uppercase mb-2">
                    {step.title}
                  </h2>
                  <p className="text-xs md:text-sm text-zinc-500 font-body">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
