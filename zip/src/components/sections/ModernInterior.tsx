import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface ModernInteriorImage {
  src: string;
  alt: string;
}

export interface ModernInteriorContent {
  title: string;
  paragraphs: string[];
  buttonText: string;
  buttonLink: string;
  image1: ModernInteriorImage;
  image2: ModernInteriorImage;
}

export const DEFAULT_MODERN_INTERIOR_CONTENT: ModernInteriorContent = {
  title: "O restauracji",
  paragraphs: [
    "Od 2011 roku prowadzimy restaurację z autorską kuchnią, w której czerpiemy z dobrych, sprawdzonych tradycji kuchni europejskiej. Naszym głównym założeniem przy kreowaniu nowych dań jest smak.",
    "Z przyjemnością ugościmy Państwa na wyjątkowym lunchu, eleganckiej kolacji, a także w niedzielne przedpołudnia przy obfitym rodzinnym stole. W letnie dni udostępniamy zielony ogródek letni, który staje się oazą, osłoniętą od miejskiego hałasu.",
  ],
  buttonText: "CZYTAJ WIĘCEJ",
  buttonLink: "/o-restauracji",
  image1: {
    src: "/react/images/about_1.jpg",
    alt: "Wnętrze restauracji",
  },
  image2: {
    src: "/react/images/about_front.jpg",
    alt: "Detale dekoracji",
  },
};

export interface ModernInteriorProps {
  content?: ModernInteriorContent;
  className?: string;
  title?: string;
  paragraphs?: string[];
  buttonText?: string;
  buttonLink?: string;
  image1Src?: string;
  image1Alt?: string;
  image2Src?: string;
  image2Alt?: string;
}

export function ModernInterior({
  content,
  className,
  title,
  paragraphs,
  buttonText,
  buttonLink,
  image1Src,
  image1Alt,
  image2Src,
  image2Alt,
}: ModernInteriorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedContent = content ?? {
    title: title ?? DEFAULT_MODERN_INTERIOR_CONTENT.title,
    paragraphs: paragraphs ?? DEFAULT_MODERN_INTERIOR_CONTENT.paragraphs,
    buttonText: buttonText ?? DEFAULT_MODERN_INTERIOR_CONTENT.buttonText,
    buttonLink: buttonLink ?? DEFAULT_MODERN_INTERIOR_CONTENT.buttonLink,
    image1: {
      src: image1Src ?? DEFAULT_MODERN_INTERIOR_CONTENT.image1.src,
      alt: image1Alt ?? DEFAULT_MODERN_INTERIOR_CONTENT.image1.alt,
    },
    image2: {
      src: image2Src ?? DEFAULT_MODERN_INTERIOR_CONTENT.image2.src,
      alt: image2Alt ?? DEFAULT_MODERN_INTERIOR_CONTENT.image2.alt,
    },
  };
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  return (
    <section
      ref={containerRef}
      className={className ? `py-32 bg-white overflow-hidden page-margin ${className}` : "py-32 bg-white overflow-hidden page-margin"}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 max-w-xl">
          <div className="space-y-8">
            <h2 className="font-headline text-4xl uppercase">{resolvedContent.title}</h2>
            <div className="w-12 h-[1px] bg-primary"></div>
          </div>
          <div className="space-y-6 text-zinc-500 font-body text-sm pr-[20%] text-justify">
            {resolvedContent.paragraphs.map((text, idx) => (
              <p key={idx}>{text}</p>
            ))}
          </div>
          <Button asChild className="bg-black text-white px-8 py-6 font-label uppercase text-sm hover:bg-zinc-800 transition-colors theme-radius-control">
            <a href={resolvedContent.buttonLink}>{resolvedContent.buttonText}</a>
          </Button>
        </div>
        <div className="relative h-[600px] w-full mt-12 lg:mt-0">
          <motion.div 
            style={{ y: y1 }}
            className="absolute top-0 right-0 w-4/5 h-4/5 overflow-hidden shadow-2xl theme-radius-media z-0"
          >
            <img
              alt={resolvedContent.image1.alt}
              className="w-full h-full object-cover theme-radius-media"
              src={resolvedContent.image1.src}
            />
          </motion.div>
          <motion.div 
            style={{ y: y2 }}
            className="absolute bottom-10 left-0 w-3/5 h-3/5 overflow-hidden shadow-2xl z-10 theme-radius-media"
          >
            <img
              alt={resolvedContent.image2.alt}
              className="w-full h-full object-cover theme-radius-media"
              src={resolvedContent.image2.src}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
