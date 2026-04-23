const importMetaEnv = (import.meta as ImportMeta & {
	env?: Record<string, string | undefined>;
}).env;

const getRawWordPressBaseUrl = (): string | undefined => {
	const importMetaValue = importMetaEnv?.PUBLIC_WORDPRESS_BASE_URL;

	if (typeof importMetaValue === 'string' && importMetaValue.trim().length > 0) {
		return importMetaValue.trim();
	}

	const processValue = process.env.PUBLIC_WORDPRESS_BASE_URL ?? process.env.CLIENT_WORDPRESS_BASE_URL;

	return typeof processValue === 'string' && processValue.trim().length > 0
		? processValue.trim()
		: undefined;
};

const getRawSiteUrl = (): string | undefined => {
	const importMetaValue = importMetaEnv?.PUBLIC_SITE_URL;

	if (typeof importMetaValue === 'string' && importMetaValue.trim().length > 0) {
		return importMetaValue.trim();
	}

	const processValue = process.env.PUBLIC_SITE_URL ?? process.env.CLIENT_SITE_URL;

	return typeof processValue === 'string' && processValue.trim().length > 0
		? processValue.trim()
		: undefined;
};

const getRawReactBasePath = (): string | undefined => {
	const importMetaValue = importMetaEnv?.PUBLIC_REACT_BASE_PATH;

	if (typeof importMetaValue === 'string' && importMetaValue.trim().length > 0) {
		return importMetaValue.trim();
	}

	const processValue = process.env.PUBLIC_REACT_BASE_PATH ?? process.env.CLIENT_REACT_BASE_PATH;

	return typeof processValue === 'string' && processValue.trim().length > 0
		? processValue.trim()
		: '/react/';
};

const normalizeUrl = (value: string, key: string): string => {
	if (!/^https?:\/\//u.test(value)) {
		throw new Error(`${key} must be an absolute http(s) URL.`);
	}

	return value.replace(/\/$/, '');
};

const normalizeBasePath = (value: string, key: string): string => {
	if (!value.startsWith('/')) {
		throw new Error(`${key} must start with '/'.`);
	}

	return value.endsWith('/') ? value : `${value}/`;
};

export const getWordPressBaseUrl = (): string => {
	const value = getRawWordPressBaseUrl();

	if (!value) {
		throw new Error('Missing required Astro runtime config: PUBLIC_WORDPRESS_BASE_URL');
	}

	return normalizeUrl(value, 'PUBLIC_WORDPRESS_BASE_URL');
};

export const getSiteUrl = (): string => {
	const value = getRawSiteUrl();

	if (!value) {
		throw new Error('Missing required Astro runtime config: PUBLIC_SITE_URL');
	}

	return normalizeUrl(value, 'PUBLIC_SITE_URL');
};

export const getReactBasePath = (): string => {
	const value = getRawReactBasePath();

	return normalizeBasePath(value, 'PUBLIC_REACT_BASE_PATH');
};

export const getReactRouteUrl = (routePath = ''): string => {
	const siteUrl = getSiteUrl();
	const reactBasePath = getReactBasePath();
	const normalizedRoutePath = routePath.replace(/^\/+/, '');

	return new URL(`${reactBasePath}${normalizedRoutePath}`, `${siteUrl}/`).toString();
};