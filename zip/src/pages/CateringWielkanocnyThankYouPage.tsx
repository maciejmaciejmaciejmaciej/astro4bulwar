import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { CheckoutSuccessConfirmation } from "@/src/components/CheckoutSuccessConfirmation";
import {
  readCheckoutSuccessSnapshot,
  type CheckoutSuccessSnapshot,
  type CheckoutSuccessSnapshotReadResult,
} from "@/src/lib/checkoutSuccessSnapshot";
import {
  CATERING_WIELKANOCNY_PATH,
  CATERING_WIELKANOCNY_THANK_YOU_PATH,
} from "@/src/lib/cateringThankYou";
import { getReactRouteCanonicalUrl, getSiteUrl } from "@/src/lib/clientRuntimeConfig";
import { CateringPageFooter } from "../components/sections/CateringPageFooter";
import { CateringPageHeader } from "../components/sections/CateringPageHeader";

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

const thankYouPageTitle = "Dziekujemy za zamowienie | Catering Wielkanocny | Restauracja BulwaR Poznan";
const thankYouPageDescription = "Potwierdzenie zamowienia Cateringu Wielkanocnego z Restauracji BulwaR w Poznaniu.";
const siteUrl = getSiteUrl();
const thankYouPageCanonicalUrl = getReactRouteCanonicalUrl(CATERING_WIELKANOCNY_THANK_YOU_PATH);

const buildMissingSnapshotResult = (): CheckoutSuccessSnapshotReadResult => ({
  status: "missing",
  snapshot: null,
  shouldClear: false,
});

const getFallbackHeading = (status: CheckoutSuccessSnapshotReadResult["status"]): string => {
  return "Dziekujemy za zamowienie";
};

const getFallbackDescription = (status: CheckoutSuccessSnapshotReadResult["status"]): string => {
  return status === "stale"
    ? "Zapisane podsumowanie wygaslo w tej przegladarce. Jesli chcesz zlozyc kolejne zamowienie, wroc do cateringu."
    : "Szczegolowe podsumowanie nie jest juz dostepne w tej przegladarce. Jesli chcesz zlozyc kolejne zamowienie, wroc do cateringu.";
};

export default function CateringWielkanocnyThankYouPage() {
  const navigate = useNavigate();
  const [snapshotResult] = useState<CheckoutSuccessSnapshotReadResult>(() => {
    if (typeof window === "undefined") {
      return buildMissingSnapshotResult();
    }

    return readCheckoutSuccessSnapshot(window.localStorage);
  });

  const snapshot: CheckoutSuccessSnapshot | null = snapshotResult.snapshot;

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = thankYouPageTitle;

    let descriptionMeta = document.querySelector('meta[name="description"]');

    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }

    descriptionMeta.setAttribute("content", thankYouPageDescription);

    let canonicalLink = document.querySelector('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute("href", thankYouPageCanonicalUrl);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-28 font-body text-on-surface selection:bg-primary-fixed md:pb-24">
      <CateringPageHeader
        logoSrc="/react/images/logo.png"
        homeHref={`/react${CATERING_WIELKANOCNY_PATH}`}
        returnLabel="<-powrót do cateringu"
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

      <main className="page-margin py-10 md:py-14">
        {snapshot ? (
          <CheckoutSuccessConfirmation snapshot={snapshot} />
        ) : (
          <div className="mx-auto max-w-3xl rounded-[4px] border border-zinc-100 bg-zinc-50 p-8 md:p-10">
            <div className="space-y-4 rounded-[4px] border border-dashed border-zinc-300 bg-white px-6 py-8 text-center">
              <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">Catering Wielkanocny</p>
              <h1 className="font-headline text-2xl uppercase tracking-widest text-zinc-900 md:text-3xl">
                {getFallbackHeading(snapshotResult.status)}
              </h1>
              <p className="mx-auto max-w-xl text-sm leading-7 text-zinc-600">
                {getFallbackDescription(snapshotResult.status)}
              </p>
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  onClick={() => navigate(CATERING_WIELKANOCNY_PATH)}
                  className="rounded-[4px] bg-black px-6 text-white hover:bg-zinc-800"
                >
                  WROC DO CATERINGU
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <CateringPageFooter
        logoSrc="/react/images/logo.png"
        socialLinks={cateringPageSocialLinks}
        legalLinks={cateringPageLegalLinks}
      />
    </div>
  );
}