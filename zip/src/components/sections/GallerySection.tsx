import { clsx } from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface GallerySectionProps {
  title?: string;
  images?: string[];
  className?: string;
}

const DEFAULT_IMAGES = [
  "/react/images/gallery/12-1024x680-1-640x640.webp",
  "/react/images/gallery/20160511_123307-kopia-1024x576-1-640x576.webp",
  "/react/images/gallery/20160511_125209-2-kopia-1024x576-1-640x576.webp",
  "/react/images/gallery/20160511_125837-kopia-1024x576-1-640x576.webp",
  "/react/images/gallery/21-1024x704-1-640x640.webp",
  "/react/images/gallery/22-1024x642-1-640x640.webp",
  "/react/images/gallery/23png-1024x718-1-640x640.webp",
];

export function GallerySection({
  title = "GALERIA",
  images = DEFAULT_IMAGES,
  className
}: GallerySectionProps) {
  // Ensure we have at least 7 images to nicely fill the masonry layout, reuse default ones if short
  const safeImages = Array.from({ length: 7 }, (_, i) => images[i] || DEFAULT_IMAGES[Math.min(i, DEFAULT_IMAGES.length - 1)]);

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yDown = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yUp = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={containerRef} className={clsx("py-24 md:py-32 bg-white text-on-surface", className)}>
      <div className="theme-section-wrapper">
        <div className="mx-auto max-w-screen-2xl">
        <div className="mb-16">
          <h2 className="font-headline text-3xl uppercase">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-start">
          {/* Column 1 */}
          <motion.div style={{ y: yUp }} className="flex flex-col gap-4 md:gap-6 md:mt-12">
            <div className="aspect-square bg-cover bg-center overflow-hidden rounded-[4px]" style={{ backgroundImage: `url('${safeImages[0]}')` }}></div>
            <div className="aspect-[4/5] bg-cover bg-center overflow-hidden rounded-[4px]" style={{ backgroundImage: `url('${safeImages[1]}')` }}></div>
          </motion.div>
          {/* Column 2 */}
          <motion.div style={{ y: yDown }} className="flex flex-col gap-4 md:gap-6">
            <div className="aspect-[3/4] bg-cover bg-center overflow-hidden rounded-[4px]" style={{ backgroundImage: `url('${safeImages[2]}')` }}></div>
            <div className="aspect-square bg-cover bg-center overflow-hidden rounded-[4px]" style={{ backgroundImage: `url('${safeImages[3]}')` }}></div>
          </motion.div>
          {/* Column 3 */}
          <motion.div style={{ y: yUp }} className="flex flex-col gap-4 md:gap-6 md:mt-24">
            <div className="aspect-[4/5] bg-cover bg-center overflow-hidden rounded-[4px]" style={{ backgroundImage: `url('${safeImages[4]}')` }}></div>
          </motion.div>
          {/* Column 4 */}
          <motion.div style={{ y: yDown }} className="flex flex-col gap-4 md:gap-6 md:mt-8">
            <div className="aspect-square bg-cover bg-center overflow-hidden rounded-[4px]" style={{ backgroundImage: `url('${safeImages[5]}')` }}></div>
            <div className="aspect-[4/5] bg-cover bg-center overflow-hidden rounded-[4px]" style={{ backgroundImage: `url('${safeImages[6]}')` }}></div>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
}
