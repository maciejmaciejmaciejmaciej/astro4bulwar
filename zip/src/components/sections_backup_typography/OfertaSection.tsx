import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function OfertaSection() {
  return (
    <section className="py-32 bg-white page-margin">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="mb-10 text-3xl font-headline tracking-[0.3rem] uppercase md:mb-14 md:text-4xl">
          Oferta
        </h2>
        <div className="flex flex-col">
          <div className="h-[1px] w-full bg-zinc-200" />
          {[
            {
              image: "https://picsum.photos/seed/biznes/800/600",
              mainText: "Spotkania Biznesowe i Konferencje",
              normalText: "Profesjonalna obsługa i dedykowane menu dla Twoich partnerów biznesowych. Idealne miejsce na lunch biznesowy lub kolację firmową w eleganckiej atmosferze.",
              link: "#"
            },
            {
              image: "https://picsum.photos/seed/przyjecia/800/600",
              mainText: "Przyjęcia Okolicznościowe i Bankiety",
              normalText: "Organizacja chrzcin, komunii, jubileuszy w niezapomnianej atmosferze. Zadbamy o każdy detal Twojego wyjątkowego dnia, oferując spersonalizowane menu.",
              link: "#"
            },
            {
              image: "https://picsum.photos/seed/catering2/800/600",
              mainText: "Ekskluzywny Catering Zewnętrzny",
              normalText: "Dostarczamy nasze wyjątkowe smaki prosto do Twojego biura lub domu. Najwyższa jakość w każdym miejscu, z pełną obsługą kelnerską i sprzętem.",
              link: "#"
            }
          ].map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="grid items-center gap-8 py-8 md:grid-cols-4">
                {/* Left Column: Image */}
                <div className="order-2 md:order-none md:col-span-1 h-[200px] w-full overflow-hidden rounded-[4px]">
                  <img 
                    src={item.image} 
                    alt={item.mainText} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 rounded-[4px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Middle Column: Main Text + Normal Text */}
                <div className="order-1 md:order-none md:col-span-2 flex flex-col gap-4">
                  <p className="text-2xl font-headline uppercase tracking-widest leading-tight">
                    {item.mainText}
                  </p>
                  <p className="text-sm text-zinc-500 font-body leading-relaxed">
                    {item.normalText}
                  </p>
                </div>
                
                {/* Right Column: Button */}
                <div className="order-3 md:order-none md:col-span-1 flex md:justify-end">
                  <Button nativeButton={false} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-on-primary px-4 py-1.5 font-label font-bold tracking-[0.05em] text-[10px] rounded-[4px] flex items-center gap-2 transition-colors w-fit" render={<a href={item.link} />}>
                    Zobacz więcej <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="h-[1px] w-full bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}