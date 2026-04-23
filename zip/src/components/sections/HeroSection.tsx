interface HeroSectionProps {
  title?: string;
  imageSrc?: string;
}

export function HeroSection({ 
  title = "Freefall",
  imageSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuDDsjmg4_bJGKqSy2Vo-SQ994I0C0y2DNuot6cx9-kZrRJ9Hjlqqs8bBGgL4ATBXrHM98TfzSGBbe_g4leRhIUg47YQM2fQP4VRJKCJ-mYZ547qG00WXvAkrM7vXrYuT0cLCLHLlRlZmQ8hrRFhQwV9aEEJ6lhQE1CFTS0ItohZfjkx7RIRCrtMydK9xUYV70TThWAkJxS4FbZYbl2Wna-PdY9xhyP386iO-Tr0tlOal_W_tbSqrsA3aJFlDNAH4fec0Cjau4gp_tI"
}: HeroSectionProps) {
  return (
    <section className="relative bg-white page-margin pb-12">
      <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${imageSrc}')` }}>
        </div>
        <div className="absolute inset-0 flex items-center justify-center select-none overflow-hidden">
          <h1 className="hero-text-mask font-handwriting text-white opacity-95 text-center px-4 transform -rotate-12 translate-y-4">
            {title}
          </h1>
        </div>
      </div>
      <div className="mt-12 w-20 h-[1px] bg-black mx-auto"></div>
    </section>
  );
}
