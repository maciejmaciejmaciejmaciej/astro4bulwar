import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO & Founder",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar1.webp",
    content:
      "This component library has transformed how we build products. We shipped our entire dashboard in half the time it would have taken otherwise.",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar2.webp",
    content:
      "The attention to accessibility and performance is impressive. Our Lighthouse scores improved significantly after adopting these components.",
  },
  {
    name: "Emily Watson",
    role: "Head of Product",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar3.webp",
    content:
      "Finally, a design system that developers actually want to use. The documentation is clear, the components are flexible, and the defaults are sensible. It's rare to find all three.",
  },
  {
    name: "David Kim",
    role: "Tech Lead",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar4.webp",
    content:
      "We've tried many UI libraries over the years. This one strikes the perfect balance between opinionated defaults and customization flexibility.",
  },
  {
    name: "Rachel Foster",
    role: "Senior Designer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar5.webp",
    content:
      "As a designer, I appreciate how closely the components match our Figma designs. The design-to-dev handoff has never been smoother. Every pixel is intentional, and the spacing system makes it easy to maintain consistency across screens. I've worked with many component libraries, but this is the first one where I don't have to constantly override styles.",
  },
  {
    name: "James Mitchell",
    role: "Full Stack Developer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar6.webp",
    content:
      "The TypeScript support is excellent. Autocomplete just works, and I catch errors before they hit production. The DX is top-notch.",
  },
  {
    name: "Nina Patel",
    role: "UX Engineer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar7.jpg",
    content:
      "These components handle edge cases I didn't even know existed. Dark mode, RTL support, keyboard navigation - it's all there out of the box.",
  },
  {
    name: "Alex Thompson",
    role: "Engineering Manager",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar8.jpg",
    content:
      "Our team's velocity increased noticeably after adopting this library. Less time on UI boilerplate means more time on business logic.",
  },
];

interface Testimonial1Props {
  className?: string;
}

const Testimonial1 = ({ className }: Testimonial1Props) => {
  const getColumns = (count: number) => {
    return Array.from({ length: count }, (_, colIdx) =>
      testimonials.filter((_, i) => i % count === colIdx),
    );
  };

  const mobileColumns = getColumns(2);
  const tabletColumns = getColumns(3);
  const desktopColumns = getColumns(4);

  return (
    <section className={cn("overflow-hidden border-b pt-32", className)}>
      <div className="container">
        <div className="flex flex-col items-center gap-6">
          <Badge variant="outline">Testimonials</Badge>
          <h2 className="text-center text-3xl tracking-tight lg:text-5xl">
            Meet Our Happy Clients
          </h2>
          <p className="text-center text-muted-foreground lg:text-lg">
            Hear from the teams who have transformed their workflow with our
            components.
          </p>
        </div>
      </div>

      <div className="container mt-10 h-[450px] md:h-[500px] lg:h-[522px]">
        {/* Mobile: 2 columns */}
        <div className="flex gap-4 md:hidden">
          {mobileColumns.map((column, colIdx) => (
            <div
              key={colIdx}
              className={cn(
                "flex w-1/2 flex-col gap-4",
                colIdx === 1 && "mt-8",
              )}
            >
              {column.map((testimonial, idx) => (
                <Card key={idx}>
                  <CardContent className="px-4 text-sm leading-6 text-muted-foreground">
                    <q>{testimonial.content}</q>
                  </CardContent>
                  <CardFooter className="px-4">
                    <div className="flex gap-3 leading-5">
                      <Avatar className="size-8 rounded-full ring-1 ring-input">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div className="text-xs">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ))}
        </div>

        {/* Tablet: 3 columns */}
        <div className="hidden gap-4 md:flex lg:hidden">
          {tabletColumns.map((column, colIdx) => (
            <div
              key={colIdx}
              className={cn(
                "flex w-1/3 flex-col gap-4",
                colIdx === 1 && "mt-10",
                colIdx === 2 && "mt-20",
              )}
            >
              {column.map((testimonial, idx) => (
                <Card key={idx}>
                  <CardContent className="px-6 leading-7 text-muted-foreground">
                    <q>{testimonial.content}</q>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-4 leading-5">
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
                  </CardFooter>
                </Card>
              ))}
            </div>
          ))}
        </div>

        {/* Desktop: 4 columns */}
        <div className="hidden gap-4 lg:flex">
          {desktopColumns.map((column, colIdx) => (
            <div
              key={colIdx}
              className={cn(
                "flex w-1/4 flex-col gap-4",
                colIdx === 1 && "mt-10",
                colIdx === 2 && "mt-20",
              )}
            >
              {column.map((testimonial, idx) => (
                <Card key={idx}>
                  <CardContent className="px-6 leading-7 text-muted-foreground">
                    <q>{testimonial.content}</q>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-4 leading-5">
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
                  </CardFooter>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Testimonial1 };
