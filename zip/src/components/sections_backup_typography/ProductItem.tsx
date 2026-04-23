import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ProductItem({ name, description, weight, price }: { name: string, description: string, weight: string, price: string }) {
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="py-8 border-b border-zinc-200 last:border-0 grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-8">
      {/* Kolumna lewa (Mobile & Desktop) */}
      <div className="flex flex-col col-span-1">
        <div className="flex justify-between items-start md:block">
          <div className="flex flex-col">
            <span className="font-headline text-[13px] tracking-widest mb-1">{name}</span>
            <p className="text-[10px] text-zinc-500 font-label tracking-[0.1em]">{description}</p>
          </div>
          {/* Mobile Price & Weight (hidden on desktop) */}
          <div className="flex flex-col items-end shrink-0 md:hidden ml-4">
            <span className="font-headline text-base leading-none mb-1">{price}</span>
            <span className="text-[10px] text-zinc-400 font-mono leading-none">{weight}</span>
          </div>
        </div>
      </div>

      {/* Kolumna środkowa: Kropkowana linia (Desktop only) */}
      <div className="hidden md:flex items-center w-full col-span-1">
        <div className="menu-leader w-full"></div>
      </div>

      {/* Kolumna prawa: Cena, Gramatura, Akcje (Desktop & Mobile) */}
      <div className="flex flex-col w-full col-span-1">
        {/* Desktop Price & Weight (hidden on mobile) */}
        <div className="hidden md:flex flex-row justify-between items-center w-full mb-4">
          <span className="text-[10px] text-zinc-400 font-mono leading-none">{weight}</span>
          <span className="font-headline text-base leading-none">{price}</span>
        </div>
        
        {/* Actions: Selector & Button (Mobile & Desktop) */}
        <div className="flex justify-between items-center w-full mt-2 md:mt-0 gap-4">
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
          <div className="relative">
            {cartCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full z-10 animate-in zoom-in duration-200">
                {cartCount}
              </div>
            )}
            <Button 
              onClick={() => setCartCount(cartCount + quantity)} 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-on-primary px-4 py-1.5 font-label font-bold tracking-[0.05em] text-[10px] rounded-[4px] transition-colors h-8"
            >
              DODAJ DO KOSZYKA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
