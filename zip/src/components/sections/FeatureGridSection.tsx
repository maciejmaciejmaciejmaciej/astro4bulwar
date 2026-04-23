import type { ReactNode } from "react";
import { Expand, Globe, LucideIcon, Rocket, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureGridItem {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
}

interface FeatureGridSectionProps {
  items?: FeatureGridItem[];
  className?: string;
}

const defaultItems: FeatureGridItem[] = [
  {
    icon: Globe,
    title: "Robust Infrastructure",
    description: "Reliable and scalable infrastructure, easy to manage.",
  },
  {
    icon: Rocket,
    title: "Easy Setup",
    description: "Quick and simple configuration for any use case.",
  },
  {
    icon: Expand,
    title: "Effortless Scaling",
    description: "Built to handle increased demand with ease.",
  },
  {
    icon: Wrench,
    title: "Low Maintenance",
    description: "Focus on building, not on maintenance tasks.",
  },
];

const FeatureGridSection = ({ items = defaultItems, className }: FeatureGridSectionProps) => {
  return (
    <section className={cn("pt-16 pb-32 bg-white text-on-surface page-margin", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-px overflow-hidden rounded-[4px] border border-zinc-200 bg-zinc-200 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="flex flex-col gap-3 bg-white p-6 md:gap-6">
                <Icon className="size-6 shrink-0 text-zinc-400" />
                <div>
                  <h2 className="font-headline text-sm uppercase mb-2">
                    {item.title}
                  </h2>
                  <div className="text-sm text-zinc-500 font-body [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:pl-1">
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { FeatureGridSection };