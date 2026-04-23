const importMetaEnv = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env;

const getEnvValue = (key: keyof ImportMetaEnv | string): string | undefined => {
  const importMetaValue = importMetaEnv?.[key as string];

  if (typeof importMetaValue === "string" && importMetaValue.trim().length > 0) {
    return importMetaValue.trim();
  }

  const processValue = typeof process !== "undefined"
    ? process.env?.[key as string]
    : undefined;

  return typeof processValue === "string" && processValue.trim().length > 0
    ? processValue.trim()
    : undefined;
};

const getRequiredEnvValue = (key: keyof ImportMetaEnv | string): string => {
  const value = getEnvValue(key);

  if (!value) {
    throw new Error(`Missing required runtime config: ${String(key)}`);
  }

  return value;
};

const normalizeUrl = (value: string, key: string): string => {
  const trimmed = value.replace(/\/$/, "");

  if (!/^https?:\/\//u.test(trimmed)) {
    throw new Error(`${key} must be an absolute http(s) URL.`);
  }

  return trimmed;
};

const normalizeBasePath = (value: string, key: string): string => {
  if (!value.startsWith("/")) {
    throw new Error(`${key} must start with '/'.`);
  }

  return value.endsWith("/") ? value : `${value}/`;
};

export const getWordPressBaseUrl = (): string =>
  normalizeUrl(getRequiredEnvValue("VITE_WORDPRESS_BASE_URL"), "VITE_WORDPRESS_BASE_URL");

export const getBridgeBaseUrl = (): string => {
  const configuredBaseUrl = normalizeUrl(getRequiredEnvValue("VITE_BRIDGE_BASE_URL"), "VITE_BRIDGE_BASE_URL");

  if (typeof window === "undefined") {
    return configuredBaseUrl;
  }

  return window.location.hostname === "localhost"
    ? configuredBaseUrl
    : window.location.origin;
};

export const getSiteUrl = (): string =>
  normalizeUrl(getRequiredEnvValue("VITE_SITE_URL"), "VITE_SITE_URL");

export const getReactBasePath = (): string =>
  normalizeBasePath(getRequiredEnvValue("VITE_REACT_BASE_PATH"), "VITE_REACT_BASE_PATH");

export const getReactRouteCanonicalUrl = (routePath: string): string => {
  const siteUrl = getSiteUrl();
  const reactBasePath = getReactBasePath();
  const trimmedRoutePath = routePath.startsWith("/") ? routePath.slice(1) : routePath;

  return new URL(`${reactBasePath}${trimmedRoutePath}`, `${siteUrl}/`).toString();
};