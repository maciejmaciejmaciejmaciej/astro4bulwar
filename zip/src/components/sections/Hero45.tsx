import { HandHelping, Users, Zap, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const features: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: HandHelping,
    title: "Flexible Support",
    description:
      "Benefit from around-the-clock assistance to keep your business running smoothly.",
  },
  {
    icon: Users,
    title: "Collaborative Tools",
    description:
      "Enhance teamwork with tools designed to simplify project management and communication.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Speed",
    description:
      "Experience the fastest load times with our high performance servers.",
  },
];

interface Hero45Props {
  className?: string;
}

export function Hero45({ className }: Hero45Props) {
  return (
    <section className={cn("py-8 sm:py-16 lg:py-24", className)}>
      <div className="w-full px-8">
        <div className="relative mx-auto w-full overflow-hidden rounded-xl">
          <img
            src="https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-01.png"
            alt="Workspace with laptop"
            className="aspect-video max-h-[500px] w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
          <div className="absolute -top-28 -right-28 -z-10 aspect-video h-72 w-96 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] [background-size:12px_12px] opacity-40 sm:bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]" />
          <div className="absolute -top-28 -left-28 -z-10 aspect-video h-72 w-96 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] [background-size:12px_12px] opacity-40 sm:bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]" />
        </div>

        <div className="mx-auto mt-10 flex w-full flex-col md:flex-row">
          {features.map((feature, index) => (
            <div key={feature.title} className="contents">
              {index > 0 ? (
                <div className="mx-6 hidden h-auto w-[2px] bg-linear-to-b from-muted via-transparent to-muted md:block" />
              ) : null}
              <div className="flex grow basis-0 flex-col rounded-md bg-background p-4">
                <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-background drop-shadow-lg">
                  <feature.icon className="h-auto w-5" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}