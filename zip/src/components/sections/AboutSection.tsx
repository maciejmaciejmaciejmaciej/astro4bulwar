import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export interface Image {
  src: string;
  alt: string;
}

export interface TextContent {
  title?: string;
  paragraphs: string[];
  ctaButton?: {
    href: string;
    text: string;
  };
}

export interface AboutSectionProps {
  leftImages?: Image[];
  leftText?: TextContent;
  rightText?: TextContent;
  rightImages?: Image[];
  className?: string;
}

export function AboutSection({
  leftImages = [],
  leftText = { paragraphs: [] },
  rightText = { paragraphs: [] },
  rightImages = [],
  className,
}: AboutSectionProps) {
  return (
    <section className={cn("overflow-x-hidden", className)}>
      <div className="theme-section-wrapper py-32">
        <div className="mx-auto max-w-5xl px-4 md:px-0">
          <div className="flex flex-col-reverse gap-8 md:gap-14 lg:flex-row lg:items-center">
            {/* Images Left - Text Right */}
            <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20 flex-[1] lg:flex-[1.2]">
              {leftImages.length > 0 && <ImageSection images={leftImages} className="xl:-translate-x-10" />}
              {(leftText.title || leftText.paragraphs.length > 0) && (
                <TextSection
                  title={leftText.title}
                  paragraphs={leftText.paragraphs}
                  ctaButton={leftText.ctaButton}
                />
              )}
            </div>

            {/* Text Left - Images Right */}
            <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20 flex-[1] lg:flex-[0.8]">
              {rightText.paragraphs.length > 0 && <TextSection paragraphs={rightText.paragraphs} />}
              {rightImages.length > 0 && (
                <ImageSection
                  images={rightImages}
                  className="hidden lg:flex xl:translate-x-10"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
          className="relative aspect-[4/3] w-full overflow-hidden rounded-sm"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 size-full object-cover transition-transform duration-1000 origin-center hover:scale-110"
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
    <div className="flex-1 space-y-8">
      {title && (
        <h2 className="font-headline text-4xl uppercase">
          {title}
        </h2>
      )}
      <div className="space-y-6 text-zinc-500 font-body text-sm">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {ctaButton && (
        <div className="mt-4">
          <Button
            className="bg-primary text-on-primary px-8 py-4 font-label uppercase text-sm hover:opacity-80 transition-opacity rounded-[4px]"
            asChild
          >
            <Link to={ctaButton.href}>{ctaButton.text}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
