import {
  parseGlobalLayoutApiResponse,
  type GlobalLayoutData,
} from "../blocks/registry/globalLayoutContract";
import { getWordPressBaseUrl } from "./clientRuntimeConfig";

interface WordPressGlobalLayoutSuccessResponse {
  success: true;
  data: {
    globalLayout: unknown;
  };
}

interface WordPressGlobalLayoutErrorResponse {
  success: false;
  error?: {
    message?: string;
  };
}

type WordPressGlobalLayoutResponse = WordPressGlobalLayoutSuccessResponse | WordPressGlobalLayoutErrorResponse;

export type GlobalLayoutFetchErrorKind = "transport" | "http" | "application" | "contract" | "meta-status";

interface GlobalLayoutFetchErrorOptions {
  kind: GlobalLayoutFetchErrorKind;
  retryable: boolean;
  status?: number;
  cause?: unknown;
}

const RESOLVED_GLOBAL_LAYOUT_STATUS = "resolved";

export class GlobalLayoutFetchError extends Error {
  readonly kind: GlobalLayoutFetchErrorKind;
  readonly retryable: boolean;
  readonly status?: number;

  constructor(message: string, options: GlobalLayoutFetchErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "GlobalLayoutFetchError";
    this.kind = options.kind;
    this.retryable = options.retryable;
    this.status = options.status;
  }
}

export const isRetryableGlobalLayoutError = (error: unknown): error is GlobalLayoutFetchError =>
  error instanceof GlobalLayoutFetchError && error.retryable;

const isAbortError = (error: unknown): boolean =>
  typeof error === "object"
  && error !== null
  && "name" in error
  && (error as { name?: string }).name === "AbortError";

const getBridgeErrorMessage = (
  payload: WordPressGlobalLayoutResponse | null,
  fallbackMessage: string,
): string => {
  if (payload && "error" in payload && payload.error?.message) {
    return payload.error.message;
  }

  return fallbackMessage;
};

export const fetchWordPressGlobalLayout = async (signal?: AbortSignal): Promise<GlobalLayoutData> => {
  const wordPressBaseUrl = getWordPressBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${wordPressBaseUrl}/wp-json/bulwar/v1/layout/global`, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    throw new GlobalLayoutFetchError("Global layout request failed before reaching the server.", {
      kind: "transport",
      retryable: true,
      cause: error,
    });
  }

  let payload: WordPressGlobalLayoutResponse | null = null;

  try {
    payload = await response.json() as WordPressGlobalLayoutResponse;
  } catch (error) {
    if (!response.ok) {
      throw new GlobalLayoutFetchError(
        `Global layout request failed: ${response.status} ${response.statusText}`,
        {
          kind: "http",
          retryable: response.status >= 500,
          status: response.status,
          cause: error,
        },
      );
    }

    throw new GlobalLayoutFetchError("Global layout response did not match the expected JSON contract.", {
      kind: "contract",
      retryable: false,
      status: response.status,
      cause: error,
    });
  }

  if (!response.ok) {
    throw new GlobalLayoutFetchError(
      getBridgeErrorMessage(payload, `Global layout request failed: ${response.status} ${response.statusText}`),
      {
        kind: "http",
        retryable: response.status >= 500,
        status: response.status,
      },
    );
  }

  if (!payload.success) {
    throw new GlobalLayoutFetchError(
      getBridgeErrorMessage(payload, "Global layout response reported an application error."),
      {
        kind: "application",
        retryable: false,
        status: response.status,
      },
    );
  }

  let parsedPayload;

  try {
    parsedPayload = parseGlobalLayoutApiResponse(payload);
  } catch (error) {
    throw new GlobalLayoutFetchError(
      error instanceof Error ? error.message : "Global layout response did not match the expected contract.",
      {
        kind: "contract",
        retryable: false,
        status: response.status,
        cause: error,
      },
    );
  }

  if (
    parsedPayload.meta.layout_option_status !== RESOLVED_GLOBAL_LAYOUT_STATUS
    || parsedPayload.meta.footer_status !== RESOLVED_GLOBAL_LAYOUT_STATUS
  ) {
    throw new GlobalLayoutFetchError(
      `Global layout endpoint returned unresolved meta: layout_option_status=${parsedPayload.meta.layout_option_status}, footer_status=${parsedPayload.meta.footer_status}`,
      {
        kind: "meta-status",
        retryable: false,
        status: response.status,
      },
    );
  }

  return parsedPayload.data.globalLayout;
};