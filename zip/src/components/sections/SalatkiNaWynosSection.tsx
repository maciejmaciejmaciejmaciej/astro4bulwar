import { ProductItem } from "./ProductItem";

export function SalatkiNaWynosSection() {
  return (
    <section className="w-full" id="salatki-na-wynos">
      {/* Parallax Header */}
      <div 
        className="w-full h-[400px] bg-fixed bg-center bg-cover flex items-center justify-center relative"
        style={{ backgroundImage: "url('https://picsum.photos/seed/salad/1920/1080')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <h2 className="relative z-10 font-headline text-4xl md:text-6xl text-white uppercase text-center px-4">
          SAŁATKI NA WYNOS
        </h2>
      </div>

      {/* Product List */}
      <div className="pb-24 bg-white page-margin">
        <div className="max-w-4xl mx-auto bg-zinc-50 p-6 md:p-10 relative z-20 -mt-[100px] shadow-sm">
          <ProductItem 
            name="Sałatka Cezar z Kurczakiem" 
            description="Sałata rzymska, grillowany kurczak, parmezan, grzanki, autorski sos cezar" 
            weight="350g" 
            price="32 PLN" 
          />
          <ProductItem 
            name="Sałatka z Kozim Serem" 
            description="Mix sałat, pieczony burak, kozi ser, orzechy włoskie, dressing miodowo-musztardowy" 
            weight="320g" 
            price="36 PLN" 
          />
          <ProductItem 
            name="Miska Mocy (Vegan)" 
            description="Komosa ryżowa, awokado, pieczony batat, ciecierzyca, pestki dyni, sos tahini" 
            weight="400g" 
            price="34 PLN" 
          />
          <ProductItem 
            name="Sałatka z Wędzonym Łososiem" 
            description="Roszponka, wędzony łosoś, jajko przepiórcze, pomidorki koktajlowe, kapary, sos koperkowy" 
            weight="300g" 
            price="39 PLN" 
          />
        </div>
      </div>
    </section>
  );
}