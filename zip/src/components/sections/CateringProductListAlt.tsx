import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ProductItemAlt } from "./ProductItemAlt";
import { cn } from "@/lib/utils";
import type {
  CateringProductContract,
  CateringSplitProductContract,
} from "@/src/data/cateringWielkanocny";

export interface LegacyProductDefAlt {
  name: string;
  description?: string;
  weight: string;
  price: string;
}

export type CateringProductListItem = CateringProductContract | LegacyProductDefAlt;

const isNormalizedProduct = (
  product: CateringProductListItem,
): product is CateringProductContract => {
  return "id" in product && "priceLabel" in product;
};

const isStructuredProduct = (
  product: CateringProductListItem,
): product is CateringSplitProductContract => {
  return isNormalizedProduct(product) && product.contentMode === "split";
};

interface CateringProductListAltProps {
  title: string;
  description?: string;
  products: readonly CateringProductListItem[];
  bgImage?: string;
  className?: string;
  cartQuantities?: Readonly<Record<number, number>>;
  orderingClosed?: boolean;
  onAddToCart?: (productId: number | string, quantity: number) => void;
}

export function CateringProductListAlt({
  title,
  description,
  products,
  bgImage,
  className,
  cartQuantities,
  orderingClosed = false,
  onAddToCart,
}: CateringProductListAltProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const motionStyle = bgImage
    ? ({ "--category-panel-y": yParallax } as React.CSSProperties)
    : undefined;

  return (
    <section ref={sectionRef} className={cn("w-full bg-white text-on-surface", className)}>
      {bgImage && (
        <div className="page-margin md:pt-16">
          <div className="max-w-7xl mx-auto">
            <div className="w-full h-[280px] md:h-[400px] relative rounded-[4px] overflow-hidden">
              <img
                src={bgImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-8 md:px-10">
                <h3 className="md:hidden font-headline text-2xl uppercase text-white drop-shadow-md">
                  {title}
                </h3>
                {description && (
                  <p className="md:hidden max-w-3xl font-body text-sm text-white/90 mt-2">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <motion.div 
        style={motionStyle}
        className={cn(
          "page-margin",
          bgImage
            ? "relative z-30 -mt-10 md:-mt-[220px] translate-y-0 md:translate-y-[var(--category-panel-y)] pb-16 md:pb-24"
            : "py-16 md:py-24",
        )}>
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
          <h3 className={cn(
            "font-headline text-2xl md:text-3xl tracking-[0.2rem] uppercase md:text-left text-center",
            bgImage ? "hidden md:block text-white relative z-30 drop-shadow-md" : ""
          )}>
            {title}
          </h3>

          {description && (
            <p className={cn(
              "max-w-3xl font-body text-sm leading-relaxed md:text-base",
              bgImage ? "hidden md:block relative z-30 text-white/90" : "text-zinc-600"
            )}>
              {description}
            </p>
          )}

          <div className="relative z-30 rounded-[8px] p-2 md:p-3 border border-zinc-200/60 bg-zinc-50/90 backdrop-blur-sm shadow-sm transition-colors duration-500">
            <div className="rounded-[4px] border border-zinc-200/80 bg-white overflow-hidden px-4 md:px-10 py-2 md:py-6">
            {products.map((product, idx) => (
              <ProductItemAlt 
                key={isNormalizedProduct(product) ? product.id : `${title}-${product.name}-${idx}`}
                productId={isNormalizedProduct(product) ? product.id : `${title}-${idx}`}
                combinedText={
                  isNormalizedProduct(product)
                    ? product.contentMode === "combined"
                      ? product.combinedText
                      : undefined
                    : product.description
                      ? `${product.name} - ${product.description}`
                      : product.name
                }
                productName={isStructuredProduct(product) ? product.productName : undefined}
                productDescriptionHtml={
                  isStructuredProduct(product) ? product.productDescriptionHtml : undefined
                }
                weight={product.weight}
                price={isNormalizedProduct(product) ? product.priceLabel : product.price}
                vegan={isNormalizedProduct(product) ? product.vegan : false}
                vegetarian={isNormalizedProduct(product) ? product.vegetarian : false}
                cartQuantity={isNormalizedProduct(product) ? (cartQuantities?.[product.id] ?? 0) : 0}
                disabled={orderingClosed}
                onAddToCart={onAddToCart}
              />
            ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
