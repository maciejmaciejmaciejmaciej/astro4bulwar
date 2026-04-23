
export function BreakfastSection() {
  return (
    <>
{/* Breakfast Section */}
        <section className="w-full">
          {/* Parallax Header */}
          <div 
            className="w-full h-[400px] bg-fixed bg-center bg-cover flex items-center justify-center relative"
            style={{ backgroundImage: "url('https://picsum.photos/seed/breakfast/1920/1080')" }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <h2 className="relative z-10 font-headline text-5xl md:text-7xl text-white tracking-[0.3rem] uppercase">
              BREAKFAST
            </h2>
          </div>

          {/* Breakfast Menu */}
          <div className="py-24 bg-white page-margin">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
                {/* Column 1 */}
                <div className="space-y-10">
                  <div className="flex items-end group">
                    <div className="flex flex-col">
                      <span className="font-headline text-[13px] tracking-widest mb-1">Cornish Earlies Potatoes</span>
                      <p className="text-[10px] text-zinc-500 font-label tracking-[0.1em]">Potato, toast & bacon</p>
                    </div>
                    <div className="menu-leader"></div>
                    <span className="font-headline text-base">$11</span>
                  </div>
                  <div className="flex items-end group">
                    <div className="flex flex-col">
                      <span className="font-headline text-[13px] tracking-widest mb-1">Parmesan-Fried Zucchini</span>
                      <p className="text-[10px] text-zinc-500 font-label tracking-[0.1em]">Tomato relish</p>
                    </div>
                    <div className="menu-leader"></div>
                    <span className="font-headline text-base">$13</span>
                  </div>
                  <div className="flex items-end group">
                    <div className="flex flex-col">
                      <span className="font-headline text-[13px] tracking-widest mb-1">Young Leeks & Asparagus</span>
                      <p className="text-[10px] text-zinc-500 font-label tracking-[0.1em]">Crispy black garlic</p>
                    </div>
                    <div className="menu-leader"></div>
                    <span className="font-headline text-base">$15</span>
                  </div>
                </div>
                
                {/* Column 2 */}
                <div className="space-y-10">
                  <div className="flex items-end group">
                    <div className="flex flex-col">
                      <span className="font-headline text-[13px] tracking-widest mb-1">Sage Roasted Veal Fillet</span>
                      <p className="text-[10px] text-zinc-500 font-label tracking-[0.1em]">Tomato & walnutss</p>
                    </div>
                    <div className="menu-leader"></div>
                    <span className="font-headline text-base">$16</span>
                  </div>
                  <div className="flex items-end group">
                    <div className="flex flex-col">
                      <span className="font-headline text-[13px] tracking-widest mb-1">BBQ Spring Chicken</span>
                      <p className="text-[10px] text-zinc-500 font-label tracking-[0.1em]">Pinenut, chilli & garlic</p>
                    </div>
                    <div className="menu-leader"></div>
                    <span className="font-headline text-base">$14</span>
                  </div>
                  <div className="flex items-end group">
                    <div className="flex flex-col">
                      <span className="font-headline text-[13px] tracking-widest mb-1">Rib-Eye On The Bone</span>
                      <p className="text-[10px] text-zinc-500 font-label tracking-[0.1em]">Scottish dry aged</p>
                    </div>
                    <div className="menu-leader"></div>
                    <span className="font-headline text-base">$18</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
    </>
  );
}
