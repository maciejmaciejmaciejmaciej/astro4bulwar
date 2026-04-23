import type {
  MenuCategoryPhotoParallaxFullWidthData,
  MenuCategoryPhotoParallaxFullWidthSource,
} from "../menu-category-photo-parallax-full-width/schema";
import type {
  MenuThreeColumnsWithWithHeadingNoImgData,
  MenuThreeColumnsWithWithHeadingNoImgSource,
} from "../menu_three_columns_with_with_heading_no_img/schema";
import type {
  MenuTwoColumnsWithNoHeadingNoImgData,
  MenuTwoColumnsWithNoHeadingNoImgSource,
} from "../menu_two_columns_with_no_heading_no_img/schema";
import type {
  MenuTwoColumnsWithWithHeadingNoImgData,
  MenuTwoColumnsWithWithHeadingNoImgSource,
} from "../menu_two_columns_with_with_heading_no_img/schema";
import type {
  MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxData,
  MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSource,
} from "../menu_two_columns_with_with_heading_with_img_fullwidth_paralax/schema";
import type { Promo2Data, Promo2Source } from "../promo2/schema";
import { getWordPressBaseUrl } from "../../lib/clientRuntimeConfig";
import type { MenuColumn, MenuItem } from "./common";

interface WooStoreProductPrices {
  price: string;
  currency_code: string;
  currency_minor_unit: number;
}

interface WooStoreProduct {
  id: number;
  name: string;
  short_description: string;
  description: string;
  prices: WooStoreProductPrices;
  is_in_stock: boolean;
  categories?: WooStoreCategory[];
  tags?: WooStoreTag[];
}

interface WooStoreCategory {
  id: number;
  name: string;
  slug: string;
  link?: string;
}

interface WooStoreTag {
  id: number;
  name: string;
  slug: string;
  link?: string;
}

const fetchWooStoreJson = async <T,>(path: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${getWordPressBaseUrl()}${path}`, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Woo Store API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

const stripHtml = (value: string): string => {
  if (!value) {
    return "";
  }

  if (typeof DOMParser !== "undefined") {
    const document = new DOMParser().parseFromString(value, "text/html");
    return document.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
  }

  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

const formatWooPrice = (prices: WooStoreProductPrices): string => {
  const divisor = 10 ** prices.currency_minor_unit;
  const numericPrice = Number(prices.price) / divisor;

  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: prices.currency_code,
  }).format(numericPrice);
};

const splitMenuItemsIntoColumns = (
  items: readonly MenuItem[],
  requestedColumns: number,
): MenuColumn[] => {
  const columnCount = Math.max(1, requestedColumns);

  if (items.length === 0) {
    return [];
  }

  const itemsPerColumn = Math.ceil(items.length / columnCount);

  return Array.from({ length: columnCount }, (_, index) => ({
    items: items.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn),
  })).filter((column) => column.items.length > 0);
};

const mapWooProductToMenuItem = (product: WooStoreProduct): MenuItem => {
  const description = stripHtml(product.short_description || product.description);

  return {
    title: product.name,
    description: description || undefined,
    priceLabel: formatWooPrice(product.prices),
    tagSlugs: Array.isArray(product.tags)
      ? product.tags
          .map((tag) => tag.name || tag.slug)
          .filter((tagLabel): tagLabel is string => typeof tagLabel === "string" && tagLabel.trim().length > 0)
      : [],
  };
};

const resolveWooMenuColumnsFromSource = async (
  source:
    | MenuCategoryPhotoParallaxFullWidthSource
    | MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSource
    | Promo2Source,
  requestedColumns: number,
  signal?: AbortSignal,
): Promise<{ category: WooStoreCategory | null; menuColumns: MenuColumn[] }> => {
  const sourceOptions = source.options ?? {};
  const resolved = source.sourceType === "woo_products"
    ? {
        category: null,
        products: await fetchWooProductsByIds(source.sourceValue, signal),
      }
    : await fetchWooProductsByCategory(source.sourceValue, sourceOptions, signal);

  return {
    category: resolved.category,
    menuColumns: splitMenuItemsIntoColumns(
      resolved.products.map(mapWooProductToMenuItem),
      requestedColumns,
    ),
  };
};

const fetchWooProductsByIds = async (productIds: readonly number[], signal?: AbortSignal): Promise<WooStoreProduct[]> => {
  const sanitizedIds = productIds.filter((productId): productId is number => Number.isInteger(productId) && productId > 0);

  if (sanitizedIds.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    include: sanitizedIds.join(","),
    orderby: "include",
  });
  const products = await fetchWooStoreJson<WooStoreProduct[]>(`/wp-json/wc/store/v1/products?${params.toString()}`, signal);
  const productMap = new Map(products.map((product) => [product.id, product] as const));

  return sanitizedIds.flatMap((productId) => {
    const product = productMap.get(productId);
    return product ? [product] : [];
  });
};

const fetchWooCategoryByIdentifier = async (
  identifier: string | number,
  signal?: AbortSignal,
): Promise<WooStoreCategory | null> => {
  const categories = await fetchWooStoreJson<WooStoreCategory[]>(
    "/wp-json/wc/store/v1/products/categories?per_page=100",
    signal,
  );

  return categories.find((category) => {
    if (typeof identifier === "number") {
      return category.id === identifier;
    }

    return category.slug === identifier;
  }) ?? null;
};

const fetchWooProductsByCategory = async (
  categoryIdentifier: string | number,
  options: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<{ category: WooStoreCategory; products: WooStoreProduct[] }> => {
  const category = await fetchWooCategoryByIdentifier(categoryIdentifier, signal);

  if (!category) {
    throw new Error(`Woo category not found for identifier: ${String(categoryIdentifier)}`);
  }

  const params = new URLSearchParams({
    category: typeof categoryIdentifier === "number" ? String(category.id) : category.slug,
    per_page: String(typeof options.limit === "number" ? options.limit : 20),
  });

  if (typeof options.sort === "string" && options.sort.length > 0) {
    params.set("orderby", options.sort);
  }

  const products = await fetchWooStoreJson<WooStoreProduct[]>(`/wp-json/wc/store/v1/products?${params.toString()}`, signal);

  if (options.includeOutOfStock === false) {
    return {
      category,
      products: products.filter((product) => product.is_in_stock),
    };
  }

  return {
    category,
    products,
  };
};

export const resolveMenuCategoryPhotoParallaxFullWidthSource = async (
  data: MenuCategoryPhotoParallaxFullWidthData,
  source: MenuCategoryPhotoParallaxFullWidthSource,
  signal?: AbortSignal,
): Promise<MenuCategoryPhotoParallaxFullWidthData> => {
  const sourceOptions = source.options ?? {};
  const splitIntoColumns =
    typeof sourceOptions.splitIntoColumns === "number"
      ? sourceOptions.splitIntoColumns
      : data.layout.columns;
  const resolved = await resolveWooMenuColumnsFromSource(
    source,
    splitIntoColumns,
    signal,
  );

  return {
    ...data,
    heroTitle: resolved.category?.name ?? data.heroTitle,
    menuColumns: resolved.menuColumns,
  };
};

export const resolveMenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSource = async (
  data: MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxData,
  source: MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxSource,
  signal?: AbortSignal,
): Promise<MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxData> => {
  const resolved = await resolveWooMenuColumnsFromSource(source, 2, signal);

  return {
    ...data,
    heroTitle: resolved.category?.name ?? data.heroTitle,
    menuColumns: resolved.menuColumns,
  };
};

export const resolveMenuTwoColumnsWithNoHeadingNoImgSource = async (
  data: MenuTwoColumnsWithNoHeadingNoImgData,
  source: MenuTwoColumnsWithNoHeadingNoImgSource,
  signal?: AbortSignal,
): Promise<MenuTwoColumnsWithNoHeadingNoImgData> => {
  const resolved = await resolveWooMenuColumnsFromSource(source, 2, signal);

  return {
    ...data,
    menuColumns: resolved.menuColumns,
  };
};

export const resolveMenuTwoColumnsWithWithHeadingNoImgSource = async (
  data: MenuTwoColumnsWithWithHeadingNoImgData,
  source: MenuTwoColumnsWithWithHeadingNoImgSource,
  signal?: AbortSignal,
): Promise<MenuTwoColumnsWithWithHeadingNoImgData> => {
  const resolved = await resolveWooMenuColumnsFromSource(source, 2, signal);

  return {
    ...data,
    title: resolved.category?.name ?? data.title,
    menuColumns: resolved.menuColumns,
  };
};

export const resolveMenuThreeColumnsWithWithHeadingNoImgSource = async (
  data: MenuThreeColumnsWithWithHeadingNoImgData,
  source: MenuThreeColumnsWithWithHeadingNoImgSource,
  signal?: AbortSignal,
): Promise<MenuThreeColumnsWithWithHeadingNoImgData> => {
  const resolved = await resolveWooMenuColumnsFromSource(source, 3, signal);

  return {
    ...data,
    title: resolved.category?.name ?? data.title,
    menuColumns: resolved.menuColumns,
  };
};

export const resolvePromo2Source = async (
  data: Promo2Data,
  source: Promo2Source,
  signal?: AbortSignal,
): Promise<Promo2Data> => {
  const splitIntoColumns =
    typeof source.options?.splitIntoColumns === "number"
      ? Math.max(1, Math.min(2, source.options.splitIntoColumns))
      : 2;
  const resolved = await resolveWooMenuColumnsFromSource(
    source,
    splitIntoColumns,
    signal,
  );

  return {
    ...data,
    menuColumns: resolved.menuColumns,
  };
};