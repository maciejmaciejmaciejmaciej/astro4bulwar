import type {
  CateringHeroImage,
  CateringHeroInfoItem,
  CateringWielkanocnyHeroProps,
} from "../components/sections/CateringWielkanocnyHero";

const infoItems: readonly CateringHeroInfoItem[] = [
  {
    label: "Odbiór",
    value: "Osobisty / Dostawa",
  },
  {
    label: "Zamówienia do",
    value: "2 Kwietnia",
  },
  {
    label: "Płatność",
    value: (
      <>
        przy odbiorze (karta/gotowka) / <span style={{ color: "#a1a1aa" }}>online</span>
        <span style={{ color: "#dc2626" }}>*</span>
      </>
    ),
    note: (
      <>
        <span style={{ color: "#dc2626" }}>*</span> płatności online od 26 marca
      </>
    ),
  },
];

const mainImage: CateringHeroImage = {
  src: "/react/images/catering%20wielkanoscny%20%281%29.webp",
  alt: "Catering Wielkanocny",
};

const secondaryImages: readonly CateringHeroImage[] = [
  {
    src: "/react/images/wypieki.webp",
    alt: "Desery i wypieki świąteczne",
  },
];

const offerParagraphs: readonly string[] = [
  "Skorzystaj z naszego sklepu online, aby złożyć zamówienie z wyprzedzeniem. Poniżej znajdziesz pełną listę podzieloną na kategorie. Dodaj odpowiednie pozycje do koszyka z uwzględnieniem ilości. Podczas składania zamówienia podajesz preferowany czas realizacji Twojego zamówienia.",
];

export const cateringWielkanocnyHeroData: Omit<CateringWielkanocnyHeroProps, "className"> = {
  eyebrow: "MENU wielkanoc - zamówienia online 2026",
  title: "Catering Wielkanocny",
  lead:
    "Świąteczny czas tak szybko mija, pomyśl więc trochę o sobie i zamów catering przygotowany w Restauracji BulwaR w Poznaniu na bazie wysokiej jakości produktów. Nasz catering świąteczny, wielkanocny dostępny jest w opcji z odbiorem własnym lub dowozem. Menu wielkanocne oparte jest na tradycyjnych regionalnych potrawach.",
  infoItems,
  mainImage,
  offerEyebrow: "MENU wielkanoc - zamówienia online 2026",
  offerTitle: (
    <>
      Catering wielkanocny z Restauracji BulwaR <br /> jak złożyć zamówienie
    </>
  ),
  offerParagraphs,
  saleNotice: "Sprzedaż cateringu została zakończona. Dziękujemy",
  secondaryImages,
};