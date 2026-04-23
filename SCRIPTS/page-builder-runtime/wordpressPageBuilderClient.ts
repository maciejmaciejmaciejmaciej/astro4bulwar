export type WordPressPageStatus = "draft" | "published" | "archived";

export type FetchLike = typeof fetch;

export type EnsurePageExistsInput = {
  slug: string;
  title: string;
  status: WordPressPageStatus;
};

export type EnsuredWordPressPage = {
  id: number;
  slug: string;
  title: string;
  status: WordPressPageStatus;
};

export type PublishPageBuilderPayloadsInput = {
  slug: string;
  schema: unknown;
  aiSchema: unknown;
};

export type PageBuilderPayloads = {
  pageId: number;
  schema: unknown;
  aiSchema: unknown;
};

export type WordPressSiteContext = {
  CompanyName: string | null;
  websiteUrl: string | null;
};

export type PageBuilderWordPressEnv = {
  baseUrl: string;
  username: string;
  applicationPassword: string;
};

type WordPressPageRecord = {
  id?: unknown;
  slug?: unknown;
  status?: unknown;
  title?: {
    rendered?: unknown;
  };
};

type WordPressPageBuilderSuccessResponse = {
  success: true;
  data: {
    pageId: number;
    schema: unknown;
    aiSchema: unknown;
  };
  error?: never;
};

type WordPressPageBuilderErrorResponse = {
  success: false;
  data?: never;
  error?: {
    message?: string;
  };
};

type WordPressPageBuilderResponse =
  | WordPressPageBuilderSuccessResponse
  | WordPressPageBuilderErrorResponse;

type WordPressSiteContextSuccessResponse = {
  success: true;
  data: {
    CompanyName?: unknown;
    websiteUrl?: unknown;
  };
  error?: never;
};

type WordPressSiteContextErrorResponse = {
  success: false;
  data?: never;
  error?: {
    message?: string;
  };
};

type WordPressSiteContextResponse =
  | WordPressSiteContextSuccessResponse
  | WordPressSiteContextErrorResponse;

const requireNonEmptyEnv = (value: string | undefined, variableName: string): string => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }

  return trimmedValue;
};

const toHeaders = (headersInit?: HeadersInit): Headers => {
  return new Headers(headersInit);
};

const encodeBasicAuthToken = (username: string, password: string): string => {
  const credentials = `${username}:${password}`;

  if (typeof globalThis.btoa === "function") {
    return globalThis.btoa(credentials);
  }

  return Buffer.from(credentials, "utf8").toString("base64");
};

const mapDraftStatusToWordPressStatus = (status: WordPressPageStatus): string => {
  if (status === "published") {
    return "publish";
  }

  if (status === "archived") {
    return "private";
  }

  return "draft";
};

const mapWordPressStatusToDraftStatus = (status: unknown): WordPressPageStatus => {
  if (status === "publish") {
    return "published";
  }

  if (status === "private" || status === "trash") {
    return "archived";
  }

  return "draft";
};

const normalizeBaseUrl = (baseUrl: string): string => {
  return baseUrl.replace(/\/$/, "");
};

const normalizeNullableString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
};

const buildPageLookupUrl = (baseUrl: string, slug: string): string => {
  const query = new URLSearchParams({
    slug,
    context: "edit",
    status: "any",
    per_page: "20",
  });

  return `${baseUrl}/wp-json/wp/v2/pages?${query.toString()}`;
};

const createAuthHeaders = (
  username: string,
  applicationPassword: string,
  headersInit?: HeadersInit,
): Headers => {
  const headers = toHeaders(headersInit);

  headers.set("Accept", "application/json");
  headers.set("Authorization", `Basic ${encodeBasicAuthToken(username, applicationPassword)}`);

  return headers;
};

const createJsonHeaders = (username: string, applicationPassword: string): Headers => {
  const headers = createAuthHeaders(username, applicationPassword);

  headers.set("Content-Type", "application/json");

  return headers;
};

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload = await response.json() as WordPressPageBuilderResponse | { message?: unknown };

    if (typeof payload === "object" && payload && "error" in payload) {
      const errorMessage = payload.error?.message;

      if (typeof errorMessage === "string" && errorMessage.trim().length > 0) {
        return errorMessage;
      }
    }

    if (typeof payload === "object" && payload && "message" in payload && typeof payload.message === "string") {
      return payload.message;
    }
  } catch {
    return `Request failed: ${response.status} ${response.statusText}`;
  }

  return `Request failed: ${response.status} ${response.statusText}`;
};

const mapWordPressPageRecord = (
  page: WordPressPageRecord,
  fallback: EnsurePageExistsInput,
): EnsuredWordPressPage => {
  if (!Number.isInteger(page.id)) {
    throw new Error("WordPress page response is missing a valid numeric id.");
  }

  const pageId = page.id as number;

  if (pageId <= 0) {
    throw new Error("WordPress page response is missing a valid numeric id.");
  }

  return {
    id: pageId,
    slug: typeof page.slug === "string" && page.slug.trim().length > 0 ? page.slug : fallback.slug,
    title:
      typeof page.title?.rendered === "string" && page.title.rendered.trim().length > 0
        ? page.title.rendered
        : fallback.title,
    status: mapWordPressStatusToDraftStatus(page.status),
  };
};

export const parsePageBuilderWordPressEnv = (
  env: NodeJS.ProcessEnv = process.env,
): PageBuilderWordPressEnv => {
  return {
    baseUrl: requireNonEmptyEnv(
      env.PAGE_BUILDER_WORDPRESS_BASE_URL,
      "PAGE_BUILDER_WORDPRESS_BASE_URL",
    ),
    username: requireNonEmptyEnv(
      env.PAGE_BUILDER_WORDPRESS_USERNAME,
      "PAGE_BUILDER_WORDPRESS_USERNAME",
    ),
    applicationPassword: requireNonEmptyEnv(
      env.PAGE_BUILDER_WORDPRESS_APPLICATION_PASSWORD,
      "PAGE_BUILDER_WORDPRESS_APPLICATION_PASSWORD",
    ),
  };
};

export const createWordPressPageBuilderClient = ({
  baseUrl,
  username,
  applicationPassword,
  fetch: fetchImpl = fetch,
}: {
  baseUrl: string;
  username: string;
  applicationPassword: string;
  fetch?: FetchLike;
}) => {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  return {
    async ensurePageExists(input: EnsurePageExistsInput): Promise<EnsuredWordPressPage> {
      const existingResponse = await fetchImpl(
        buildPageLookupUrl(normalizedBaseUrl, input.slug),
        {
          method: "GET",
          headers: createAuthHeaders(username, applicationPassword),
        },
      );

      if (!existingResponse.ok) {
        throw new Error(await getErrorMessage(existingResponse));
      }

      const existingPages = await existingResponse.json() as WordPressPageRecord[];
      const existingPage = Array.isArray(existingPages) ? existingPages[0] : null;
      const endpointPath = existingPage && Number.isInteger(existingPage.id)
        ? `/wp-json/wp/v2/pages/${existingPage.id}`
        : "/wp-json/wp/v2/pages";

      const response = await fetchImpl(`${normalizedBaseUrl}${endpointPath}`, {
        method: "POST",
        headers: createJsonHeaders(username, applicationPassword),
        body: JSON.stringify({
          slug: input.slug,
          title: input.title,
          status: mapDraftStatusToWordPressStatus(input.status),
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const payload = await response.json() as WordPressPageRecord;

      return mapWordPressPageRecord(payload, input);
    },

    async publishPageBuilderPayloads(input: PublishPageBuilderPayloadsInput): Promise<PageBuilderPayloads> {
      const response = await fetchImpl(
        `${normalizedBaseUrl}/wp-json/bulwar/v1/page-builder/pages/${encodeURIComponent(input.slug)}`,
        {
          method: "POST",
          headers: createJsonHeaders(username, applicationPassword),
          body: JSON.stringify({
            schema: input.schema,
            aiSchema: input.aiSchema,
          }),
        },
      );

      const payload = await response.json() as WordPressPageBuilderResponse;

      if (!response.ok || !payload.success) {
        const errorMessage = "error" in payload && typeof payload.error?.message === "string"
          ? payload.error.message
          : `Page builder publish failed: ${response.status} ${response.statusText}`;

        throw new Error(errorMessage);
      }

      return {
        pageId: payload.data.pageId,
        schema: payload.data.schema,
        aiSchema: payload.data.aiSchema,
      };
    },

    async readPageBuilderPayloads(slug: string): Promise<PageBuilderPayloads> {
      const response = await fetchImpl(
        `${normalizedBaseUrl}/wp-json/bulwar/v1/page-builder/pages/${encodeURIComponent(slug)}`,
        {
          method: "GET",
          headers: createAuthHeaders(username, applicationPassword),
        },
      );

      const payload = await response.json() as WordPressPageBuilderResponse;

      if (!response.ok || !payload.success) {
        const errorMessage = "error" in payload && typeof payload.error?.message === "string"
          ? payload.error.message
          : `Page builder readback failed: ${response.status} ${response.statusText}`;

        throw new Error(errorMessage);
      }

      return {
        pageId: payload.data.pageId,
        schema: payload.data.schema,
        aiSchema: payload.data.aiSchema,
      };
    },

    async fetchSiteContext(): Promise<WordPressSiteContext> {
      const response = await fetchImpl(
        `${normalizedBaseUrl}/wp-json/bulwar/v1/page-builder/site-context`,
        {
          method: "GET",
          headers: createAuthHeaders(username, applicationPassword),
        },
      );

      const payload = await response.json() as WordPressSiteContextResponse;

      if (!response.ok || !payload.success) {
        const errorMessage = "error" in payload && typeof payload.error?.message === "string"
          ? payload.error.message
          : `Page builder site context fetch failed: ${response.status} ${response.statusText}`;

        throw new Error(errorMessage);
      }

      return {
        CompanyName: normalizeNullableString(payload.data.CompanyName),
        websiteUrl: normalizeNullableString(payload.data.websiteUrl),
      };
    },
  };
};