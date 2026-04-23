import { Button } from "@/components/ui/button";

export function WielkanocSection() {
  return (
    <>
{/* Wielkanoc w Bulwarze Section */}
        <section className="py-32 bg-surface-container-low page-margin">
          <div className="max-w-7xl mx-auto space-y-16">
            
            {/* Row 1: Wielkanoc w Bulwarze */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
              {/* Left: Title & Button */}
              <div className="space-y-8">
                <h2 className="font-headline text-4xl uppercase">Wielkanoc w Bulwarze</h2>
                <div className="w-12 h-[1px] bg-primary"></div>
                <Button className="bg-primary text-on-primary px-8 py-4 font-label uppercase text-sm hover:opacity-80 transition-opacity rounded-[4px] mt-4">
                  ZOBACZ OFERTĘ
                </Button>
              </div>

              {/* Middle: Text */}
              <div className="space-y-8">
                <p className="text-zinc-500 font-body text-sm">
                  Spędź tegoroczne Święta Wielkanocne w wyjątkowej atmosferze naszej restauracji. Przygotowaliśmy dla Państwa specjalne menu degustacyjne, w którym tradycja spotyka się z nowoczesną finezją.
                </p>
              </div>

              {/* Right: Full width square image */}
              <div className="w-full aspect-square overflow-hidden rounded-[4px]">
                <img 
                  src="https://picsum.photos/seed/easter/600/600" 
                  alt="Wielkanoc w Bulwarze" 
                  className="w-full h-full object-cover rounded-[4px]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Row 2: Catering Wielkanocny */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
              {/* Left (2 columns): Flat rectangular image 400px height */}
              <div className="lg:col-span-2 w-full h-[400px] overflow-hidden order-2 lg:order-1 rounded-[4px]">
                <img 
                  src="https://picsum.photos/seed/catering/1200/800" 
                  alt="Catering Wielkanocny" 
                  className="w-full h-full object-cover rounded-[4px]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right (1 column): Title, Text, Button */}
              <div className="space-y-8 order-1 lg:order-2">
                <h2 className="font-headline text-4xl uppercase">Catering Wielkanocny</h2>
                <div className="w-12 h-[1px] bg-primary"></div>
                <p className="text-zinc-500 font-body text-sm">
                  Zaproś smaki naszej restauracji do swojego domu. Oferujemy ekskluzywny catering świąteczny, przygotowany z najwyższej jakości składników, gotowy do podania na Twój wielkanocny stół.
                </p>
                <Button className="bg-primary text-on-primary px-8 py-4 font-label uppercase text-sm hover:opacity-80 transition-opacity rounded-[4px] mt-4">
                  ZAMÓW CATERING
                </Button>
              </div>
            </div>

          </div>
        </section>

        
    </>
  );
}
