import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CheckoutSuccessSnapshot, CheckoutSuccessSnapshotItem } from "@/src/lib/checkoutSuccessSnapshot";

const formatCurrency = (amount: number): string => `${amount.toFixed(2)} zł`;

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

interface CheckoutSuccessConfirmationProps {
  snapshot: CheckoutSuccessSnapshot;
}

export function CheckoutSuccessConfirmation({ snapshot }: CheckoutSuccessConfirmationProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const copyConfirmationText = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snapshot.copyText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = snapshot.copyText;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (!copied) {
          throw new Error("copy_failed");
        }
      }

      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] xl:gap-12">
      <div className="order-1 space-y-8 lg:order-1">
        <div className="rounded-[4px] border border-zinc-100 bg-zinc-50 p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-headline text-xl uppercase tracking-widest">Podsumowanie</h3>
              <p className="mt-8 text-xs font-label uppercase tracking-widest text-zinc-500">
                {snapshot.itemCount > 0 ? `${snapshot.itemCount} pozycji w koszyku` : "Koszyk jest pusty"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {snapshot.items.map((item) => (
              <div key={item.lineId} className="space-y-2">
                {renderReadonlyCartItem(item)}
              </div>
            ))}
          </div>

          <div className="my-8 border-t border-dashed border-zinc-300" />

          <div className="space-y-4">
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Suma częściowa</span>
              <span>{formatCurrency(snapshot.itemsSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Dostawa</span>
              <span>{formatCurrency(snapshot.deliveryFee)}</span>
            </div>
            <div className="mt-6 flex justify-between border-t border-zinc-200 pt-6 font-headline text-xl">
              <span>Razem</span>
              <span>{formatCurrency(snapshot.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-2 lg:order-2">
        <div className="space-y-8">
          <div className="relative rounded-[4px] border-2 border-green-500/50 bg-green-50/30 p-8">
            <div className="absolute right-6 top-6 text-green-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="mb-4 font-headline text-xl uppercase tracking-widest">Zamówienie potwierdzone</h3>
            <p className="text-sm text-zinc-600">
              Dziękujemy. Zamówienie zostało zapisane i pozostaje widoczne poniżej w formie podsumowania.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[4px] border border-zinc-200 bg-white px-4 py-4">
                <p className="text-xs font-label uppercase tracking-widest text-zinc-500">Numer zamówienia</p>
                <p className="mt-2 font-headline text-2xl uppercase tracking-widest text-zinc-900">{snapshot.orderNumber}</p>
              </div>
              <div className="rounded-[4px] border border-zinc-200 bg-white px-4 py-4">
                <p className="text-xs font-label uppercase tracking-widest text-zinc-500">Forma płatności</p>
                <p className="mt-2 text-sm font-medium text-zinc-900">{snapshot.paymentMethodLabel}</p>
              </div>
              <div className="rounded-[4px] border border-zinc-200 bg-white px-4 py-4">
                <p className="text-xs font-label uppercase tracking-widest text-zinc-500">Sposób realizacji</p>
                <p className="mt-2 text-sm font-medium text-zinc-900">{snapshot.fulfillmentTypeLabel}</p>
              </div>
              <div className="rounded-[4px] border border-zinc-200 bg-white px-4 py-4">
                <p className="text-xs font-label uppercase tracking-widest text-zinc-500">Termin i slot</p>
                <p className="mt-2 text-sm font-medium text-zinc-900">
                  {snapshot.fulfillmentTermLabel} • {snapshot.fulfillmentSlotLabel}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[4px] border border-zinc-200 bg-white px-5 py-5">
              <p className="text-xs font-label uppercase tracking-widest text-zinc-500">Widoczne podsumowanie</p>
              <div className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-700">{snapshot.copyText}</div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={() => void copyConfirmationText()}
                className="rounded-[4px] bg-black text-white hover:bg-zinc-800"
              >
                KOPIUJ INFORMACJE
              </Button>
              {copyStatus === "copied" && <p className="text-sm text-zinc-600">Skopiowano podsumowanie zamówienia.</p>}
              {copyStatus === "failed" && <p className="text-sm text-red-500">Nie udało się skopiować podsumowania.</p>}
            </div>

            <p className="mt-6 text-sm text-zinc-600">
              Szczegóły zamówienia zostały wysłane na podany adres email: {snapshot.customerEmail}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}