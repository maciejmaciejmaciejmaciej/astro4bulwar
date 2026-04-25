import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type RegionalCuisineAction = {
  title: ReactNode;
  description: string;
  href: string;
  linkLabel: string;
  icon: LucideIcon;
};

type RegionalCuisineProps = {
  title: ReactNode;
  description: string;
  actions: RegionalCuisineAction[];
  imageSrc: string;
  imageAlt: string;
};

export function RegionalCuisine({
  title,
  description,
  actions,
  imageSrc,
  imageAlt,
}: RegionalCuisineProps) {
  return (
    <section className="bg-white py-32">
      <div className="theme-section-wrapper relative">
        {/* Prawa kolumna - Zdjęcie "Wychodzące" jako absolutne tło na desktopie, na mobilu względne */}
        <div className="absolute top-1/2 right-[-150px] hidden h-[1080px] w-[863px] max-w-[50vw] -translate-y-1/2 md:block pointer-events-none z-50">
            <img 
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
            />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Lewa kolumna */}
        <div className="space-y-10 max-w-xl">
          <div className="space-y-6">
            <h2 className="font-headline text-5xl md:text-[3.5rem] text-on-surface">
              {title}
            </h2>
          </div>
          
          <p className="text-on-surface-variant font-body text-base md:text-[17px] text-justify md:text-left">
            {description}
          </p>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12 pt-8">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <div key={action.href} className="flex gap-4">
                  <Icon className="w-8 h-8 text-on-surface shrink-0 stroke-[1.2] mt-0.5" />
                  <div className="space-y-3">
                    <h3 className="font-headline text-lg text-on-surface">
                      {action.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant font-body md:pr-4">
                      {action.description}
                    </p>
                    <div className="pt-2">
                      <Link 
                        to={action.href}
                        className="inline-block text-xs font-headline text-on-surface hover:text-primary transition-colors border-b-2 border-on-surface/20 pb-1">
                        {action.linkLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prawa kolumna - Zdjęcie tylko na mobile */}
        <div className="flex justify-center md:hidden relative z-50">
          <img 
            src={imageSrc}
            alt={imageAlt}
            className="h-auto w-full max-w-[863px] object-cover drop-shadow-[0_20px_40px rgba(0,0,0,0.15)]"
          />
        </div>
        
        </div>
      </div>
    </section>
  );
}