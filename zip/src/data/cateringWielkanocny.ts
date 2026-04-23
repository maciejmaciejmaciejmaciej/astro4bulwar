import cateringWielkanocnyJson from "./cateringWielkanocny.json";

export type CateringDietaryTag = "vegan" | "vegetarian";

export interface RawCateringProduct {
  product_id: number;
  zespolona_nazwa_z_opisem?: string;
  nazwa_produktu?: string;
  opis_produktu?: string;
  opis_poduktu?: string;
  gramatura: string;
  cena: number;
  vegan: boolean;
  vegetarian: boolean;
}

export interface RawCateringCategory {
  category_id: number;
  nazwa_kategorii: string;
  opis_kategorii: string;
  image_url: string;
  pozycje: RawCateringProduct[];
}

interface CateringProductContractBase {
  id: number;
  weight: string;
  price: number;
  priceLabel: string;
  vegan: boolean;
  vegetarian: boolean;
  dietaryTag: CateringDietaryTag | null;
}

export interface CateringCombinedProductContract extends CateringProductContractBase {
  contentMode: "combined";
  combinedText: string;
}

export interface CateringSplitProductContract extends CateringProductContractBase {
  contentMode: "split";
  productName: string;
  productDescriptionHtml: string;
}

export type CateringProductContract =
  | CateringCombinedProductContract
  | CateringSplitProductContract;

export interface CateringCategoryContract {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  products: CateringProductContract[];
}

const PUBLIC_IMAGE_PREFIX = "/react/images/";

const formatPriceLabel = (price: number): string => {
  return Number.isInteger(price)
    ? `${price} PLN`
    : `${price.toFixed(2).replace(".", ",")} PLN`;
};

const normalizeString = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string") {
    throw new Error(`Invalid catering data: ${fieldName} must be a string.`);
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new Error(`Invalid catering data: ${fieldName} cannot be empty.`);
  }

  return normalizedValue;
};

const normalizeOptionalString = (value: unknown, fieldName: string): string | null => {
  if (typeof value === "undefined") {
    return null;
  }

  return normalizeString(value, fieldName);
};

const normalizeNumber = (value: unknown, fieldName: string): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid catering data: ${fieldName} must be a finite number.`);
  }

  return value;
};

const normalizeBoolean = (value: unknown, fieldName: string): boolean => {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid catering data: ${fieldName} must be a boolean.`);
  }

  return value;
};

const normalizeImageUrl = (value: unknown, fieldName: string): string => {
  const imageUrl = normalizeString(value, fieldName);

  if (!imageUrl.startsWith(PUBLIC_IMAGE_PREFIX)) {
    throw new Error(
      `Invalid catering data: ${fieldName} must start with ${PUBLIC_IMAGE_PREFIX}.`,
    );
  }

  return imageUrl;
};

const toDietaryTag = (vegan: boolean, vegetarian: boolean): CateringDietaryTag | null => {
  if (vegan) {
    return "vegan";
  }

  if (vegetarian) {
    return "vegetarian";
  }

  return null;
};

const normalizeProduct = (
  product: RawCateringProduct,
  categoryName: string,
): CateringProductContract => {
  const productId = normalizeNumber(
    product.product_id,
    `${categoryName}.product.product_id`,
  );
  const vegan = normalizeBoolean(product.vegan, `${categoryName}.product.vegan`);
  const vegetarian = normalizeBoolean(
    product.vegetarian,
    `${categoryName}.product.vegetarian`,
  );
  const price = normalizeNumber(product.cena, `${categoryName}.product.cena`);
  const baseProduct: CateringProductContractBase = {
    id: productId,
    weight: normalizeString(product.gramatura, `${categoryName}.product.gramatura`),
    price,
    priceLabel: formatPriceLabel(price),
    vegan,
    vegetarian,
    dietaryTag: toDietaryTag(vegan, vegetarian),
  };

  const productName = normalizeOptionalString(
    product.nazwa_produktu,
    `${categoryName}.product.nazwa_produktu`,
  );
  const productDescriptionHtml = normalizeOptionalString(
    product.opis_produktu ?? product.opis_poduktu,
    `${categoryName}.product.opis_produktu`,
  );

  if (productName !== null || productDescriptionHtml !== null) {
    if (productName === null || productDescriptionHtml === null) {
      throw new Error(
        `Invalid catering data: ${categoryName}.product must provide both nazwa_produktu and opis_produktu.`,
      );
    }

    return {
      ...baseProduct,
      contentMode: "split",
      productName,
      productDescriptionHtml,
    };
  }

  return {
    ...baseProduct,
    contentMode: "combined",
    combinedText: normalizeString(
      product.zespolona_nazwa_z_opisem,
      `${categoryName}.product.zespolona_nazwa_z_opisem`,
    ),
  };
};

const normalizeCategory = (category: RawCateringCategory): CateringCategoryContract => {
  const categoryName = normalizeString(category.nazwa_kategorii, "category.nazwa_kategorii");
  const products = Array.isArray(category.pozycje)
    ? category.pozycje.map((product) => normalizeProduct(product, categoryName))
    : null;

  if (!products) {
    throw new Error(`Invalid catering data: ${categoryName}.pozycje must be an array.`);
  }

  const description = normalizeString(
    category.opis_kategorii,
    `${categoryName}.opis_kategorii`,
  );

  return {
    id: normalizeNumber(category.category_id, `${categoryName}.category_id`),
    title: categoryName,
    description,
    imageUrl: normalizeImageUrl(category.image_url, `${categoryName}.image_url`),
    products,
  };
};

const rawCategories = Array.isArray(cateringWielkanocnyJson)
  ? (cateringWielkanocnyJson as RawCateringCategory[])
  : (() => {
      throw new Error("Invalid catering data: root JSON value must be an array.");
    })();

export const cateringWielkanocnySource: readonly RawCateringCategory[] = rawCategories;

export const cateringWielkanocnyCategories: readonly CateringCategoryContract[] = rawCategories.map(
  normalizeCategory,
);