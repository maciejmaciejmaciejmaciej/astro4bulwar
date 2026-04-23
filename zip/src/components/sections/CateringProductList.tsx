import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ProductItem } from "./ProductItem";
import { cn } from "@/lib/utils";

export interface ProductDef {
  name: string;
  description: string;
  weight: string;
  price: string;
}

interface CateringProductListProps {
  title: string;
  products: ProductDef[];
  bgImage?: string;
  className?: string;
}

export function CateringProductList({ title, products, bgImage, className }: CateringProductListProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect: card moves slightly in relation to the background
  // Zwiększamy wartości, żeby efekt był wyraźny
  const yParallax = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={sectionRef} className={cn("w-full bg-white text-on-surface", className)}>
      {bgImage && (
        <div className="theme-section-wrapper md:pt-16">
          <div className="md:mx-16 lg:mx-8">
            <div 
              className="relative h-[280px] w-full overflow-hidden rounded-[4px] bg-fixed bg-cover bg-center md:h-[400px]"
              style={{ backgroundImage: `url('${bgImage}')` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          </div>
        </div>
      )}

      <motion.div 
        style={bgImage ? { y: yParallax } : undefined}
        className={cn("theme-section-wrapper", bgImage ? "relative z-20 -mt-[140px] pb-16 md:-mt-[220px] md:pb-24" : "py-16 md:py-24")}>
        <div className="mx-auto max-w-4xl space-y-8 md:space-y-10">
          <h3 className={cn(
            "font-headline text-2xl md:text-3xl tracking-[0.2rem] uppercase md:text-left text-center",
            bgImage ? "text-white relative z-30 drop-shadow-md" : ""
          )}>
            {title}
          </h3>

          {/* Hero205 style subtle outer frame */}
          <div className="relative z-30 rounded-[8px] p-2 md:p-3 border border-zinc-200/60 bg-zinc-50/90 backdrop-blur-sm shadow-sm transition-colors duration-500">
            {/* Inner tight container */}
            <div className="rounded-[4px] border border-zinc-200/80 bg-white overflow-hidden px-4 md:px-10 py-2 md:py-6">
            {products.map((product, idx) => (
              <ProductItem 
                key={idx}
                name={product.name}
                description={product.description}
                weight={product.weight}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>
      </motion.div>
    </section>
  );
}
