import { z } from 'zod';

import { getWordPressBaseUrl } from './config.ts';
import {
  pageBuilderSchema,
  parseGlobalLayoutApiResponse,
  type GlobalLayoutData,
  type PageBuilderSchema,
} from './types.ts';

type PageBuilderApiResponse = {
  success: boolean;
  data?: {
    schema?: unknown;
  };
  error?: {
    message?: string;
  };
};

type GlobalLayoutApiResponse = {
  success: boolean;
  data?: {
    globalLayout?: unknown;
  };
  error?: {
    message?: string;
  };
};

const buildablePageSummarySchema = z.object({
  pageId: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  status: z.string().min(1),
}).strict();

const buildablePagesApiResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    pages: z.array(buildablePageSummarySchema),
  }).strict(),
  meta: z.record(z.string(), z.unknown()).optional(),
}).strict();

export type BuildablePageSummary = z.infer<typeof buildablePageSummarySchema>;

export const GLOBAL_LAYOUT_FALLBACK_OVERRIDE_ENV_VAR = 'ASTRO_ALLOW_GLOBAL_LAYOUT_FALLBACK' as const;
const RESOLVED_GLOBAL_LAYOUT_STATUS = 'resolved';

type GlobalLayoutFallbackOptions = {
  prod: boolean;
  allowFallback?: string | boolean;
};

export const DEFAULT_GLOBAL_LAYOUT_DATA: GlobalLayoutData = {
  navbar: {
    brand: {
      name: 'Bulwar',
      href: '/',
      logoSrc: '/react/images/logo.png',
      logoAlt: 'Bulwar',
    },
    primaryItems: [
      {
        label: 'Start',
        href: '#',
        description: 'Szybki dostep do glownej nawigacji restauracji.',
        children: [
          { label: 'Strona glowna', href: '#', description: 'Powrot do glownego widoku restauracji.', children: [] },
          { label: 'O restauracji', href: '#', description: 'Historia miejsca, zespol i klimat.', children: [] },
          { label: 'Aktualnosci', href: '#', description: 'Nowosci, wydarzenia i komunikaty sezonowe.', children: [] },
          { label: 'Galeria', href: '#', description: 'Zdjecia sali, tarasu i dan.', children: [] },
        ],
      },
      {
        label: 'Menu',
        href: '#',
        description: 'Pelna karta i sekcje specjalne w jednym miejscu.',
        children: [
          { label: 'Sniadania', href: '#', description: 'Poranne menu i lekkie propozycje.', children: [] },
          { label: 'Lunch', href: '#', description: 'Dania dnia i szybkie zestawy.', children: [] },
          { label: 'Kolacje', href: '#', description: 'Wieczorne talerze i specjalnosci kuchni.', children: [] },
          { label: 'Desery i wina', href: '#', description: 'Slodkie zakonczenie i selekcja win.', children: [] },
        ],
      },
      {
        label: 'Catering',
        href: '#',
        description: 'Oferta zamowien, eventow i zestawow okazjonalnych.',
        children: [
          { label: 'Catering firmowy', href: '#', description: 'Zestawy dla biur i spotkan biznesowych.', children: [] },
          { label: 'Przyjecia rodzinne', href: '#', description: 'Kompozycje na uroczystosci i obiady rodzinne.', children: [] },
          { label: 'Menu swiateczne', href: '#', description: 'Sezonowe propozycje na specjalne okazje.', children: [] },
          { label: 'Dostawa i odbior', href: '#', description: 'Warunki realizacji i logistyka zamowien.', children: [] },
        ],
      },
      {
        label: 'Przyjecia',
        href: '#',
        description: 'Spotkania prywatne, eventy i wieksze rezerwacje.',
        children: [
          { label: 'Eventy prywatne', href: '#', description: 'Kolacje zamkniete i przyjecia rodzinne.', children: [] },
          { label: 'Wesela i komunie', href: '#', description: 'Oprawa menu dla waznych okazji.', children: [] },
          { label: 'Spotkania firmowe', href: '#', description: 'Obsluga biznesowa i wieczory integracyjne.', children: [] },
          { label: 'Sala i taras', href: '#', description: 'Mozliwosci ustawien i liczba miejsc.', children: [] },
        ],
      },
      {
        label: 'Kontakt',
        href: '#',
        description: 'Adres, kontakt bezposredni i kanaly marki.',
        children: [
          { label: 'Dane kontaktowe', href: '#', description: 'Telefon, email i godziny otwarcia.', children: [] },
          { label: 'Dojazd', href: '#', description: 'Mapa, parking i wskazowki dojazdu.', children: [] },
          { label: 'Instagram', href: '#', description: 'Biezace kadry z restauracji.', children: [] },
          { label: 'Newsletter', href: '#', description: 'Nowosci, premiery i oferty sezonowe.', children: [] },
        ],
      },
    ],
    companyLinks: [
      { label: '+48 500 200 300', href: '#' },
      { label: 'Bulwar Poznan 2026', href: '#' },
    ],
    legalLinks: [
      { label: 'Polityka prywatnosci', href: '#' },
      { label: 'Regulamin', href: '#' },
    ],
  },
  footer: {
    brand: {
      name: 'Bulwar',
      href: '/',
      logoSrc: null,
      logoAlt: null,
    },
    address: {
      heading: 'Adres',
      lines: ['Restauracja "BulwaR"', 'Stary Rynek 37', 'Poznan'],
    },
    contact: {
      heading: 'Kontakt',
      items: [
        { label: '+48 533 181 171', href: 'tel:+48533181171' },
        { label: 'rezerwacje@bulwarrestauracja.pl', href: 'mailto:rezerwacje@bulwarrestauracja.pl' },
      ],
    },
    hours: {
      heading: 'Godziny',
      lines: ['Codziennie od 09.00 do 23.00'],
    },
    socialLinks: [
      { label: 'Facebook', href: 'https://www.facebook.com/bulwaRrestauracja/' },
      { label: 'Instagram', href: 'https://www.instagram.com/bulwar/' },
      { label: 'Tripadvisor', href: 'https://pl.tripadvisor.com/Restaurant_Review-g274847-d10184406-Reviews-Bulwar-Poznan_Greater_Poland_Province_Central_Poland.html' },
    ],
    legalLinks: [
      { label: 'Polityka prywatnosci', href: 'https://bulwarrestauracja.pl/polityka-prywatnosci/' },
      { label: 'Regulamin', href: 'https://bulwarrestauracja.pl/regulamin/' },
    ],
    copyright: '© 2026 Restauracja BulwaR. All rights reserved.',
  },
};

export const shouldAllowGlobalLayoutFallback = ({
  prod,
  allowFallback,
}: GlobalLayoutFallbackOptions): boolean => {
  if (!prod) {
    return true;
  }

  if (allowFallback === true) {
    return true;
  }

  if (typeof allowFallback === 'string') {
    return allowFallback.trim().toLowerCase() === 'true';
  }

  return false;
};

const normalizeRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
};

const normalizeSchema = (value: unknown): unknown => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  const schema = value as Record<string, unknown>;
  const sections = Array.isArray(schema.sections) ? schema.sections : [];

  return {
    ...schema,
    meta: normalizeRecord(schema.meta),
    seo: schema.seo ?? undefined,
    build: typeof schema.build === 'undefined' ? undefined : normalizeRecord(schema.build),
    sections: sections.map((sectionValue) => {
      if (!sectionValue || typeof sectionValue !== 'object' || Array.isArray(sectionValue)) {
        return sectionValue;
      }

      const section = sectionValue as Record<string, unknown>;

      return {
        ...section,
        meta: normalizeRecord(section.meta),
      };
    }),
  };
};

export const fetchWordPressBuildablePages = async (): Promise<BuildablePageSummary[]> => {
  const endpoint = `${getWordPressBaseUrl()}/wp-json/bulwar/v1/page-builder/pages`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const payload = await response.json() as PageBuilderApiResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? `Buildable pages request failed for ${endpoint}: ${response.status} ${response.statusText}`);
  }

  try {
    return buildablePagesApiResponseSchema.parse(payload).data.pages;
  } catch (error) {
    throw new Error('Invalid buildable pages list response from WordPress endpoint.', { cause: error });
  }
};

export const fetchWordPressPageBuilderSchema = async (slug: string): Promise<PageBuilderSchema> => {
  const response = await fetch(`${getWordPressBaseUrl()}/wp-json/bulwar/v1/page-builder/pages/${encodeURIComponent(slug)}`);
  const payload = await response.json() as PageBuilderApiResponse;

  if (!response.ok || !payload.success || !payload.data?.schema) {
    throw new Error(payload.error?.message ?? `Failed to fetch schema for ${slug}`);
  }

  return pageBuilderSchema.parse(normalizeSchema(payload.data.schema));
};

export const fetchWordPressGlobalLayout = async (): Promise<GlobalLayoutData> => {
  const response = await fetch(`${getWordPressBaseUrl()}/wp-json/bulwar/v1/layout/global`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const payload = await response.json() as GlobalLayoutApiResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? `Global layout request failed: ${response.status} ${response.statusText}`);
  }

  const parsedPayload = parseGlobalLayoutApiResponse(payload);

  if (
    parsedPayload.meta.layout_option_status !== RESOLVED_GLOBAL_LAYOUT_STATUS
    || parsedPayload.meta.footer_status !== RESOLVED_GLOBAL_LAYOUT_STATUS
  ) {
    throw new Error(
      `Global layout endpoint returned unresolved meta: layout_option_status=${parsedPayload.meta.layout_option_status}, footer_status=${parsedPayload.meta.footer_status}`,
    );
  }

  return parsedPayload.data.globalLayout;
};