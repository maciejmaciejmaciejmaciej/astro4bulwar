import type {
  GalleryBlock,
  MenuBlock,
  PageBuilderSchema,
  ResolvedPageSeo,
} from './types.ts';

const toAbsoluteAssetUrl = (src: string, wordPressBaseUrl: string) => {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  return `${wordPressBaseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
};

const resolveAbsoluteUrl = (value: string | undefined, fallbackPath: string, siteUrl: URL) => {
  const fallbackUrl = new URL(fallbackPath, siteUrl);

  if (!value) {
    return fallbackUrl.toString();
  }

  try {
    const resolvedUrl = new URL(value, siteUrl);

    if (
      (resolvedUrl.protocol === 'http:' || resolvedUrl.protocol === 'https:')
      && resolvedUrl.origin === siteUrl.origin
    ) {
      return resolvedUrl.toString();
    }
  } catch {
    return fallbackUrl.toString();
  }

  return fallbackUrl.toString();
};

const resolveOptionalAbsoluteUrl = (value: string | undefined, siteUrl: URL) => {
  if (!value) {
    return undefined;
  }

  try {
    const resolvedUrl = new URL(value, siteUrl);

    if (resolvedUrl.protocol === 'http:' || resolvedUrl.protocol === 'https:') {
      return resolvedUrl.toString();
    }
  } catch {
    return undefined;
  }

  return undefined;
};

const getDefaultDescription = (page: PageBuilderSchema, sections: PageBuilderSchema['sections']) => {
  const firstEnabledSection = sections.find((section) => section.enabled);

  if (!firstEnabledSection) {
    return `Poznaj ${page.page.title} w BulwaR.`;
  }

  if (firstEnabledSection.blockKey === 'gallery-masonry-style1') {
    const gallerySection = firstEnabledSection as GalleryBlock;

    if (gallerySection.data.title !== page.page.title) {
      return `${page.page.title} - ${gallerySection.data.title}.`;
    }
  }

  if (firstEnabledSection.blockKey === 'menu-category-photo-parallax-full-width') {
    const menuSection = firstEnabledSection as MenuBlock;

    if (menuSection.data.heroTitle !== page.page.title) {
      return `${page.page.title} - ${menuSection.data.heroTitle}.`;
    }
  }

  return `Poznaj ${page.page.title} w BulwaR.`;
};

const getDefaultOgImage = (sections: PageBuilderSchema['sections'], wordPressBaseUrl: string) => {
  for (const section of sections) {
    if (!section.enabled) {
      continue;
    }

    if (section.blockKey === 'gallery-masonry-style1') {
      const gallerySection = section as GalleryBlock;
      const firstImage = gallerySection.data.images[0];

      if (firstImage?.src) {
        return toAbsoluteAssetUrl(firstImage.src, wordPressBaseUrl);
      }
    }

    if (section.blockKey === 'menu-category-photo-parallax-full-width') {
      const menuSection = section as MenuBlock;

      if (menuSection.data.backgroundImage.src) {
        return toAbsoluteAssetUrl(menuSection.data.backgroundImage.src, wordPressBaseUrl);
      }
    }
  }

  return undefined;
};

export const resolvePageSeo = ({
  page,
  sections,
  siteUrl,
  pagePath,
  wordPressBaseUrl,
}: {
  page: PageBuilderSchema;
  sections: PageBuilderSchema['sections'];
  siteUrl: URL;
  pagePath: string;
  wordPressBaseUrl: string;
}): ResolvedPageSeo => {
  const seoTitle = page.seo.title ?? page.page.title;
  const seoDescription = page.seo.description ?? getDefaultDescription(page, sections);
  const seoCanonical = resolveAbsoluteUrl(page.seo.canonical, pagePath, siteUrl);
  const isPublished = page.page.status === 'published';
  const robotsIndex = isPublished && !page.seo.noindex && page.seo.robots?.index !== false;
  const robotsFollow = isPublished ? page.seo.robots?.follow ?? true : false;
  const seoOgImage = resolveOptionalAbsoluteUrl(
    page.seo.og?.image ?? getDefaultOgImage(sections, wordPressBaseUrl),
    siteUrl,
  );

  return {
    title: seoTitle,
    description: seoDescription,
    canonical: seoCanonical,
    robots: `${robotsIndex ? 'index' : 'noindex'},${robotsFollow ? 'follow' : 'nofollow'}`,
    og: {
      title: page.seo.og?.title ?? seoTitle,
      description: page.seo.og?.description ?? seoDescription,
      image: seoOgImage,
      type: page.seo.og?.type ?? 'website',
      url: seoCanonical,
    },
    twitter: {
      card: seoOgImage ? 'summary_large_image' : 'summary',
      title: page.seo.og?.title ?? seoTitle,
      description: page.seo.og?.description ?? seoDescription,
      image: seoOgImage,
    },
  };
};