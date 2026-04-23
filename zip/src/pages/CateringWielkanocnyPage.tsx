import { useEffect, useState } from "react";
import { CalendarDays, ShoppingCart, Store, Truck } from "lucide-react";
import { CateringWielkanocnyHero } from "../components/sections/CateringWielkanocnyHero";
import { FeatureGridSection } from "../components/sections/FeatureGridSection";
import { CateringProductListAlt } from "../components/sections/CateringProductListAlt";
import { CateringProductSpecialMenuFor2 } from "../components/sections/CateringProductSpecialMenuFor2";
import { CheckoutDrawer } from "@/components/CheckoutDrawer";
import { CateringPageFooter } from "../components/sections/CateringPageFooter";
import { CateringPageHeader } from "../components/sections/CateringPageHeader";
import { CateringStickyCartControls } from "../components/sections/CateringStickyCartControls";
import { cateringWielkanocnyCategories } from "../data/cateringWielkanocny";
import { cateringWielkanocnyHeroData } from "../data/cateringWielkanocnyHero";
import {
  SPECIAL_MENU_FOR_2_LINE_TYPE,
  cateringSpecialMenuFor2Seed,
  type SpecialMenuFor2Config,
} from "../data/cateringSpecialMenuFor2";
import {
  CATERING_CART_STORAGE_KEY,
  addSimpleProductLine,
  addSpecialMenuFor2Line,
  buildCheckoutDrawerItems,
  buildBridgeCheckoutCartLines,
  createCateringProductLookup,
  createEmptyCateringCartState,
  getCateringCartItemCount,
  getCateringCartSubtotal,
  getSimpleProductQuantities,
  loadCateringCartState,
  serializeCateringCartState,
  setCartLineQuantity,
} from "../lib/cateringCart";
import { getReactRouteCanonicalUrl, getSiteUrl } from "../lib/clientRuntimeConfig";

const cateringWielkanocnyFeatureGridItems = [
  {
    icon: Store,
    title: "Odbiór własny",
    description: (
      <ul>
        <li>Odbiór w Restauracji BulwaR.</li>
        <li>3.04.2026 r. w Wielki Piątek w godzinach 10.00 - 21.00.</li>
        <li>4.04.2026 r. w Wielką Sobotę w godzinach 10.00 - 16.00.</li>
      </ul>
    ),
  },
  {
    icon: CalendarDays,
    title: "Dowóz",
    description: (
      <ul>
        <li>2-3.04.2026 r. w godz. 10.00 - 18.00.</li>
        <li>4.04.2026 r. w godz. 10.00 - 15.00.</li>
        <li>
          9zł /km + opłata początkowa 10 zł
          <br />
          Dowóz GRATIS przy zamówieniu powyżej 800 zł.
        </li>
      </ul>
    ),
  },
  {
    icon: Truck,
    title: "Płatności",
    description: (
      <ul>
        <li>Przy odbiorze na miejscu karta lub gotówka.</li>
        <li>Od 26 marca także płatności online.</li>
      </ul>
    ),
  },
  {
    icon: ShoppingCart,
    title: "Informacje dodatkowe",
    description: (
      <ul>
        <li>Zamówienia przyjmujemy do czwartku 2.04.2026 r. do godziny 22.00.</li>
        <li>Mailowo: rezerwacje@bulwarrestauracja.pl.</li>
        <li>Tel.: +48 533 181 171.</li>
      </ul>
    ),
  },
] as const;

const cateringProductLookup = createCateringProductLookup(cateringWielkanocnyCategories);

const cateringPageSocialLinks = [
  { label: "Facebook", url: "https://www.facebook.com/bulwaRrestauracja/" },
  { label: "Instagram", url: "https://www.instagram.com/bulwar/" },
  {
    label: "Tripadvisor",
    url: "https://pl.tripadvisor.com/Restaurant_Review-g274847-d10184406-Reviews-Bulwar-Poznan_Greater_Poland_Province_Central_Poland.html",
  },
] as const;

const cateringPageLegalLinks = [
  { label: "Polityka prywatnosci", url: "https://bulwarrestauracja.pl/polityka-prywatnosci/" },
  { label: "Regulamin", url: "https://bulwarrestauracja.pl/regulamin/" },
] as const;

const cateringPageTitle = "Catering Wielkanocny | Restauracja BulwaR Poznan";
const cateringPageDescription = "Catering Wielkanocny z Restauracji BulwaR w Poznaniu. Zamowienia online, odbior osobisty i dowoz w wybranych terminach swiatecznych.";
const siteUrl = getSiteUrl();
const cateringPageCanonicalUrl = getReactRouteCanonicalUrl("catering-wielkanocny");
const isOrderingClosed = true;

export default function CateringWielkanocnyPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartState, setCartState] = useState(() => {
    if (typeof window === "undefined") {
      return createEmptyCateringCartState();
    }

    return loadCateringCartState(
      window.localStorage.getItem(CATERING_CART_STORAGE_KEY),
      cateringProductLookup,
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CATERING_CART_STORAGE_KEY, serializeCateringCartState(cartState));
  }, [cartState]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = cateringPageTitle;

    let descriptionMeta = document.querySelector('meta[name="description"]');

    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }

    descriptionMeta.setAttribute("content", cateringPageDescription);

    let canonicalLink = document.querySelector('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute("href", cateringPageCanonicalUrl);
  }, []);

  const handleAddToCart = (productId: number | string, quantity: number) => {
    if (isOrderingClosed) {
      return;
    }

    if (typeof productId !== "number" || quantity < 1) {
      return;
    }

    const product = cateringProductLookup.get(productId);

    if (!product) {
      return;
    }

    setCartState((currentCartState) => addSimpleProductLine(currentCartState, product, quantity));
  };

  const handleSetCartLineQuantity = (lineId: string, quantity: number) => {
    if (!lineId) {
      return;
    }

    setCartState((currentCartState) => setCartLineQuantity(currentCartState, lineId, quantity));
  };

  const handleAddConfiguredSet = (config: SpecialMenuFor2Config) => {
    if (isOrderingClosed) {
      return;
    }

    setCartState((currentCartState) => addSpecialMenuFor2Line(currentCartState, config, cateringSpecialMenuFor2Seed));
  };

  const handleClearCart = () => {
    setCartState(createEmptyCateringCartState());
  };

  const cartQuantities = getSimpleProductQuantities(cartState);
  const cartItems = buildCheckoutDrawerItems(cartState);
  const cartLinesPayload = buildBridgeCheckoutCartLines(cartState);
  const itemCount = getCateringCartItemCount(cartState);
  const subtotal = getCateringCartSubtotal(cartState);
  const configuredSetCount = cartState.lines.filter(
    (line) => line.lineType === SPECIAL_MENU_FOR_2_LINE_TYPE,
  ).length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-28 font-body text-on-surface selection:bg-primary-fixed md:pb-24">
      <CateringPageHeader
        logoSrc="/react/images/logo.png"
        homeHref={siteUrl}
        returnLabel="<-powrót do strony głównej"
      />

      <div className="w-full border-b border-zinc-100 bg-zinc-50">
        <div className="page-margin">
          <div className="mx-auto flex min-h-[72px] w-full max-w-7xl flex-col justify-center gap-2 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-0">
            <div className="font-label text-[11px] uppercase tracking-[0.12em] text-black">
              Restauracja Bulwar Poznań
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-label text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              <span>Stary Rynek 37</span>
              <span className="hidden md:inline">/</span>
              <a
                href={siteUrl}
                className="transition-colors hover:text-black"
              >
                {new URL(siteUrl).hostname}
              </a>
            </div>
          </div>
        </div>
      </div>

      <main>
        <CateringWielkanocnyHero {...cateringWielkanocnyHeroData} />
        <FeatureGridSection items={[...cateringWielkanocnyFeatureGridItems]} />
        <CateringProductSpecialMenuFor2
          seed={cateringSpecialMenuFor2Seed}
          configuredCount={configuredSetCount}
          orderingClosed={isOrderingClosed}
          onCommitConfiguredSet={handleAddConfiguredSet}
        />
        {cateringWielkanocnyCategories.map((category) => (
          <CateringProductListAlt
            key={category.id}
            title={category.title}
            description={category.description}
            products={category.products}
            bgImage={category.imageUrl}
            cartQuantities={cartQuantities}
            orderingClosed={isOrderingClosed}
            onAddToCart={handleAddToCart}
          />
        ))}
      </main>

      <CateringPageFooter
        logoSrc="/react/images/logo.png"
        socialLinks={cateringPageSocialLinks}
        legalLinks={cateringPageLegalLinks}
      />

      {!isOrderingClosed && (
        <>
          <CateringStickyCartControls
            onOpenCart={() => setIsCartOpen(true)}
            itemCount={itemCount}
            totalPrice={subtotal}
          />
          <CheckoutDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            cartLinesPayload={cartLinesPayload}
            itemCount={itemCount}
            subtotal={subtotal}
            onSetCartLineQuantity={handleSetCartLineQuantity}
            onClearCart={handleClearCart}
          />
        </>
      )}
    </div>
  );
}
