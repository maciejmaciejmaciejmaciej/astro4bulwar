import type {
  OfertaPostsSectionData,
  OfertaPostsSectionItem,
  OfertaPostsSectionSource,
} from "../oferta_posts_section/schema";
import { getWordPressBaseUrl } from "../../lib/clientRuntimeConfig";

interface WordPressRenderedField {
  rendered?: string;
}

interface WordPressFeaturedMedia {
  source_url?: string;
  alt_text?: string;
}

interface WordPressPost {
  id: number;
  title?: WordPressRenderedField;
  excerpt?: WordPressRenderedField;
  link?: string;
  offer_url_link?: unknown;
  meta?: Record<string, unknown>;
  acf?: Record<string, unknown>;
  _embedded?: {
    "wp:featuredmedia"?: WordPressFeaturedMedia[];
  };
}

const fetchWordPressJson = async <T,>(path: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${getWordPressBaseUrl()}${path}`, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress API request failed: ${response.status} ${response.statusText}`);
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

const getOptionalString = (value: unknown): string | null => {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
};

const fetchWordPressPostsByIds = async (
  postIds: readonly number[],
  signal?: AbortSignal,
): Promise<WordPressPost[]> => {
  const sanitizedIds = postIds.filter((postId): postId is number => Number.isInteger(postId) && postId > 0);

  if (sanitizedIds.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    include: sanitizedIds.join(","),
    orderby: "include",
    per_page: String(sanitizedIds.length),
    _embed: "wp:featuredmedia",
  });

  const posts = await fetchWordPressJson<WordPressPost[]>(`/wp-json/wp/v2/posts?${params.toString()}`, signal);
  const postMap = new Map(posts.map((post) => [post.id, post] as const));

  return sanitizedIds.flatMap((postId) => {
    const post = postMap.get(postId);
    return post ? [post] : [];
  });
};

const getOfferUrlLink = (post: WordPressPost): string | null => {
  return getOptionalString(post.offer_url_link)
    ?? getOptionalString(post.meta?.offer_url_link)
    ?? getOptionalString(post.acf?.offer_url_link)
    ?? getOptionalString(post.link);
};

const mapWordPressPostToOfertaItem = (
  post: WordPressPost,
  fallbackItem: OfertaPostsSectionItem,
): OfertaPostsSectionItem => {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const title = stripHtml(post.title?.rendered ?? "") || fallbackItem.title;

  return {
    image: {
      src: getOptionalString(featuredMedia?.source_url) ?? fallbackItem.image.src,
      alt: getOptionalString(featuredMedia?.alt_text) ?? title ?? fallbackItem.image.alt,
    },
    title,
    description: stripHtml(post.excerpt?.rendered ?? "") || fallbackItem.description,
    link: {
      href: getOfferUrlLink(post) ?? fallbackItem.link.href,
    },
  };
};

export const resolveOfertaPostsSectionSource = async (
  data: OfertaPostsSectionData,
  source: OfertaPostsSectionSource,
  signal?: AbortSignal,
): Promise<OfertaPostsSectionData> => {
  const posts = await fetchWordPressPostsByIds(source.sourceValue, signal);
  const firstFallbackItem = data.items[0];

  if (!firstFallbackItem) {
    return {
      ...data,
      items: [],
    };
  }

  return {
    ...data,
    items: posts.map((post, index) => {
      const fallbackItem = data.items[index] ?? firstFallbackItem;
      return mapWordPressPostToOfertaItem(post, fallbackItem);
    }),
  };
};