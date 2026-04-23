import type {
  CateringCategoryContract,
  CateringProductContract,
} from "../data/cateringWielkanocny";
import {
  SPECIAL_MENU_FOR_2_LINE_TYPE,
  buildSpecialMenuFor2SummaryLines,
  cateringSpecialMenuFor2Seed,
  isSpecialMenuFor2Config,
  resolveSpecialMenuFor2UnitPrice,
  type SpecialMenuFor2Config,
  type SpecialMenuFor2Seed,
} from "../data/cateringSpecialMenuFor2";

export const CATERING_CART_STORAGE_KEY = "bulwar-catering-cart";
export const CATERING_CART_VERSION = 2 as const;
export const SIMPLE_CART_LINE_TYPE = "simple" as const;

export interface SimpleCartLine {
  lineId: string;
  lineType: typeof SIMPLE_CART_LINE_TYPE;
  baseProductId: number;
  displayName: string;
  unitPrice: number;
  quantity: number;
  weight: string;
  priceLabel: string;
}

export interface SpecialMenuFor2CartLine {
  lineId: string;
  lineType: typeof SPECIAL_MENU_FOR_2_LINE_TYPE;
  baseProductId: number;
  displayName: string;
  unitPrice: number;
  quantity: 1;
  config: SpecialMenuFor2Config;
  metaSummary: readonly string[];
}

export type CateringCartLine = SimpleCartLine | SpecialMenuFor2CartLine;

export interface CateringCartState {
  version: typeof CATERING_CART_VERSION;
  lines: CateringCartLine[];
}

export interface CateringCartDisplayItem {
  lineId: string;
  productId: number;
  lineType: CateringCartLine["lineType"];
  name: string;
  price: number;
  quantity: number;
  weight?: string;
  priceLabel?: string;
  summaryLines?: readonly string[];
  quantityAdjustable: boolean;
}

export interface BridgeCheckoutCartLine {
  client_line_id: string;
  line_type: CateringCartLine["lineType"];
  product_id: number;
  quantity: number;
  configuration?: SpecialMenuFor2Config;
}

type LegacyCartQuantities = Record<number, number>;
type CateringProductLookup = ReadonlyMap<number, CateringProductContract>;

const isFinitePositiveInteger = (value: unknown): value is number => {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const buildSimpleLineId = (productId: number): string => {
  return `simple:${productId}`;
};

const createUniqueLineId = (prefix: string): string => {
  const uuid = globalThis.crypto?.randomUUID?.();

  if (uuid) {
    return `${prefix}:${uuid}`;
  }

  return `${prefix}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 10)}`;
};

const migrateLegacyCartQuantities = (
  parsedValue: unknown,
  productLookup: CateringProductLookup,
): CateringCartState | null => {
  if (!isRecord(parsedValue)) {
    return null;
  }

  const quantities = Object.entries(parsedValue).reduce<LegacyCartQuantities>((accumulator, [key, value]) => {
    const productId = Number(key);

    if (!Number.isInteger(productId) || !isFinitePositiveInteger(value)) {
      return accumulator;
    }

    accumulator[productId] = value;
    return accumulator;
  }, {});

  const lines = Object.entries(quantities).flatMap(([key, quantity]) => {
    const productId = Number(key);
    const product = productLookup.get(productId);

    if (!product) {
      return [];
    }

    return [buildSimpleCartLine(product, quantity)];
  });

  return {
    version: CATERING_CART_VERSION,
    lines,
  };
};

const sanitizeSimpleLine = (
  value: unknown,
  productLookup: CateringProductLookup,
): SimpleCartLine | null => {
  if (!isRecord(value) || value.lineType !== SIMPLE_CART_LINE_TYPE) {
    return null;
  }

  const baseProductId = value.baseProductId;
  const quantity = value.quantity;

  if (!isFinitePositiveInteger(baseProductId) || !isFinitePositiveInteger(quantity)) {
    return null;
  }

  const product = productLookup.get(baseProductId);

  if (!product) {
    return null;
  }

  return buildSimpleCartLine(product, quantity);
};

const sanitizeSpecialMenuLine = (value: unknown): SpecialMenuFor2CartLine | null => {
  if (!isRecord(value) || value.lineType !== SPECIAL_MENU_FOR_2_LINE_TYPE) {
    return null;
  }

  const baseProductId = value.baseProductId;

  if (typeof value.lineId !== "string" || !isFinitePositiveInteger(baseProductId)) {
    return null;
  }

  if (!isSpecialMenuFor2Config(value.config)) {
    return null;
  }

  const displayName = typeof value.displayName === "string"
    ? value.displayName
    : cateringSpecialMenuFor2Seed.shellProduct.displayName;
  const unitPrice = typeof value.unitPrice === "number" && Number.isFinite(value.unitPrice)
    ? value.unitPrice
    : cateringSpecialMenuFor2Seed.shellProduct.unitPrice;

  return {
    lineId: value.lineId,
    lineType: SPECIAL_MENU_FOR_2_LINE_TYPE,
    baseProductId,
    displayName,
    unitPrice,
    quantity: 1,
    config: value.config,
    metaSummary: buildSpecialMenuFor2SummaryLines(value.config),
  };
};

export const createEmptyCateringCartState = (): CateringCartState => {
  return {
    version: CATERING_CART_VERSION,
    lines: [],
  };
};

export const createCateringProductLookup = (
  categories: readonly CateringCategoryContract[],
): CateringProductLookup => {
  return new Map(
    categories.flatMap((category) => category.products.map((product) => [product.id, product] as const)),
  );
};

export const buildSimpleCartLine = (
  product: CateringProductContract,
  quantity = 1,
): SimpleCartLine => {
  const displayName = product.contentMode === "combined"
    ? product.combinedText
    : product.productName;

  return {
    lineId: buildSimpleLineId(product.id),
    lineType: SIMPLE_CART_LINE_TYPE,
    baseProductId: product.id,
    displayName,
    unitPrice: product.price,
    quantity,
    weight: product.weight,
    priceLabel: product.priceLabel,
  };
};

export const buildSpecialMenuFor2CartLine = (
  config: SpecialMenuFor2Config,
  seed: SpecialMenuFor2Seed = cateringSpecialMenuFor2Seed,
): SpecialMenuFor2CartLine => {
  return {
    lineId: createUniqueLineId(SPECIAL_MENU_FOR_2_LINE_TYPE),
    lineType: SPECIAL_MENU_FOR_2_LINE_TYPE,
    baseProductId: seed.shellProduct.baseProductId,
    displayName: seed.shellProduct.displayName,
    unitPrice: resolveSpecialMenuFor2UnitPrice(config, seed),
    quantity: 1,
    config,
    metaSummary: buildSpecialMenuFor2SummaryLines(config),
  };
};

export const loadCateringCartState = (
  rawValue: string | null | undefined,
  productLookup: CateringProductLookup,
): CateringCartState => {
  if (!rawValue) {
    return createEmptyCateringCartState();
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;

    if (isRecord(parsedValue) && parsedValue.version === CATERING_CART_VERSION && Array.isArray(parsedValue.lines)) {
      const lines = parsedValue.lines.reduce<CateringCartLine[]>((accumulator, line) => {
        const simpleLine = sanitizeSimpleLine(line, productLookup);

        if (simpleLine) {
          accumulator.push(simpleLine);
          return accumulator;
        }

        const specialLine = sanitizeSpecialMenuLine(line);

        if (specialLine) {
          accumulator.push(specialLine);
        }

        return accumulator;
      }, []);

      return {
        version: CATERING_CART_VERSION,
        lines,
      };
    }

    return migrateLegacyCartQuantities(parsedValue, productLookup) ?? createEmptyCateringCartState();
  } catch {
    return createEmptyCateringCartState();
  }
};

export const serializeCateringCartState = (state: CateringCartState): string => {
  return JSON.stringify(state);
};

export const addSimpleProductLine = (
  state: CateringCartState,
  product: CateringProductContract,
  quantity: number,
): CateringCartState => {
  if (!isFinitePositiveInteger(quantity)) {
    return state;
  }

  const targetLineId = buildSimpleLineId(product.id);
  const targetLine = state.lines.find((line) => line.lineId === targetLineId);

  if (targetLine && targetLine.lineType === SIMPLE_CART_LINE_TYPE) {
    return {
      ...state,
      lines: state.lines.map((line) => {
        if (line.lineId !== targetLineId || line.lineType !== SIMPLE_CART_LINE_TYPE) {
          return line;
        }

        return {
          ...line,
          quantity: line.quantity + quantity,
        };
      }),
    };
  }

  return {
    ...state,
    lines: [...state.lines, buildSimpleCartLine(product, quantity)],
  };
};

export const addSpecialMenuFor2Line = (
  state: CateringCartState,
  config: SpecialMenuFor2Config,
  seed: SpecialMenuFor2Seed = cateringSpecialMenuFor2Seed,
): CateringCartState => {
  return {
    ...state,
    lines: [...state.lines, buildSpecialMenuFor2CartLine(config, seed)],
  };
};

export const setCartLineQuantity = (
  state: CateringCartState,
  lineId: string,
  quantity: number,
): CateringCartState => {
  const targetLine = state.lines.find((line) => line.lineId === lineId);

  if (!targetLine) {
    return state;
  }

  if (quantity < 1) {
    return {
      ...state,
      lines: state.lines.filter((line) => line.lineId !== lineId),
    };
  }

  if (targetLine.lineType !== SIMPLE_CART_LINE_TYPE) {
    return state;
  }

  return {
    ...state,
    lines: state.lines.map((line) => {
      if (line.lineId !== lineId || line.lineType !== SIMPLE_CART_LINE_TYPE) {
        return line;
      }

      return {
        ...line,
        quantity,
      };
    }),
  };
};

export const getSimpleProductQuantities = (
  state: CateringCartState,
): Record<number, number> => {
  return state.lines.reduce<Record<number, number>>((accumulator, line) => {
    if (line.lineType !== SIMPLE_CART_LINE_TYPE) {
      return accumulator;
    }

    accumulator[line.baseProductId] = (accumulator[line.baseProductId] ?? 0) + line.quantity;
    return accumulator;
  }, {});
};

export const buildCheckoutDrawerItems = (
  state: CateringCartState,
): CateringCartDisplayItem[] => {
  return state.lines.map((line) => {
    if (line.lineType === SIMPLE_CART_LINE_TYPE) {
      return {
        lineId: line.lineId,
        productId: line.baseProductId,
        lineType: line.lineType,
        name: line.displayName,
        price: line.unitPrice,
        quantity: line.quantity,
        weight: line.weight,
        priceLabel: line.priceLabel,
        quantityAdjustable: true,
      };
    }

    return {
      lineId: line.lineId,
      productId: line.baseProductId,
      lineType: line.lineType,
      name: line.displayName,
      price: line.unitPrice,
      quantity: line.quantity,
      summaryLines: line.metaSummary,
      quantityAdjustable: false,
    };
  });
};

export const getCateringCartItemCount = (state: CateringCartState): number => {
  return state.lines.reduce((sum, line) => sum + line.quantity, 0);
};

export const getCateringCartSubtotal = (state: CateringCartState): number => {
  return state.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
};

export const buildBridgeCheckoutCartLines = (
  state: CateringCartState,
): BridgeCheckoutCartLine[] => {
  return state.lines.map((line) => {
    if (line.lineType === SIMPLE_CART_LINE_TYPE) {
      return {
        client_line_id: line.lineId,
        line_type: line.lineType,
        product_id: line.baseProductId,
        quantity: line.quantity,
      };
    }

    return {
      client_line_id: line.lineId,
      line_type: line.lineType,
      product_id: line.baseProductId,
      quantity: line.quantity,
      configuration: line.config,
    };
  });
};