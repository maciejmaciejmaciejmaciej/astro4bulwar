export function TheSelection() {
  return (
    <section>
      <div className="theme-section-wrapper">
        <div className="bg-surface py-32">
          <div className="mx-auto max-w-5xl px-4 md:px-0">
          <div className="text-center mb-24">
            <h2 className="font-headline text-4xl uppercase mb-4">The Selection</h2>
            <div className="w-12 h-[1px] bg-primary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
            <div className="space-y-12">
              <div className="flex items-end group">
                <div className="flex flex-col">
                  <span className="font-headline text-sm uppercase mb-1">SMOKED PORK JOWL</span>
                  <p className="text-sm text-zinc-500 font-label uppercase">Apple, Celery, Fennel Pollen</p>
                </div>
                <div className="menu-leader"></div>
                <span className="font-headline text-lg">$10</span>
              </div>
              <div className="flex items-end group">
                <div className="flex flex-col">
                  <span className="font-headline text-sm uppercase mb-1">PASTA WITH LAMB RAGU</span>
                  <p className="text-sm text-zinc-500 font-label uppercase">Handmade Pappardelle, Pecorino</p>
                </div>
                <div className="menu-leader"></div>
                <span className="font-headline text-lg">$18</span>
              </div>
            </div>
            <div className="space-y-12">
              <div className="flex items-end group">
                <div className="flex flex-col">
                  <span className="font-headline text-sm uppercase mb-1">PORK RILLETTE HAND PIES</span>
                  <p className="text-sm text-zinc-500 font-label uppercase">Shortcrust, Mustard Seed</p>
                </div>
                <div className="menu-leader"></div>
                <span className="font-headline text-lg">$14</span>
              </div>
              <div className="flex items-end group">
                <div className="flex flex-col">
                  <span className="font-headline text-sm uppercase mb-1">VEGAN CHARCUTERIE</span>
                  <p className="text-sm text-zinc-500 font-label uppercase">Cashew Cheese, Pickles, Rye</p>
                </div>
                <div className="menu-leader"></div>
                <span className="font-headline text-lg">$22</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
