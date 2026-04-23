import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface OfertaSectionImage {
  src: string;
  alt: string;
}

export interface OfertaSectionLink {
  href: string;
}

export interface OfertaItem {
  image: OfertaSectionImage;
  title: string;
  description: string;
  link: OfertaSectionLink;
}

export interface OfertaSectionContent {
  title: string;
  items: OfertaItem[];
}

export interface OfertaSectionProps {
  title?: string;
  items?: OfertaItem[];
  content?: OfertaSectionContent;
}

export const DEFAULT_OFERTA_SECTION_CONTENT: OfertaSectionContent = {
  title: "Oferta",
  items: [
    {
      image: {
        src: "https://bulwarrestauracja.pl/wp-content/uploads/2020/07/26-1024x735-1.png",
        alt: "Catering dla Ciebie i dla Twojej Firmy",
      },
      title: "Catering dla Ciebie i dla Twojej Firmy",
      description:
        "Oferujemy kompleksowy catering na różnego rodzaju wydarzenia – od spotkań biznesowych po prywatne przyjęcia. Zapewniamy najwyższą jakość.",
      link: {
        href: "/portfolio-catering-domowy-i-swiateczny-z-dowozem-poznan",
      },
    },
    {
      image: {
        src: "https://bulwarrestauracja.pl/wp-content/uploads/2020/07/IMG_7467-1024x683-1.jpg",
        alt: "Imprezy Firmowe i integracyjne w Poznaniu",
      },
      title: "Imprezy Firmowe i integracyjne w Poznaniu",
      description:
        "Organizacja niezapomnianych imprez firmowych. Zadbamy o oprawę kulinarną i komfort Twojego zespołu podczas każdego spotkania integracyjnego.",
      link: {
        href: "/portfolio-imprezy-firmowe-i-integracyjne-w-poznaniu",
      },
    },
    {
      image: {
        src: "https://bulwarrestauracja.pl/wp-content/uploads/2020/07/dine-part-2-1024x374-2.jpg",
        alt: "Dine in the dark - Kolacja w ciemności",
      },
      title: "Dine in the dark - Kolacja w ciemności",
      description:
        "Niezwykłe doświadczenie kulinarne, w którym zmysł smaku odgrywa główną rolę. Zaskocz siebie i bliskich podczas tajemniczej kolacji.",
      link: {
        href: "/portfolio-kolacja-w-ciemnosci",
      },
    },
  ],
};

const resolveOfertaSectionContent = ({
  title,
  items,
  content,
}: OfertaSectionProps): OfertaSectionContent => {
  if (content) {
    return content;
  }

  return {
    title: title ?? DEFAULT_OFERTA_SECTION_CONTENT.title,
    items: items ?? DEFAULT_OFERTA_SECTION_CONTENT.items,
  };
};

export function OfertaSection(props: OfertaSectionProps) {
  const content = resolveOfertaSectionContent(props);

  return (
    <section className="bg-white py-32">
      <div className="theme-section-wrapper">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="mb-10 text-3xl font-headline uppercase md:mb-14 md:text-4xl">
          {content.title}
        </h2>
        <div className="flex flex-col">
          <div className="h-[1px] w-full bg-zinc-200" />
          {content.items.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="grid items-center gap-8 py-8 md:grid-cols-4">
                <div className="order-2 md:order-none md:col-span-1 h-[200px] w-full overflow-hidden theme-radius-media">
                  <img
                    src={item.image.src}
                    alt={item.image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 theme-radius-media"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="order-1 md:order-none md:col-span-2 flex flex-col gap-4">
                  <p className="text-2xl font-headline uppercase">
                    {item.title}
                  </p>
                  <p className="text-sm text-zinc-500 font-body">
                    {item.description}
                  </p>
                </div>

                <div className="order-3 md:order-none md:col-span-1 flex md:justify-end">
                  <Button nativeButton={false} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-on-primary px-4 py-1.5 font-label text-xs theme-radius-control flex items-center gap-2 transition-colors w-fit" render={<a href={item.link.href} />}>
                    Zobacz więcej <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="h-[1px] w-full bg-zinc-200" />
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}