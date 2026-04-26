/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { startTransition, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


import { ProductItem } from "../components/sections/ProductItem";
import { Project5a } from "../components/sections/Project5a";
import { Projects17a } from "../components/sections/Projects17a";
import { RestaurantMenuDrawerType } from "../components/sections/RestaurantMenuDrawerType";
import { About28 } from "../components/sections/About28";
import { NavbarBigSpaceBetweenElements_py32 } from "../components/sections/NavbarBigSpaceBetweenElements_py32";
import {
  about2SimpleBlockDefinition,
  about2SimpleDefaultData,
} from "../blocks/about_2_simple/schema";
import {
  bigImgAndBoldedTexEditorialStyleBlockDefinition,
} from "../blocks/big_img_and_bolded_tex_editorial_style_block/schema";
import {
  blockDownloadBlockDefinition,
  blockDownloadDefaultData,
} from "../blocks/block_download/schema";
import {
  heroSimpleNoTextNormalWideBlockDefinition,
  heroSimpleNoTextNormalWideDefaultData,
} from "../blocks/hero_simple_no_text_normal_wide/schema";
import {
  heroSimpleNoTextPy32BlockDefinition,
  heroSimpleNoTextPy32DefaultData,
} from "../blocks/hero_simple_no_text_py32/schema";
import {
  ofertaPostsSectionBlockDefinition,
  ofertaPostsSectionDefaultData,
} from "../blocks/oferta_posts_section/schema";
import {
  premiumCallToActionWithImageCarouselBlockDefinition,
  premiumCallToActionWithImageCarouselDefaultData,
} from "../blocks/premium_call_to_action_with_image_carousel/schema";
import {
  simpleHeadingAndParagraphBlockDefinition,
  simpleHeadingAndParagraphDefaultData,
} from "../blocks/simple_heading_and_paragraph/schema";
import {
  justPralaxImgHorizontalBlockDefinition,
  justPralaxImgHorizontalDefaultData,
} from "../blocks/just_pralax_img_horizontal/schema";
import {
  menuThreeColumnsWithWithHeadingNoImgBlockDefinition,
  menuThreeColumnsWithWithHeadingNoImgDefaultData,
} from "../blocks/menu_three_columns_with_with_heading_no_img/schema";
import {
  menuTwoColumnsWithNoHeadingNoImgBlockDefinition,
  menuTwoColumnsWithNoHeadingNoImgDefaultData,
} from "../blocks/menu_two_columns_with_no_heading_no_img/schema";
import {
  menuTwoColumnsWithWithHeadingNoImgBlockDefinition,
  menuTwoColumnsWithWithHeadingNoImgDefaultData,
} from "../blocks/menu_two_columns_with_with_heading_no_img/schema";
import {
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockDefinition,
  menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData,
} from "../blocks/menu_two_columns_with_with_heading_with_img_fullwidth_paralax/schema";
import {
  ourServicesBlockDefinition,
  ourServicesDefaultData,
} from "../blocks/our-services/schema";
import {
  promo2BlockDefinition,
  promo2DefaultData,
} from "../blocks/promo2/schema";
import {
  promo3DefaultData,
} from "../blocks/promo3/schema";
import {
  universalHeaderBlock1Definition,
  universalHeaderBlock1DefaultData,
} from "../blocks/universal_header_block_1/schema";
import {
  universalHeaderBlock2Definition,
  universalHeaderBlock2DefaultData,
} from "../blocks/universal_header_block_2/schema";
import {
  universalMultilinkBlockDefinition,
  universalMultilinkBlockDefaultData,
} from "../blocks/universal_multilink_block/schema";
import {
  universalMultilinkBlockSimpleDefinition,
  universalMultilinkBlockSimpleDefaultData,
} from "../blocks/universal_multilink_block_simple/schema";
import type { PageBuilderSchema } from "../blocks/registry/pageBuilderSchema";
import { parsePageBuilderSchema } from "../blocks/registry/pageBuilderSchema";
import { renderPageBuilderSections } from "../blocks/registry/renderPageBuilderSections";
import { resolvePageBuilderSchemaSources } from "../blocks/registry/resolvePageBuilderSources";

const TEMPLATE_PAGE_PREVIEW_SCHEMA = parsePageBuilderSchema({
  version: 1,
  page: {
    slug: "template",
    title: "Template",
    status: "published",
  },
  sections: [
    {
      id: "template-hero-simple-py32-01",
      blockKey: heroSimpleNoTextPy32BlockDefinition.blockKey,
      blockVersion: heroSimpleNoTextPy32BlockDefinition.version,
      variant: null,
      enabled: true,
      data: heroSimpleNoTextPy32DefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-hero-simple-wide-01",
      blockKey: heroSimpleNoTextNormalWideBlockDefinition.blockKey,
      blockVersion: heroSimpleNoTextNormalWideBlockDefinition.version,
      variant: null,
      enabled: true,
      data: heroSimpleNoTextNormalWideDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-about-2-simple-01",
      blockKey: about2SimpleBlockDefinition.blockKey,
      blockVersion: about2SimpleBlockDefinition.version,
      variant: null,
      enabled: true,
      data: about2SimpleDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-promo2-01",
      blockKey: promo2BlockDefinition.blockKey,
      blockVersion: promo2BlockDefinition.version,
      variant: null,
      enabled: true,
      data: promo2DefaultData,
      source: {
        sourceType: "woo_category",
        sourceValue: "swiateczny-obiad",
        options: {
          includeOutOfStock: false,
          limit: 4,
          splitIntoColumns: 2,
        },
      },
      meta: {},
    },
    {
      id: "template-our-services-01",
      blockKey: ourServicesBlockDefinition.blockKey,
      blockVersion: ourServicesBlockDefinition.version,
      variant: null,
      enabled: true,
      data: ourServicesDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-universal-multilink-01",
      blockKey: universalMultilinkBlockDefinition.blockKey,
      blockVersion: universalMultilinkBlockDefinition.version,
      variant: null,
      enabled: true,
      data: universalMultilinkBlockDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-universal-multilink-simple-01",
      blockKey: universalMultilinkBlockSimpleDefinition.blockKey,
      blockVersion: universalMultilinkBlockSimpleDefinition.version,
      variant: null,
      enabled: true,
      data: universalMultilinkBlockSimpleDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-universal-header-1-01",
      blockKey: universalHeaderBlock1Definition.blockKey,
      blockVersion: universalHeaderBlock1Definition.version,
      variant: null,
      enabled: true,
      data: universalHeaderBlock1DefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-universal-header-2-01",
      blockKey: universalHeaderBlock2Definition.blockKey,
      blockVersion: universalHeaderBlock2Definition.version,
      variant: null,
      enabled: true,
      data: universalHeaderBlock2DefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-simple-heading-01",
      blockKey: simpleHeadingAndParagraphBlockDefinition.blockKey,
      blockVersion: simpleHeadingAndParagraphBlockDefinition.version,
      variant: null,
      enabled: true,
      data: simpleHeadingAndParagraphDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-block-download-01",
      blockKey: blockDownloadBlockDefinition.blockKey,
      blockVersion: blockDownloadBlockDefinition.version,
      variant: null,
      enabled: true,
      data: blockDownloadDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-editorial-style-01",
      blockKey: bigImgAndBoldedTexEditorialStyleBlockDefinition.blockKey,
      blockVersion: bigImgAndBoldedTexEditorialStyleBlockDefinition.version,
      variant: null,
      enabled: true,
      data: promo3DefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-menu-two-columns-no-heading-01",
      blockKey: menuTwoColumnsWithNoHeadingNoImgBlockDefinition.blockKey,
      blockVersion: menuTwoColumnsWithNoHeadingNoImgBlockDefinition.version,
      variant: "white",
      enabled: true,
      data: menuTwoColumnsWithNoHeadingNoImgDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-menu-two-columns-no-heading-02",
      blockKey: menuTwoColumnsWithNoHeadingNoImgBlockDefinition.blockKey,
      blockVersion: menuTwoColumnsWithNoHeadingNoImgBlockDefinition.version,
      variant: "surface",
      enabled: true,
      data: menuTwoColumnsWithNoHeadingNoImgDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-menu-two-columns-heading-01",
      blockKey: menuTwoColumnsWithWithHeadingNoImgBlockDefinition.blockKey,
      blockVersion: menuTwoColumnsWithWithHeadingNoImgBlockDefinition.version,
      variant: "white-outlined",
      enabled: true,
      data: menuTwoColumnsWithWithHeadingNoImgDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-menu-two-columns-parallax-01",
      blockKey: menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockDefinition.blockKey,
      blockVersion: menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxBlockDefinition.version,
      variant: "surface",
      enabled: true,
      data: {
        ...menuTwoColumnsWithWithHeadingWithImgFullwidthParalaxDefaultData,
        backgroundImage: {
          src: "/react/images/about_1.jpg",
          alt: "Pelnowymiarowy hero kategorii menu",
        },
      },
      source: {
        sourceType: "woo_category",
        sourceValue: "swiateczny-obiad",
        options: {
          includeOutOfStock: false,
          limit: 4,
        },
      },
      meta: {},
    },
    {
      id: "template-just-pralax-img-horizontal-01",
      blockKey: justPralaxImgHorizontalBlockDefinition.blockKey,
      blockVersion: justPralaxImgHorizontalBlockDefinition.version,
      variant: null,
      enabled: true,
      data: {
        ...justPralaxImgHorizontalDefaultData,
        imageUrl: "/react/images/about_1.jpg",
      },
      source: null,
      meta: {},
    },
    {
      id: "template-menu-three-columns-heading-01",
      blockKey: menuThreeColumnsWithWithHeadingNoImgBlockDefinition.blockKey,
      blockVersion: menuThreeColumnsWithWithHeadingNoImgBlockDefinition.version,
      variant: "inverted",
      enabled: true,
      data: menuThreeColumnsWithWithHeadingNoImgDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-premium-carousel-01",
      blockKey: premiumCallToActionWithImageCarouselBlockDefinition.blockKey,
      blockVersion: premiumCallToActionWithImageCarouselBlockDefinition.version,
      variant: null,
      enabled: true,
      data: premiumCallToActionWithImageCarouselDefaultData,
      source: null,
      meta: {},
    },
    {
      id: "template-oferta-posts-01",
      blockKey: ofertaPostsSectionBlockDefinition.blockKey,
      blockVersion: ofertaPostsSectionBlockDefinition.version,
      variant: null,
      enabled: true,
      data: {
        ...ofertaPostsSectionDefaultData,
        title: "Nasza Oferta",
      },
      source: null,
      meta: {},
    },
  ],
});

export default function TemplatePage() {
  const [previewSchema, setPreviewSchema] = useState<PageBuilderSchema>(TEMPLATE_PAGE_PREVIEW_SCHEMA);
  const [sourceError, setSourceError] = useState<string | null>(null);

  const heroPy32PreviewSchema = {
    ...previewSchema,
    sections: previewSchema.sections.filter((section) => section.id === "template-hero-simple-py32-01"),
  };

  const heroWidePreviewSchema = {
    ...previewSchema,
    sections: previewSchema.sections.filter((section) => section.id === "template-hero-simple-wide-01"),
  };

  const about2PreviewSchema = {
    ...previewSchema,
    sections: previewSchema.sections.filter((section) => section.id === "template-about-2-simple-01"),
  };

  const promoPreviewSchema = {
    ...previewSchema,
    sections: previewSchema.sections.filter((section) => section.id === "template-promo2-01"),
  };

  const ourServicesPreviewSchema = {
    ...previewSchema,
    sections: previewSchema.sections.filter((section) => section.id === "template-our-services-01"),
  };

  const featureHeaderPreviewSchema = {
    ...previewSchema,
    sections: previewSchema.sections.filter((section) => (
      section.id === "template-universal-multilink-01"
      || section.id === "template-universal-multilink-simple-01"
      || section.id === "template-universal-header-1-01"
      || section.id === "template-universal-header-2-01"
    )),
  };

  const ofertaPreviewSchema = {
    ...previewSchema,
    sections: previewSchema.sections.filter((section) => section.id === "template-oferta-posts-01"),
  };

  const remainingPreviewSchema = {
    ...previewSchema,
    sections: previewSchema.sections.filter(
      (section) =>
        section.id !== "template-hero-simple-py32-01"
        && section.id !== "template-hero-simple-wide-01"
        && section.id !== "template-about-2-simple-01"
        && section.id !== "template-promo2-01"
        && section.id !== "template-our-services-01"
        && section.id !== "template-universal-multilink-01"
        && section.id !== "template-universal-multilink-simple-01"
        && section.id !== "template-universal-header-1-01"
        && section.id !== "template-universal-header-2-01"
        && section.id !== "template-oferta-posts-01",
    ),
  };

  useEffect(() => {
    const abortController = new AbortController();

    resolvePageBuilderSchemaSources(TEMPLATE_PAGE_PREVIEW_SCHEMA, abortController.signal)
      .then((resolvedSchema) => {
        startTransition(() => {
          setPreviewSchema(resolvedSchema);
          setSourceError(null);
        });
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) {
          return;
        }

        const message = error instanceof Error
          ? error.message
          : "Nie udało się pobrać danych WooCommerce dla podglądu page buildera.";

        console.error("Failed to resolve TemplatePage preview sources", error);

        startTransition(() => {
          setSourceError(message);
        });
      });

    return () => {
      abortController.abort();
    };
  }, []);

  return (
      <main className="overflow-x-hidden">
        <section className="bg-white py-16 md:py-20">
          <div className="page-margin mb-6 md:mb-8">
            <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              Variant preview
            </p>
          </div>

          <div className="space-y-16 md:space-y-20">
            <div>
              <div className="page-margin mb-5 md:mb-6">
                <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                  NavbarBigSpaceBetweenElements_py32
                </p>
              </div>
              <NavbarBigSpaceBetweenElements_py32 logoSrc="/react/images/logo.png" />
            </div>

            <div>
              <div className="page-margin mb-5 md:mb-6">
                <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                  hero_simple_no_text_py32
                </p>
              </div>
              {renderPageBuilderSections(heroPy32PreviewSchema)}
            </div>

            <div>
              <div className="page-margin mb-5 md:mb-6">
                <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                  hero_simple_no_text_normal_wide
                </p>
              </div>
              {renderPageBuilderSections(heroWidePreviewSchema)}
            </div>
          </div>
        </section>
        {renderPageBuilderSections(about2PreviewSchema)}
        {renderPageBuilderSections(ofertaPreviewSchema)}
        <div>
          <div className="page-margin mb-5 md:mb-6">
            <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              Projects17a
            </p>
          </div>
          <Projects17a />
        </div>
        {renderPageBuilderSections(featureHeaderPreviewSchema)}
        {renderPageBuilderSections(promoPreviewSchema)}
        {renderPageBuilderSections(ourServicesPreviewSchema)}
        <div>
          <div className="page-margin mb-5 md:mb-6">
            <p className="font-label text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              RestaurantMenuDrawerType
            </p>
          </div>
          <RestaurantMenuDrawerType />
        </div>
        {renderPageBuilderSections(remainingPreviewSchema)}
        {sourceError ? (
          <div className="page-margin py-6">
            <p className="font-body text-sm text-zinc-500">{sourceError}</p>
          </div>
        ) : null}

      </main>
  );
}
