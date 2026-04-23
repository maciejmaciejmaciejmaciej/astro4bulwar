export const CHECKOUT_SUCCESS_SNAPSHOT_STORAGE_KEY = "bulwar-catering-checkout-success";
export const CHECKOUT_SUCCESS_SNAPSHOT_MAX_AGE_MS = 1000 * 60 * 60 * 24;

export interface CheckoutSuccessSnapshotItem {
  lineId: string;
  lineType: "simple" | "special_menu_for_2";
  name: string;
  quantity: number;
  weight?: string;
  lineTotal: number;
  summaryLines?: readonly string[];
}

export interface CheckoutSuccessSnapshotData {
  orderNumber: string;
  items: CheckoutSuccessSnapshotItem[];
  itemCount: number;
  itemsSubtotal: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethodLabel: string;
  fulfillmentTypeLabel: string;
  fulfillmentTermLabel: string;
  fulfillmentSlotLabel: string;
  customerEmail: string;
  address?: string;
}

export interface PersistedCheckoutSuccessSnapshot extends CheckoutSuccessSnapshotData {
  createdAt: string;
}

export interface CheckoutSuccessSnapshot extends PersistedCheckoutSuccessSnapshot {
  copyText: string;
}

export interface CheckoutSuccessSnapshotReadResult {
  status: "missing" | "ready" | "stale";
  snapshot: CheckoutSuccessSnapshot | null;
  shouldClear: boolean;
}

type SnapshotStorageReader = Pick<Storage, "getItem">;
type SnapshotStorageWriter = Pick<Storage, "setItem">;
type SnapshotStorageRemover = Pick<Storage, "removeItem">;
type SnapshotStorage = SnapshotStorageReader & SnapshotStorageWriter & SnapshotStorageRemover;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};

const isPositiveInteger = (value: unknown): value is number => {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
};

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
};

const sanitizeSnapshotItem = (value: unknown): CheckoutSuccessSnapshotItem | null => {
  if (!isRecord(value)) {
    return null;
  }

  const quantity = value.quantity;
  const lineTotal = value.lineTotal;

  if (typeof value.lineId !== "string") {
    return null;
  }

  if (value.lineType !== "simple" && value.lineType !== "special_menu_for_2") {
    return null;
  }

  if (typeof value.name !== "string" || !isPositiveInteger(quantity)) {
    return null;
  }

  if (!isFiniteNumber(lineTotal)) {
    return null;
  }

  return {
    lineId: value.lineId,
    lineType: value.lineType,
    name: value.name,
    quantity,
    weight: typeof value.weight === "string" ? value.weight : undefined,
    lineTotal,
    summaryLines: isStringArray(value.summaryLines) ? value.summaryLines : undefined,
  };
};

const sanitizePersistedSnapshot = (value: unknown): PersistedCheckoutSuccessSnapshot | null => {
  if (!isRecord(value) || typeof value.createdAt !== "string" || typeof value.orderNumber !== "string") {
    return null;
  }

  if (!Array.isArray(value.items)) {
    return null;
  }

  const items = value.items.flatMap((item) => {
    const sanitizedItem = sanitizeSnapshotItem(item);

    return sanitizedItem ? [sanitizedItem] : [];
  });

  if (items.length !== value.items.length) {
    return null;
  }

  const itemCount = value.itemCount;
  const itemsSubtotal = value.itemsSubtotal;
  const deliveryFee = value.deliveryFee;
  const grandTotal = value.grandTotal;
  const paymentMethodLabel = value.paymentMethodLabel;
  const fulfillmentTypeLabel = value.fulfillmentTypeLabel;
  const fulfillmentTermLabel = value.fulfillmentTermLabel;
  const fulfillmentSlotLabel = value.fulfillmentSlotLabel;
  const customerEmail = value.customerEmail;

  if (
    typeof paymentMethodLabel !== "string"
    || typeof fulfillmentTypeLabel !== "string"
    || typeof fulfillmentTermLabel !== "string"
    || typeof fulfillmentSlotLabel !== "string"
    || typeof customerEmail !== "string"
  ) {
    return null;
  }

  if (
    !isFiniteNumber(itemCount)
    || !isFiniteNumber(itemsSubtotal)
    || !isFiniteNumber(deliveryFee)
    || !isFiniteNumber(grandTotal)
  ) {
    return null;
  }

  return {
    createdAt: value.createdAt,
    orderNumber: value.orderNumber,
    items,
    itemCount,
    itemsSubtotal,
    deliveryFee,
    grandTotal,
    paymentMethodLabel,
    fulfillmentTypeLabel,
    fulfillmentTermLabel,
    fulfillmentSlotLabel,
    customerEmail,
    address: typeof value.address === "string" ? value.address : undefined,
  };
};

const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} zł`;
};

export const buildCheckoutSuccessCopyText = (
  snapshot: CheckoutSuccessSnapshotData,
): string => {
  const lines = [
    `Numer zamówienia: ${snapshot.orderNumber}`,
    "",
    "Produkty:",
    ...snapshot.items.flatMap((item) => {
      const itemLines = [`- ${item.name} x${item.quantity}: ${formatCurrency(item.lineTotal)}`];

      if (item.summaryLines?.length) {
        itemLines.push(...item.summaryLines.map((line) => `  ${line}`));
      }

      return itemLines;
    }),
    "",
    `Płatność: ${snapshot.paymentMethodLabel}`,
    `Realizacja: ${snapshot.fulfillmentTypeLabel}`,
    `Termin: ${snapshot.fulfillmentTermLabel}`,
    `Slot: ${snapshot.fulfillmentSlotLabel}`,
  ];

  if (snapshot.address) {
    lines.push(`Adres: ${snapshot.address}`);
  }

  lines.push(
    "",
    `Suma produktów: ${formatCurrency(snapshot.itemsSubtotal)}`,
    `Dostawa: ${formatCurrency(snapshot.deliveryFee)}`,
    `Razem: ${formatCurrency(snapshot.grandTotal)}`,
  );

  return lines.join("\n");
};

export const buildCheckoutSuccessSnapshot = (
  snapshot: PersistedCheckoutSuccessSnapshot,
): CheckoutSuccessSnapshot => {
  return {
    ...snapshot,
    copyText: buildCheckoutSuccessCopyText(snapshot),
  };
};

export const serializeCheckoutSuccessSnapshot = (
  snapshot: PersistedCheckoutSuccessSnapshot,
): string => {
  return JSON.stringify(snapshot);
};

export const loadCheckoutSuccessSnapshot = (
  rawValue: string | null | undefined,
  now: Date = new Date(),
): CheckoutSuccessSnapshotReadResult => {
  if (!rawValue) {
    return {
      status: "missing",
      snapshot: null,
      shouldClear: false,
    };
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;
    const persistedSnapshot = sanitizePersistedSnapshot(parsedValue);

    if (!persistedSnapshot) {
      return {
        status: "missing",
        snapshot: null,
        shouldClear: true,
      };
    }

    const createdAtTimestamp = Date.parse(persistedSnapshot.createdAt);

    if (!Number.isFinite(createdAtTimestamp)) {
      return {
        status: "missing",
        snapshot: null,
        shouldClear: true,
      };
    }

    if ((now.getTime() - createdAtTimestamp) > CHECKOUT_SUCCESS_SNAPSHOT_MAX_AGE_MS) {
      return {
        status: "stale",
        snapshot: null,
        shouldClear: true,
      };
    }

    return {
      status: "ready",
      snapshot: buildCheckoutSuccessSnapshot(persistedSnapshot),
      shouldClear: false,
    };
  } catch {
    return {
      status: "missing",
      snapshot: null,
      shouldClear: true,
    };
  }
};

export const writeCheckoutSuccessSnapshot = (
  storage: SnapshotStorage,
  snapshot: CheckoutSuccessSnapshotData,
  now: Date = new Date(),
): CheckoutSuccessSnapshot => {
  const persistedSnapshot: PersistedCheckoutSuccessSnapshot = {
    ...snapshot,
    createdAt: now.toISOString(),
  };

  storage.setItem(
    CHECKOUT_SUCCESS_SNAPSHOT_STORAGE_KEY,
    serializeCheckoutSuccessSnapshot(persistedSnapshot),
  );

  return buildCheckoutSuccessSnapshot(persistedSnapshot);
};

export const readCheckoutSuccessSnapshot = (
  storage: SnapshotStorageReader & SnapshotStorageRemover,
  now: Date = new Date(),
): CheckoutSuccessSnapshotReadResult => {
  const result = loadCheckoutSuccessSnapshot(
    storage.getItem(CHECKOUT_SUCCESS_SNAPSHOT_STORAGE_KEY),
    now,
  );

  if (result.shouldClear) {
    storage.removeItem(CHECKOUT_SUCCESS_SNAPSHOT_STORAGE_KEY);
  }

  return result;
};

export const clearCheckoutSuccessSnapshot = (
  storage: SnapshotStorageRemover,
): void => {
  storage.removeItem(CHECKOUT_SUCCESS_SNAPSHOT_STORAGE_KEY);
};