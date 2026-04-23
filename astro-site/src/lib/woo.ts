import { getWordPressBaseUrl } from './config';
import type {
  MenuBlock,
  MenuColumn,
  MenuSource,
  MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlock,
} from './types';

interface WooProductPrices {
  price: string;
  currency_code: string;
  currency_minor_unit: number;
}

interface WooProduct {
  id: number;
  name: string;
  short_description: string;
  description: string;
  prices: WooProductPrices;
  is_in_stock: boolean;
  categories?: WooCategory[];
  tags?: WooTag[];
}

interface WooCategory {
  id: number;
  name: string;
  slug: string;
}

interface WooTag {
  id: number;
  name: string;
  slug: string;
}

const stripHtml = (value: string): string => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const formatPrice = (prices: WooProductPrices): string => {
  const amount = Number(prices.price) / 10 ** prices.currency_minor_unit;
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: prices.currency_code }).format(amount);
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

const splitIntoColumns = (products: WooProduct[], count: number): MenuColumn[] => {
  if (products.length === 0) {
    return [];
  }

  const perColumn = Math.ceil(products.length / Math.max(1, count));

  return Array.from({ length: Math.max(1, count) }, (_, index) => ({
    items: products.slice(index * perColumn, (index + 1) * perColumn).map((product) => ({
      title: product.name,
      description: stripHtml(product.short_description || product.description) || undefined,
      priceLabel: formatPrice(product.prices),
      tagSlugs: Array.isArray(product.tags)
        ? product.tags
          .map((tag) => tag.slug)
          .filter((tagSlug): tagSlug is string => typeof tagSlug === 'string' && tagSlug.length > 0)
        : [],
    })),
  })).filter((column) => column.items.length > 0);
};

const fetchProductsByIds = async (productIds: number[]): Promise<WooProduct[]> => {
  const wordPressBaseUrl = getWordPressBaseUrl();
  const params = new URLSearchParams({
    include: productIds.join(','),
    orderby: 'include',
  });

  const products = await fetchJson<WooProduct[]>(`${wordPressBaseUrl}/wp-json/wc/store/v1/products?${params.toString()}`);
  const productMap = new Map(products.map((product) => [product.id, product] as const));

  return productIds.flatMap((productId) => {
    const product = productMap.get(productId);
    return product ? [product] : [];
  });
};

const fetchCategoryByIdentifier = async (identifier: string | number): Promise<WooCategory | null> => {
  const categories = await fetchJson<WooCategory[]>(`${getWordPressBaseUrl()}/wp-json/wc/store/v1/products/categories?per_page=100`);

  return categories.find((item) => {
    if (typeof identifier === 'number') {
      return item.id === identifier;
    }

    return item.slug === identifier;
  }) ?? null;
};

const fetchProductsByCategory = async (
  identifier: string | number,
  source: Extract<MenuSource, { sourceType: 'woo_category' }>,
): Promise<{ category: WooCategory; products: WooProduct[] }> => {
  const wordPressBaseUrl = getWordPressBaseUrl();
  const category = await fetchCategoryByIdentifier(identifier);

  if (!category) {
    throw new Error(`Woo category not found: ${String(identifier)}`);
  }

  const params = new URLSearchParams({
    category: typeof identifier === 'number' ? String(category.id) : category.slug,
    per_page: String(source.options.limit ?? 20),
  });

  if (source.options.sort) {
    params.set('orderby', source.options.sort);
  }

  const products = await fetchJson<WooProduct[]>(`${wordPressBaseUrl}/wp-json/wc/store/v1/products?${params.toString()}`);

  return {
    category,
    products: source.options.includeOutOfStock === false
      ? products.filter((product) => product.is_in_stock)
      : products,
  };
};

type ResolvableMenuBlock = MenuBlock | MenuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlock;

export const resolveMenuBlock = async <T extends ResolvableMenuBlock>(block: T): Promise<T> => {
  if (!block.source) {
    return block;
  }

  const resolved = block.source.sourceType === 'woo_products'
    ? {
      category: null,
      products: await fetchProductsByIds(block.source.sourceValue),
    }
    : await fetchProductsByCategory(block.source.sourceValue, block.source);

  return {
    ...block,
    data: {
      ...block.data,
      heroTitle: resolved.category?.name ?? block.data.heroTitle,
      menuColumns: splitIntoColumns(
        resolved.products,
        block.source.options.splitIntoColumns ?? block.data.layout.columns,
      ),
    },
  } as T;
};