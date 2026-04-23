import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="bg-white w-full border-none relative z-50">
      <div className="flex justify-between items-center page-margin h-[116px] w-full">
        {/* Left: Reserve Button */}
        <div className="flex-1 flex items-center">
          <Button className="bg-primary text-on-primary px-8 py-4 text-[11px] font-label tracking-[0.1em] uppercase hover:opacity-70 transition-opacity rounded-[4px]">
            RESERVE
          </Button>
        </div>
        {/* Center: Links and Logo */}
        <div className="flex-[3] flex items-center justify-center space-x-10 h-full">
          <div className="hidden lg:flex items-center space-x-10 h-full">
            <div className="relative group h-full flex items-center">
              <a className="font-label tracking-[0.15rem] uppercase text-[10px] text-black border-b border-black pb-0.5" href="#">Home</a>
            </div>
            
            <div className="relative group h-full flex items-center">
              <a className="font-label tracking-[0.15rem] uppercase text-[10px] text-zinc-500 transition-colors border-b border-transparent group-hover:text-black group-hover:border-black pb-0.5" href="#">Pages</a>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-[220px] [clip-path:inset(0px_-50px_-50px_-50px)] pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-black text-white py-6 shadow-xl transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <ul className="flex flex-col">
                    <li><a href="#" className="block px-8 py-2.5 font-body text-[13px] text-zinc-400 hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="block px-8 py-2.5 font-body text-[13px] text-zinc-400 hover:text-white transition-colors">Book A Table</a></li>
                    <li><a href="#" className="block px-8 py-2.5 font-body text-[13px] text-zinc-400 hover:text-white transition-colors">Our Menu</a></li>
                    <li><a href="#" className="block px-8 py-2.5 font-body text-[13px] text-zinc-400 hover:text-white transition-colors">Contact Us</a></li>
                    <li><a href="#" className="block px-8 py-2.5 font-body text-[13px] text-zinc-400 hover:text-white transition-colors">Our Team</a></li>
                    <li><a href="#" className="block px-8 py-2.5 font-body text-[13px] text-zinc-400 hover:text-white transition-colors">Pricing Plan</a></li>
                    <li><a href="#" className="block px-8 py-2.5 font-body text-[13px] text-zinc-400 hover:text-white transition-colors">Gallery</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group h-full flex items-center">
              <a className="font-label tracking-[0.15rem] uppercase text-[10px] text-zinc-500 transition-colors border-b border-transparent group-hover:text-black group-hover:border-black pb-0.5" href="#">Portfolio</a>
            </div>
          </div>
          <div className="font-headline font-normal tracking-[0.3rem] text-4xl text-black px-6">
            ANDÉ
          </div>
          <div className="hidden lg:flex items-center space-x-10 h-full">
            <div className="relative group h-full flex items-center">
              <a className="font-label tracking-[0.15rem] uppercase text-[10px] text-zinc-500 transition-colors border-b border-transparent group-hover:text-black group-hover:border-black pb-0.5" href="#">Blog</a>
            </div>
            <div className="relative group h-full flex items-center">
              <a className="font-label tracking-[0.15rem] uppercase text-[10px] text-zinc-500 transition-colors border-b border-transparent group-hover:text-black group-hover:border-black pb-0.5" href="#">Shop</a>
            </div>
            <div className="relative group h-full flex items-center">
              <a className="font-label tracking-[0.15rem] uppercase text-[10px] text-zinc-500 transition-colors border-b border-transparent group-hover:text-black group-hover:border-black pb-0.5" href="#">Elements</a>
            </div>
          </div>
        </div>
        {/* Right: Menu Toggle */}
        <div className="flex-1 flex justify-end items-center">
          <button className="py-2 pl-2 group">
            <div className="w-10 h-[1px] bg-black mb-2 transition-all"></div>
            <div className="w-10 h-[1px] bg-black"></div>
          </button>
        </div>
      </div>
    </nav>
  );
}
