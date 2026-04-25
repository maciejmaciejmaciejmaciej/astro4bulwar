import { resolveAstroRenderer } from './astroRegistry.ts';
import { pageBuilderSchema } from './types.ts';
import type { PageBuilderSchema } from './types.ts';

export const TEMPLATE_BLOCK_ASTRO_VALIDATION_ROUTE_PATH = '/validation/template-blocks/';
export const TEMPLATE_BLOCK_ASTRO_VALIDATION_OUTPUT_PATH = 'dist/validation/template-blocks/index.html';
export const TEMPLATE_BLOCK_ASTRO_VALIDATION_MARKER_ATTRIBUTE = 'data-template-block-validation';

export const TEMPLATE_BLOCK_ASTRO_VALIDATION_BLOCK_KEYS = [
  'hero_simple_no_text_py32',
  'hero_simple_no_text_normal_wide',
  'about_2_simple',
  'promo2',
  'restaurant_menu_drawer_type',
  'simple_heading_and_paragraph',
  'big_img_and_bolded_tex_editorial_style_block',
  'menu_two_columns_with_no_heading_no_img',
  'menu_two_columns_with_with_heading_no_img',
  'just_pralax_img_horizontal',
  'menu_three_columns_with_with_heading_no_img',
  'premium_call_to_action_with_image_carousel',
  'oferta_posts_section',
] as const;

export const templateBlockAstroValidationPage: PageBuilderSchema = pageBuilderSchema.parse({
  version: 1,
  page: {
    slug: '__validation-template-blocks',
    title: 'Template Block Astro Validation',
    status: 'published',
  },
  sections: [
    {
      id: 'hero-simple-no-text-py32-validation',
      blockKey: 'hero_simple_no_text_py32',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        imageSrc: '/react/images/home_hero.jpg',
        alt: 'Hero validation py32',
      },
      source: null,
      meta: {},
    },
    {
      id: 'hero-simple-no-text-normal-wide-validation',
      blockKey: 'hero_simple_no_text_normal_wide',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        imageSrc: '/react/images/about_front.jpg',
        alt: 'Hero validation wide',
      },
      source: null,
      meta: {},
    },
    {
      id: 'about-2-simple-validation',
      blockKey: 'about_2_simple',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        title: 'O restauracji',
        paragraphs: ['Od 2011 roku prowadzimy restauracje z autorska kuchnia.'],
        buttonText: 'CZYTAJ WIECEJ',
        buttonLink: '/o-restauracji',
        image1: {
          src: '/react/images/about_1.jpg',
          alt: 'Wnetrze restauracji',
        },
        image2: {
          src: '/react/images/about_front.jpg',
          alt: 'Detale dekoracji',
        },
      },
      source: null,
      meta: {},
    },
    {
      id: 'promo2-validation',
      blockKey: 'promo2',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        eyebrow: 'Chef notes',
        title: 'Seasonal menu',
        members: [
          {
            icon: 'calendar-days',
            name: 'Anna Example',
            role: 'Guest Experience Lead',
          },
        ],
        story: 'Story-led promo with an attached lower menu panel.',
        image: {
          src: '/react/images/promo2.jpg',
          alt: 'Promo2 sample image',
        },
        menuColumns: [],
        emptyStateText: 'Brak pozycji w tej kategorii.',
      },
      source: null,
      meta: {},
    },
    {
      id: 'restaurant-menu-drawer-type-validation',
      blockKey: 'restaurant_menu_drawer_type',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        intro: {
          heading: 'Our Services',
          description: 'Curated collections that open into WooCommerce-powered drawers.',
          buttonLabel: 'View all services',
          buttonTarget: '/oferta',
          imageUrl: '/react/images/about_front.jpg',
          imageAlt: 'Restaurant interior',
        },
        collections: [
          {
            visualUrl: '/react/images/about_front.jpg',
            collectionTitle: 'TASTING MENU',
            collectionDescription: 'Seasonal tasting collections.',
            buttonLabel: 'Open tasting menu',
            wooCategoryIds: [84, 85],
          },
          {
            collectionTitle: 'PRIVATE EVENTS',
            collectionDescription: 'Cards can omit the image without leaving an empty placeholder.',
            buttonLabel: 'Open events',
            wooCategoryIds: [87],
          },
        ],
      },
      source: null,
      meta: {},
    },
    {
      id: 'simple-heading-and-paragraph-validation',
      blockKey: 'simple_heading_and_paragraph',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        eyebrow: 'Polityka prywatnosci',
        title: 'Informacja o przetwarzaniu danych',
        richTextHtml: '<p>Opis testowy</p>',
      },
      source: null,
      meta: {},
    },
    {
      id: 'big-img-and-bolded-text-validation',
      blockKey: 'big_img_and_bolded_tex_editorial_style_block',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        title: 'Seasonal story',
        story: 'Jedno zdjecie portretowe i jeden blok tekstu redakcyjnego.',
        buttonLabel: 'przycisk',
        buttonHref: '#',
        image: {
          src: '/react/images/about_1.jpg',
          alt: 'Seasonal portrait image',
        },
      },
      source: null,
      meta: {},
    },
    {
      id: 'menu-two-columns-no-heading-validation',
      blockKey: 'menu_two_columns_with_no_heading_no_img',
      blockVersion: 1,
      variant: 'surface',
      enabled: true,
      data: {
        menuColumns: [],
        emptyStateText: 'Brak pozycji w tej kategorii.',
      },
      source: null,
      meta: {},
    },
    {
      id: 'menu-two-columns-with-heading-validation',
      blockKey: 'menu_two_columns_with_with_heading_no_img',
      blockVersion: 1,
      variant: 'white',
      enabled: true,
      data: {
        title: 'The Menu',
        menuColumns: [],
        emptyStateText: 'Brak pozycji w tej kategorii.',
      },
      source: null,
      meta: {},
    },
    {
      id: 'just-pralax-img-horizontal-validation',
      blockKey: 'just_pralax_img_horizontal',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        imageUrl: 'https://example.com/uploads/parallax-horizontal.jpg',
      },
      source: null,
      meta: {},
    },
    {
      id: 'menu-three-columns-with-heading-validation',
      blockKey: 'menu_three_columns_with_with_heading_no_img',
      blockVersion: 1,
      variant: 'inverted',
      enabled: true,
      data: {
        title: 'Chef Selection',
        menuColumns: [],
        emptyStateText: 'Brak pozycji w tej kategorii.',
      },
      source: null,
      meta: {},
    },
    {
      id: 'premium-catering-validation',
      blockKey: 'premium_call_to_action_with_image_carousel',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        heading: 'Catering Wielkanocny',
        description: 'Contained CTA section aligned with Promo2 rhythm.',
        buttonText: 'ZAMOW ONLINE',
        buttonHref: '/catering-wielkanocny',
        images: [
          {
            src: '/react/images/zupy-catering.jpg',
            alt: 'Zupy cateringowe',
          },
        ],
      },
      source: null,
      meta: {},
    },
    {
      id: 'oferta-posts-validation',
      blockKey: 'oferta_posts_section',
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        title: 'Nasza Oferta',
        items: [
          {
            image: {
              src: '/react/images/oferta-fallback.jpg',
              alt: 'Oferta fallback',
            },
            title: 'Catering dla firm',
            description: 'Fallback preview content used when source is null.',
            link: {
              href: '/oferta/catering-dla-firm',
            },
          },
        ],
      },
      source: null,
      meta: {},
    },
  ],
});

const isRenderableTemplateBlockValidationSection = (
  section: PageBuilderSchema['sections'][number],
): boolean => {
  try {
    resolveAstroRenderer(section.blockKey);
    return true;
  } catch (error) {
    if (error instanceof Error && /not Astro-ready/i.test(error.message)) {
      return false;
    }

    throw error;
  }
};

export const templateBlockAstroValidationRenderableSections = templateBlockAstroValidationPage.sections.filter(
  isRenderableTemplateBlockValidationSection,
);

export const TEMPLATE_BLOCK_ASTRO_VALIDATION_RENDERABLE_BLOCK_KEYS =
  templateBlockAstroValidationRenderableSections.map((section) => section.blockKey);