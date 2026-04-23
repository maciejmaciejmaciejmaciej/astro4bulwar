import { Button } from "@/components/ui/button";

export function OurServices() {
  return (
    <section className="py-32 bg-white page-margin">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left side: Title, Description, Button */}
          <div className="lg:w-1/3 space-y-8 lg:sticky lg:top-32 self-start">
            <h2 className="font-headline text-4xl tracking-[0.3rem] uppercase leading-tight">Our Services</h2>
            <div className="w-12 h-[1px] bg-primary"></div>
            <p className="text-zinc-500 font-body text-sm leading-relaxed">
              From intimate chef's table experiences to grand private events, we offer a range of bespoke culinary services designed to elevate your dining experience. Every detail is meticulously crafted to ensure unforgettable moments.
            </p>
            <Button className="bg-primary text-on-primary px-8 py-4 font-label tracking-[0.1em] uppercase text-[11px] hover:opacity-80 transition-opacity rounded-[4px] mt-4">
              VIEW ALL SERVICES
            </Button>
          </div>

          {/* Right side: Masonry Grid */}
          <div className="lg:w-2/3 columns-1 md:columns-2 gap-6 space-y-6">
            {/* Card 1 */}
            <div className="break-inside-avoid group relative overflow-hidden bg-surface p-10 flex flex-col transition-colors duration-500 hover:bg-surface-container-low">
              <div className="relative z-10 space-y-8">
                <span className="material-symbols-outlined text-4xl text-zinc-400 group-hover:text-black transition-colors duration-500">restaurant</span>
                <div>
                  <h3 className="font-headline text-lg tracking-[0.15rem] uppercase mb-4">FINE DINING</h3>
                  <p className="text-xs text-zinc-500 font-body leading-relaxed">Experience our meticulously crafted tasting menus in an elegant setting, where every dish tells a story of local terroir and culinary innovation.</p>
                </div>
                <div className="pt-4">
                  <a href="#" className="inline-flex items-center text-[10px] font-label uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                    Explore Menu <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="break-inside-avoid group relative overflow-hidden bg-surface p-10 flex flex-col transition-colors duration-500 hover:bg-surface-container-low">
              <div className="relative z-10 space-y-8">
                <span className="material-symbols-outlined text-4xl text-zinc-400 group-hover:text-black transition-colors duration-500">wine_bar</span>
                <div>
                  <h3 className="font-headline text-lg tracking-[0.15rem] uppercase mb-4">WINE PAIRING</h3>
                  <p className="text-xs text-zinc-500 font-body leading-relaxed">Expertly curated wine selections from our master sommelier to perfectly complement every dish on our tasting menu, featuring rare vintages and local discoveries.</p>
                </div>
                <div className="pt-4">
                  <a href="#" className="inline-flex items-center text-[10px] font-label uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                    View Cellar <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="break-inside-avoid group relative overflow-hidden bg-surface p-10 flex flex-col transition-colors duration-500 hover:bg-surface-container-low">
              <div className="relative z-10 space-y-8">
                <span className="material-symbols-outlined text-4xl text-zinc-400 group-hover:text-black transition-colors duration-500">celebration</span>
                <div>
                  <h3 className="font-headline text-lg tracking-[0.15rem] uppercase mb-4">PRIVATE EVENTS</h3>
                  <p className="text-xs text-zinc-500 font-body leading-relaxed">Exclusive spaces and tailored menus for your most important celebrations and corporate gatherings. Our dedicated events team ensures flawless execution.</p>
                </div>
                <div className="pt-4">
                  <a href="#" className="inline-flex items-center text-[10px] font-label uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                    Book Event <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="break-inside-avoid group relative overflow-hidden bg-surface p-10 flex flex-col transition-colors duration-500 hover:bg-surface-container-low">
              <div className="relative z-10 space-y-8">
                <span className="material-symbols-outlined text-4xl text-zinc-400 group-hover:text-black transition-colors duration-500">ramen_dining</span>
                <div>
                  <h3 className="font-headline text-lg tracking-[0.15rem] uppercase mb-4">CHEF'S TABLE</h3>
                  <p className="text-xs text-zinc-500 font-body leading-relaxed">An intimate, interactive dining experience directly overlooking our kitchen. Watch our culinary team at work and interact directly with the executive chef.</p>
                </div>
                <div className="pt-4">
                  <a href="#" className="inline-flex items-center text-[10px] font-label uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                    Reserve Seat <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Card 5 */}
            <div className="break-inside-avoid group relative overflow-hidden bg-surface p-10 flex flex-col transition-colors duration-500 hover:bg-surface-container-low">
              <div className="relative z-10 space-y-8">
                <span className="material-symbols-outlined text-4xl text-zinc-400 group-hover:text-black transition-colors duration-500">eco</span>
                <div>
                  <h3 className="font-headline text-lg tracking-[0.15rem] uppercase mb-4">ORGANIC SOURCING</h3>
                  <p className="text-xs text-zinc-500 font-body leading-relaxed">We partner exclusively with local, sustainable farms to bring the freshest organic ingredients to your table, supporting our community and environment.</p>
                </div>
                <div className="pt-4">
                  <a href="#" className="inline-flex items-center text-[10px] font-label uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                    Our Partners <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
