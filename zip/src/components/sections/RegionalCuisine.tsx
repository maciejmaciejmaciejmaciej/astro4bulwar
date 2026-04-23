import { Heart, ConciergeBell } from "lucide-react";
import { Link } from "react-router-dom";

export function RegionalCuisine() {
  return (
    <section className="bg-white py-32">
      <div className="theme-section-wrapper relative">
        {/* Prawa kolumna - Zdjęcie "Wychodzące" jako absolutne tło na desktopie, na mobilu względne */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-[20%] w-[500px] lg:w-[700px] xl:w-[800px] hidden md:block z-50 pointer-events-none">
            <img 
              src="/react/images/klips.png" 
              alt="Bulwar Restauracja - Nowoczesna kuchnia regionalna" 
              className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] -rotate-[4deg]"
            />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Lewa kolumna */}
        <div className="space-y-10 max-w-xl">
          <div className="space-y-6">
            <h2 className="font-headline text-5xl md:text-[3.5rem] text-on-surface">
              Kuchnia <br />
              regionalna
            </h2>
          </div>
          
          <p className="text-on-surface-variant font-body text-base md:text-[17px] text-justify md:text-left">
            Restauracja Bulwar na Starym Rynku w Poznaniu oferuje
            niecodzienne połączenie tradycyjnej, regionalnej kuchni z
            nowoczesnymi trendami w gotowaniu.
          </p>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12 pt-8">
            {/* Opcja 1: Menu a'la carte */}
            <div className="flex gap-4">
              <Heart className="w-8 h-8 text-on-surface shrink-0 stroke-[1.2] mt-0.5" />
              <div className="space-y-3">
                <h3 className="font-headline text-lg text-on-surface">
                  Zobacz menu a'la<br/>carte
                </h3>
                <p className="text-sm text-on-surface-variant font-body md:pr-4">
                  Wyjątkowe dania na bazie ekologicznych produktów z regionu
                </p>
                <div className="pt-2">
                  <Link 
                    to="/menu" 
                    className="inline-block text-xs font-headline text-on-surface hover:text-primary transition-colors border-b-2 border-on-surface/20 pb-1">
                    Zobacz menu
                  </Link>
                </div>
              </div>
            </div>

            {/* Opcja 2: Przyjęcie */}
            <div className="flex gap-4">
              <ConciergeBell className="w-8 h-8 text-on-surface shrink-0 stroke-[1.2] mt-0.5" />
              <div className="space-y-3">
                <h3 className="font-headline text-lg text-on-surface">
                  Zorganizujemy Twoje<br/>przyjęcie
                </h3>
                <p className="text-sm text-on-surface-variant font-body md:pr-4">
                  Imprezy okolicznościowe na najwyższym poziomie
                </p>
                <div className="pt-2">
                  <Link 
                    to="/oferta" 
                    className="inline-block text-xs font-headline text-on-surface hover:text-primary transition-colors border-b-2 border-on-surface/20 pb-1">
                    Zobacz ofertę
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prawa kolumna - Zdjęcie tylko na mobile */}
        <div className="flex justify-center md:hidden relative z-50">
          <img 
            src="/react/images/klips.png" 
            alt="Bulwar Restauracja - Nowoczesna kuchnia regionalna" 
            className="w-full max-w-[400px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] translate-x-[10%] -rotate-[4deg]"
          />
        </div>
        
        </div>
      </div>
    </section>
  );
}