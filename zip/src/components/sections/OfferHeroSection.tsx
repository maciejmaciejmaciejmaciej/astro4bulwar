import { cn } from "@/lib/utils";
import { CateringWielkanocnyHero } from "./CateringWielkanocnyHero";

export type OfferHeroInfoItem = {
  label: string;
  value: string;
  note?: string;
};

export type OfferHeroImage = {
  src: string;
  alt: string;
};

export type OfferHeroContent = {
  eyebrow: string;
  titleLines: string[];
  lead: string;
  infoItems: OfferHeroInfoItem[];
  mainImage: OfferHeroImage;
  offerEyebrow: string;
  offerTitleLines: string[];
  offerParagraphs: string[];
  saleNotice?: string;
  secondaryImages: OfferHeroImage[];
};

export const DEFAULT_OFFER_HERO_CONTENT: OfferHeroContent = {
  eyebrow: "Oferta specjalna",
  titleLines: ["Oferta", "sezonowa"],
  lead:
    "Sekcja prezentuje glowne warunki oferty, kluczowe terminy i najwazniejsze argumenty sprzedazowe w ukladzie hero z obrazem.",
  infoItems: [
    {
      label: "Realizacja",
      value: "Na miejscu / z dostawa",
    },
    {
      label: "Rezerwacje do",
      value: "30 kwietnia",
    },
    {
      label: "Kontakt",
      value: "+48 533 181 171",
      note: "Skontaktuj sie, aby dopasowac szczegoly oferty.",
    },
  ],
  mainImage: {
    src: "/react/images/about_front.jpg",
    alt: "Glowne zdjecie oferty",
  },
  offerEyebrow: "Jak to dziala",
  offerTitleLines: ["Jak skorzystac", "z tej oferty"],
  offerParagraphs: [
    "W tej czesci opisz, jak przebiega zamowienie, rezerwacja lub realizacja oferty. Kazdy akapit jest edytowalny bezposrednio w schema bloku.",
  ],
  saleNotice: "Miejsca i terminy sa ograniczone.",
  secondaryImages: [
    {
      src: "/react/images/about_1.jpg",
      alt: "Dodatkowe zdjecie oferty",
    },
  ],
};

interface OfferHeroSectionProps {
  content?: OfferHeroContent;
  className?: string;
}

const renderLines = (lines: string[]) =>
  lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));

export const OfferHeroSection = ({
  content = DEFAULT_OFFER_HERO_CONTENT,
  className,
}: OfferHeroSectionProps) => {
  return (
    <CateringWielkanocnyHero
      className={cn(className)}
      eyebrow={content.eyebrow}
      title={renderLines(content.titleLines)}
      lead={content.lead}
      infoItems={content.infoItems}
      mainImage={content.mainImage}
      offerEyebrow={content.offerEyebrow}
      offerTitle={renderLines(content.offerTitleLines)}
      offerParagraphs={content.offerParagraphs}
      saleNotice={content.saleNotice}
      secondaryImages={content.secondaryImages}
    />
  );
};

export type { OfferHeroSectionProps };