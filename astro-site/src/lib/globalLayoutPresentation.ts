import type { GlobalLayoutNavigationItem } from './globalLayoutContract.ts';

export const splitNavbarPrimaryItems = (items: GlobalLayoutNavigationItem[]) => {
  const midpoint = Math.ceil(items.length / 2);

  return {
    leading: items.slice(0, midpoint),
    trailing: items.slice(midpoint),
  };
};

export const buildFooterWordmark = (brandName: string) => {
  const normalizedBrand = brandName.trim();

  return {
    leading: normalizedBrand.slice(0, 1).toUpperCase(),
    trailing: normalizedBrand.slice(1).toUpperCase(),
  };
};

export const isExternalHttpHref = (href: string) => /^https?:\/\//.test(href);