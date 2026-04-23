import { startTransition, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  parseGlobalLayoutData,
  type GlobalLayoutData,
} from "../blocks/registry/globalLayoutContract";
import { Navbar2 } from "../components/sections/NavbarBigSpaceBetweenElements";
import { Footer } from "../components/sections/Footer";
import { StickyCartControls } from "../components/sections/StickyCartControls";
import { CheckoutDrawer } from "@/components/CheckoutDrawer";
import {
  fetchWordPressGlobalLayout,
  isRetryableGlobalLayoutError,
} from "../lib/fetchWordPressGlobalLayout";

type GlobalLayoutStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

interface ShouldRetryGlobalLayoutLoadOptions {
  globalLayout: GlobalLayoutData | null;
  hasRetried: boolean;
  error: unknown;
}

export const GLOBAL_LAYOUT_CACHE_KEY = "bulwar.global-layout.last-known-good.v1";
const GLOBAL_LAYOUT_RETRY_DELAY_MS = 1000;

const getGlobalLayoutStorage = (): GlobalLayoutStorage | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
};

const readCachedGlobalLayout = (storage: GlobalLayoutStorage | null): GlobalLayoutData | null => {
  const cachedSnapshot = storage?.getItem(GLOBAL_LAYOUT_CACHE_KEY);

  if (!cachedSnapshot) {
    return null;
  }

  try {
    return parseGlobalLayoutData(JSON.parse(cachedSnapshot));
  } catch {
    storage?.removeItem(GLOBAL_LAYOUT_CACHE_KEY);

    return null;
  }
};

const persistGlobalLayout = (layout: GlobalLayoutData, storage: GlobalLayoutStorage | null = getGlobalLayoutStorage()) => {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(GLOBAL_LAYOUT_CACHE_KEY, JSON.stringify(layout));
  } catch {
    // Ignore storage write failures so layout rendering remains unaffected.
  }
};

export const resolveInitialGlobalLayout = (
  initialGlobalLayout?: GlobalLayoutData,
  storage: GlobalLayoutStorage | null = getGlobalLayoutStorage(),
): GlobalLayoutData | null => initialGlobalLayout ?? readCachedGlobalLayout(storage);

export const shouldRetryGlobalLayoutLoad = ({
  globalLayout,
  hasRetried,
  error,
}: ShouldRetryGlobalLayoutLoadOptions): boolean =>
  globalLayout === null
  && !hasRetried
  && isRetryableGlobalLayoutError(error);

interface RootLayoutProps {
  initialGlobalLayout?: GlobalLayoutData;
}

export function RootLayout({ initialGlobalLayout }: RootLayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [globalLayout, setGlobalLayout] = useState<GlobalLayoutData | null>(() => resolveInitialGlobalLayout(initialGlobalLayout));
  const globalLayoutRef = useRef(globalLayout);
  const hasRetriedGlobalLayoutRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    globalLayoutRef.current = globalLayout;
  }, [globalLayout]);

  useEffect(() => {
    const abortController = new AbortController();
    let retryTimeoutId: number | null = null;

    const loadGlobalLayout = () => {
      fetchWordPressGlobalLayout(abortController.signal)
        .then((nextGlobalLayout) => {
          persistGlobalLayout(nextGlobalLayout);
          globalLayoutRef.current = nextGlobalLayout;

          startTransition(() => {
            setGlobalLayout(nextGlobalLayout);
          });
        })
        .catch((error: unknown) => {
          if (abortController.signal.aborted) {
            return;
          }

          console.error("Failed to fetch global layout", error);

          if (!shouldRetryGlobalLayoutLoad({
            globalLayout: globalLayoutRef.current,
            hasRetried: hasRetriedGlobalLayoutRef.current,
            error,
          })) {
            return;
          }

          hasRetriedGlobalLayoutRef.current = true;
          retryTimeoutId = window.setTimeout(() => {
            if (!abortController.signal.aborted) {
              loadGlobalLayout();
            }
          }, GLOBAL_LAYOUT_RETRY_DELAY_MS);
        });
    };

    loadGlobalLayout();

    return () => {
      abortController.abort();

      if (retryTimeoutId !== null) {
        window.clearTimeout(retryTimeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    setIsCartOpen(false);
  }, [isCartOpen, location.pathname, location.search]);

  return (
    <div className="bg-background text-foreground font-body selection:bg-primary-fixed min-h-screen pb-16">
      {globalLayout ? <Navbar2 navbar={globalLayout.navbar} /> : null}

      <Outlet />

      {globalLayout ? <Footer footer={globalLayout.footer} /> : null}

      <StickyCartControls onOpenCart={() => setIsCartOpen(true)} />

      <CheckoutDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default RootLayout;
