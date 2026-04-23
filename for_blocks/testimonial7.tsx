"use client";

import * as React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const testimonials1 = [
  {
    name: "Sarah Chen",
    role: "CEO & Founder",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar1.webp",
    content:
      "This component library has transformed how we build products. We shipped our entire dashboard in half the time.",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar2.webp",
    content:
      "The attention to accessibility and performance is impressive. Our Lighthouse scores improved significantly.",
  },
  {
    name: "Emily Watson",
    role: "Head of Product",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar3.webp",
    content:
      "Finally, a design system that developers actually want to use. The documentation is clear and defaults are sensible.",
  },
  {
    name: "David Kim",
    role: "Tech Lead",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar4.webp",
    content:
      "This library strikes the perfect balance between opinionated defaults and customization flexibility.",
  },
  {
    name: "Rachel Foster",
    role: "Senior Designer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar5.webp",
    content:
      "The components match our Figma designs closely. The design-to-dev handoff has never been smoother.",
  },
  {
    name: "James Mitchell",
    role: "Full Stack Developer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar6.webp",
    content:
      "The TypeScript support is excellent. Autocomplete just works, and I catch errors before they hit production.",
  },
];

const testimonials2 = [
  {
    name: "Nina Patel",
    role: "UX Engineer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar7.jpg",
    content:
      "These components handle edge cases I didn't even know existed. Dark mode and RTL support work out of the box.",
  },
  {
    name: "Alex Thompson",
    role: "Engineering Manager",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar8.jpg",
    content:
      "Our team's velocity increased noticeably. Less time on UI boilerplate means more time on business logic.",
  },
  {
    name: "Jordan Lee",
    role: "Frontend Developer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar9.jpg",
    content:
      "I love how easy it is to customize components without fighting against the library. Great composability.",
  },
  {
    name: "Priya Sharma",
    role: "Product Designer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar10.jpg",
    content:
      "The visual consistency across all components is remarkable. Our app finally looks cohesive.",
  },
  {
    name: "Michael Brown",
    role: "Startup Founder",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar11.jpg",
    content:
      "We launched our MVP in record time thanks to these components. Saved us months of development.",
  },
  {
    name: "Lisa Wang",
    role: "DevOps Engineer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar12.jpg",
    content:
      "Even from an infrastructure perspective, the bundle sizes are reasonable and performance is solid.",
  },
];

interface Testimonial7Props {
  className?: string;
}

const Testimonial7 = ({ className }: Testimonial7Props) => {
  const [plugins, setPlugins] = React.useState<[unknown[], unknown[]]>([[], []]);

  React.useEffect(() => {
    let isMounted = true;

    import("embla-carousel-auto-scroll")
      .then((module) => {
        if (!isMounted) return;

        setPlugins([
          [
            module.default({
              startDelay: 500,
              speed: 0.7,
            }),
          ],
          [
            module.default({
              startDelay: 500,
              speed: 0.7,
              direction: "backward",
            }),
          ],
        ]);
      })
      .catch(() => {
        if (!isMounted) return;
        setPlugins([[], []]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto flex flex-col gap-16">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
          <Badge variant="outline">Testimonials</Badge>
          <h2 className="text-center text-3xl lg:text-5xl">
            Meet Our Happy Clients
          </h2>
          <p className="text-center text-muted-foreground lg:text-lg">
            Hear from the teams who have transformed their workflow with our
            components.
          </p>
        </div>
        <div className="w-full space-y-6 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={plugins[0]}
          >
            <CarouselContent className="-ml-4">
              {testimonials1.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-auto py-px pl-4">
                  <Card className="max-w-96 gap-2 p-6 select-none">
                    <div className="mb-4 flex gap-4">
                      <Avatar className="size-9 rounded-full ring-1 ring-input">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <q className="text-muted-foreground">
                      {testimonial.content}
                    </q>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={plugins[1]}
          >
            <CarouselContent className="-ml-4">
              {testimonials2.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-auto py-px pl-4">
                  <Card className="max-w-96 p-6 select-none">
                    <div className="mb-4 flex gap-4">
                      <Avatar className="size-9 rounded-full ring-1 ring-input">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <q className="text-muted-foreground">
                      {testimonial.content}
                    </q>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export { Testimonial7 };
