import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export interface StickyCartControlsProps {
  onOpenCart: () => void;
  itemCount?: number;
  totalPrice?: number;
}

const formatCurrency = (amount: number): string => `${amount.toFixed(2)} zł`;

export function StickyCartControls({ onOpenCart, itemCount = 0, totalPrice = 0 }: StickyCartControlsProps) {
  const cartSummaryLabel = itemCount > 0 ? `${itemCount} szt.` : "Koszyk pusty";

  return (
    <>
      {/* Sticky Cart Bar */}
      <div className="hidden md:flex fixed bottom-0 left-0 right-0 h-[50px] bg-zinc-50 border-t border-zinc-200 z-40 items-center px-8">
        {/* Desktop Layout */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-shrink-0 font-headline text-sm uppercase">
            Twoje zamówienie
          </div>
          <div className="flex-grow mx-8 border-b-2 border-dotted border-zinc-300 relative top-[2px]"></div>
          <div className="flex-shrink-0 flex items-center">
            <ShoppingCart className="w-5 h-5 text-zinc-800" />
            <div className="ml-4 mr-6 text-right">
              <div className="font-label text-[10px] uppercase text-zinc-500">
                {cartSummaryLabel}
              </div>
              <div className="font-headline text-[11px] uppercase text-zinc-800">
                {formatCurrency(totalPrice)}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-4 font-label text-xs uppercase border-zinc-300 hover:bg-zinc-100 rounded-[4px]"
              onClick={onOpenCart}
            >
              Rozwiń koszyk
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile FAB Cart Button */}
      <button
        onClick={onOpenCart}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform relative"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-6 h-6 rounded-full bg-white px-1.5 text-[10px] font-label text-black shadow-sm">
            {itemCount}
          </span>
        )}
      </button>
    </>
  );
}
