import { Button } from "@/components/ui/button";

export function ReservationQuickBar() {
  return (
    <section className="bg-surface-container-lowest py-10 page-margin">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-outline-variant/30 pb-6 space-y-6 md:space-y-0">
          <div className="flex flex-col w-full md:w-1/4">
            <label className="font-label text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Guests</label>
            <select className="bg-transparent border-none focus:ring-0 font-headline text-lg p-0 outline-none">
              <option>1 Person</option>
              <option>2 People</option>
              <option>4 People</option>
            </select>
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="font-label text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Date</label>
            <input className="bg-transparent border-none focus:ring-0 font-headline text-lg p-0 outline-none" type="text" defaultValue="05/21/2026" />
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="font-label text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Time</label>
            <input className="bg-transparent border-none focus:ring-0 font-headline text-lg p-0 outline-none" type="text" defaultValue="7:00 pm" />
          </div>
          <Button className="w-full md:w-auto bg-primary text-on-primary px-8 py-4 font-label tracking-[0.1em] uppercase text-[11px] hover:opacity-80 transition-opacity rounded-[4px]">
            BOOK A TABLE
          </Button>
        </div>
      </div>
    </section>
  );
}
