import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Project5aProps {
  className?: string;
}

export const Project5a = ({ className }: Project5aProps) => {
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
    <section className={cn("py-32 bg-white page-margin", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <motion.header
          className="pb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-primary"></div>
                  <span className="font-label text-[10px] tracking-widest uppercase text-zinc-500">
                    NEXUS STUDIOS PRESENTS
                  </span>
                </div>
                <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl tracking-[0.2rem] uppercase leading-tight">
                  Organic Resonance
                </h2>
                <p className="max-w-2xl font-body text-sm leading-relaxed text-zinc-500">
                  A contemporary exploration of nature's abstract forms through
                  sculptural artistry. This piece challenges the boundaries
                  between natural organic structures and human interpretation.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex h-full flex-col justify-end"
            >
              <div className="space-y-4 border-l border-zinc-200 pl-8">
                <div className="flex justify-between items-center">
                  <span className="font-label text-[10px] tracking-widest uppercase text-zinc-500">Museum</span>
                  <span className="font-headline text-[13px] tracking-widest uppercase">
                    MOMA NYC
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label text-[10px] tracking-widest uppercase text-zinc-500">Year</span>
                  <span className="font-headline text-[13px] tracking-widest uppercase">
                    2024
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label text-[10px] tracking-widest uppercase text-zinc-500">Medium</span>
                  <span className="font-headline text-[13px] tracking-widest uppercase">
                    Sculpture
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.header>

        <motion.main
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-16"
        >
          <motion.div variants={fadeInUp}>
            <div className="relative aspect-[21/9] overflow-hidden rounded-[4px]">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/modern-terrarium/Tree Trunk Art Piece.jpg"
                alt="Organic Resonance - Modern abstract nature sculpture"
                className="h-full w-full object-cover rounded-[4px]"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 gap-16 lg:grid-cols-2"
          >
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-primary"></div>
                  <span className="font-label text-[10px] tracking-widest uppercase text-zinc-500">
                    ARTISTIC VISION
                  </span>
                </div>
                <h3 className="font-headline text-3xl tracking-[0.2rem] uppercase">
                  Creative Process
                </h3>
              </div>
              <div className="space-y-6">
                <p className="font-body text-sm leading-relaxed text-zinc-500">
                  This sculptural piece emerges from our deep exploration of
                  nature's inherent abstract qualities. Through careful
                  observation and artistic interpretation, we've captured the
                  essence of organic growth patterns, bark textures, and the
                  interplay between light and shadow.
                </p>
                <p className="font-body text-sm leading-relaxed text-zinc-500">
                  The work invites viewers to reconsider their relationship with
                  the natural world through a contemporary lens, creating a
                  dialogue between the viewer and the raw beauty of
                  environmental textures and forms.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[4px]">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/modern-terrarium/Modern Terrarium Design.jpg"
                  alt="Modern Terrarium Design - Contemporary presentation"
                  className="h-full w-full object-cover rounded-[4px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden mt-12 rounded-[4px]">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/modern-terrarium/Modern Terrarium Display.jpg"
                  alt="Modern Terrarium Display - Contemporary presentation"
                  className="h-full w-full object-cover rounded-[4px]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </section>
  );
};
