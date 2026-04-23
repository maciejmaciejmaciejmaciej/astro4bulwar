import { useState } from "react";
import { Leaf, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProductItemAltProps {
  productId: number | string;
  combinedText?: string;
  productName?: string;
  productDescriptionHtml?: string;
  weight: string;
  price: string;
  vegan?: boolean;
  vegetarian?: boolean;
  cartQuantity?: number;
  disabled?: boolean;
  onAddToCart?: (productId: number | string, quantity: number) => void;
}

const getDietaryIndicator = (vegan?: boolean, vegetarian?: boolean) => {
  if (vegan) {
    return {
      Icon: Leaf,
      label: "Vegan",
    };
  }

  if (vegetarian) {
    return {
      Icon: Sprout,
      label: "Vegetariańskie",
    };
  }

  return null;
};

export function ProductItemAlt({
  productId,
  combinedText,
  productName,
  productDescriptionHtml,
  weight,
  price,
  vegan,
  vegetarian,
  cartQuantity = 0,
  disabled = false,
  onAddToCart,
}: ProductItemAltProps) {
  const [quantity, setQuantity] = useState(1);
  const dietaryIndicator = getDietaryIndicator(vegan, vegetarian);
  const isStructuredProduct = Boolean(productName && productDescriptionHtml);
  const desktopLayoutClass = isStructuredProduct
    ? "md:grid-cols-[minmax(0,1.7fr)_56px_minmax(0,1fr)]"
    : "md:grid-cols-3";

  return (
    <div
      className={`py-8 border-b border-zinc-200 last:border-0 grid grid-cols-1 ${desktopLayoutClass} items-center gap-4 md:gap-8`}
    >
      {/* Kolumna lewa (Mobile & Desktop) */}
      <div className="flex flex-col col-span-1">
        <div className="flex flex-col pr-0 md:pr-0">
          {isStructuredProduct ? (
            <>
              <span className="font-body text-sm text-zinc-900">
                {productName}
              </span>
              <div
                className="mt-1 font-body text-sm text-zinc-600 [&_br]:block [&_em]:italic [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mt-2"
                dangerouslySetInnerHTML={{ __html: productDescriptionHtml ?? "" }}
              />
            </>
          ) : (
            <span className="font-body text-sm text-zinc-900">
              {combinedText}
            </span>
          )}
          {dietaryIndicator && (
            <span className="mt-2 inline-flex items-center gap-1.5 font-label text-[10px] uppercase text-zinc-500">
              <dietaryIndicator.Icon className="size-3 text-primary" strokeWidth={1.75} />
              {dietaryIndicator.label}
            </span>
          )}
        </div>
      </div>

      {/* Kolumna środkowa: Kropkowana linia (Desktop only) */}
      <div className="hidden md:flex items-center w-full col-span-1">
        {isStructuredProduct ? (
          <div className="w-full text-center font-mono text-xs text-zinc-300">
            .....
          </div>
        ) : (
          <div className="menu-leader w-full"></div>
        )}
      </div>

      {/* Kolumna prawa: Cena, Gramatura, Akcje (Desktop & Mobile) */}
      <div className="flex flex-col w-full col-span-1">
        {/* Desktop Price & Weight (hidden on mobile) */}
        <div className="hidden md:flex flex-row items-center w-full mb-4">
          <span className="text-xs text-zinc-400 font-mono">{weight}</span>
          <span className="ml-auto text-right font-headline text-base">{price}</span>
        </div>

        <div className="md:hidden mt-4 flex w-full flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span className="font-headline text-base">{price}</span>
            <span className="text-xs text-zinc-400 font-mono">{weight}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center border border-zinc-200 rounded-[4px] h-8">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 h-full text-zinc-500 hover:text-black transition-colors">-</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-6 text-center text-xs font-mono outline-none bg-transparent"
              />
              <button onClick={() => setQuantity(quantity + 1)} className="px-2 h-full text-zinc-500 hover:text-black transition-colors">+</button>
            </div>
            <div className="relative shrink-0">
              {cartQuantity > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full z-10 animate-in zoom-in duration-200">
                  {cartQuantity}
                </div>
              )}
              <Button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (disabled) {
                    return;
                  }

                  onAddToCart?.(productId, quantity);
                }}
                variant="outline"
                className="h-8 rounded-[4px] border-primary px-4 py-1.5 font-label text-xs text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                DODAJ DO KOSZYKA
              </Button>
            </div>
          </div>
        </div>

        {/* Actions: Selector & Button (Desktop only) */}
        <div className="hidden md:flex justify-between items-center w-full mt-2 md:mt-0 gap-4">
          <div className="flex items-center border border-zinc-200 rounded-[4px] h-8">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 h-full text-zinc-500 hover:text-black transition-colors">-</button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-6 text-center text-xs font-mono outline-none bg-transparent"
            />
            <button onClick={() => setQuantity(quantity + 1)} className="px-2 h-full text-zinc-500 hover:text-black transition-colors">+</button>
          </div>
          <div className="relative shrink-0">
            {cartQuantity > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full z-10 animate-in zoom-in duration-200">
                {cartQuantity}
              </div>
            )}
            <Button
              type="button"
              disabled={disabled}
              onClick={() => {
                if (disabled) {
                  return;
                }

                onAddToCart?.(productId, quantity);
              }}
              variant="outline"
              className="h-8 rounded-[4px] border-primary px-4 py-1.5 font-label text-xs text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              DODAJ DO KOSZYKA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
