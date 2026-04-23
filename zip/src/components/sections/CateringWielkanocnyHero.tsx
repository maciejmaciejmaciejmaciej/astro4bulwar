import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CateringHeroInfoItem {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  note?: ReactNode;
}

export interface CateringHeroImage {
  src: string;
  alt: string;
}

export interface CateringWielkanocnyHeroProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: string;
  infoItems?: readonly CateringHeroInfoItem[];
  mainImage?: CateringHeroImage;
  offerEyebrow?: ReactNode;
  offerTitle?: ReactNode;
  offerParagraphs?: readonly string[];
  saleNotice?: ReactNode;
  secondaryImages?: readonly CateringHeroImage[];
  className?: string;
}

export const CateringWielkanocnyHero = ({
  eyebrow,
  title,
  lead,
  infoItems = [],
  mainImage,
  offerEyebrow,
  offerTitle,
  offerParagraphs = [],
  saleNotice,
  secondaryImages = [],
  className,
}: CateringWielkanocnyHeroProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className={cn("py-24 md:py-32 bg-white text-on-surface page-margin", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <motion.header
          className="pb-12 md:pb-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-primary"></div>
                  <span className="font-label text-[10px] uppercase text-zinc-500">
                    {eyebrow}
                  </span>
                </div>
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl uppercase">
                  {title}
                </h1>
                <p className="max-w-2xl font-body text-sm md:text-base text-zinc-500">
                  {lead}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex h-full flex-col justify-end"
            >
              <div className="space-y-4">
                {infoItems.map((item) => (
                  <div key={item.label} className="border-b border-zinc-100 pb-2">
                    <div className="flex justify-between gap-4">
                      <span className="font-label text-[10px] uppercase text-zinc-500">{item.label}</span>
                      <span className={cn("font-headline text-[13px] tracking-widest uppercase text-right", item.valueClassName)}>
                        {item.value}
                      </span>
                    </div>
                    {item.note && (
                      <div className="mt-2 text-right font-label text-[10px] text-zinc-500">
                        {item.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.header>

        <motion.main
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-12 md:space-y-16"
        >
          {mainImage && (
            <motion.div variants={fadeInUp}>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[4px] bg-zinc-100">
                <img
                  src={mainImage.src}
                  alt={mainImage.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          )}

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start"
          >
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-6 bg-primary"></div>
                  <span className="font-label text-[10px] uppercase text-zinc-500">
                    {offerEyebrow}
                  </span>
                </div>
                <h2 className="font-headline text-3xl md:text-4xl uppercase">
                  {offerTitle}
                </h2>
              </div>
              <div className="space-y-6">
                {offerParagraphs.map((paragraph, index) => (
                  <p key={`${offerTitle}-${index}`} className="font-body text-sm text-zinc-500">
                    {paragraph}
                  </p>
                ))}
                {saleNotice && (
                  <h3 className="font-headline text-2xl text-red-900 md:text-3xl">
                    {saleNotice}
                  </h3>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {secondaryImages.map((image, index) => (
                <div key={`${image.src}-${index}`} className="relative aspect-[16/9] overflow-hidden rounded-[4px] bg-zinc-100">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.main>
      </div>
    </section>
  );
};
