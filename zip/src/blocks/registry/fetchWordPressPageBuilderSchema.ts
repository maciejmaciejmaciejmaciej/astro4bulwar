import { getWordPressBaseUrl } from "../../lib/clientRuntimeConfig";
import { parsePageBuilderSchema, type PageBuilderSchema } from "./pageBuilderSchema";

interface WordPressPageBuilderSuccessResponse {
  success: true;
  data: {
    schema: unknown;
  };
}

interface WordPressPageBuilderErrorResponse {
  success: false;
  error?: {
    message?: string;
  };
}

type WordPressPageBuilderResponse = WordPressPageBuilderSuccessResponse | WordPressPageBuilderErrorResponse;

const normalizeMetaRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
};

const normalizePageBuilderSchemaShape = (value: unknown): unknown => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const schema = value as Record<string, unknown>;
  const sections = Array.isArray(schema.sections) ? schema.sections : [];

  return {
    ...schema,
    meta: normalizeMetaRecord(schema.meta),
    seo: typeof schema.seo === "undefined" ? undefined : normalizeMetaRecord(schema.seo),
    build: typeof schema.build === "undefined" ? undefined : normalizeMetaRecord(schema.build),
    sections: sections.map((sectionValue) => {
      if (!sectionValue || typeof sectionValue !== "object" || Array.isArray(sectionValue)) {
        return sectionValue;
      }

      const section = sectionValue as Record<string, unknown>;

      return {
        ...section,
        variant: section.variant ?? null,
        source: section.source ?? null,
        meta: normalizeMetaRecord(section.meta),
      };
    }),
  };
};

export const fetchWordPressPageBuilderSchema = async (
  slug: string,
  signal?: AbortSignal,
): Promise<PageBuilderSchema> => {
  const wordPressBaseUrl = getWordPressBaseUrl();
  const response = await fetch(
    `${wordPressBaseUrl}/wp-json/bulwar/v1/page-builder/pages/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
    },
  );

  const payload = await response.json() as WordPressPageBuilderResponse;

  if (!response.ok || !payload.success) {
    const errorMessage = "error" in payload && payload.error?.message
      ? payload.error.message
      : `Page builder schema request failed: ${response.status} ${response.statusText}`;

    throw new Error(errorMessage);
  }

  return parsePageBuilderSchema(normalizePageBuilderSchemaShape(payload.data.schema));
};