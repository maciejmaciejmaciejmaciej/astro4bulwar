import { motion } from "framer-motion";
import { Forward } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

interface Feature285Props {
  className?: string;
}

const images = [
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img11.jpeg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img1.jpeg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img7.jpeg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img12.jpeg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img13.jpeg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img3.jpeg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img11.jpeg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img1.jpeg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img7.jpeg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img12.jpeg",
];

const brand = {
  url: "https://www.shadcnblocks.com",
  src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
  alt: "logo",
  title: "Shadcnblocks.com",
};

export const Feature285 = ({ className }: Feature285Props) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      className={cn(
        "h-full overflow-hidden bg-white py-32 lg:h-screen",
        className,
      )}
    >
      <div className="theme-section-wrapper flex h-full items-center justify-center">
        <div className="grid h-full w-full grid-cols-1 overflow-hidden rounded-4xl bg-muted lg:grid-cols-2">
          <div className="relative flex flex-col justify-between p-10 md:p-12 lg:p-[3.75rem]">
            <a href={brand.url} className="flex items-center gap-2">
              <img
                src={brand.src}
                className="max-h-8 w-8"
                alt={brand.alt}
                referrerPolicy="no-referrer"
              />
              <span className="text-xl">
                {brand.title}
              </span>
            </a>

            <div>
              <h2 className="relative mt-12 text-4xl md:text-5xl lg:mt-0 xl:text-6xl">
                Built by Developers for Developers
              </h2>
              <p className="mx-auto mb-10 mt-2 max-w-2xl text-2xl text-muted-foreground/70">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
                suscipit dolor blanditiis voluptatum minus est labore amet
                necessitatibus quod distinctio! ipsum dolor sit
              </p>
            </div>

            <Button
              nativeButton={false}
              render={<a href={brand.url} />}
              className="h-12 w-fit rounded-xl !px-5"
            >
              Be a Member <Forward />
            </Button>
          </div>

          <div className="relative flex h-[30rem] flex-row items-center justify-end overflow-hidden lg:h-full">
            <ImageMarquee
              images={images}
              hoveredIndex={hoveredIndex}
              onHoverChange={setHoveredIndex}
            />
            <ImageMarquee
              images={images}
              hoveredIndex={hoveredIndex}
              onHoverChange={setHoveredIndex}
              reverse
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 block h-1/4 bg-gradient-to-b from-muted lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
};

interface ImageMarqueeProps {
  images: string[];
  hoveredIndex: number | null;
  onHoverChange: (index: number | null) => void;
  reverse?: boolean;
}

const ImageMarquee = ({
  images,
  hoveredIndex,
  onHoverChange,
  reverse = false,
}: ImageMarqueeProps) => {
  return (
    <Marquee
      pauseOnHover
      vertical
      reverse={reverse}
      className="[--duration:20s]"
    >
      {images.map((image, index) => (
        <motion.img
          key={`${reverse ? "marquee2" : "marquee1"}-${image}-${index}`}
          onMouseEnter={() => onHoverChange(index)}
          onMouseLeave={() => onHoverChange(null)}
          transition={{
            duration: 0.2,
            ease: "easeOut",
            delay: index * 0.1 + 0.5,
          }}
          animate={{
            filter:
              hoveredIndex !== null && hoveredIndex !== index
                ? "blur(10px)"
                : "blur(0px)",
            transition: {
              duration: 0.3,
              ease: "easeOut",
              delay: 0,
            },
          }}
          src={image}
          alt=""
          className="w-full rounded-3xl object-cover lg:h-60"
          referrerPolicy="no-referrer"
        />
      ))}
    </Marquee>
  );
};