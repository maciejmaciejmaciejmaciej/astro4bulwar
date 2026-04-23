"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, CheckCircle2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckoutSuccessConfirmation } from "@/src/components/CheckoutSuccessConfirmation";
import type { BridgeCheckoutCartLine, CateringCartDisplayItem } from "@/src/lib/cateringCart";
import {
  type CheckoutSuccessSnapshot,
  type CheckoutSuccessSnapshotItem,
  writeCheckoutSuccessSnapshot,
} from "@/src/lib/checkoutSuccessSnapshot";
import { CATERING_WIELKANOCNY_THANK_YOU_PATH } from "@/src/lib/cateringThankYou";
import { getBridgeBaseUrl } from "@/src/lib/clientRuntimeConfig";
import { parseSpecialMenuFor2SummaryLine } from "@/src/lib/specialMenuFor2Summary";

// --- Types & Schemas ---

const paymentMethodValues = ["cash", "online"] as const;
const deliveryMethodValues = ["pickup", "delivery"] as const;

const checkoutSchema = z.object({
  personalData: z.object({
    fullName: z.string().min(2, "Imię i nazwisko jest wymagane"),
    phone: z.string().regex(/^[0-9+\-\s()]{9,15}$/, "Niepoprawny numer telefonu"),
    email: z.string().email("Niepoprawny adres email"),
  }),
  salesRegulationsAccepted: z.boolean().refine((value) => value, {
    message: "Zaakceptuj regulamin sprzedaży",
  }),
  paymentMethod: z.enum(paymentMethodValues, {
    error: "Wybierz formę płatności",
  }),
  deliveryMethod: z.enum(deliveryMethodValues, {
    error: "Wybierz sposób realizacji",
  }),
  deliveryDetails: z.object({
    address: z.string().optional(),
    date: z.string().optional(),
    timeSlot: z.string().optional(),
  }).optional(),
}).superRefine((data, ctx) => {
  if (!data.deliveryDetails?.date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["deliveryDetails", "date"],
      message: "Wybierz dzień",
    });
  }

  if (!data.deliveryDetails?.timeSlot) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["deliveryDetails", "timeSlot"],
      message: "Wybierz godzinę",
    });
  }

  if (data.deliveryMethod === "delivery") {
    if (!data.deliveryDetails?.address || data.deliveryDetails.address.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deliveryDetails", "address"],
        message: "Adres jest wymagany",
      });
    }
  }
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: readonly CateringCartDisplayItem[];
  cartLinesPayload?: readonly BridgeCheckoutCartLine[];
  itemCount?: number;
  subtotal?: number;
  onSetCartLineQuantity?: (lineId: string, quantity: number) => void;
  onClearCart?: () => void;
}

interface QuoteResponseData {
  delivery_fee_minor: number;
  quote_token: string;
  distance_km: number;
  expires_at: string;
}

interface SlotOption {
  label: string;
  start_at: string;
  end_at: string;
  remaining_capacity: number;
  slot_token: string;
  expires_at: string;
}

interface SlotDateGroup {
  date: string;
  slots: SlotOption[];
}

interface SlotsResponseData {
  fulfillment_type: "pickup" | "delivery";
  available_dates: SlotDateGroup[];
}

interface OrderResponseData {
  order_id: number;
  order_number: string;
  status: string;
  payment_method: string;
  currency: string;
  totals: {
    items_subtotal_minor: number;
    delivery_fee_minor: number;
    grand_total_minor: number;
  };
  fulfillment: {
    type: "pickup" | "delivery";
    slot_start_at: string;
    slot_end_at: string;
  };
}

const SLOT_LOOKAHEAD_DAYS = 60;

const buildBridgeBaseUrl = (): string => {
  return getBridgeBaseUrl();
};

const buildDateWindowStart = (): string => {
  return new Date().toISOString().slice(0, 10);
};

const formatCurrency = (amount: number): string => `${amount.toFixed(2)} zł`;

const formatDateLabel = (date: string): string => {
  const parsed = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(parsed);
};

const formatFulfillmentTypeLabel = (type: "pickup" | "delivery"): string => {
  return type === "delivery" ? "Dostawa" : "Odbiór osobisty";
};

const formatPaymentMethodLabel = (paymentMethod: string): string => {
  return paymentMethod === "manual_cash" ? "Płatność przy odbiorze" : paymentMethod;
};

const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return {
      firstName: parts[0] ?? fullName.trim(),
      lastName: "-",
    };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const renderSimpleCartItem = (
  item: CateringCartDisplayItem,
  onSetCartLineQuantity?: (lineId: string, quantity: number) => void,
) => {
  return (
    <div className="space-y-1">
      <div className="flex items-start justify-between gap-4">
        <p className="font-medium">{item.name}</p>
        <button
          type="button"
          onClick={() => onSetCartLineQuantity?.(item.lineId, 0)}
          className="shrink-0 font-label text-[10px] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-black"
        >
          Usuń
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 text-sm text-zinc-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-zinc-200 rounded-[4px] h-8 bg-white text-zinc-900">
            <button
              type="button"
              onClick={() => onSetCartLineQuantity?.(item.lineId, item.quantity - 1)}
              className="px-2 h-full text-zinc-500 hover:text-black transition-colors"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-mono">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onSetCartLineQuantity?.(item.lineId, item.quantity + 1)}
              className="px-2 h-full text-zinc-500 hover:text-black transition-colors"
            >
              +
            </button>
          </div>
          {item.weight && <p>{item.weight}</p>}
        </div>
        <p className="text-right font-medium text-zinc-900">{formatCurrency(item.price * item.quantity)}</p>
      </div>
    </div>
  );
};

interface SpecialCartItemProps {
  item: CateringCartDisplayItem;
  isExpanded: boolean;
  onToggle: (lineId: string) => void;
  onSetCartLineQuantity?: (lineId: string, quantity: number) => void;
}

const renderSpecialCartItem = ({
  item,
  isExpanded,
  onToggle,
  onSetCartLineQuantity,
}: SpecialCartItemProps) => {
  const parsedSummaryGroups = item.summaryLines
    ?.map((line) => ({ line, parsed: parseSpecialMenuFor2SummaryLine(line) }))
    ?? [];
  const hasSummary = parsedSummaryGroups.length > 0;

  return (
    <div className="rounded-[4px] border border-zinc-200 bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-zinc-900">{item.name}</p>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 font-label text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              Zestaw specjalny
            </span>
          </div>
          {hasSummary && (
            <div className="space-y-3 text-xs leading-relaxed text-zinc-500">
              <div className="relative overflow-hidden rounded-[4px] border border-zinc-100 bg-zinc-50/60 px-3 py-3">
                <div
                  id={`special-cart-item-${item.lineId}`}
                  className={cn(
                    "space-y-3 overflow-hidden pr-1 transition-all duration-300",
                    isExpanded ? "max-h-[999px]" : "max-h-[150px]",
                  )}
                >
                  {parsedSummaryGroups.map(({ line, parsed }) =>
                    parsed ? (
                      <div key={`${item.lineId}-${line}`} className="space-y-1.5">
                        <p className="font-body text-xs font-medium leading-relaxed text-zinc-700">{parsed.personLabel}</p>
                        <ul className="list-disc space-y-1 pl-4 font-body text-xs leading-relaxed text-zinc-500 marker:text-zinc-400">
                          {parsed.items.map((summaryItem) => (
                            <li key={summaryItem}>{summaryItem}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p key={`${item.lineId}-${line}`}>{line}</p>
                    ),
                  )}
                </div>
                {!isExpanded && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-zinc-50 via-zinc-50/90 to-transparent" />
                )}
              </div>
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={`special-cart-item-${item.lineId}`}
                onClick={() => onToggle(item.lineId)}
                className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-black"
              >
                <span>{isExpanded ? "Ukryj konfigurację" : "Pokaż konfigurację"}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isExpanded && "rotate-180")} />
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onSetCartLineQuantity?.(item.lineId, 0)}
          className="shrink-0 font-label text-[10px] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-black"
        >
          Usuń
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-dashed border-zinc-200 pt-4 text-sm text-zinc-500">
        <div className="flex items-center border border-zinc-200 rounded-[4px] h-8 bg-zinc-50 px-3 text-xs font-label uppercase tracking-[0.12em] text-zinc-500">
          1 zestaw
        </div>
        <p className="text-right font-medium text-zinc-900">{formatCurrency(item.price)}</p>
      </div>
    </div>
  );
};

const renderReadonlyCartItem = (item: CheckoutSuccessSnapshotItem) => {
  return (
    <div className="rounded-[4px] border border-zinc-200 bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-zinc-900">{item.name}</p>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 font-label text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              {item.quantity} {item.quantity === 1 ? "sztuka" : "szt."}
            </span>
          </div>
          {item.weight && <p className="text-sm text-zinc-500">{item.weight}</p>}
          {item.summaryLines?.length ? (
            <div className="space-y-1 text-xs leading-relaxed text-zinc-500">
              {item.summaryLines.map((line) => (
                <p key={`${item.lineId}-${line}`}>{line}</p>
              ))}
            </div>
          ) : null}
        </div>
        <p className="text-right font-medium text-zinc-900">{formatCurrency(item.lineTotal)}</p>
      </div>
    </div>
  );
};

export function CheckoutDrawer({
  isOpen,
  onClose,
  cartItems = [],
  cartLinesPayload = [],
  itemCount,
  subtotal,
  onSetCartLineQuantity,
  onClearCart,
}: CheckoutDrawerProps) {
  const navigate = useNavigate();
  const [expandedSpecialItems, setExpandedSpecialItems] = useState<Record<string, boolean>>({});
  const [quoteData, setQuoteData] = useState<QuoteResponseData | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [slotsData, setSlotsData] = useState<SlotsResponseData | null>(null);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [successSnapshot, setSuccessSnapshot] = useState<CheckoutSuccessSnapshot | null>(null);
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      personalData: { fullName: "", phone: "", email: "" },
      salesRegulationsAccepted: false,
      paymentMethod: "cash",
      deliveryMethod: "pickup",
      deliveryDetails: { address: "", date: "", timeSlot: "" },
    },
  });

  const { watch, formState: { errors }, resetField, setValue } = form;
  const values = watch();

  const toggleSalesRegulationsAccepted = () => {
    setValue("salesRegulationsAccepted", !values.salesRegulationsAccepted, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const selectedDateGroup = useMemo(() => {
    return slotsData?.available_dates.find((entry) => entry.date === values.deliveryDetails?.date) ?? null;
  }, [slotsData, values.deliveryDetails?.date]);

  const selectedSlot = useMemo(() => {
    return selectedDateGroup?.slots.find((slot) => slot.label === values.deliveryDetails?.timeSlot) ?? null;
  }, [selectedDateGroup, values.deliveryDetails?.timeSlot]);

  // Check completion status of boxes
  const isPersonalDataComplete = 
    !errors.personalData && 
    values.personalData?.fullName?.length > 0 && 
    values.personalData?.phone?.length > 0 && 
    values.personalData?.email?.length > 0;

  const isPaymentComplete = !!values.paymentMethod;

  const isFulfillmentComplete = 
    Boolean(values.deliveryDetails?.date) &&
    Boolean(values.deliveryDetails?.timeSlot) &&
    Boolean(selectedSlot) &&
    (values.deliveryMethod === "pickup" ||
      (values.deliveryMethod === "delivery" && Boolean(values.deliveryDetails?.address) && Boolean(quoteData))) &&
    !errors.deliveryDetails;

  const isCheckoutReady =
    isPersonalDataComplete &&
    isPaymentComplete &&
    isFulfillmentComplete;

  const canSubmit =
    isCheckoutReady &&
    values.salesRegulationsAccepted &&
    cartLinesPayload.length > 0 &&
    !isSubmittingOrder;

  const cartItemCount = itemCount ?? cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = subtotal ?? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice = values.deliveryMethod === "delivery" ? ((quoteData?.delivery_fee_minor ?? 0) / 100) : 0;
  const displayedItemCount = successSnapshot?.itemCount ?? cartItemCount;
  const displayedItemsSubtotal = successSnapshot?.itemsSubtotal ?? totalPrice;
  const displayedDeliveryPrice = successSnapshot?.deliveryFee ?? deliveryPrice;
  const displayedGrandTotal = successSnapshot?.grandTotal ?? (totalPrice + deliveryPrice);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    setSuccessSnapshot(null);
    setSubmitError(null);
    resetField("salesRegulationsAccepted");
  }, [isOpen, resetField]);

  useEffect(() => {
    resetField("deliveryDetails.date");
    resetField("deliveryDetails.timeSlot");
    setSlotsData(null);
    setSlotsError(null);

    if (values.deliveryMethod === "delivery") {
      setQuoteData(null);
      setQuoteError(null);
    }
  }, [values.deliveryMethod, resetField]);

  useEffect(() => {
    if (!isOpen || values.deliveryMethod !== "pickup" || cartLinesPayload.length === 0) {
      return;
    }

    const run = async () => {
      setIsSlotsLoading(true);
      setSlotsError(null);

      try {
        const response = await fetch(`${buildBridgeBaseUrl()}/wp-json/bulwar/v1/checkout/slots`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fulfillment_type: "pickup",
            window_start: buildDateWindowStart(),
            days: SLOT_LOOKAHEAD_DAYS,
          }),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload?.error?.message ?? "Nie udało się pobrać slotów odbioru.");
        }

        setSlotsData(payload.data as SlotsResponseData);
      } catch (error) {
        setSlotsError(error instanceof Error ? error.message : "Nie udało się pobrać slotów odbioru.");
      } finally {
        setIsSlotsLoading(false);
      }
    };

    void run();
  }, [isOpen, values.deliveryMethod, cartLinesPayload.length]);

  useEffect(() => {
    if (values.deliveryMethod !== "delivery") {
      return;
    }

    setQuoteData(null);
    setQuoteError(null);
    setSlotsData(null);
    setSlotsError(null);
    resetField("deliveryDetails.date");
    resetField("deliveryDetails.timeSlot");
  }, [values.deliveryDetails?.address, cartLinesPayload, values.deliveryMethod, resetField]);

  const toggleSpecialItem = (lineId: string) => {
    setExpandedSpecialItems((current) => ({
      ...current,
      [lineId]: !current[lineId],
    }));
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchDeliveryQuote = async () => {
    if (!values.deliveryDetails?.address || cartLinesPayload.length === 0) {
      setQuoteError("Uzupełnij adres i dodaj produkty do koszyka.");
      return;
    }

    setIsQuoteLoading(true);
    setQuoteError(null);
    setSlotsError(null);
    setSlotsData(null);
    resetField("deliveryDetails.date");
    resetField("deliveryDetails.timeSlot");

    try {
      const response = await fetch(`${buildBridgeBaseUrl()}/wp-json/bulwar/v1/checkout/delivery-quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: {
            address_line_1: values.deliveryDetails.address,
            city: "Poznań",
            postcode: "61-001",
            country_code: "PL",
          },
          cart_lines: cartLinesPayload,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload?.error?.message ?? "Nie udało się obliczyć kosztu dostawy.");
      }

      const nextQuoteData = payload.data as QuoteResponseData;
      setQuoteData(nextQuoteData);

      setIsSlotsLoading(true);
      const slotsResponse = await fetch(`${buildBridgeBaseUrl()}/wp-json/bulwar/v1/checkout/slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fulfillment_type: "delivery",
          quote_token: nextQuoteData.quote_token,
          window_start: buildDateWindowStart(),
          days: SLOT_LOOKAHEAD_DAYS,
        }),
      });
      const slotsPayload = await slotsResponse.json();

      if (!slotsResponse.ok || !slotsPayload.success) {
        throw new Error(slotsPayload?.error?.message ?? "Nie udało się pobrać slotów dostawy.");
      }

      setSlotsData(slotsPayload.data as SlotsResponseData);
    } catch (error) {
      setQuoteData(null);
      setQuoteError(error instanceof Error ? error.message : "Nie udało się obliczyć kosztu dostawy.");
    } finally {
      setIsQuoteLoading(false);
      setIsSlotsLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartLinesPayload.length === 0) {
      setSubmitError("Koszyk jest pusty.");
      return;
    }

    if (data.paymentMethod !== "cash") {
      setSubmitError("Płatność online nie jest dziś aktywna. Użyj płatności przy odbiorze.");
      return;
    }

    if (!selectedSlot) {
      setSubmitError("Wybierz slot realizacji zamówienia.");
      return;
    }

    if (data.deliveryMethod === "delivery" && !quoteData) {
      setSubmitError("Najpierw oblicz koszt dostawy.");
      return;
    }

    setIsSubmittingOrder(true);
    setSubmitError(null);

    try {
      const { firstName, lastName } = splitFullName(data.personalData.fullName);
      const response = await fetch(`${buildBridgeBaseUrl()}/wp-json/bulwar/v1/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotency_key: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
          payment_method: "manual_cash",
          customer: {
            first_name: firstName,
            last_name: lastName,
            phone: data.personalData.phone,
            email: data.personalData.email,
          },
          fulfillment: {
            type: data.deliveryMethod,
            quote_token: data.deliveryMethod === "delivery" ? quoteData?.quote_token : undefined,
            slot_token: selectedSlot.slot_token,
            address: data.deliveryMethod === "delivery"
              ? {
                  address_line_1: data.deliveryDetails?.address,
                  city: "Poznań",
                  postcode: "61-001",
                  country_code: "PL",
                }
              : undefined,
          },
          cart_lines: cartLinesPayload,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload?.error?.message ?? "Nie udało się zapisać zamówienia.");
      }

      const orderData = payload.data as OrderResponseData;
      const nextSnapshotBase = {
        orderNumber: orderData.order_number,
        items: cartItems.map((item) => ({
          lineId: item.lineId,
          lineType: item.lineType,
          name: item.name,
          quantity: item.quantity,
          weight: item.weight,
          lineTotal: item.price * item.quantity,
          summaryLines: item.summaryLines,
        })),
        itemCount: cartItemCount,
        itemsSubtotal: orderData.totals.items_subtotal_minor / 100,
        deliveryFee: orderData.totals.delivery_fee_minor / 100,
        grandTotal: orderData.totals.grand_total_minor / 100,
        paymentMethodLabel: formatPaymentMethodLabel(orderData.payment_method),
        fulfillmentTypeLabel: formatFulfillmentTypeLabel(data.deliveryMethod),
        fulfillmentTermLabel: data.deliveryDetails?.date ? formatDateLabel(data.deliveryDetails.date) : "-",
        fulfillmentSlotLabel: selectedSlot.label,
        customerEmail: data.personalData.email,
        address: data.deliveryMethod === "delivery" ? data.deliveryDetails?.address : undefined,
      };

      const nextSnapshot = writeCheckoutSuccessSnapshot(window.localStorage, nextSnapshotBase);

      setSuccessSnapshot(nextSnapshot);
      onClearCart?.();
      onClose();
      navigate(CATERING_WIELKANOCNY_THANK_YOU_PATH);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Nie udało się zapisać zamówienia.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 h-[95vh] bg-white rounded-t-[4px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 shrink-0">
              <h2 className="font-headline text-2xl tracking-widest uppercase">Koszyk</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {successSnapshot ? (
                  <CheckoutSuccessConfirmation snapshot={successSnapshot} />
                ) : (
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] xl:gap-12">
                
                {/* Left: Order Summary (Top on mobile) */}
                <div className="order-1 lg:order-1 space-y-8">
                  <div className="bg-zinc-50 p-8 rounded-[4px] border border-zinc-100">
                    <div className="mb-8 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-headline text-xl tracking-widest uppercase">Podsumowanie</h3>
                        <p className="mt-8 text-xs font-label tracking-widest uppercase text-zinc-500">
                          {displayedItemCount > 0 ? `${displayedItemCount} pozycji w koszyku` : "Koszyk jest pusty"}
                        </p>
                      </div>
                      {!successSnapshot && cartItems.length > 0 && (
                        <button
                          type="button"
                          onClick={onClearCart}
                          className="font-label text-[10px] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-black"
                        >
                          Wyczyść koszyk
                        </button>
                      )}
                    </div>
                    
                    {successSnapshot ? (
                      <div className="space-y-6">
                        {successSnapshot.items.map((item) => (
                          <div key={item.lineId} className="space-y-2">
                            {renderReadonlyCartItem(item)}
                          </div>
                        ))}
                      </div>
                    ) : cartItems.length > 0 ? (
                      <div className="space-y-6">
                        {cartItems.map((item) => (
                          <div key={item.lineId} className="space-y-2">
                            {item.quantityAdjustable
                              ? renderSimpleCartItem(item, onSetCartLineQuantity)
                              : renderSpecialCartItem({
                                  item,
                                  isExpanded: !!expandedSpecialItems[item.lineId],
                                  onToggle: toggleSpecialItem,
                                  onSetCartLineQuantity,
                                })}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-[4px] border border-dashed border-zinc-300 bg-white px-4 py-6 text-sm text-zinc-500">
                        Dodaj produkty z listy, aby zobaczyć podsumowanie zamówienia.
                      </div>
                    )}

                    <div className="my-8 border-t border-dashed border-zinc-300"></div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Suma częściowa</span>
                        <span>{formatCurrency(displayedItemsSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Dostawa</span>
                        <span>{formatCurrency(displayedDeliveryPrice)}</span>
                      </div>
                      <div className="flex justify-between font-headline text-xl mt-6 pt-6 border-t border-zinc-200">
                        <span>Razem</span>
                        <span>{formatCurrency(displayedGrandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Checkout Form */}
                <div className="order-2 lg:order-2">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Box 1: Twoje dane */}
                    <div className={cn(
                      "relative p-8 rounded-[4px] border-2 transition-colors duration-300",
                      isPersonalDataComplete ? "border-green-500/50 bg-green-50/30" : "border-zinc-200"
                    )}>
                      {isPersonalDataComplete && (
                        <div className="absolute top-6 right-6 text-green-500">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                      <h3 className="font-headline text-xl tracking-widest uppercase mb-8">Twoje dane</h3>
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-xs font-label tracking-widest uppercase text-zinc-500">Imię i nazwisko</label>
                          <input 
                            {...form.register("personalData.fullName")}
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Jan Kowalski"
                          />
                          {errors.personalData?.fullName && <p className="text-red-500 text-xs mt-1">{errors.personalData.fullName.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-xs font-label tracking-widest uppercase text-zinc-500">Telefon</label>
                            <input 
                              {...form.register("personalData.phone")}
                              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              placeholder="+48 000 000 000"
                            />
                            {errors.personalData?.phone && <p className="text-red-500 text-xs mt-1">{errors.personalData.phone.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-label tracking-widest uppercase text-zinc-500">Email</label>
                            <input 
                              {...form.register("personalData.email")}
                              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              placeholder="jan@example.com"
                            />
                            {errors.personalData?.email && <p className="text-red-500 text-xs mt-1">{errors.personalData.email.message}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Box 2: Forma płatności */}
                    <div className={cn(
                      "relative p-8 rounded-[4px] border-2 transition-colors duration-300",
                      !isPersonalDataComplete ? "opacity-50 pointer-events-none" : "",
                      isPaymentComplete ? "border-green-500/50 bg-green-50/30" : "border-zinc-200"
                    )}>
                      {isPaymentComplete && (
                        <div className="absolute top-6 right-6 text-green-500">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                      <h3 className="font-headline text-xl tracking-widest uppercase mb-8">Forma płatności</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className={cn(
                          "flex items-center p-4 border rounded-[4px] cursor-pointer transition-all",
                          values.paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-zinc-200 hover:border-zinc-300"
                        )}>
                          <input type="radio" value="cash" {...form.register("paymentMethod")} className="sr-only" />
                          <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center mr-3", values.paymentMethod === "cash" ? "border-primary" : "border-zinc-300")}>
                            {values.paymentMethod === "cash" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                          </div>
                          <span className="font-medium">Płatność przy odbiorze</span>
                        </label>
                        <div className="flex items-center p-4 border rounded-[4px] border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed">
                          <div className="w-5 h-5 rounded-full border border-zinc-300 mr-3" />
                          <span className="font-medium">Płatność online w przygotowaniu</span>
                        </div>
                      </div>
                      {errors.paymentMethod && <p className="text-red-500 text-xs mt-2">{errors.paymentMethod.message}</p>}
                    </div>

                    {/* Box 3: Sposób realizacji */}
                    <div className={cn(
                      "relative p-8 rounded-[4px] border-2 transition-all duration-500",
                      (!isPersonalDataComplete || !isPaymentComplete) ? "opacity-50 pointer-events-none" : "",
                      isFulfillmentComplete ? "border-green-500/50 bg-green-50/30" : "border-zinc-200"
                    )}>
                      {isFulfillmentComplete && (
                        <div className="absolute top-6 right-6 text-green-500">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                      <h3 className="font-headline text-xl tracking-widest uppercase mb-8">Sposób realizacji zamówienia</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <label className={cn(
                          "flex items-center p-4 border rounded-[4px] cursor-pointer transition-all",
                          values.deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-zinc-200 hover:border-zinc-300"
                        )}>
                          <input type="radio" value="pickup" {...form.register("deliveryMethod")} className="sr-only" />
                          <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center mr-3", values.deliveryMethod === "pickup" ? "border-primary" : "border-zinc-300")}>
                            {values.deliveryMethod === "pickup" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                          </div>
                          <span className="font-medium">Odbiór osobisty</span>
                        </label>
                        <label className={cn(
                          "flex items-center p-4 border rounded-[4px] cursor-pointer transition-all",
                          values.deliveryMethod === "delivery" ? "border-primary bg-primary/5" : "border-zinc-200 hover:border-zinc-300"
                        )}>
                          <input type="radio" value="delivery" {...form.register("deliveryMethod")} className="sr-only" />
                          <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center mr-3", values.deliveryMethod === "delivery" ? "border-primary" : "border-zinc-300")}>
                            {values.deliveryMethod === "delivery" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                          </div>
                          <span className="font-medium">Dostawa</span>
                        </label>
                      </div>

                      <div className="pt-6 border-t border-zinc-200 space-y-8">
                        {values.deliveryMethod === "delivery" && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-xs font-label tracking-widest uppercase text-zinc-500">Adres dostawy</label>
                              <input 
                                {...form.register("deliveryDetails.address")}
                                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="Wpisz adres dostawy..."
                              />
                              {errors.deliveryDetails?.address && <p className="text-red-500 text-xs mt-1">{errors.deliveryDetails.address.message}</p>}
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <Button
                                type="button"
                                onClick={() => void fetchDeliveryQuote()}
                                disabled={isQuoteLoading || !values.deliveryDetails?.address || cartLinesPayload.length === 0}
                                className="rounded-[4px] bg-black text-white hover:bg-zinc-800"
                              >
                                {isQuoteLoading ? "Obliczam koszt..." : "Oblicz koszt dostawy"}
                              </Button>
                              {quoteData && <p className="text-sm text-zinc-600">Koszt dostawy: {formatCurrency(deliveryPrice)} • {quoteData.distance_km.toFixed(1)} km</p>}
                            </div>
                            {quoteError && <p className="text-red-500 text-xs mt-1">{quoteError}</p>}
                          </div>
                        )}

                        <div className="space-y-8">
                          <div className="space-y-4 w-full">
                            <label className="text-xs font-label tracking-widest uppercase text-zinc-500 flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" /> Wybierz dzień
                            </label>
                            <div className="space-y-2 w-full">
                              {(slotsData?.available_dates ?? []).map((date) => (
                                <label key={date.date} className={cn(
                                  "block w-full p-3 border rounded-[4px] cursor-pointer transition-all text-center",
                                  values.deliveryDetails?.date === date.date ? "border-primary bg-primary text-on-primary" : "border-zinc-200 hover:border-zinc-300 bg-white"
                                )}>
                                  <input type="radio" value={date.date} {...form.register("deliveryDetails.date")} className="sr-only" />
                                  <span className="font-medium block capitalize">{formatDateLabel(date.date)}</span>
                                  <span className={cn("text-xs", values.deliveryDetails?.date === date.date ? "text-on-primary/80" : "text-zinc-500")}>{date.date}</span>
                                </label>
                              ))}
                              {!isSlotsLoading && (slotsData?.available_dates ?? []).length === 0 && (
                                <div className="rounded-[4px] border border-dashed border-zinc-300 bg-white px-4 py-4 text-sm text-zinc-500">
                                  {values.deliveryMethod === "delivery" ? "Oblicz koszt dostawy, aby zobaczyć dostępne dni." : "Brak dostępnych dni odbioru."}
                                </div>
                              )}
                            </div>
                            {errors.deliveryDetails?.date && <p className="text-red-500 text-xs mt-1">{errors.deliveryDetails.date.message}</p>}
                          </div>

                          <div className="space-y-4 w-full border-t border-zinc-200 pt-6">
                            <label className="text-xs font-label tracking-widest uppercase text-zinc-500 flex items-center gap-2">
                              <Clock className="w-4 h-4" /> Wybierz godzinę
                            </label>
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                              {(selectedDateGroup?.slots ?? []).map((slot) => (
                                <label key={slot.slot_token} className={cn(
                                  "block p-2 border rounded-[4px] cursor-pointer transition-all text-center text-sm",
                                  values.deliveryDetails?.timeSlot === slot.label ? "border-primary bg-primary text-on-primary" : "border-zinc-200 hover:border-zinc-300 bg-white"
                                )}>
                                  <input type="radio" value={slot.label} {...form.register("deliveryDetails.timeSlot")} className="sr-only" />
                                  <span className="font-medium">{slot.label}</span>
                                </label>
                              ))}
                            </div>
                            {isSlotsLoading && <p className="text-zinc-500 text-xs mt-1">Ładowanie slotów...</p>}
                            {slotsError && <p className="text-red-500 text-xs mt-1">{slotsError}</p>}
                            {errors.deliveryDetails?.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.deliveryDetails.timeSlot.message}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Box 4: Submit */}
                    <div className="transition-all duration-500">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={values.salesRegulationsAccepted}
                        onClick={toggleSalesRegulationsAccepted}
                        className={cn(
                          "mb-4 flex w-full items-center p-4 border rounded-[4px] cursor-pointer text-left transition-all",
                          values.salesRegulationsAccepted ? "border-primary bg-primary/5" : "border-zinc-200 hover:border-zinc-300"
                        )}
                      >
                        <div className={cn(
                          "mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border",
                          values.salesRegulationsAccepted ? "border-primary bg-primary" : "border-zinc-300 bg-white"
                        )}>
                          {values.salesRegulationsAccepted && <CheckCircle2 className="h-3.5 w-3.5 text-on-primary" />}
                        </div>
                        <span className="font-medium">Akceptuje regulamin sprzedaży</span>
                      </button>
                      {errors.salesRegulationsAccepted && (
                        <p className="mb-3 text-red-500 text-sm">{errors.salesRegulationsAccepted.message}</p>
                      )}
                      {!errors.salesRegulationsAccepted && !values.salesRegulationsAccepted && isCheckoutReady && (
                        <p className="mb-3 text-sm text-zinc-600">Zaakceptuj regulamin sprzedaży, aby aktywować potwierdzenie zamówienia.</p>
                      )}
                      {!isCheckoutReady && (
                        <p className="mb-3 text-sm text-zinc-600">Uzupełnij poprzednie sekcje, aby aktywować potwierdzenie zamówienia.</p>
                      )}
                      {submitError && <p className="mb-3 text-red-500 text-sm">{submitError}</p>}
                      <Button 
                        type="submit" 
                        disabled={!canSubmit}
                        className="w-full py-8 text-lg font-headline tracking-widest uppercase rounded-[4px] bg-black text-white hover:bg-zinc-800"
                      >
                        {isSubmittingOrder ? "Zapisuję zamówienie..." : "POTWIERDZAM ZAMÓWIENIE"}
                      </Button>
                    </div>

                  </form>
                </div>
              </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
