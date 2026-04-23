import { useEffect, useRef, useState } from "react";
import { Check, Leaf, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  buildSpecialMenuFor2Config,
  resolveSpecialMenuFor2UnitPriceLabel,
  type SpecialMenuFor2Config,
  type SpecialMenuFor2DraftSelection,
  type SpecialMenuFor2Seed,
  type SpecialMenuOption,
} from "@/src/data/cateringSpecialMenuFor2";

interface CateringProductSpecialMenuFor2Props {
  seed: SpecialMenuFor2Seed;
  configuredCount: number;
  onCommitConfiguredSet: (config: SpecialMenuFor2Config) => void;
  orderingClosed?: boolean;
  className?: string;
}

const INITIAL_SELECTION: SpecialMenuFor2DraftSelection = {
  person1SoupOptionId: "",
  person1MainOptionId: "",
  person2SoupOptionId: "",
  person2MainOptionId: "",
};

const getDietaryIndicator = (option: SpecialMenuOption) => {
  if (option.dietaryTag === "vegan") {
    return {
      Icon: Leaf,
      label: "Vegan",
    };
  }

  if (option.dietaryTag === "vegetarian") {
    return {
      Icon: Sprout,
      label: "Vegetariańskie",
    };
  }

  return null;
};

const renderOptionButton = (
  option: SpecialMenuOption,
  isSelected: boolean,
  onSelect: () => void,
) => {
  const dietaryIndicator = getDietaryIndicator(option);

  return (
    <button
      key={option.optionId}
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-full flex-col rounded-[4px] border px-4 py-4 text-left transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="font-body text-sm text-zinc-900">{option.label}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase text-zinc-500">
            <span className="font-mono normal-case text-xs text-zinc-400">{option.weight}</span>
            <span className="font-label">{option.priceLabel}</span>
            {dietaryIndicator && (
              <span className="inline-flex items-center gap-1.5 font-label">
                <dietaryIndicator.Icon className="size-3 text-primary" strokeWidth={1.75} />
                {dietaryIndicator.label}
              </span>
            )}
          </div>
        </div>
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
            isSelected ? "border-primary bg-primary text-on-primary" : "border-zinc-300 text-transparent",
          )}
        >
          <Check className="size-3" strokeWidth={2.5} />
        </span>
      </div>
    </button>
  );
};

export function CateringProductSpecialMenuFor2({
  seed,
  configuredCount,
  onCommitConfiguredSet,
  orderingClosed = false,
  className,
}: CateringProductSpecialMenuFor2Props) {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selection, setSelection] = useState<SpecialMenuFor2DraftSelection>(INITIAL_SELECTION);
  const person1MainRef = useRef<HTMLDivElement | null>(null);
  const person2SectionRef = useRef<HTMLDivElement | null>(null);
  const person2MainRef = useRef<HTMLDivElement | null>(null);

  const config = buildSpecialMenuFor2Config(selection, seed);
  const ctaLabel = orderingClosed
    ? "Sprzedaż zakończona"
    : configuredCount > 0
      ? "Skonfiguruj kolejny zestaw"
      : "Skonfiguruj zestaw";
  const isPerson1SoupSelected = Boolean(selection.person1SoupOptionId);
  const isPerson1Complete = Boolean(selection.person1SoupOptionId && selection.person1MainOptionId);
  const isPerson2Visible = isPerson1Complete;
  const isPerson2SoupSelected = Boolean(selection.person2SoupOptionId);
  const isReadyToAdd = Boolean(config);

  useEffect(() => {
    if (!isConfiguratorOpen || !isPerson1SoupSelected || selection.person1MainOptionId) {
      return;
    }

    person1MainRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isConfiguratorOpen, isPerson1SoupSelected, selection.person1MainOptionId]);

  useEffect(() => {
    if (!isConfiguratorOpen || !isPerson1Complete) {
      return;
    }

    person2SectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isConfiguratorOpen, isPerson1Complete]);

  useEffect(() => {
    if (!isConfiguratorOpen || !isPerson2SoupSelected || selection.person2MainOptionId) {
      return;
    }

    person2MainRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isConfiguratorOpen, isPerson2SoupSelected, selection.person2MainOptionId]);

  const updateSelection = (field: keyof SpecialMenuFor2DraftSelection, optionId: string) => {
    setSelection((currentSelection) => ({
      ...currentSelection,
      [field]: optionId,
    }));
  };

  const handleCommit = () => {
    if (orderingClosed || !config) {
      return;
    }

    onCommitConfiguredSet(config);
    setSelection(INITIAL_SELECTION);
    setIsConfiguratorOpen(false);
  };

  return (
    <section className={cn("w-full bg-white text-on-surface", className)}>
      {seed.imageUrl && (
        <div className="theme-section-wrapper md:pt-16">
          <div className="mx-auto max-w-7xl">
            <div className="relative h-[280px] w-full overflow-hidden rounded-[4px] md:h-[400px]">
              <img
                src={seed.imageUrl}
                alt={seed.shellProduct.title}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/35" />
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "theme-section-wrapper",
          seed.imageUrl ? "relative z-20 -mt-[140px] pb-16 md:-mt-[220px] md:pb-24" : "py-16 md:py-24",
        )}
      >
        <div className="mx-auto max-w-6xl space-y-8 md:space-y-10">
          <div className="space-y-4 text-center md:text-left">
            <h3
              className={cn(
                "font-headline text-2xl uppercase tracking-[0.2rem] md:text-3xl",
                seed.imageUrl ? "relative z-30 text-white drop-shadow-md" : "text-zinc-900",
              )}
            >
              {seed.shellProduct.title}
            </h3>
            <p
              className={cn(
                "max-w-3xl font-body text-sm leading-relaxed md:text-base",
                seed.imageUrl ? "relative z-30 text-white/90" : "text-zinc-600",
              )}
            >
              Skonfiguruj świąteczny zestaw dla dwóch osób. Najpierw wybierasz zupę i danie główne dla Osoby 1, a po zakończeniu tej części odsłaniamy wybory dla Osoby 2. Porcje widoczne przy opcjach podajemy na 1 osobę, np. 0,25 l zupy, 1 noga z kaczki, 1 zraz.
            </p>
          </div>

          <div className="relative z-30 rounded-[8px] border border-zinc-200/60 bg-zinc-50/90 p-2 shadow-sm transition-colors duration-500 md:p-3">
            <div className="rounded-[4px] border border-zinc-200/80 bg-white px-4 py-6 md:px-10 md:py-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase text-zinc-500">
                    <span className="font-label">Produkt specjalny</span>
                    <span className="font-label">4 wybory w jednym zestawie</span>
                    {configuredCount > 0 && <span className="font-label">Dodano: {configuredCount}</span>}
                  </div>
                  <div className="space-y-2">
                    <p className="font-body text-base text-zinc-900">{seed.shellProduct.displayName}</p>
                    <p className="font-body text-sm text-zinc-500">
                      Zestaw zapisuje się w koszyku jako osobna linia, więc możesz dodać kilka różnych konfiguracji bez nadpisywania wyborów.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <Button
                    type="button"
                    disabled={orderingClosed}
                    onClick={() => {
                      if (orderingClosed) {
                        return;
                      }

                      setIsConfiguratorOpen((currentValue) => !currentValue);
                    }}
                    variant={isConfiguratorOpen ? "secondary" : "outline"}
                    className="h-10 rounded-[4px] border-primary px-5 font-label text-xs text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isConfiguratorOpen ? "Zamknij konfigurator" : ctaLabel}
                  </Button>
                  {config && (
                    <p className="font-label text-[11px] uppercase text-zinc-500">
                      Wartość aktualnego zestawu: {resolveSpecialMenuFor2UnitPriceLabel(config, seed)}
                    </p>
                  )}
                </div>
              </div>

              {isConfiguratorOpen && (
                <div className="mt-8 border-t border-zinc-200 pt-8">
                  <div className="space-y-8">
                    <div className="space-y-5 border-b border-zinc-200 pb-8">
                      <div className="space-y-2">
                        <p className="font-headline text-lg uppercase text-zinc-900">Osoba 1</p>
                        <p className="font-body text-sm text-zinc-500">Krok 1. Wybierz zupę, a następnie danie główne.</p>
                      </div>

                      <div className="space-y-3">
                        <p className="font-label text-[11px] uppercase text-zinc-500">1. Wybór zupy</p>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {seed.soups.map((option) =>
                            renderOptionButton(option, selection.person1SoupOptionId === option.optionId, () =>
                              updateSelection("person1SoupOptionId", option.optionId),
                            ),
                          )}
                        </div>
                      </div>

                      {isPerson1SoupSelected && (
                        <div ref={person1MainRef} className="space-y-3">
                          <p className="font-label text-[11px] uppercase text-zinc-500">2. Wybór dania głównego</p>
                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {seed.mains.map((option) =>
                              renderOptionButton(option, selection.person1MainOptionId === option.optionId, () =>
                                updateSelection("person1MainOptionId", option.optionId),
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {isPerson2Visible && (
                      <div ref={person2SectionRef} className="space-y-5">
                        <div className="space-y-2">
                          <p className="font-headline text-lg uppercase text-zinc-900">Osoba 2</p>
                          <p className="font-body text-sm text-zinc-500">Krok 2. Po uzupełnieniu Osoby 1 możesz dokończyć wybory dla Osoby 2.</p>
                        </div>

                        <div className="space-y-3">
                          <p className="font-label text-[11px] uppercase text-zinc-500">3. Wybór zupy</p>
                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {seed.soups.map((option) =>
                              renderOptionButton(option, selection.person2SoupOptionId === option.optionId, () =>
                                updateSelection("person2SoupOptionId", option.optionId),
                              ),
                            )}
                          </div>
                        </div>

                        {isPerson2SoupSelected && (
                          <div ref={person2MainRef} className="space-y-3">
                            <p className="font-label text-[11px] uppercase text-zinc-500">4. Wybór dania głównego</p>
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                              {seed.mains.map((option) =>
                                renderOptionButton(option, selection.person2MainOptionId === option.optionId, () =>
                                  updateSelection("person2MainOptionId", option.optionId),
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {isReadyToAdd && config && (
                      <div className="rounded-[4px] border border-zinc-200 bg-zinc-50 px-4 py-5 md:px-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                          <div className="space-y-2">
                            <p className="font-label text-[11px] uppercase text-zinc-500">Podsumowanie zestawu</p>
                            <div className="space-y-3">
                              {config.persons.map((person) => (
                                <div key={person.personIndex} className="space-y-1.5">
                                  <p className="font-body text-sm text-zinc-900">
                                    Osoba {person.personIndex}
                                  </p>
                                  <ul className="list-disc space-y-1 pl-5 font-body text-sm text-zinc-700 marker:text-zinc-500">
                                    <li>Zupa: {person.soupLabel}</li>
                                    <li>Danie główne: {person.mainLabel}</li>
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <p className="font-label text-[11px] uppercase text-zinc-500">
                              Cena aktualnego zestawu: {resolveSpecialMenuFor2UnitPriceLabel(config, seed)}
                            </p>
                          </div>

                          <Button
                            type="button"
                            disabled={orderingClosed}
                            onClick={handleCommit}
                            className="h-10 rounded-[4px] bg-primary px-5 font-label text-xs text-on-primary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Dodaj do koszyka
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}