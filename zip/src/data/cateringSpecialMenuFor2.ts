import type { CateringDietaryTag } from "./cateringWielkanocny";

export const SPECIAL_MENU_FOR_2_KIND = "menu_for_2" as const;
export const SPECIAL_MENU_FOR_2_LINE_TYPE = "special_menu_for_2" as const;
export const SPECIAL_MENU_FOR_2_SCHEMA_VERSION = 1 as const;

export type SpecialMenuOptionCategoryKey = "soups" | "mains";

export interface SpecialMenuOption {
  optionId: string;
  categoryKey: SpecialMenuOptionCategoryKey;
  label: string;
  weight: string;
  dietaryTag: CateringDietaryTag | null;
  priceLabel?: string;
}

export interface SpecialMenuPersonSelection {
  personIndex: 1 | 2;
  soupOptionId: string;
  soupLabel: string;
  mainOptionId: string;
  mainLabel: string;
}

export type SpecialMenuFor2Persons = readonly [
  SpecialMenuPersonSelection,
  SpecialMenuPersonSelection,
];

export interface SpecialMenuFor2Config {
  kind: typeof SPECIAL_MENU_FOR_2_KIND;
  schemaVersion: typeof SPECIAL_MENU_FOR_2_SCHEMA_VERSION;
  persons: SpecialMenuFor2Persons;
}

export interface SpecialMenuFor2ShellProductIdentity {
  baseProductId: number;
  baseProductIdStatus: "placeholder" | "live";
  slug: string;
  title: string;
  displayName: string;
  unitPrice: number;
  unitPriceLabel: string;
}

export interface SpecialMenuFor2Seed {
  kind: typeof SPECIAL_MENU_FOR_2_KIND;
  schemaVersion: typeof SPECIAL_MENU_FOR_2_SCHEMA_VERSION;
  shellProduct: SpecialMenuFor2ShellProductIdentity;
  intro: string;
  imageUrl?: string;
  soups: readonly SpecialMenuOption[];
  mains: readonly SpecialMenuOption[];
}

export interface SpecialMenuFor2DraftSelection {
  person1SoupOptionId: string;
  person1MainOptionId: string;
  person2SoupOptionId: string;
  person2MainOptionId: string;
}

const buildOption = (
  categoryKey: SpecialMenuOptionCategoryKey,
  optionId: string,
  label: string,
  weight: string,
  dietaryTag: CateringDietaryTag | null = null,
): SpecialMenuOption => ({
  optionId: `${categoryKey}:${optionId}`,
  categoryKey,
  label,
  weight,
  dietaryTag,
  priceLabel: "W cenie zestawu",
});

export const cateringSpecialMenuFor2Seed: SpecialMenuFor2Seed = {
  kind: SPECIAL_MENU_FOR_2_KIND,
  schemaVersion: SPECIAL_MENU_FOR_2_SCHEMA_VERSION,
  shellProduct: {
    baseProductId: 53,
    baseProductIdStatus: "live",
    slug: "obiad-wielkanocny-dla-2-osob",
    title: "Obiad Wielkanocny dla 2 osób",
    displayName: "Obiad Wielkanocny dla 2 osób",
    unitPrice: 169,
    unitPriceLabel: "169 PLN",
  },
  intro: "USER DO WYBORU MA ZUPĘ I DANIE GŁÓWNE DLA KAŻDEJ Z 2 OSÓB.",
  imageUrl: "/react/images/zestaw-obiad-dla-2-osob.webp",
  soups: [
    buildOption(
      "soups",
      "barszcz-czerwony",
      "Barszcz czerwony gotowany z kwaśnymi jabłkami i suszonymi podgrzybkami pełen czosnku i świeżego majeranku",
      "0,25 l",
    ),
    buildOption(
      "soups",
      "rosol-z-kury-domowej",
      "Rosół z kury domowej gotowany 12 godzin na wolnym ogniu, z ekologiczną marchewką, świeżo ciętym lubczykiem i natką młodej pietruszki",
      "0,25 l",
    ),
    buildOption(
      "soups",
      "domowy-zurek",
      "Domowy żurek na 5-ciodniowym zakwasie z mąki żytniej razowej gotowany na wędzonych żeberkach, z białą surową kiełbasą, pełen czosnku i świeżo tartego chrzanu",
      "0,25 l",
    ),
  ],
  mains: [
    buildOption(
      "mains",
      "devolay-z-kurczaka-zagrodowego",
      "Devolay z kurczaka zagrodowego z delikatnym kremowym puree ziemniaczanym i młodą marchewką z groszkiem cukrowym na klarowanym wiejskim masełku",
      "1 szt. / 150 gr / 150 gr",
    ),
    buildOption(
      "mains",
      "konfitowana-noga-z-kaczki",
      "Konfitowana noga z kaczki leniwie pieczona w gęsim tłuszczu, z ręcznie robionymi pulchnymi pyzami drożdżowymi i sosem z suszonych jagód żurawiny, gruszek i wędzonych śliwek perfumowanym świeżym tymiankiem",
      "1 noga z kaczki / 2 pyzy / 100 ml",
    ),
    buildOption(
      "mains",
      "zraz-wolowy",
      "Zraz wołowy z czosnkowym ogórkiem kiszonym, razowym chlebem wiejskim, wędzonym boczkiem, z młodymi ziemniakami pieczonymi w świeżych ziołach prowansalskich, głębokim własnym sosem pieczeniowym i buraczkami zasmażanymi na wiejskim klarowanym maśle",
      "1 zraz / 150 gr / 100 ml / 150 gr",
    ),
  ],
};

export const findSpecialMenuOption = (
  seed: SpecialMenuFor2Seed,
  categoryKey: SpecialMenuOptionCategoryKey,
  optionId: string,
): SpecialMenuOption | null => {
  const options = categoryKey === "soups" ? seed.soups : seed.mains;

  return options.find((option) => option.optionId === optionId) ?? null;
};

export const buildSpecialMenuFor2Config = (
  selection: SpecialMenuFor2DraftSelection,
  seed: SpecialMenuFor2Seed = cateringSpecialMenuFor2Seed,
): SpecialMenuFor2Config | null => {
  const person1Soup = findSpecialMenuOption(seed, "soups", selection.person1SoupOptionId);
  const person1Main = findSpecialMenuOption(seed, "mains", selection.person1MainOptionId);
  const person2Soup = findSpecialMenuOption(seed, "soups", selection.person2SoupOptionId);
  const person2Main = findSpecialMenuOption(seed, "mains", selection.person2MainOptionId);

  if (!person1Soup || !person1Main || !person2Soup || !person2Main) {
    return null;
  }

  return {
    kind: SPECIAL_MENU_FOR_2_KIND,
    schemaVersion: SPECIAL_MENU_FOR_2_SCHEMA_VERSION,
    persons: [
      {
        personIndex: 1,
        soupOptionId: person1Soup.optionId,
        soupLabel: person1Soup.label,
        mainOptionId: person1Main.optionId,
        mainLabel: person1Main.label,
      },
      {
        personIndex: 2,
        soupOptionId: person2Soup.optionId,
        soupLabel: person2Soup.label,
        mainOptionId: person2Main.optionId,
        mainLabel: person2Main.label,
      },
    ],
  };
};

export const resolveSpecialMenuFor2UnitPrice = (
  config: SpecialMenuFor2Config,
  seed: SpecialMenuFor2Seed = cateringSpecialMenuFor2Seed,
): number => {
  void config;
  return seed.shellProduct.unitPrice;
};

const formatResolvedPriceLabel = (price: number): string => {
  return `${Number.isInteger(price) ? price.toString() : price.toFixed(2)} PLN`;
};

export const resolveSpecialMenuFor2UnitPriceLabel = (
  config: SpecialMenuFor2Config,
  seed: SpecialMenuFor2Seed = cateringSpecialMenuFor2Seed,
): string => {
  if (seed.shellProduct.unitPrice > 0 && seed.shellProduct.unitPriceLabel) {
    return seed.shellProduct.unitPriceLabel;
  }

  return formatResolvedPriceLabel(resolveSpecialMenuFor2UnitPrice(config, seed));
};

const isValidPersonIndex = (value: unknown): value is 1 | 2 => {
  return value === 1 || value === 2;
};

const isSpecialMenuPersonSelection = (value: unknown): value is SpecialMenuPersonSelection => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<SpecialMenuPersonSelection>;

  return (
    isValidPersonIndex(candidate.personIndex) &&
    typeof candidate.soupOptionId === "string" &&
    typeof candidate.soupLabel === "string" &&
    typeof candidate.mainOptionId === "string" &&
    typeof candidate.mainLabel === "string"
  );
};

export const isSpecialMenuFor2Config = (value: unknown): value is SpecialMenuFor2Config => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<SpecialMenuFor2Config>;

  return (
    candidate.kind === SPECIAL_MENU_FOR_2_KIND &&
    candidate.schemaVersion === SPECIAL_MENU_FOR_2_SCHEMA_VERSION &&
    Array.isArray(candidate.persons) &&
    candidate.persons.length === 2 &&
    isSpecialMenuPersonSelection(candidate.persons[0]) &&
    isSpecialMenuPersonSelection(candidate.persons[1]) &&
    candidate.persons[0].personIndex === 1 &&
    candidate.persons[1].personIndex === 2
  );
};

export const buildSpecialMenuPersonSummary = (
  person: SpecialMenuPersonSelection,
): string => {
  return `Osoba ${person.personIndex}: Zupa ${person.soupLabel} / Danie ${person.mainLabel}`;
};

export const buildSpecialMenuFor2SummaryLines = (
  config: SpecialMenuFor2Config,
): readonly string[] => {
  return config.persons.map((person) => buildSpecialMenuPersonSummary(person));
};

export const buildSpecialMenuFor2SummaryString = (
  config: SpecialMenuFor2Config,
): string => {
  return buildSpecialMenuFor2SummaryLines(config).join(" | ");
};