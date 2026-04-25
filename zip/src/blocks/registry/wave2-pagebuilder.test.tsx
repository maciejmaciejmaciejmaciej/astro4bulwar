import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import { DEFAULT_STORY_TEAM_SHOWCASE_CONTENT } from "../../../components/PROMOCJA_sezonowa";
import { DEFAULT_PROMO2_CONTENT } from "../../../components/Promo2";
import { DEFAULT_PROMO3_CONTENT } from "../../../components/Promo3";
import { DEFAULT_OUR_SERVICES_CONTENT } from "../../components/sections/OurServices";
import { DEFAULT_OCCASIONAL_MENU_PDF_DOWNLOAD_CONTENT } from "../../components/sections/OccasionalMenuPdfDownloadSection";
import { DEFAULT_FEATURE18_CONTENT } from "../../components/sections/Feature18";
import {
  DEFAULT_MODERN_INTERIOR_CONTENT,
} from "../../components/sections/ModernInterior";
import { DEFAULT_PROJECT5C_CONTENT } from "../../components/sections/Project5c";
import { DEFAULT_PROJECT10_CONTENT } from "../../components/sections/Project10";
import {
  heroSimpleNoTextNormalWideDefaultData,
  heroSimpleNoTextNormalWideBlockDefinition,
} from "../hero_simple_no_text_normal_wide/schema";
import {
  heroSimpleNoTextPy32BlockDefinition,
  heroSimpleNoTextPy32DefaultData,
} from "../hero_simple_no_text_py32/schema";
import {
  bigImgAndBoldedTexEditorialStyleBlockDefinition,
} from "../big_img_and_bolded_tex_editorial_style_block/schema";
import {
  blockDownloadBlockDefinition,
  blockDownloadDefaultData,
} from "../block_download/schema";
import {
  justPralaxImgHorizontalBlockDefinition,
  justPralaxImgHorizontalDefaultData,
} from "../just_pralax_img_horizontal/schema";
import {
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockDefinition,
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData,
} from "../menu_two_columns_with_with_heading_with_img_fullwidth_paralax/schema";
import {
  ofertaPostsSectionBlockDefinition,
  ofertaPostsSectionDefaultData,
} from "../oferta_posts_section/schema";
import {
  premiumCallToActionWithImageCarouselBlockDefinition,
  premiumCallToActionWithImageCarouselDefaultData,
} from "../premium_call_to_action_with_image_carousel/schema";
import {
  about2SimpleBlockDefinition,
  about2SimpleDefaultData,
} from "../about_2_simple/schema";
import {
  simpleHeadingAndParagraphBlockDefinition,
  simpleHeadingAndParagraphDefaultData,
} from "../simple_heading_and_paragraph/schema";
import { promo2BlockDefinition } from "../promo2/schema";
import { promo3BlockDefinition } from "../promo3/schema";
import { storyTeamShowcaseBlockDefinition } from "../story-team-showcase/schema";
import {
  universalMultilinkBlockDefinition,
} from "../universal_multilink_block/schema";
import {
  universalHeaderBlock1Definition,
} from "../universal_header_block_1/schema";
import {
  universalHeaderBlock2Definition,
} from "../universal_header_block_2/schema";
import {
  createDefaultBlockInstance,
  getBlock,
  mvpBlockDefaults,
  validateBlockData,
  validateBlockSource,
} from "./index";
import { parsePageBuilderSchema } from "./pageBuilderSchema";
import { renderPageBuilderSections } from "./renderPageBuilderSections";

test("wave 2 registers the our-services block with stable defaults", () => {
  const block = getBlock("our-services");

  assert.ok(block);
  assert.equal(block.blockKey, "our-services");
  assert.deepEqual(mvpBlockDefaults.ourServices, DEFAULT_OUR_SERVICES_CONTENT);

  const instance = createDefaultBlockInstance("our-services", 2);

  assert.equal(instance.id, "our-services-02");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, DEFAULT_OUR_SERVICES_CONTENT);
});

test("wave 2 validates and renders about-1 with our-services in one page schema", () => {
  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "testowa-blueprint",
      title: "Testowa Blueprint",
      status: "published",
      templateKey: "blueprint-test-page",
    },
    sections: [
      {
        id: "about-1-01",
        blockKey: "about-1",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("about-1", {
          leftImages: [
            {
              src: "/react/images/about/bulwar-o-nas-1.webp",
              alt: "Sala restauracyjna Bulwar",
            },
          ],
          leftText: {
            title: "Bulwar nad Wisla",
            paragraphs: [
              "Tworzymy miejsce na spokojne lunche, rodzinne kolacje i wieczory przy winie.",
            ],
            ctaButton: {
              href: "/kontakt",
              text: "Zobacz kontakt",
            },
          },
          rightText: {
            paragraphs: [
              "Ta sekcja pozostaje content-only i prowadzi do wewnetrznej podstrony.",
            ],
          },
          rightImages: [
            {
              src: "/react/images/about/bulwar-o-nas-2.webp",
              alt: "Detal stolika przy oknie",
            },
          ],
        }),
        source: null,
        meta: {},
      },
      {
        id: "our-services-01",
        blockKey: "our-services",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("our-services", {
          title: "Nasze uslugi",
          description: "Sekcja prezentuje uslugi Bulwaru w ukladzie kart.",
          primaryCta: {
            text: "Poznaj cala oferte",
            href: "/oferta",
          },
          cards: [
            {
              icon: "celebration",
              title: "PRZYJECIA OKOLICZNOSCIOWE",
              description: "Kompletna oprawa menu i sali dla rodzinnych spotkan.",
              ctaText: "Zobacz szczegoly",
              ctaHref: "/przyjecia-okolicznosciowe",
            },
          ],
        }),
        source: null,
        meta: {},
      },
    ],
  });

  assert.equal(schema.sections[1]?.blockKey, "our-services");
  assert.equal(schema.sections[1]?.source, null);

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Bulwar nad Wisla/);
  assert.match(markup, /Nasze uslugi/);
  assert.match(markup, /Poznaj cala oferte/);
  assert.match(markup, /PRZYJECIA OKOLICZNOSCIOWE/);
});

test("story-team-showcase registers with stable defaults and renders through the shared runtime", () => {
  const block = getBlock("story-team-showcase");

  assert.ok(block);
  assert.equal(block.blockKey, storyTeamShowcaseBlockDefinition.blockKey);
  assert.deepEqual(mvpBlockDefaults.storyTeamShowcase, DEFAULT_STORY_TEAM_SHOWCASE_CONTENT);

  const instance = createDefaultBlockInstance("story-team-showcase", 3);

  assert.equal(instance.id, "story-team-showcase-03");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, DEFAULT_STORY_TEAM_SHOWCASE_CONTENT);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "homepage-bottom",
      title: "Homepage Bottom",
      status: "published",
    },
    sections: [
      {
        id: "story-team-showcase-01",
        blockKey: "story-team-showcase",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("story-team-showcase", {
          eyebrow: "Our Crew, Our story",
          title: "Our story",
          members: [
            {
              icon: "calendar-days",
              name: "John Doe1",
              role: "Creative Director1",
            },
            {
              icon: "utensils-crossed",
              name: "John Doe2",
              role: "Creative Director2",
            },
          ],
          story:
            "We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect.",
          image: {
            src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri4/img10.png",
            alt: "about us image",
          },
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Our story/);
  assert.match(markup, /Our Crew, Our story/);
  assert.match(markup, /John Doe1/);
  assert.match(markup, /John Doe2/);
  assert.match(markup, /about us image/);
});

test("promo2 registers with stable defaults and renders through the shared runtime", () => {
  const block = getBlock("promo2");

  assert.ok(block);
  assert.equal(block.blockKey, promo2BlockDefinition.blockKey);
  assert.deepEqual(mvpBlockDefaults.promo2, DEFAULT_PROMO2_CONTENT);

  const instance = createDefaultBlockInstance("promo2", 4);

  assert.equal(instance.id, "promo2-04");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, DEFAULT_PROMO2_CONTENT);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "homepage-promo2",
      title: "Homepage Promo2",
      status: "published",
    },
    sections: [
      {
        id: "promo2-01",
        blockKey: "promo2",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("promo2", {
          eyebrow: "Chef notes",
          title: "Seasonal menu",
          members: [
            {
              icon: "calendar-days",
              name: "Anna Example",
              role: "Guest Experience Lead",
            },
          ],
          story: "This version keeps the story layout but adds an attached menu panel below the image.",
          image: {
            src: "/react/images/promo2.jpg",
            alt: "Promo2 sample image",
          },
          menuColumns: [
            {
              items: [
                {
                  title: "Spring ravioli",
                  description: "Brown butter, hazelnut",
                  priceLabel: "42 zł",
                },
              ],
            },
          ],
          emptyStateText: "Brak pozycji w tej kategorii.",
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Seasonal menu/);
  assert.match(markup, /Chef notes/);
  assert.match(markup, /Anna Example/);
  assert.match(markup, /Spring ravioli/);
  assert.match(markup, /Brown butter, hazelnut/);
  assert.doesNotMatch(markup, /The Selection/);
});

test("promo3 registers with stable defaults and renders through the shared runtime", () => {
  const block = getBlock("promo3");

  assert.ok(block);
  assert.equal(block.blockKey, promo3BlockDefinition.blockKey);
  assert.deepEqual(mvpBlockDefaults.promo3, DEFAULT_PROMO3_CONTENT);

  const instance = createDefaultBlockInstance("promo3", 5);

  assert.equal(instance.id, "promo3-05");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, DEFAULT_PROMO3_CONTENT);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "homepage-promo3",
      title: "Homepage Promo3",
      status: "published",
    },
    sections: [
      {
        id: "promo3-01",
        blockKey: "promo3",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("promo3", {
          title: "Seasonal story",
          story: "This version removes the crew rows and keeps only the main editorial copy with one portrait image.",
          image: {
            src: "/react/images/promo3.jpg",
            alt: "Promo3 sample image",
          },
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Promo3 sample image/);
  assert.doesNotMatch(markup, /Seasonal story/);
  assert.doesNotMatch(markup, /Our Crew, Our story/);
  assert.doesNotMatch(markup, /John Doe/);
});

test("block_download registers stable defaults and renders the full direct-edit PDF content", () => {
  const block = getBlock("block_download");

  assert.ok(block);
  assert.equal(block.blockKey, blockDownloadBlockDefinition.blockKey);
  assert.deepEqual(mvpBlockDefaults.block_download, blockDownloadDefaultData);
  assert.deepEqual(blockDownloadDefaultData, DEFAULT_OCCASIONAL_MENU_PDF_DOWNLOAD_CONTENT);

  const instance = createDefaultBlockInstance("block_download", 6);

  assert.equal(instance.id, "block_download-06");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, blockDownloadDefaultData);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "pdf-download-preview",
      title: "PDF Download Preview",
      status: "published",
    },
    sections: [
      {
        id: "block-download-01",
        blockKey: "block_download",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("block_download", {
          title: "Pakiet bankietowy",
          subtitle: "Pobierz rozszerzony pakiet PDF dla eventow premium.",
          primaryCta: {
            label: "Pobierz pakiet",
            href: "/pdf/premium.pdf",
          },
          secondaryCta: {
            label: "Zobacz online",
            href: "/menu-okolicznosciowe-premium",
          },
          helperText: "PDF gotowy do wysylki klientom i do druku na spotkanie",
          versionLabel: "PDF PRO",
          fileMeta: "4.1 MB",
          panelCaption: "Rozszerzona oferta dla wydarzen premium",
          features: [
            {
              icon: "events",
              title: "Rozbudowane propozycje dla gali i jubileuszy",
            },
          ],
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Pakiet bankietowy/);
  assert.match(markup, /Pobierz pakiet/);
  assert.match(markup, /Zobacz online/);
  assert.match(markup, /PDF gotowy do wysylki klientom i do druku na spotkanie/);
  assert.match(markup, /Rozszerzona oferta dla wydarzen premium/);
});

test("hero_simple_no_text_py32 registers stable defaults and renders the direct-edit hero image", () => {
  const block = getBlock("hero_simple_no_text_py32");

  assert.ok(block);
  assert.equal(block.blockKey, heroSimpleNoTextPy32BlockDefinition.blockKey);
  assert.deepEqual(mvpBlockDefaults.hero_simple_no_text_py32, heroSimpleNoTextPy32DefaultData);

  const instance = createDefaultBlockInstance("hero_simple_no_text_py32", 9);

  assert.equal(instance.id, "hero_simple_no_text_py32-09");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, heroSimpleNoTextPy32DefaultData);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "hero-py32-preview",
      title: "Hero Py32 Preview",
      status: "draft",
    },
    sections: [
      {
        id: "hero-py32-01",
        blockKey: "hero_simple_no_text_py32",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("hero_simple_no_text_py32", {
          imageSrc: "/react/images/home_hero.jpg",
          alt: "Hero preview py32",
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Hero preview py32/);
  assert.match(markup, /home_hero\.jpg/);
});

test("hero_simple_no_text_normal_wide registers stable defaults and renders the wide direct-edit hero image", () => {
  const block = getBlock("hero_simple_no_text_normal_wide");

  assert.ok(block);
  assert.equal(block.blockKey, heroSimpleNoTextNormalWideBlockDefinition.blockKey);
  assert.deepEqual(
    mvpBlockDefaults.hero_simple_no_text_normal_wide,
    heroSimpleNoTextNormalWideDefaultData,
  );

  const instance = createDefaultBlockInstance("hero_simple_no_text_normal_wide", 10);

  assert.equal(instance.id, "hero_simple_no_text_normal_wide-10");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, heroSimpleNoTextNormalWideDefaultData);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "hero-wide-preview",
      title: "Hero Wide Preview",
      status: "draft",
    },
    sections: [
      {
        id: "hero-wide-01",
        blockKey: "hero_simple_no_text_normal_wide",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("hero_simple_no_text_normal_wide", {
          imageSrc: "/react/images/home_hero.jpg",
          alt: "Hero preview wide",
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Hero preview wide/);
  assert.match(markup, /home_hero\.jpg/);
});

test("about_2_simple registers stable defaults and renders the ModernInterior direct-edit content", () => {
  const block = getBlock("about_2_simple");

  assert.ok(block);
  assert.equal(block.blockKey, about2SimpleBlockDefinition.blockKey);
  assert.deepEqual(mvpBlockDefaults.about_2_simple, about2SimpleDefaultData);
  assert.deepEqual(about2SimpleDefaultData, DEFAULT_MODERN_INTERIOR_CONTENT);

  const instance = createDefaultBlockInstance("about_2_simple", 11);

  assert.equal(instance.id, "about_2_simple-11");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, about2SimpleDefaultData);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "about-2-simple-preview",
      title: "About 2 Simple Preview",
      status: "published",
    },
    sections: [
      {
        id: "about-2-simple-01",
        blockKey: "about_2_simple",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("about_2_simple", {
          title: "O restauracji",
          paragraphs: [
            "Od 2011 roku prowadzimy restauracje z autorska kuchnia.",
            "Z przyjemnoscia ugoscimy Panstwa na lunchu i kolacji.",
          ],
          buttonText: "CZYTAJ WIECEJ",
          buttonLink: "/o-restauracji",
          image1: {
            src: "/react/images/about_1.jpg",
            alt: "Wnętrze restauracji",
          },
          image2: {
            src: "/react/images/about_front.jpg",
            alt: "Detale dekoracji",
          },
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /O restauracji/);
  assert.match(markup, /CZYTAJ WIECEJ/);
  assert.match(markup, /Wnętrze restauracji/);
  assert.match(markup, /Detale dekoracji/);
});

test("big_img_and_bolded_tex_editorial_style_block reuses Promo3 defaults under the requested direct-edit key", () => {
  const block = getBlock("big_img_and_bolded_tex_editorial_style_block");

  assert.ok(block);
  assert.equal(block.blockKey, bigImgAndBoldedTexEditorialStyleBlockDefinition.blockKey);
  assert.deepEqual(
    mvpBlockDefaults.big_img_and_bolded_tex_editorial_style_block,
    {
      ...DEFAULT_PROMO3_CONTENT,
      buttonLabel: "przycisk",
      buttonHref: "#",
    },
  );

  const instance = createDefaultBlockInstance("big_img_and_bolded_tex_editorial_style_block", 7);

  assert.equal(instance.id, "big_img_and_bolded_tex_editorial_style_block-07");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, {
    ...DEFAULT_PROMO3_CONTENT,
    buttonLabel: "przycisk",
    buttonHref: "#",
  });

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "editorial-style-preview",
      title: "Editorial Style Preview",
      status: "published",
    },
    sections: [
      {
        id: "editorial-style-01",
        blockKey: "big_img_and_bolded_tex_editorial_style_block",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("big_img_and_bolded_tex_editorial_style_block", {
          title: "Editorial portrait",
          story: "This variant keeps the tall image and the bold editorial copy block only.",
          buttonLabel: "przycisk",
          buttonHref: "#",
          image: {
            src: "/react/images/editorial-portrait.jpg",
            alt: "Editorial portrait image",
          },
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Editorial portrait image/);
  assert.match(markup, /This variant keeps the tall image and the bold editorial copy block only\./);
  assert.match(markup, />przycisk</);
  assert.match(markup, /href="#"/);
  assert.doesNotMatch(markup, /Creative Director/);
});

test("premium_call_to_action_with_image_carousel keeps a direct-edit six-image default contract and renders the contained carousel shell", () => {
  const block = getBlock("premium_call_to_action_with_image_carousel");

  assert.ok(block);
  assert.equal(
    block.blockKey,
    premiumCallToActionWithImageCarouselBlockDefinition.blockKey,
  );
  assert.deepEqual(
    mvpBlockDefaults.premium_call_to_action_with_image_carousel,
    premiumCallToActionWithImageCarouselDefaultData,
  );
  assert.equal(premiumCallToActionWithImageCarouselDefaultData.images.length, 6);

  const instance = createDefaultBlockInstance("premium_call_to_action_with_image_carousel", 8);

  assert.equal(instance.id, "premium_call_to_action_with_image_carousel-08");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, premiumCallToActionWithImageCarouselDefaultData);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "premium-catering-preview",
      title: "Premium Catering Preview",
      status: "draft",
    },
    sections: [
      {
        id: "premium-catering-01",
        blockKey: "premium_call_to_action_with_image_carousel",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("premium_call_to_action_with_image_carousel", {
          heading: "Catering wielkanocny",
          description: "Zamow z dostawa lub odbiorem w contained shell zgodnym z Promo2.",
          buttonText: "ZAMOW ONLINE",
          buttonHref: "/catering-wielkanocny",
          images: [
            { src: "/react/images/zupy-catering.jpg", alt: "Zupy catering" },
            { src: "/react/images/sniadanie-wielkanocne.jpg", alt: "Sniadanie wielkanocne" },
            { src: "/react/images/ciasta-catering.jpg", alt: "Ciasta catering" },
            { src: "/react/images/dla-dzieci.jpg", alt: "Menu dla dzieci" },
            { src: "/react/images/chleb-pieczywo.jpg", alt: "Chleb i pieczywo" },
            { src: "/react/images/dania-glowne.jpg", alt: "Dania glowne" },
          ],
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Catering wielkanocny/i);
  assert.match(markup, /ZAMOW ONLINE/);
  assert.match(markup, /max-w-screen-2xl/);
  assert.match(markup, /zupy-catering\.jpg/);
  assert.match(markup, /dania-glowne\.jpg/);
  assert.doesNotMatch(markup, /piers-z-kaczki\.jpg/);
});

test("menu-only page-builder blocks register with stable defaults and practical named variants", () => {
  const justPralaxImage = getBlock("just_pralax_img_horizontal");
  const twoColumnNoHeading = getBlock("menu_two_columns_with_no_heading_no_img");
  const twoColumnHeading = getBlock("menu_two_columns_with_with_heading_no_img");
  const threeColumnHeading = getBlock("menu_three_columns_with_with_heading_no_img");
  const parallaxTwoColumnHeading = getBlock(
    "menu_two_columns_with_with_heading_with_img_fullwidth_paralax",
  );
  const ofertaPostsSection = getBlock("oferta_posts_section");

  assert.ok(justPralaxImage);
  assert.ok(twoColumnNoHeading);
  assert.ok(twoColumnHeading);
  assert.ok(threeColumnHeading);
  assert.ok(parallaxTwoColumnHeading);
  assert.ok(ofertaPostsSection);

  assert.equal(justPralaxImage.variants, undefined);
  assert.deepEqual(twoColumnNoHeading.variants, ["white", "surface", "white-outlined", "inverted"]);
  assert.deepEqual(twoColumnHeading.variants, ["white", "surface", "white-outlined", "inverted"]);
  assert.deepEqual(threeColumnHeading.variants, ["white", "surface", "white-outlined", "inverted"]);
  assert.deepEqual(parallaxTwoColumnHeading.variants, ["white", "surface", "white-outlined", "inverted"]);

  const justPralaxImageInstance = createDefaultBlockInstance("just_pralax_img_horizontal", 6);
  const twoColumnInstance = createDefaultBlockInstance("menu_two_columns_with_no_heading_no_img", 6);
  const twoColumnHeadingInstance = createDefaultBlockInstance("menu_two_columns_with_with_heading_no_img", 7);
  const threeColumnHeadingInstance = createDefaultBlockInstance("menu_three_columns_with_with_heading_no_img", 8);
  const parallaxTwoColumnHeadingInstance = createDefaultBlockInstance(
    "menu_two_columns_with_with_heading_with_img_fullwidth_paralax",
    9,
  );

  assert.equal(justPralaxImageInstance.id, "just_pralax_img_horizontal-06");
  assert.equal(twoColumnInstance.id, "menu_two_columns_with_no_heading_no_img-06");
  assert.equal(twoColumnHeadingInstance.id, "menu_two_columns_with_with_heading_no_img-07");
  assert.equal(threeColumnHeadingInstance.id, "menu_three_columns_with_with_heading_no_img-08");
  assert.equal(
    parallaxTwoColumnHeadingInstance.id,
    "menu_two_columns_with_with_heading_with_img_fullwidth_paralax-09",
  );
  assert.equal(justPralaxImageInstance.variant, null);
  assert.equal(twoColumnInstance.variant, null);
  assert.equal(twoColumnHeadingInstance.variant, null);
  assert.equal(threeColumnHeadingInstance.variant, null);
  assert.equal(parallaxTwoColumnHeadingInstance.variant, null);
});

test("oferta posts section registers stable defaults, validates ordered WordPress post sources, and renders fixed CTA copy", () => {
  const block = getBlock("oferta_posts_section");

  assert.ok(block);
  assert.equal(block.blockKey, ofertaPostsSectionBlockDefinition.blockKey);
  assert.deepEqual(mvpBlockDefaults.oferta_posts_section, ofertaPostsSectionDefaultData);

  const instance = createDefaultBlockInstance("oferta_posts_section", 10);

  assert.equal(instance.id, "oferta_posts_section-10");
  assert.equal(instance.variant, null);
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, ofertaPostsSectionDefaultData);

  const source = validateBlockSource("oferta_posts_section", {
    sourceType: "wordpress_posts",
    sourceValue: [401, 912],
    options: {},
  });

  assert.deepEqual(source, {
    sourceType: "wordpress_posts",
    sourceValue: [401, 912],
    options: {},
  });

  assert.throws(
    () => validateBlockSource("oferta_posts_section", {
      sourceType: "wordpress_posts",
      sourceValue: [],
      options: {},
    }),
    /At least one WordPress post id is required/i,
  );

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "oferta-posts-preview",
      title: "Oferta Posts Preview",
      status: "draft",
    },
    sections: [
      {
        id: "oferta-posts-01",
        blockKey: "oferta_posts_section",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("oferta_posts_section", {
          title: "Nasza Oferta",
          items: [
            {
              image: {
                src: "/react/images/about_1.jpg",
                alt: "Oferta sample image",
              },
              title: "Kolacja degustacyjna",
              description: "Siedem autorskich dan z pairingiem.",
              link: {
                href: "/oferta/kolacja-degustacyjna",
              },
            },
          ],
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Nasza Oferta/);
  assert.match(markup, /Kolacja degustacyjna/);
  assert.match(markup, /Siedem autorskich dan z pairingiem\./);
  assert.match(markup, /Zobacz więcej/);
  assert.match(markup, /href="\/oferta\/kolacja-degustacyjna"/);
});

test("parallax hero menu block registers stable defaults and only accepts woo_category sources", () => {
  const block = getBlock("menu_two_columns_with_with_heading_with_img_fullwidth_paralax");

  assert.ok(block);
  assert.equal(
    block.blockKey,
    menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockDefinition.blockKey,
  );
  assert.deepEqual(
    mvpBlockDefaults.menu_two_columns_with_with_heading_with_img_fullwidth_paralax,
    menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData,
  );

  const source = validateBlockSource(
    "menu_two_columns_with_with_heading_with_img_fullwidth_paralax",
    {
      sourceType: "woo_category",
      sourceValue: "kolacje",
      options: {
        limit: 4,
      },
    },
  );

  assert.deepEqual(source, {
    sourceType: "woo_category",
    sourceValue: "kolacje",
    options: {
      limit: 4,
    },
  });

  assert.throws(
    () => validateBlockSource("menu_two_columns_with_with_heading_with_img_fullwidth_paralax", {
      sourceType: "woo_products",
      sourceValue: [11, 12],
      options: {},
    }),
    /sourceType|woo_category/i,
  );
});

test("standalone menu blocks register Woo category sources and reject unsupported Woo source types", () => {
  const noHeadingSource = validateBlockSource(
    "menu_two_columns_with_no_heading_no_img",
    {
      sourceType: "woo_category",
      sourceValue: "kolacje",
      options: {
        limit: 6,
      },
    },
  );
  const twoColumnHeadingSource = validateBlockSource(
    "menu_two_columns_with_with_heading_no_img",
    {
      sourceType: "woo_category",
      sourceValue: 14,
      options: {
        limit: 4,
      },
    },
  );
  const threeColumnHeadingSource = validateBlockSource(
    "menu_three_columns_with_with_heading_no_img",
    {
      sourceType: "woo_category",
      sourceValue: "desery",
      options: {
        limit: 9,
      },
    },
  );

  assert.deepEqual(noHeadingSource, {
    sourceType: "woo_category",
    sourceValue: "kolacje",
    options: {
      limit: 6,
    },
  });
  assert.deepEqual(twoColumnHeadingSource, {
    sourceType: "woo_category",
    sourceValue: 14,
    options: {
      limit: 4,
    },
  });
  assert.deepEqual(threeColumnHeadingSource, {
    sourceType: "woo_category",
    sourceValue: "desery",
    options: {
      limit: 9,
    },
  });

  assert.throws(
    () => validateBlockSource("menu_two_columns_with_no_heading_no_img", {
      sourceType: "woo_products",
      sourceValue: [11, 12],
      options: {},
    }),
    /sourceType|woo_category/i,
  );

  assert.throws(
    () => validateBlockSource("menu_two_columns_with_with_heading_no_img", {
      sourceType: "woo_products",
      sourceValue: [11, 12],
      options: {},
    }),
    /sourceType|woo_category/i,
  );

  assert.throws(
    () => validateBlockSource("menu_three_columns_with_with_heading_no_img", {
      sourceType: "woo_products",
      sourceValue: [11, 12],
      options: {},
    }),
    /sourceType|woo_category/i,
  );
});

test("menu-only blocks validate named variants while still allowing null", () => {
  const validSchema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "menu-variants",
      title: "Menu Variants",
      status: "published",
    },
    sections: [
      {
        id: "menu-two-col-01",
        blockKey: "menu_two_columns_with_no_heading_no_img",
        blockVersion: 1,
        variant: "surface",
        enabled: true,
        data: validateBlockData("menu_two_columns_with_no_heading_no_img", {
          menuColumns: [
            {
              items: [
                {
                  title: "Spring ravioli",
                  description: "Brown butter, hazelnut",
                  priceLabel: "42 zl",
                },
              ],
            },
            {
              items: [
                {
                  title: "Burnt cheesecake",
                  description: "Cherry, vanilla",
                  priceLabel: "28 zl",
                },
              ],
            },
          ],
          emptyStateText: "Brak pozycji w tej kategorii.",
        }),
        source: null,
        meta: {},
      },
      {
        id: "menu-two-col-02",
        blockKey: "menu_two_columns_with_with_heading_no_img",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("menu_two_columns_with_with_heading_no_img", {
          title: "The Menu",
          menuColumns: [
            {
              items: [
                {
                  title: "Charred cabbage",
                  description: "Apple glaze, dill oil",
                  priceLabel: "36 zl",
                },
              ],
            },
            {
              items: [
                {
                  title: "Smoked trout",
                  description: "Cucumber, cultured cream",
                  priceLabel: "44 zl",
                },
              ],
            },
          ],
          emptyStateText: "Brak pozycji w tej kategorii.",
        }),
        source: null,
        meta: {},
      },
    ],
  });

  assert.equal(validSchema.sections[0]?.variant, "surface");
  assert.equal(validSchema.sections[1]?.variant, null);

  assert.throws(
    () => parsePageBuilderSchema({
      version: 1,
      page: {
        slug: "menu-invalid-variant",
        title: "Menu Invalid Variant",
        status: "draft",
      },
      sections: [
        {
          id: "menu-two-col-invalid",
          blockKey: "menu_two_columns_with_no_heading_no_img",
          blockVersion: 1,
          variant: "pink",
          enabled: true,
          data: validateBlockData("menu_two_columns_with_no_heading_no_img", {
            menuColumns: [],
            emptyStateText: "Brak pozycji w tej kategorii.",
          }),
          source: null,
          meta: {},
        },
      ],
    }),
    /variant/i,
  );
});

test("menu-only blocks render shared menu rows and heading only where required", () => {
  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "menu-preview",
      title: "Menu Preview",
      status: "published",
    },
    sections: [
      {
        id: "menu-two-col-no-heading-01",
        blockKey: "menu_two_columns_with_no_heading_no_img",
        blockVersion: 1,
        variant: "white-outlined",
        enabled: true,
        data: validateBlockData("menu_two_columns_with_no_heading_no_img", {
          menuColumns: [
            {
              items: [
                {
                  title: "Spring asparagus",
                  description: "Brown butter, hazelnut",
                  priceLabel: "42 zl",
                },
              ],
            },
            {
              items: [
                {
                  title: "Burnt cheesecake",
                  description: "Cherry, vanilla",
                  priceLabel: "28 zl",
                },
              ],
            },
          ],
          emptyStateText: "Brak pozycji w tej kategorii.",
        }),
        source: null,
        meta: {},
      },
      {
        id: "menu-three-col-heading-01",
        blockKey: "menu_three_columns_with_with_heading_no_img",
        blockVersion: 1,
        variant: "inverted",
        enabled: true,
        data: validateBlockData("menu_three_columns_with_with_heading_no_img", {
          title: "The Menu",
          menuColumns: [
            {
              items: [
                {
                  title: "Charred cabbage",
                  description: "Apple glaze, dill oil",
                  priceLabel: "36 zl",
                },
              ],
            },
            {
              items: [
                {
                  title: "Smoked trout",
                  description: "Cucumber, cultured cream",
                  priceLabel: "44 zl",
                },
              ],
            },
            {
              items: [
                {
                  title: "Duck ravioli",
                  description: "Burnt orange, sage",
                  priceLabel: "48 zl",
                },
              ],
            },
          ],
          emptyStateText: "Brak pozycji w tej kategorii.",
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Spring asparagus/);
  assert.match(markup, /Brown butter, hazelnut/);
  assert.match(markup, /The Menu/);
  assert.match(markup, /Duck ravioli/);
  assert.match(markup, /white-outlined/);
  assert.match(markup, /inverted/);
});

test("parallax hero menu block renders the image heading above an attached shared menu panel", () => {
  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "menu-parallax-preview",
      title: "Menu Parallax Preview",
      status: "published",
    },
    sections: [
      {
        id: "menu-parallax-01",
        blockKey: "menu_two_columns_with_with_heading_with_img_fullwidth_paralax",
        blockVersion: 1,
        variant: "surface",
        enabled: true,
        data: validateBlockData("menu_two_columns_with_with_heading_with_img_fullwidth_paralax", {
          heroTitle: "Kolacje",
          backgroundImage: {
            src: "/react/images/menu/kolacje-hero.jpg",
            alt: "Kolacje w Bulwarze",
          },
          overlayOpacity: 0.35,
          layout: {
            heroHeight: "420px",
          },
          menuColumns: [
            {
              items: [
                {
                  title: "Stek z kalafiora",
                  description: "Maslo z tymiankiem",
                  priceLabel: "42 zl",
                },
              ],
            },
            {
              items: [
                {
                  title: "Pstrag wedzony",
                  description: "Ogorek, kremowy sos",
                  priceLabel: "44 zl",
                },
              ],
            },
          ],
          emptyStateText: "Brak pozycji w tej kategorii.",
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Kolacje/);
  assert.match(markup, /kolacje-hero\.jpg/);
  assert.match(markup, /rounded-t-\[4px\] rounded-b-none/);
  assert.match(markup, /rounded-t-none rounded-b-\[4px\]/);
  assert.match(markup, /Stek z kalafiora/);
  assert.match(markup, /Pstrag wedzony/);
  assert.match(markup, /data-section-variant="white"/);
});

test("just_pralax_img_horizontal registers stable defaults and renders only the image shell", () => {
  const block = getBlock("just_pralax_img_horizontal");

  assert.ok(block);
  assert.equal(block.blockKey, justPralaxImgHorizontalBlockDefinition.blockKey);
  assert.deepEqual(
    mvpBlockDefaults.just_pralax_img_horizontal,
    justPralaxImgHorizontalDefaultData,
  );

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "just-pralax-preview",
      title: "Just Pralax Preview",
      status: "published",
    },
    sections: [
      {
        id: "just-pralax-01",
        blockKey: "just_pralax_img_horizontal",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("just_pralax_img_horizontal", {
          imageUrl: "/react/images/about_1.jpg",
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /about_1\.jpg/);
  assert.match(markup, /rounded-\[4px\]/);
  assert.doesNotMatch(markup, /Kolacje|Desery|The Menu/);
});

test("universal_multilink_block registers stable defaults and renders schema-driven cards", () => {
  const block = getBlock("universal_multilink_block");

  assert.ok(block);
  assert.equal(block.blockKey, universalMultilinkBlockDefinition.blockKey);
  assert.deepEqual(mvpBlockDefaults.universal_multilink_block, DEFAULT_FEATURE18_CONTENT);

  const instance = createDefaultBlockInstance("universal_multilink_block", 10);

  assert.equal(instance.id, "universal_multilink_block-10");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, DEFAULT_FEATURE18_CONTENT);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "feature18-preview",
      title: "Feature18 Preview",
      status: "published",
    },
    sections: [
      {
        id: "universal-multilink-01",
        blockKey: "universal_multilink_block",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("universal_multilink_block", {
          leftColumn: {
            title: "Karta menu",
            primaryCta: {
              label: "Sprawdz cala karte",
              href: "/menu",
            },
          },
          cards: [
            {
              meta: "08:00 - 12:00",
              title: "Sniadania",
              description: "Pozycje poranne z sezonowymi dodatkami.",
              linkLabel: "Zobacz wiecej",
              linkHref: "/sniadania",
            },
            {
              meta: "12:00 - 22:00",
              title: "Lunch i kolacja",
              description: "Karta glowna restauracji w elastycznym ukladzie kart.",
              linkLabel: "Przejdz do sekcji",
              linkHref: "/menu#lunch",
            },
            {
              meta: "Weekend",
              title: "Desery",
              description: "Sekcja potwierdza, ze liczba kart pochodzi bezposrednio z danych.",
              linkLabel: "Otworz desery",
              linkHref: "/menu#desery",
            },
          ],
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Karta menu/);
  assert.match(markup, /Sprawdz cala karte/);
  assert.match(markup, /Sniadania/);
  assert.match(markup, /Lunch i kolacja/);
  assert.match(markup, /Otworz desery/);
});

test("universal_header_block_1 registers stable defaults and renders direct-edit editorial content", () => {
  const block = getBlock("universal_header_block_1");

  assert.ok(block);
  assert.equal(block.blockKey, universalHeaderBlock1Definition.blockKey);
  assert.deepEqual(mvpBlockDefaults.universal_header_block_1, DEFAULT_PROJECT5C_CONTENT);

  const instance = createDefaultBlockInstance("universal_header_block_1", 11);

  assert.equal(instance.id, "universal_header_block_1-11");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, DEFAULT_PROJECT5C_CONTENT);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "project5c-preview",
      title: "Project5c Preview",
      status: "published",
    },
    sections: [
      {
        id: "universal-header-1-01",
        blockKey: "universal_header_block_1",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("universal_header_block_1", {
          eyebrow: "Karta restauracji",
          title: "Bulwar Degustation",
          description: "Wszystkie tresci tego bloku maja pochodzic bezposrednio z danych strony.",
          links: [
            {
              label: "Menu glowne",
              href: "/menu",
            },
            {
              label: "Menu dla dzieci",
              href: "/menu-dla-dzieci",
            },
          ],
          gallery: {
            primaryImage: {
              src: "/react/images/home_hero.jpg",
              alt: "Glowne ujecie sali restauracyjnej",
            },
            secondaryImage: {
              src: "/react/images/about_1.jpg",
              alt: "Detal stolow i oswietlenia",
            },
          },
          detailSection: {
            title: "Atmosfera",
            body: "Dolna sekcja tez pozostaje content-only i zachowuje istniejacy uklad oraz motion.",
          },
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Bulwar Degustation/);
  assert.match(markup, /Karta restauracji/);
  assert.match(markup, /Menu glowne/);
  assert.match(markup, /Atmosfera/);
  assert.match(markup, /Glowne ujecie sali restauracyjnej/);
});

test("universal_header_block_2 registers stable defaults and renders editable metadata and story rows", () => {
  const block = getBlock("universal_header_block_2");

  assert.ok(block);
  assert.equal(block.blockKey, universalHeaderBlock2Definition.blockKey);
  assert.deepEqual(mvpBlockDefaults.universal_header_block_2, DEFAULT_PROJECT10_CONTENT);

  const instance = createDefaultBlockInstance("universal_header_block_2", 12);

  assert.equal(instance.id, "universal_header_block_2-12");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, DEFAULT_PROJECT10_CONTENT);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "project10-preview",
      title: "Project10 Preview",
      status: "published",
    },
    sections: [
      {
        id: "universal-header-2-01",
        blockKey: "universal_header_block_2",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("universal_header_block_2", {
          eyebrow: "Sesja marki",
          title: "Bulwar Photo Story",
          description: "Header, metadata, CTA i kolejne story rows sa w pelni sterowane przez content props.",
          metadataItems: [
            {
              label: "Kategoria:",
              value: "Przyjecia okolicznosciowe",
            },
            {
              label: "Tel:",
              value: "+48 123 456 789",
            },
          ],
          contactCta: {
            label: "Dostepne terminy:",
            buttonLabel: "wyslij zapytanie",
            href: "/kontakt",
          },
          heroImage: {
            src: "/react/images/home_hero.jpg",
            alt: "Fasada restauracji Bulwar",
          },
          storySections: [
            {
              number: "01.",
              title: "Inspiration.",
              content: "Pierwszy wiersz historii jest w pelni wymienialny z poziomu page schema.",
            },
            {
              number: "02.",
              title: "Execution.",
              content: "Drugi wiersz potwierdza, ze kolekcja sekcji pozostaje bezposrednio edytowalna.",
            },
          ],
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Sesja marki/);
  assert.match(markup, /Dostepne terminy:/);
  assert.match(markup, /wyslij zapytanie/);
  assert.match(markup, /Execution\./);
  assert.match(markup, /Fasada restauracji Bulwar/);
});

test("simple_heading_and_paragraph registers stable defaults and renders sanitized rich-text content", () => {
  const block = getBlock("simple_heading_and_paragraph");

  assert.ok(block);
  assert.equal(block.blockKey, simpleHeadingAndParagraphBlockDefinition.blockKey);
  assert.deepEqual(mvpBlockDefaults.simple_heading_and_paragraph, simpleHeadingAndParagraphDefaultData);

  const instance = createDefaultBlockInstance("simple_heading_and_paragraph", 13);

  assert.equal(instance.id, "simple_heading_and_paragraph-13");
  assert.equal(instance.source, null);
  assert.deepEqual(instance.data, simpleHeadingAndParagraphDefaultData);

  const schema = parsePageBuilderSchema({
    version: 1,
    page: {
      slug: "privacy-preview",
      title: "Privacy Preview",
      status: "published",
    },
    sections: [
      {
        id: "simple-heading-01",
        blockKey: "simple_heading_and_paragraph",
        blockVersion: 1,
        variant: null,
        enabled: true,
        data: validateBlockData("simple_heading_and_paragraph", {
          eyebrow: "Polityka prywatności",
          title: "Jak przetwarzamy dane osobowe",
          richTextHtml:
            "<p><strong>Administrator danych</strong> przetwarza dane zgodnie z obowiazujacymi przepisami.</p><p><em>Zakres danych</em> zalezy od celu kontaktu.<br>Dbamy o przejrzystosc informacji.</p><ul><li>kontakt telefoniczny</li><li>formularz kontaktowy</li></ul><script>alert('x')</script><p><a href=\"/x\">Niedozwolony link</a></p>",
        }),
        source: null,
        meta: {},
      },
    ],
  });

  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <>{renderPageBuilderSections(schema)}</>
    </MemoryRouter>,
  );

  assert.match(markup, /Polityka prywatności/);
  assert.match(markup, /Jak przetwarzamy dane osobowe/);
  assert.match(markup, /<strong>Administrator danych<\/strong>/);
  assert.match(markup, /<em>Zakres danych<\/em>/);
  assert.match(markup, /<li>kontakt telefoniczny<\/li>/);
  assert.doesNotMatch(markup, /<script/i);
  assert.doesNotMatch(markup, /<a href=/i);
});