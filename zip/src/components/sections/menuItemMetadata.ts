const MENU_ITEM_PILL_LABELS: Record<string, string> = {
  "500-ml": "500 ml",
  vegan: "Vegan",
  vege: "Vege",
  ostre: "Ostre",
  "bardzo-ostre": "Bardzo ostre",
};

const normalizeMenuMetadataValue = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export interface MenuItemPill {
  slug: string;
  label: string;
}

export const getOptionalMenuText = (value: string | null | undefined): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
};

export const getMenuItemPills = (tagSlugs: readonly string[] | undefined): MenuItemPill[] => {
  if (!tagSlugs || tagSlugs.length === 0) {
    return [];
  }

  const uniquePills = new Map<string, string>();

  for (const tagSlug of tagSlugs) {
    const safeTag = getOptionalMenuText(tagSlug);

    if (!safeTag) {
      continue;
    }

    const normalized = normalizeMenuMetadataValue(safeTag);

    if (!uniquePills.has(normalized)) {
      uniquePills.set(normalized, safeTag);
    }
  }

  return Array.from(uniquePills.entries()).map(([slug, label]) => ({
    slug,
    label: MENU_ITEM_PILL_LABELS[slug] ?? label,
  }));
};