
export function TheMenuSection() {
  return (
    <>
{/* The Menu */}
        <section className="py-32 bg-white page-margin">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="font-headline text-4xl uppercase mb-4">THE MENU</h2>
              <div className="w-16 h-[1px] bg-black mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
              <div className="space-y-10">
                <div className="flex items-end group">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm mb-1">Smoked Pork Jowl</span>
                    <p className="text-xs text-zinc-500 font-label">Apple, Celery, Fennel Pollen</p>
                  </div>
                  <div className="menu-leader"></div>
                  <span className="font-headline text-base">$10</span>
                </div>
                <div className="flex items-end group">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm mb-1">Pasta With Lamb Ragu</span>
                    <p className="text-xs text-zinc-500 font-label">Handmade Pappardelle</p>
                  </div>
                  <div className="menu-leader"></div>
                  <span className="font-headline text-base">$18</span>
                </div>
                <div className="flex items-end group">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm mb-1">Truffle Risotto</span>
                    <p className="text-xs text-zinc-500 font-label">Wild Mushrooms, Aged Parmesan</p>
                  </div>
                  <div className="menu-leader"></div>
                  <span className="font-headline text-base">$24</span>
                </div>
              </div>
              <div className="space-y-10">
                <div className="flex items-end group">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm mb-1">Pork Rillette Hand Pies</span>
                    <p className="text-xs text-zinc-500 font-label">Shortcrust, Mustard Seed</p>
                  </div>
                  <div className="menu-leader"></div>
                  <span className="font-headline text-base">$14</span>
                </div>
                <div className="flex items-end group">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm mb-1">Vegan Charcuterie</span>
                    <p className="text-xs text-zinc-500 font-label">Cashew Cheese, Pickles</p>
                  </div>
                  <div className="menu-leader"></div>
                  <span className="font-headline text-base">$22</span>
                </div>
                <div className="flex items-end group">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm mb-1">Grilled Asparagus</span>
                    <p className="text-xs text-zinc-500 font-label">Poached Egg, Hollandaise</p>
                  </div>
                  <div className="menu-leader"></div>
                  <span className="font-headline text-base">$16</span>
                </div>
              </div>
              <div className="space-y-10">
                <div className="flex items-end group">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm mb-1">Seared Scallops</span>
                    <p className="text-xs text-zinc-500 font-label">Cauliflower Puree, Bacon</p>
                  </div>
                  <div className="menu-leader"></div>
                  <span className="font-headline text-base">$28</span>
                </div>
                <div className="flex items-end group">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm mb-1">Duck Confit</span>
                    <p className="text-xs text-zinc-500 font-label">Braised Cabbage, Berries</p>
                  </div>
                  <div className="menu-leader"></div>
                  <span className="font-headline text-base">$32</span>
                </div>
                <div className="flex items-end group">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm mb-1">Lemon Tart</span>
                    <p className="text-xs text-zinc-500 font-label">Burnt Meringue, Mint</p>
                  </div>
                  <div className="menu-leader"></div>
                  <span className="font-headline text-base">$12</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        
    </>
  );
}
