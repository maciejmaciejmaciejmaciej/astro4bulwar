import { Button } from "@/components/ui/button";

export function ModernInterior() {
  return (
    <section className="py-32 bg-white overflow-hidden page-margin">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 max-w-xl">
          <div className="space-y-8">
            <h2 className="font-headline text-4xl tracking-[0.3rem] uppercase leading-tight">Modern Interior</h2>
            <div className="w-12 h-[1px] bg-primary"></div>
          </div>
          <div className="space-y-6 text-zinc-500 font-body text-sm leading-relaxed">
            <p>Lorem ipsum dolor sit amet, constituto efficiendi sadipscing an sed, nec ne antiopam inimicus. Salutatus repudiare vis at, aperiri mnesarchum. Nostrum eloquentiam et vim, ea facete delectus vis. Mel erant vocibus elaboraret ea, et impetus referrentur vix.</p>
            <p>At prima dicit postulant pro, te nam meliore definitionem. His atqui vocent indoctum no, minim definitionem cum an, ne nec dico sonet tibique. Ne qui dicat graeco, in mucius utroque mnesarchum cum.</p>
          </div>
          <Button className="bg-black text-white px-8 py-4 font-label tracking-[0.1em] uppercase text-[11px] hover:bg-zinc-800 transition-colors rounded-[4px]">
            DISCOVER
          </Button>
        </div>
        <div className="relative h-[600px] w-full mt-12 lg:mt-0">
          <div className="absolute top-0 right-0 w-4/5 h-4/5 overflow-hidden shadow-2xl rounded-[4px]">
            <img alt="Modern restaurant interior" className="w-full h-full object-cover rounded-[4px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvAq4RIrwZm1pkFoSty9S07_XgDQdFREFuuw4eA1giR0UbbuIJf0KDFXm8kVPbiYaf4DAcP4BFVrw_Wqvhg4LJ7qpte2Ysv6lvnEWS5jBAJ8eITibW0h6y_Hb5UkTZxbdQNTDm3vVxqEzC5h8UJltCFv1USKkBaSR_UG2jPgqI6W26mtbISYWK6XroAc6GJ6zB0JIxSRZNab70cEYX0o45eCNFN0zyZKUQ1_JsQaRVHpaL2xx7CZZwj5iLjooh0oV7dvJQsS04JQc" />
          </div>
          <div className="absolute bottom-0 left-0 w-3/5 h-3/5 overflow-hidden shadow-2xl z-10 border-[12px] border-white rounded-[4px]">
            <img alt="Geometric hanging floral decorations" className="w-full h-full object-cover rounded-[4px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmvwzpoeiKBkHih4QMAP5hzmSCSzV3HFYMEpZ4VZvEkhv9tWnj7VFFHG57w2j4YY_cn_gNUHZRG7e07fvpNqLc-DbnPsjjVGIV-xIULwR1cQVWnym3feuB0pErllKDMzOCsi6wjpoZ0-OGlwuthkD-mCEU40QuHkNIg-_G3E77wiKCTJVsuHovM8OSvr6YmFWLVKNUO-dPNRTWBVhsJADIcHh4E-IabBhm_-GaKdxlJvGfGu83BPOkOMBBhAiSgx6pkmmwTZjeZfk" />
          </div>
        </div>
      </div>
    </section>
  );
}
