function createAiBlockRegistry(helpers) {
  const {
    assertObject,
    getArray,
    clone,
    getStructuredSource,
  } = helpers;

  function buildMenuBlockContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const source = getStructuredSource(section);
    const backgroundImage = assertObject(data.backgroundImage, `${section.id}.data.backgroundImage`);
    const hasWooSource = Boolean(source && source.sourceType === 'woo_category');

    const content = hasWooSource
      ? {
        backgroundImage: clone(backgroundImage),
        source: clone(source),
        emptyStateText: typeof data.emptyStateText === 'string' ? data.emptyStateText : 'Brak pozycji w tej kategorii.',
      }
      : {
        heroTitle: typeof data.heroTitle === 'string' ? data.heroTitle : '',
        backgroundImage: clone(backgroundImage),
        menuColumns: clone(Array.isArray(data.menuColumns) ? data.menuColumns : []),
        emptyStateText: typeof data.emptyStateText === 'string' ? data.emptyStateText : 'Brak pozycji w tej kategorii.',
      };

    return {
      content,
      hasWooSource,
      heroTitle: typeof data.heroTitle === 'string' ? data.heroTitle : '',
    };
  }

  function buildAbout1Content(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      leftImages: clone(Array.isArray(data.leftImages) ? data.leftImages : []),
      leftText: clone(assertObject(data.leftText, `${section.id}.data.leftText`)),
      rightText: clone(assertObject(data.rightText, `${section.id}.data.rightText`)),
      rightImages: clone(Array.isArray(data.rightImages) ? data.rightImages : []),
    };
  }

  function buildHeroImageContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      imageSrc: typeof data.imageSrc === 'string' ? data.imageSrc : '',
      alt: typeof data.alt === 'string' ? data.alt : '',
    };
  }

  function buildAbout2SimpleContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const image1 = assertObject(data.image1, `${section.id}.data.image1`);
    const image2 = assertObject(data.image2, `${section.id}.data.image2`);

    return {
      title: typeof data.title === 'string' ? data.title : '',
      paragraphs: clone(Array.isArray(data.paragraphs) ? data.paragraphs : []),
      buttonText: typeof data.buttonText === 'string' ? data.buttonText : '',
      buttonLink: typeof data.buttonLink === 'string' ? data.buttonLink : '',
      image1: clone(image1),
      image2: clone(image2),
    };
  }

  function buildSimpleHeadingAndParagraphContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      eyebrow: typeof data.eyebrow === 'string' ? data.eyebrow : '',
      title: typeof data.title === 'string' ? data.title : '',
      richTextHtml: typeof data.richTextHtml === 'string' ? data.richTextHtml : '',
    };
  }

  function buildOurServicesContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const cards = getArray(data.cards, `${section.id}.data.cards`);
    const primaryCta = data.primaryCta && typeof data.primaryCta === 'object' && !Array.isArray(data.primaryCta)
      ? data.primaryCta
      : null;

    return {
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description : '',
      primaryCta: primaryCta ? clone(primaryCta) : null,
      cards: clone(cards),
    };
  }

  function buildRestaurantMenuDrawerTypeContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      intro: clone(assertObject(data.intro, `${section.id}.data.intro`)),
      collections: clone(Array.isArray(data.collections) ? data.collections : []),
    };
  }

  function buildOfferHeroContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      eyebrow: typeof data.eyebrow === 'string' ? data.eyebrow : '',
      titleLines: clone(Array.isArray(data.titleLines) ? data.titleLines : []),
      lead: typeof data.lead === 'string' ? data.lead : '',
      infoItems: clone(Array.isArray(data.infoItems) ? data.infoItems : []),
      mainImage: clone(assertObject(data.mainImage, `${section.id}.data.mainImage`)),
      offerEyebrow: typeof data.offerEyebrow === 'string' ? data.offerEyebrow : '',
      offerTitleLines: clone(Array.isArray(data.offerTitleLines) ? data.offerTitleLines : []),
      offerParagraphs: clone(Array.isArray(data.offerParagraphs) ? data.offerParagraphs : []),
      saleNotice: typeof data.saleNotice === 'string' ? data.saleNotice : '',
      secondaryImages: clone(Array.isArray(data.secondaryImages) ? data.secondaryImages : []),
    };
  }

  function buildTestimonial7Content(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      badge: typeof data.badge === 'string' ? data.badge : '',
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description : '',
      firstRow: clone(Array.isArray(data.firstRow) ? data.firstRow : []),
      secondRow: clone(Array.isArray(data.secondRow) ? data.secondRow : []),
    };
  }

  function buildContact34Content(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      tagline: typeof data.tagline === 'string' ? data.tagline : '',
      title: typeof data.title === 'string' ? data.title : '',
      image: clone(assertObject(data.image, `${section.id}.data.image`)),
      contactItems: clone(Array.isArray(data.contactItems) ? data.contactItems : []),
      form: clone(assertObject(data.form, `${section.id}.data.form`)),
    };
  }

  function buildFeatureGridSectionContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      items: clone(Array.isArray(data.items) ? data.items : []),
    };
  }

  function buildRegionalCuisineContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      titleLines: clone(Array.isArray(data.titleLines) ? data.titleLines : []),
      description: typeof data.description === 'string' ? data.description : '',
      actions: clone(Array.isArray(data.actions) ? data.actions : []),
      image: clone(assertObject(data.image, `${section.id}.data.image`)),
    };
  }

  function buildStoryTeamShowcaseContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const members = getArray(data.members, `${section.id}.data.members`);
    const image = assertObject(data.image, `${section.id}.data.image`);

    return {
      eyebrow: typeof data.eyebrow === 'string' ? data.eyebrow : '',
      title: typeof data.title === 'string' ? data.title : '',
      members: clone(members),
      story: typeof data.story === 'string' ? data.story : '',
      image: clone(image),
    };
  }

  function buildPromo3Content(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const image = assertObject(data.image, `${section.id}.data.image`);

    return {
      title: typeof data.title === 'string' ? data.title : '',
      story: typeof data.story === 'string' ? data.story : '',
      image: clone(image),
    };
  }

  function buildBlockDownloadContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const primaryCta = assertObject(data.primaryCta, `${section.id}.data.primaryCta`);
    const secondaryCta = assertObject(data.secondaryCta, `${section.id}.data.secondaryCta`);

    return {
      title: typeof data.title === 'string' ? data.title : '',
      subtitle: typeof data.subtitle === 'string' ? data.subtitle : '',
      primaryCta: clone(primaryCta),
      secondaryCta: clone(secondaryCta),
      helperText: typeof data.helperText === 'string' ? data.helperText : '',
      versionLabel: typeof data.versionLabel === 'string' ? data.versionLabel : '',
      fileMeta: typeof data.fileMeta === 'string' ? data.fileMeta : '',
      panelCaption: typeof data.panelCaption === 'string' ? data.panelCaption : '',
      features: clone(Array.isArray(data.features) ? data.features : []),
    };
  }

  function buildPremiumCallToActionWithImageCarouselContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);

    return {
      heading: typeof data.heading === 'string' ? data.heading : '',
      description: typeof data.description === 'string' ? data.description : '',
      buttonText: typeof data.buttonText === 'string' ? data.buttonText : '',
      buttonHref: typeof data.buttonHref === 'string' ? data.buttonHref : '',
      images: clone(Array.isArray(data.images) ? data.images : []),
    };
  }

  function buildPromo2Content(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const members = getArray(data.members, `${section.id}.data.members`);
    const image = assertObject(data.image, `${section.id}.data.image`);
    const source = getStructuredSource(section);
    const baseContent = {
      eyebrow: typeof data.eyebrow === 'string' ? data.eyebrow : '',
      title: typeof data.title === 'string' ? data.title : '',
      members: clone(members),
      story: typeof data.story === 'string' ? data.story : '',
      image: clone(image),
      emptyStateText: typeof data.emptyStateText === 'string' ? data.emptyStateText : 'Brak pozycji w tej kategorii.',
    };

    if (source && source.sourceType === 'woo_category') {
      return {
        ...baseContent,
        source: clone(source),
      };
    }

    return {
      ...baseContent,
      menuColumns: clone(Array.isArray(data.menuColumns) ? data.menuColumns : []),
    };
  }

  function buildUniversalMultilinkContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const leftColumn = assertObject(data.leftColumn, `${section.id}.data.leftColumn`);
    const primaryCta = assertObject(leftColumn.primaryCta, `${section.id}.data.leftColumn.primaryCta`);

    return {
      leftColumn: {
        title: typeof leftColumn.title === 'string' ? leftColumn.title : '',
        primaryCta: clone(primaryCta),
      },
      cards: clone(Array.isArray(data.cards) ? data.cards : []),
    };
  }

  function buildUniversalHeaderBlock1Content(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const gallery = assertObject(data.gallery, `${section.id}.data.gallery`);
    const detailSection = assertObject(data.detailSection, `${section.id}.data.detailSection`);

    return {
      eyebrow: typeof data.eyebrow === 'string' ? data.eyebrow : '',
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description : '',
      links: clone(Array.isArray(data.links) ? data.links : []),
      gallery: {
        primaryImage: clone(assertObject(gallery.primaryImage, `${section.id}.data.gallery.primaryImage`)),
        secondaryImage: clone(assertObject(gallery.secondaryImage, `${section.id}.data.gallery.secondaryImage`)),
      },
      detailSection: clone(detailSection),
    };
  }

  function buildUniversalHeaderBlock2Content(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const heroImage = assertObject(data.heroImage, `${section.id}.data.heroImage`);
    const contactCta = data.contactCta && typeof data.contactCta === 'object' && !Array.isArray(data.contactCta)
      ? data.contactCta
      : null;

    return {
      eyebrow: typeof data.eyebrow === 'string' ? data.eyebrow : '',
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description : '',
      metadataItems: clone(Array.isArray(data.metadataItems) ? data.metadataItems : []),
      contactCta: contactCta ? clone(contactCta) : null,
      heroImage: clone(heroImage),
      storySections: clone(Array.isArray(data.storySections) ? data.storySections : []),
    };
  }

  function buildStandaloneMenuPanelContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const source = getStructuredSource(section);

    if (source && (source.sourceType === 'woo_category' || source.sourceType === 'woo_products')) {
      return {
        title: typeof data.title === 'string' ? data.title : null,
        source: clone(source),
        emptyStateText: typeof data.emptyStateText === 'string' ? data.emptyStateText : 'Brak pozycji w tej kategorii.',
        variant: typeof section.variant === 'string' ? section.variant : null,
      };
    }

    return {
      title: typeof data.title === 'string' ? data.title : null,
      menuColumns: clone(Array.isArray(data.menuColumns) ? data.menuColumns : []),
      emptyStateText: typeof data.emptyStateText === 'string' ? data.emptyStateText : 'Brak pozycji w tej kategorii.',
      variant: typeof section.variant === 'string' ? section.variant : null,
    };
  }

  function buildOfertaPostsSectionContent(section) {
    const data = assertObject(section.data, `${section.id}.data`);
    const source = getStructuredSource(section);
    const baseContent = {
      title: typeof data.title === 'string' ? data.title : '',
    };

    if (source && source.sourceType === 'wordpress_posts') {
      return {
        ...baseContent,
        source: clone(source),
      };
    }

    return {
      ...baseContent,
      items: clone(Array.isArray(data.items) ? data.items : []),
    };
  }

  return {
    'gallery-masonry-style1': {
      contentSource: 'page_schema',
      editableFields: [
        'content.title',
        'content.images[].src',
        'content.images[].alt',
      ],
      editRoute: 'Zmiany tytulu i listy zdjec wprowadzaj w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Do wyboru istniejacych obrazow uzywaj narzedzi WordPress media.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        const data = assertObject(section.data, `${section.id}.data`);
        const images = getArray(data.images, `${section.id}.data.images`);

        return {
          content: {
            title: typeof data.title === 'string' ? data.title : '',
            images: clone(images),
          },
        };
      },
    },
    'menu-category-photo-parallax-full-width': {
      contentSource(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'woo_category'
          : 'page_schema';
      },
      editableFields(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? [
            'content.backgroundImage.src',
            'content.backgroundImage.alt',
            'content.source.sourceValue',
            'content.emptyStateText',
          ]
          : [
            'content.heroTitle',
            'content.backgroundImage.src',
            'content.backgroundImage.alt',
            'content.menuColumns',
            'content.emptyStateText',
          ];
      },
      editRoute(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'Zmiana obrazu: narzedzia WordPress media. Zmiana kategorii wyswietlanej przez blok: content.source.sourceValue. Zmiana tresci dan: narzedzia WooCommerce do listowania, edycji, usuwania lub tworzenia produktow w wybranej kategorii.'
          : 'Zmiany tresci sekcji wprowadzaj bezposrednio w page_builder_schema_for_ai i odpowiadajacym page_builder_schema. Nie korzystaj z narzedzi WooCommerce, jesli blok nie ma zrodla Woo.';
      },
      doNotEditDirectly(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? ['content.menuColumns', 'content.heroTitle', 'data.menuColumns']
          : ['layout', 'overlayOpacity', 'meta'];
      },
      build(section) {
        const { content, hasWooSource, heroTitle } = buildMenuBlockContent(section);

        return {
          context: hasWooSource
            ? {
              resolvedHeading: heroTitle,
              presentation: 'Obraz naglowka + nazwa kategorii + lista produktow z kategorii WooCommerce',
              notes: [
                'Hero title jest wyprowadzany z nazwy kategorii WooCommerce, gdy source jest ustawiony.',
                'Ten blok nie wyswietla obrazow produktow.',
              ],
            }
            : {
              resolvedHeading: heroTitle,
              presentation: 'Obraz naglowka + recznie utrzymywana lista pozycji menu',
              notes: ['Ten blok nie wyswietla obrazow produktow.'],
            },
          content,
        };
      },
    },
    'menu_two_columns_with_with_heading_with_img_fullwidth_paralax': {
      contentSource(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'woo_category'
          : 'page_schema';
      },
      editableFields(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? [
            'content.backgroundImage.src',
            'content.backgroundImage.alt',
            'content.source.sourceValue',
            'content.emptyStateText',
            'content.variant',
          ]
          : [
            'content.heroTitle',
            'content.backgroundImage.src',
            'content.backgroundImage.alt',
            'content.menuColumns',
            'content.emptyStateText',
            'content.variant',
          ];
      },
      editRoute(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'Zmiana obrazu hero: narzedzia WordPress media. Zmiana kategorii wyswietlanej przez blok: content.source.sourceValue. Zmiana tresci dan: narzedzia WooCommerce dla produktow w wybranej kategorii. Zmiana wygladu dolnego panelu: content.variant.'
          : 'Zmiany hero, pozycji menu i wariantu kolorystycznego wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Nie korzystaj z WooCommerce, jesli blok nie ma zrodla Woo.';
      },
      doNotEditDirectly(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? ['content.menuColumns', 'content.heroTitle', 'data.menuColumns', 'layout', 'overlayOpacity', 'meta']
          : ['layout', 'overlayOpacity', 'meta'];
      },
      build(section) {
        const { content, hasWooSource, heroTitle } = buildMenuBlockContent(section);

        return {
          context: hasWooSource
            ? {
              resolvedHeading: heroTitle,
              presentation: 'Pelnoszerokosciowy hero + dolaczony dwu-kolumnowy panel menu z WooCommerce',
              notes: [
                'Hero title jest wyprowadzany z nazwy kategorii WooCommerce, gdy source jest ustawiony.',
                'Dolny panel korzysta z shared menu variants przez section.variant.',
              ],
            }
            : {
              resolvedHeading: heroTitle,
              presentation: 'Pelnoszerokosciowy hero + recznie utrzymywany dwu-kolumnowy panel menu',
              notes: ['Dolny panel korzysta z shared menu variants przez section.variant.'],
            },
          content: {
            ...content,
            variant: typeof section.variant === 'string' ? section.variant : null,
          },
        };
      },
    },
    'just_pralax_img_horizontal': {
      contentSource: 'page_schema',
      editableFields: [
        'content.imageUrl',
      ],
      editRoute: 'Zmiane obrazu wykonuj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema przez podmiane content.imageUrl. Do wyboru istniejacego obrazu uzywaj narzedzi WordPress media.',
      doNotEditDirectly: ['layout', 'overlayOpacity', 'meta', 'source'],
      build(section) {
        const data = assertObject(section.data, `${section.id}.data`);

        return {
          content: {
            imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : '',
          },
        };
      },
    },
    'about-1': {
      contentSource: 'page_schema',
      editableFields: [
        'content.leftImages[].src',
        'content.leftImages[].alt',
        'content.leftText.title',
        'content.leftText.paragraphs[]',
        'content.leftText.ctaButton.text',
        'content.leftText.ctaButton.href',
        'content.rightText.paragraphs[]',
        'content.rightImages[].src',
        'content.rightImages[].alt',
      ],
      editRoute: 'Zmiany copy wprowadzaj bezposrednio w page_builder_schema_for_ai i odpowiadajacym page_builder_schema. Gdy trzeba podmienic obrazy, uzywaj narzedzi WordPress media. Link CTA powinien pozostac wewnetrzna sciezka strony Bulwaru.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildAbout1Content(section),
        };
      },
    },
    'about_2_simple': {
      contentSource: 'page_schema',
      editableFields: [
        'content.title',
        'content.paragraphs[]',
        'content.buttonText',
        'content.buttonLink',
        'content.image1.src',
        'content.image1.alt',
        'content.image2.src',
        'content.image2.alt',
      ],
      editRoute: 'Zmiany copy, CTA i obrazow wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Do wyboru nowych obrazow wnetrza uzywaj narzedzi WordPress media. Nie korzystaj z WooCommerce dla tego bloku.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildAbout2SimpleContent(section),
        };
      },
    },
    'simple_heading_and_paragraph': {
      contentSource: 'page_schema',
      editableFields: [
        'content.eyebrow',
        'content.title',
        'content.richTextHtml',
      ],
      editRoute: 'Zmiany naglowka i tresci rich-text HTML wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Blok jest direct-edit only i nie korzysta z WooCommerce ani z zewnetrznego source.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildSimpleHeadingAndParagraphContent(section),
        };
      },
    },
    'our-services': {
      contentSource: 'page_schema',
      editableFields: [
        'content.title',
        'content.description',
        'content.primaryCta.text',
        'content.primaryCta.href',
        'content.cards[].icon',
        'content.cards[].title',
        'content.cards[].description',
        'content.cards[].ctaText',
        'content.cards[].ctaHref',
      ],
      editRoute: 'Zmiany tresci i linkow kart wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Nie korzystaj z narzedzi WooCommerce dla tego bloku.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildOurServicesContent(section),
        };
      },
    },
    'restaurant_menu_drawer_type': {
      contentSource: 'page_schema',
      editableFields: [
        'content.intro.heading',
        'content.intro.description',
        'content.intro.buttonLabel',
        'content.intro.buttonTarget',
        'content.intro.imageUrl',
        'content.intro.imageAlt',
        'content.collections[].visualUrl',
        'content.collections[].collectionTitle',
        'content.collections[].collectionDescription',
        'content.collections[].buttonLabel',
        'content.collections[].wooCategoryIds[]',
      ],
      editRoute: 'Zmiany intro i kolekcji wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Aby zmienic to, co pokazuje drawer, aktualizuj content.collections[].wooCategoryIds albo edytuj produkty WooCommerce we wskazanych kategoriach.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildRestaurantMenuDrawerTypeContent(section),
        };
      },
    },
    offer_hero: {
      contentSource: 'page_schema',
      editableFields: [
        'content.eyebrow',
        'content.titleLines[]',
        'content.lead',
        'content.infoItems[].label',
        'content.infoItems[].value',
        'content.infoItems[].note',
        'content.mainImage.src',
        'content.mainImage.alt',
        'content.offerEyebrow',
        'content.offerTitleLines[]',
        'content.offerParagraphs[]',
        'content.saleNotice',
        'content.secondaryImages[].src',
        'content.secondaryImages[].alt',
      ],
      editRoute: 'Zmiany copy, list linii naglowka oraz obrazow wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Do podmiany obrazow korzystaj z WordPress media.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildOfferHeroContent(section),
        };
      },
    },
    testimonial7: {
      contentSource: 'page_schema',
      editableFields: [
        'content.badge',
        'content.title',
        'content.description',
        'content.firstRow[].name',
        'content.firstRow[].role',
        'content.firstRow[].avatar',
        'content.firstRow[].content',
        'content.secondRow[].name',
        'content.secondRow[].role',
        'content.secondRow[].avatar',
        'content.secondRow[].content',
      ],
      editRoute: 'Zmiany naglowka i kart opinii wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Adresy avatarow utrzymuj jako obrazy z WordPress media lub zaufanych zasobow CDN.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildTestimonial7Content(section),
        };
      },
    },
    contact34: {
      contentSource: 'page_schema',
      editableFields: [
        'content.tagline',
        'content.title',
        'content.image.src',
        'content.image.alt',
        'content.contactItems[].label',
        'content.contactItems[].value',
        'content.contactItems[].href',
        'content.form.nameLabel',
        'content.form.namePlaceholder',
        'content.form.emailLabel',
        'content.form.emailPlaceholder',
        'content.form.messageLabel',
        'content.form.messagePlaceholder',
        'content.form.submitLabel',
      ],
      editRoute: 'Zmiany obrazu, danych kontaktowych i tekstow formularza wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Nie zmieniaj struktury formularza ani geometrii sekcji.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildContact34Content(section),
        };
      },
    },
    feature_grid_section: {
      contentSource: 'page_schema',
      editableFields: [
        'content.items[].icon',
        'content.items[].title',
        'content.items[].description',
      ],
      editRoute: 'Zmiany kart siatki cech wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Icon musi pozostac jednym z dozwolonych kluczy systemowych.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildFeatureGridSectionContent(section),
        };
      },
    },
    regional_cuisine: {
      contentSource: 'page_schema',
      editableFields: [
        'content.titleLines[]',
        'content.description',
        'content.actions[].icon',
        'content.actions[].titleLines[]',
        'content.actions[].description',
        'content.actions[].href',
        'content.actions[].linkLabel',
        'content.image.src',
        'content.image.alt',
      ],
      editRoute: 'Zmiany naglowka, listy akcji i obrazu wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Obraz wybieraj przez WordPress media.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildRegionalCuisineContent(section),
        };
      },
    },
    'universal_multilink_block': {
      contentSource: 'page_schema',
      editableFields: [
        'content.leftColumn.title',
        'content.leftColumn.primaryCta.label',
        'content.leftColumn.primaryCta.href',
        'content.cards[].meta',
        'content.cards[].title',
        'content.cards[].description',
        'content.cards[].linkLabel',
        'content.cards[].linkHref',
      ],
      editRoute: 'Zmiany lewej kolumny, przycisku i kolekcji kart wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Nie korzystaj z WooCommerce dla tego bloku.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildUniversalMultilinkContent(section),
        };
      },
    },
    'universal_header_block_1': {
      contentSource: 'page_schema',
      editableFields: [
        'content.eyebrow',
        'content.title',
        'content.description',
        'content.links[].label',
        'content.links[].href',
        'content.gallery.primaryImage.src',
        'content.gallery.primaryImage.alt',
        'content.gallery.secondaryImage.src',
        'content.gallery.secondaryImage.alt',
        'content.detailSection.title',
        'content.detailSection.body',
      ],
      editRoute: 'Zmiany copy, linkow i obrazow wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Do wyboru obrazow uzywaj narzedzi WordPress media. Nie korzystaj z WooCommerce dla tego bloku.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildUniversalHeaderBlock1Content(section),
        };
      },
    },
    'universal_header_block_2': {
      contentSource: 'page_schema',
      editableFields: [
        'content.eyebrow',
        'content.title',
        'content.description',
        'content.metadataItems[].label',
        'content.metadataItems[].value',
        'content.contactCta.label',
        'content.contactCta.buttonLabel',
        'content.contactCta.href',
        'content.heroImage.src',
        'content.heroImage.alt',
        'content.storySections[].number',
        'content.storySections[].title',
        'content.storySections[].content',
      ],
      editRoute: 'Zmiany copy, metadanych, CTA, obrazu i kolekcji story rows wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Do wyboru obrazow uzywaj narzedzi WordPress media. Nie korzystaj z WooCommerce dla tego bloku.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildUniversalHeaderBlock2Content(section),
        };
      },
    },
    'story-team-showcase': {
      contentSource: 'page_schema',
      editableFields: [
        'content.eyebrow',
        'content.title',
        'content.members[].icon',
        'content.members[].name',
        'content.members[].role',
        'content.story',
        'content.image.src',
        'content.image.alt',
      ],
      editRoute: 'Zmiany copy i listy osob wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Gdy trzeba podmienic obraz, uzywaj narzedzi WordPress media i zaktualizuj content.image.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildStoryTeamShowcaseContent(section),
        };
      },
    },
    'promo3': {
      contentSource: 'page_schema',
      editableFields: [
        'content.title',
        'content.story',
        'content.image.src',
        'content.image.alt',
      ],
      editRoute: 'Zmiany copy i obrazu wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Gdy trzeba podmienic obraz, uzywaj narzedzi WordPress media i zaktualizuj content.image.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildPromo3Content(section),
        };
      },
    },
    'big_img_and_bolded_tex_editorial_style_block': {
      contentSource: 'page_schema',
      editableFields: [
        'content.title',
        'content.story',
        'content.image.src',
        'content.image.alt',
      ],
      editRoute: 'Zmiany copy i obrazu wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Do wyboru obrazow uzywaj narzedzi WordPress media.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildPromo3Content(section),
        };
      },
    },
    'hero_simple_no_text_py32': {
      contentSource: 'page_schema',
      editableFields: [
        'content.imageSrc',
        'content.alt',
      ],
      editRoute: 'Zmiane obrazu wykonuj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema przez aktualizacje content.imageSrc i content.alt. Do wyboru obrazow uzywaj narzedzi WordPress media.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildHeroImageContent(section),
        };
      },
    },
    'hero_simple_no_text_normal_wide': {
      contentSource: 'page_schema',
      editableFields: [
        'content.imageSrc',
        'content.alt',
      ],
      editRoute: 'Zmiane obrazu wykonuj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema przez aktualizacje content.imageSrc i content.alt. Do wyboru obrazow uzywaj narzedzi WordPress media.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildHeroImageContent(section),
        };
      },
    },
    'block_download': {
      contentSource: 'page_schema',
      editableFields: [
        'content.title',
        'content.subtitle',
        'content.primaryCta.label',
        'content.primaryCta.href',
        'content.secondaryCta.label',
        'content.secondaryCta.href',
        'content.helperText',
        'content.versionLabel',
        'content.fileMeta',
        'content.panelCaption',
        'content.features[].icon',
        'content.features[].title',
      ],
      editRoute: 'Zmiany copy, linkow CTA, helper textu oraz listy cech wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Nie korzystaj z WooCommerce dla tego bloku.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildBlockDownloadContent(section),
        };
      },
    },
    'promo2': {
      contentSource(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'woo_category'
          : 'page_schema';
      },
      editableFields(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? [
            'content.eyebrow',
            'content.title',
            'content.members[].icon',
            'content.members[].name',
            'content.members[].role',
            'content.story',
            'content.image.src',
            'content.image.alt',
            'content.source.sourceValue',
            'content.emptyStateText',
          ]
          : [
            'content.eyebrow',
            'content.title',
            'content.members[].icon',
            'content.members[].name',
            'content.members[].role',
            'content.story',
            'content.image.src',
            'content.image.alt',
            'content.menuColumns',
            'content.emptyStateText',
          ];
      },
      editRoute(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'Zmiany copy i obrazu gornej czesci wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Zmiane kategorii menu wykonuj przez content.source.sourceValue. Zmiany tytulow, opisow i cen dan wykonuj przez narzedzia WooCommerce dla produktow w wybranej kategorii.'
          : 'Zmiany tresci calego bloku wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Nie korzystaj z WooCommerce, jesli blok nie ma ustawionego source.';
      },
      doNotEditDirectly(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? ['content.menuColumns', 'data.menuColumns', 'layout', 'meta']
          : ['source', 'meta', 'layout'];
      },
      build(section) {
        return {
          content: buildPromo2Content(section),
        };
      },
    },
    'oferta_posts_section': {
      contentSource(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'wordpress_posts'
          ? 'wordpress_posts'
          : 'page_schema';
      },
      editableFields(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'wordpress_posts'
          ? [
            'content.title',
            'content.source.sourceValue',
          ]
          : [
            'content.title',
            'content.items[].image.src',
            'content.items[].image.alt',
            'content.items[].title',
            'content.items[].description',
            'content.items[].link.href',
          ];
      },
      editRoute(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'wordpress_posts'
          ? 'Zmiany naglowka sekcji wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Kolejnosc i dobor postow zmieniaj przez content.source.sourceValue. Aby zmienic obrazek, tytul, excerpt albo offer_url_link konkretnego wiersza, edytuj odpowiedni post WordPress i jego featured image lub pole custom, zamiast recznie zmieniac content.items.'
          : 'Gdy source jest puste, zmiany naglowka i recznych wierszy wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Tekst przycisku pozostaje staly i nie wymaga pola edycyjnego.';
      },
      doNotEditDirectly(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'wordpress_posts'
          ? ['content.items', 'data.items', 'layout', 'meta']
          : ['source', 'meta', 'layout'];
      },
      build(section) {
        return {
          content: buildOfertaPostsSectionContent(section),
        };
      },
    },
    'premium_call_to_action_with_image_carousel': {
      contentSource: 'page_schema',
      editableFields: [
        'content.heading',
        'content.description',
        'content.buttonText',
        'content.buttonHref',
        'content.images[].src',
        'content.images[].alt',
      ],
      editRoute: 'Zmiany copy, linku CTA i kolekcji obrazow wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Do wyboru obrazow uzywaj narzedzi WordPress media. Nie korzystaj z WooCommerce dla tego bloku.',
      doNotEditDirectly: ['source', 'meta', 'layout'],
      build(section) {
        return {
          content: buildPremiumCallToActionWithImageCarouselContent(section),
        };
      },
    },
    'menu_two_columns_with_no_heading_no_img': {
      contentSource(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'woo_category'
          : 'page_schema';
      },
      editableFields(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? [
            'content.source.sourceValue',
            'content.emptyStateText',
            'content.variant',
          ]
          : [
            'content.menuColumns',
            'content.emptyStateText',
            'content.variant',
          ];
      },
      editRoute(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'Zmiane kategorii menu wykonuj przez content.source.sourceValue. Zmiane nazw, opisow i cen potraw wykonuj przez narzedzia WooCommerce dla produktow w wybranej kategorii. Wariant kolorystyczny dolnego panelu zmieniaj przez content.variant.'
          : 'Zmiany pozycji menu i wariantu kolorystycznego wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Nie korzystaj z WooCommerce dla tego bloku.';
      },
      doNotEditDirectly(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? ['content.menuColumns', 'data.menuColumns', 'layout', 'meta']
          : ['source', 'meta', 'layout'];
      },
      build(section) {
        return {
          content: buildStandaloneMenuPanelContent(section),
        };
      },
    },
    'menu_two_columns_with_with_heading_no_img': {
      contentSource(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'woo_category'
          : 'page_schema';
      },
      editableFields(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? [
            'content.title',
            'content.source.sourceValue',
            'content.emptyStateText',
            'content.variant',
          ]
          : [
            'content.title',
            'content.menuColumns',
            'content.emptyStateText',
            'content.variant',
          ];
      },
      editRoute(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'Zmiane naglowka sekcji wykonuj przez content.title. Zmiane kategorii menu wykonuj przez content.source.sourceValue. Zmiane nazw, opisow i cen potraw wykonuj przez narzedzia WooCommerce dla produktow w wybranej kategorii. Wariant kolorystyczny dolnego panelu zmieniaj przez content.variant.'
          : 'Zmiany naglowka, pozycji menu i wariantu kolorystycznego wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Nie korzystaj z WooCommerce dla tego bloku.';
      },
      doNotEditDirectly(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? ['content.menuColumns', 'data.menuColumns', 'layout', 'meta']
          : ['source', 'meta', 'layout'];
      },
      build(section) {
        return {
          content: buildStandaloneMenuPanelContent(section),
        };
      },
    },
    'menu_three_columns_with_with_heading_no_img': {
      contentSource(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'woo_category'
          : 'page_schema';
      },
      editableFields(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? [
            'content.title',
            'content.source.sourceValue',
            'content.emptyStateText',
            'content.variant',
          ]
          : [
            'content.title',
            'content.menuColumns',
            'content.emptyStateText',
            'content.variant',
          ];
      },
      editRoute(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? 'Zmiane naglowka sekcji wykonuj przez content.title. Zmiane kategorii menu wykonuj przez content.source.sourceValue. Zmiane nazw, opisow i cen potraw wykonuj przez narzedzia WooCommerce dla produktow w wybranej kategorii. Wariant kolorystyczny dolnego panelu zmieniaj przez content.variant.'
          : 'Zmiany naglowka, pozycji menu i wariantu kolorystycznego wprowadzaj bezposrednio w page_builder_schema_for_ai oraz odpowiadajacym page_builder_schema. Nie korzystaj z WooCommerce dla tego bloku.';
      },
      doNotEditDirectly(section) {
        return getStructuredSource(section) && getStructuredSource(section).sourceType === 'woo_category'
          ? ['content.menuColumns', 'data.menuColumns', 'layout', 'meta']
          : ['source', 'meta', 'layout'];
      },
      build(section) {
        return {
          content: buildStandaloneMenuPanelContent(section),
        };
      },
    },
  };
}

module.exports = {
  createAiBlockRegistry,
};