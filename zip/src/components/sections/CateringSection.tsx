"use client";

import { motion } from "framer-motion";
import { Forward } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Marquee } from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CateringSectionWidthMode = "default" | "promo2-contained";

export interface CateringSectionImage {
  src: string;
  alt?: string;
}

export interface CateringSectionProps {
  className?: string;
  heading: string;
  description: React.ReactNode;
  buttonText: string;
  buttonHref?: string;
  logoSrc?: string;
  brandName?: string;
  images: CateringSectionImage[];
  widthMode?: CateringSectionWidthMode;
}

export function CateringSection({
  className,
  heading,
  description,
  buttonText,
  buttonHref = "#",
  images,
  widthMode = "default",
}: CateringSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Split images into two halves for the two marquees
  const half = Math.ceil(images.length / 2);
  const marquee1Images = images.length > 0 ? images.slice(0, half) : [];
  const marquee2Images = images.length > 0 ? images.slice(half) : [];

  return (
    <section className={cn(className)}>
      <div className="theme-section-wrapper">
        <div className={cn(widthMode === "promo2-contained" ? "mx-auto max-w-screen-2xl" : null)}>
        <div className="py-32 bg-surface-container-low theme-radius-surface">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-16 items-center lg:grid-cols-2">
        {/* Left side text */}
        <div className="space-y-10 max-w-xl">
          <div className="space-y-8">
            <h2 className="font-headline text-4xl uppercase">
              {heading}
            </h2>
            <div className="w-12 h-[1px] bg-primary"></div>
          </div>
          <div className="space-y-6 text-zinc-500 font-body text-sm pr-[20%] text-justify">
            <p>{description}</p>
          </div>
          <Button asChild className="bg-black text-white px-8 py-6 font-label uppercase text-sm hover:bg-zinc-800 transition-colors theme-radius-control">
            <Link to={buttonHref}>{buttonText}</Link>
          </Button>
        </div>

        {/* Right side images */}
        <div className="relative w-full h-[550px] flex items-center justify-center">
          <div className="flex w-full h-full overflow-hidden justify-center items-center gap-4 relative theme-radius-media">
            <div className="pointer-events-none absolute inset-x-0 top-0 block h-16 bg-gradient-to-b from-surface-container-low z-10 w-full"></div>
            
            <Marquee pauseOnHover vertical className="w-1/2 [--duration:40s]">
              {marquee1Images.map((image, index) => (
                <motion.img
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    filter: hoveredIndex !== null && hoveredIndex !== index ? "blur(3px)" : "blur(0px)",
                  }}
                  key={`marquee1-${image.src}-${index}`}
                  src={image.src}
                  alt={image.alt ?? ""}
                  className="w-full theme-radius-media object-cover h-[250px] mb-4"
                />
              ))}
            </Marquee>

            <Marquee reverse pauseOnHover vertical className="w-1/2 [--duration:40s] hidden sm:flex">
              {marquee2Images.map((image, index) => (
                <motion.img
                  onMouseEnter={() => setHoveredIndex(index + half)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    filter: hoveredIndex !== null && hoveredIndex !== (index + half) ? "blur(3px)" : "blur(0px)",
                  }}
                  key={`marquee2-${image.src}-${index}`}
                  src={image.src}
                  alt={image.alt ?? ""}
                  className="w-full theme-radius-media object-cover h-[250px] mb-4"
                />
              ))}
            </Marquee>
            
            <div className="pointer-events-none absolute inset-x-0 bottom-0 block h-16 bg-gradient-to-t from-surface-container-low z-10 w-full"></div>
          </div>
        </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
