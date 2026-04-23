import { CircleArrowRight, Files, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

interface About1Props {
  className?: string;
}

export const About1 = ({ className }: About1Props) => {
  return (
    <section className={cn("bg-background py-32", className)}>
      <div className="theme-section-wrapper flex flex-col gap-16 lg:gap-28">
        <div className="flex flex-col gap-4 lg:gap-8">
          <h2 className="text-6xl lg:text-7xl">
            About Us
          </h2>
          <p className="max-w-xl text-2xl text-muted-foreground">
            Shadcnblocks.com makes it easy to build customer portals, CRMs,
            internal tools, and other business applications for your team. In
            minutes, not months.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
            alt="placeholder"
            className="size-full max-h-96 rounded-2xl object-cover"
            referrerPolicy="no-referrer"
          />

          <div className="flex flex-col justify-between gap-10 rounded-2xl bg-muted bg-[url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/christin-hume-Hcfwew744z4-unsplash.jpg')] bg-cover bg-center p-10">
            <p className="text-sm text-white">OUR MISSION</p>
            <p className="text-lg text-white">
              We believe that building software should be insanely easy. That
              everyone should have the freedom to create the tools they need,
              without any developers, designers or drama.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:gap-20">
          <div className="max-w-xl">
            <h3 className="mb-4 text-4xl md:text-5xl">
              We make creating software easy.
            </h3>
            <p className="text-2xl text-muted-foreground">
              We aim to help empower 1,000,000 teams to create their own
              software. Here is how we plan on doing it.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <ValueCard
              icon={<Files className="size-5" />}
              title="Being radically open"
              description="We believe there’s no room for big egos and there’s always time to help each other. We strive to give and receive feedback, ideas, perspectives"
            />
            <ValueCard
              icon={<CircleArrowRight className="size-5" />}
              title="Moving the needle"
              description="Boldly, bravely and with clear aims. We seek out the big opportunities and double down on the most important things to work on."
            />
            <ValueCard
              icon={<Settings className="size-5" />}
              title="Optimizing for empowerment"
              description="We believe that everyone should be empowered to do whatever they think is in the company's best interests."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard = ({ icon, title, description }: ValueCardProps) => {
  return (
    <div className="flex flex-col">
      <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
        {icon}
      </div>
      <h3 className="mb-3 mt-2 text-lg">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};