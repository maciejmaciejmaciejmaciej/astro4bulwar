"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface Project5cLinkItem {
  label: string;
  href: string;
}

export interface Project5cContent {
  eyebrow: string;
  title: string;
  description: string;
  links: Project5cLinkItem[];
  gallery: {
    primaryImage: {
      src: string;
      alt: string;
    };
    secondaryImage: {
      src: string;
      alt: string;
    };
  };
  detailSection: {
    title: string;
    body: string;
  };
}

interface Project5cProps {
  content?: Project5cContent;
  className?: string;
}

export const DEFAULT_PROJECT5C_CONTENT: Project5cContent = {
  eyebrow: "Selected Work",
  title: "Organic Resonance",
  description:
    "A contemporary exploration of nature's abstract forms through sculptural artistry. This piece challenges the boundaries between natural organic structures and human interpretation, creating a dialogue between the viewer and the raw beauty of environmental textures and forms.",
  links: [
    {
      label: "Menu a'La carte",
      href: "#",
    },
    {
      label: "Menu dla dzieci",
      href: "#",
    },
    {
      label: "Sniadania",
      href: "#",
    },
    {
      label: "Menu okolicznosciowe 1",
      href: "#",
    },
    {
      label: "Menu okolicznosciowe 2",
      href: "#",
    },
  ],
  gallery: {
    primaryImage: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/modern-terrarium/Tree Trunk Art Piece.jpg",
      alt: "Organic Resonance - Main sculpture view",
    },
    secondaryImage: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/modern-terrarium/Futuristic Tree Artwork.jpg",
      alt: "Minimalist art blocks",
    },
  },
  detailSection: {
    title: "Artistic Vision",
    body:
      "This sculptural piece emerges from our deep exploration of nature's inherent abstract qualities. Through careful observation and artistic interpretation, we've captured the essence of organic growth patterns, bark textures, and the interplay between light and shadow that defines natural forms. The work invites viewers to reconsider their relationship with the natural world through a contemporary lens.",
  },
};

const Project5c = ({
  content = DEFAULT_PROJECT5C_CONTENT,
  className,
}: Project5cProps) => {
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
    <section className={cn("bg-white py-24 text-on-surface page-margin md:py-32", className)}>
      <div className="mx-auto max-w-screen-2xl font-body">
        <motion.header
          className="border-b border-outline-variant/20 pb-12 md:pb-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)] lg:gap-14 lg:items-start">
            <motion.div variants={fadeInUp} className="space-y-6">
              <p className="font-label text-xs uppercase text-zinc-500">
                {content.eyebrow}
              </p>
              <h1 className="font-headline text-4xl uppercase md:text-6xl">
                {content.title}
              </h1>
              <div className="h-px w-12 bg-primary" />
              <p className="text-sm text-zinc-500 md:text-base lg:pr-10 xl:pr-16">
                {content.description}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="theme-radius-surface overflow-hidden border border-[#bfbfbf] bg-[#f7f7f7]">
                {content.links.map((item, index) => (
                  <a
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className={cn(
                      "flex min-h-16 w-full items-center justify-between gap-6 bg-[#f7f7f7] px-6 py-5 transition-colors duration-300 hover:bg-[#efefef]",
                      index < content.links.length - 1 ? "border-b border-[#bfbfbf]" : "",
                    )}
                  >
                    <span className="font-headline text-xl text-on-surface">&gt;</span>
                    <span className="text-right font-headline text-sm uppercase text-on-surface md:text-base">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.header>

        <motion.main
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-12 pt-12 md:pt-16"
        >
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 gap-6 md:grid-cols-4"
          >
            <div className="md:col-span-3">
              <div className="theme-radius-media relative aspect-[16/9] overflow-hidden bg-surface-container-low">
                <img
                  src={content.gallery.primaryImage.src}
                  alt={content.gallery.primaryImage.alt}
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="theme-radius-media relative h-full overflow-hidden bg-surface-container-low">
                <img
                  src={content.gallery.secondaryImage.src}
                  alt={content.gallery.secondaryImage.alt}
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </motion.div>
        </motion.main>

        <motion.section
          className="py-12 md:py-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="grid gap-8 border-t border-outline-variant/20 pt-12 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12 md:items-start">
            <motion.div variants={fadeInUp} className="md:pr-10">
              <h2 className="font-headline text-lg uppercase text-on-surface">
                {content.detailSection.title}
              </h2>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <p className="text-base text-zinc-500 md:text-lg">
                {content.detailSection.body}
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export { Project5c };