import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Image {
  src: string;
  alt: string;
}

interface TextContent {
  title?: string;
  paragraphs: string[];
  ctaButton?: {
    href: string;
    text: string;
  };
}

interface About28Props {
  leftImages?: Image[];
  leftText?: TextContent;
  rightText?: TextContent;
  rightImages?: Image[];
  className?: string;
}

export const About28 = ({
  leftImages = [
    {
      src: "https://picsum.photos/seed/kitchen1/800/600",
      alt: "Culinary preparation",
    },
    {
      src: "https://picsum.photos/seed/kitchen2/800/600",
      alt: "Chef plating",
    },
  ],
  leftText = {
    title: "The Kitchen",
    paragraphs: [
      "Our culinary journey began with a simple premise: to respect the ingredient above all else. Every dish on our menu has been designed from the ground up — honoring traditional techniques while embracing modern innovation.",
      "We are an independent, chef-driven establishment. Over time, our menu evolves with the seasons, but our focus remains steadfast on delivering an unforgettable dining experience.",
      "If you share our passion for exceptional gastronomy, explore our career opportunities.",
    ],
    ctaButton: {
      href: "#",
      text: "Join Our Team",
    },
  },
  rightText = {
    paragraphs: [
      "We are dedicated to transforming the way you experience fine dining. Our mission is to provide our guests with an unbeatable journey through taste, texture, and aroma, guided by our actionable insights into local sourcing and seamless service.",
      "We're guest-obsessed — investing the time to understand every aspect of your dining preferences so that we can help you celebrate life's moments better than ever before. Your satisfaction is our ultimate reward.",
    ],
  },
  rightImages = [
    {
      src: "https://picsum.photos/seed/dining1/800/600",
      alt: "Elegant dining room",
    },
    {
      src: "https://picsum.photos/seed/dining2/800/600",
      alt: "Wine selection",
    },
  ],
  className,
}: About28Props) => {
  return (
    <section
      className={cn(
        "container mx-auto mt-10 flex max-w-5xl flex-col-reverse gap-8 md:mt-14 md:gap-14 lg:mt-20 lg:flex-row lg:items-end bg-white py-20 px-4 md:px-8",
        className,
      )}
    >
      {/* Images Left - Text Right */}
      <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20 w-full lg:w-1/2">
        <ImageSection images={leftImages} className="xl:-translate-x-10" />
        <TextSection
          title={leftText.title}
          paragraphs={leftText.paragraphs}
          ctaButton={leftText.ctaButton}
        />
      </div>

      {/* Text Left - Images Right */}
      <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20 w-full lg:w-1/2">
        <TextSection paragraphs={rightText.paragraphs} />
        <ImageSection
          images={rightImages}
          className="hidden lg:flex xl:translate-x-10"
        />
      </div>
    </section>
  );
};

interface ImageSectionProps {
  images: Image[];
  className?: string;
}

const ImageSection = ({ images, className }: ImageSectionProps) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-[2/1.5] overflow-hidden rounded-[4px]"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 size-full object-cover rounded-[4px]"
            referrerPolicy="no-referrer"
          />
        </div>
      ))}
    </div>
  );
};

interface TextSectionProps {
  title?: string;
  paragraphs: string[];
  ctaButton?: {
    href: string;
    text: string;
  };
}

const TextSection = ({ title, paragraphs, ctaButton }: TextSectionProps) => {
  return (
    <div className="flex-1 space-y-4 text-lg md:space-y-6">
      {title && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-8 bg-primary"></div>
            <span className="font-label text-[10px] tracking-widest uppercase text-zinc-500">
              OUR STORY
            </span>
          </div>
          <h2 className="font-headline text-4xl tracking-[0.2rem] uppercase leading-tight text-foreground">{title}</h2>
        </div>
      )}
      <div className="max-w-xl space-y-6 text-muted-foreground">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="font-body text-sm leading-relaxed text-zinc-500">{paragraph}</p>
        ))}
      </div>
      {ctaButton && (
        <div className="mt-8">
          <Button nativeButton={false} className="bg-primary text-on-primary px-8 py-4 font-label tracking-[0.1em] uppercase text-[11px] hover:opacity-80 transition-opacity rounded-[4px]" render={<a href={ctaButton.href} />}>
            {ctaButton.text}
          </Button>
        </div>
      )}
    </div>
  );
};
