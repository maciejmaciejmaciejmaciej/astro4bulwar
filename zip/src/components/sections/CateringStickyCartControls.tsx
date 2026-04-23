import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export interface CateringStickyCartControlsProps {
  onOpenCart: () => void;
  itemCount?: number;
  totalPrice?: number;
}

const formatCurrency = (amount: number): string => `${amount.toFixed(2)} zł`;

export function CateringStickyCartControls({
  onOpenCart,
  itemCount = 0,
  totalPrice = 0,
}: CateringStickyCartControlsProps) {
  const cartSummaryLabel = `${itemCount} szt.`;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-zinc-200 bg-zinc-50/95 backdrop-blur md:flex">
        <div className="page-margin flex h-[64px] w-full items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="font-headline text-sm uppercase text-zinc-900">
              Twoje zamówienie
            </span>
            <span className="font-label text-[10px] uppercase text-zinc-500">
              {cartSummaryLabel}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-6 justify-end">
            <div className="hidden min-w-0 flex-1 border-b-2 border-dotted border-zinc-300 lg:block" />
            <div className="flex items-center gap-4 text-right">
              <ShoppingCart className="h-5 w-5 text-zinc-800" />
              <div>
                <div className="font-label text-[10px] uppercase text-zinc-500">
                  Wartość koszyka
                </div>
                <div className="font-headline text-[11px] uppercase text-zinc-800">
                  {formatCurrency(totalPrice)}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-[4px] border-zinc-300 px-4 font-label text-xs uppercase hover:bg-zinc-100"
              onClick={onOpenCart}
            >
              Rozwiń koszyk
            </Button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenCart}
        aria-label="Otwórz koszyk"
        className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl transition-transform hover:scale-105 md:hidden"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 font-label text-[10px] text-white shadow-sm">
            {itemCount}
          </span>
        )}
      </button>
    </>
  );
}