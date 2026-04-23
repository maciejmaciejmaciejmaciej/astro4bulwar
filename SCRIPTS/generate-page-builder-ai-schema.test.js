const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const generatorPath = path.resolve(__dirname, 'generate-page-builder-ai-schema.js');

test('AI schema generator supports about-1 and our-services with stable ids', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bulwar-ai-schema-'));
  const inputPath = path.join(tempDir, 'testowa-blueprint.page_builder_schema.json');
  const outputPath = path.join(tempDir, 'testowa-blueprint.page_builder_schema_for_ai.json');

  fs.writeFileSync(
    inputPath,
    `${JSON.stringify({
      version: 1,
      page: {
        slug: 'testowa-blueprint',
        title: 'Testowa Blueprint',
        status: 'published',
        templateKey: 'blueprint-test-page',
      },
      sections: [
        {
          id: 'about-1-01',
          blockKey: 'about-1',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            leftImages: [
              {
                src: '/react/images/about/bulwar-o-nas-1.webp',
                alt: 'Sala restauracyjna Bulwar',
              },
            ],
            leftText: {
              title: 'Bulwar nad Wisla',
              paragraphs: ['Opowiesc o restauracji i atmosferze miejsca.'],
              ctaButton: {
                href: '/kontakt',
                text: 'Zobacz kontakt',
              },
            },
            rightText: {
              paragraphs: ['Wewnetrzny route pozostaje czescia pagebuildera.'],
            },
            rightImages: [
              {
                src: '/react/images/about/bulwar-o-nas-2.webp',
                alt: 'Detal wnetrza restauracji',
              },
            ],
          },
          source: null,
          meta: {
            ai: {
              description: 'Sekcja wprowadza historie restauracji i prowadzi do podstrony kontaktowej.',
            },
          },
        },
        {
          id: 'our-services-01',
          blockKey: 'our-services',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            title: 'Nasze uslugi',
            description: 'Przekroj uslug Bulwaru dla eventow i spotkan.',
            primaryCta: {
              text: 'Poznaj cala oferte',
              href: '/oferta',
            },
            cards: [
              {
                icon: 'celebration',
                title: 'PRZYJECIA OKOLICZNOSCIOWE',
                description: 'Kompleksowa oprawa przyjec prywatnych i firmowych.',
                ctaText: 'Zobacz szczegoly',
                ctaHref: '/przyjecia-okolicznosciowe',
              },
            ],
          },
          source: null,
          meta: {
            ai: {
              description: 'Sekcja zbiera przeglad uslug eventowych i kieruje do pelnej oferty.',
            },
          },
        },
      ],
    }, null, 2)}\n`,
    'utf8',
  );

  execFileSync(process.execPath, [generatorPath, '--input', inputPath, '--output', outputPath, '--post-id', '118'], {
    stdio: 'pipe',
  });

  const output = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

  assert.equal(output.postId, 118);
  assert.deepEqual(
    output.blocks.map((block) => ({ id: block.id, blockKey: block.blockKey })),
    [
      { id: 'about-1-01', blockKey: 'about-1' },
      { id: 'our-services-01', blockKey: 'our-services' },
    ],
  );
  assert.equal(output.blocks[0].content.leftText.ctaButton.href, '/kontakt');
  assert.equal(output.blocks[1].content.primaryCta.href, '/oferta');
  assert.equal(output.blocks[0].description, 'Sekcja wprowadza historie restauracji i prowadzi do podstrony kontaktowej.');
  assert.equal(output.blocks[1].description, 'Sekcja zbiera przeglad uslug eventowych i kieruje do pelnej oferty.');
});

test('AI schema generator supports the standalone menu panel blocks and keeps section variants editable', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bulwar-ai-menu-schema-'));
  const inputPath = path.join(tempDir, 'menu-panels.page_builder_schema.json');
  const outputPath = path.join(tempDir, 'menu-panels.page_builder_schema_for_ai.json');

  fs.writeFileSync(
    inputPath,
    `${JSON.stringify({
      version: 1,
      page: {
        slug: 'menu-panels',
        title: 'Menu Panels',
        status: 'draft',
      },
      sections: [
        {
          id: 'menu-two-columns-01',
          blockKey: 'menu_two_columns_with_no_heading_no_img',
          blockVersion: 1,
          variant: 'surface',
          enabled: true,
          data: {
            menuColumns: [
              {
                items: [
                  {
                    title: 'Spring asparagus',
                    description: 'Brown butter, hazelnut',
                    priceLabel: '42 zl',
                  },
                ],
              },
              {
                items: [
                  {
                    title: 'Burnt cheesecake',
                    description: 'Cherry, vanilla',
                    priceLabel: '28 zl',
                  },
                ],
              },
            ],
            emptyStateText: 'Brak pozycji w tej kategorii.',
          },
          source: null,
          meta: {},
        },
        {
          id: 'menu-three-columns-01',
          blockKey: 'menu_three_columns_with_with_heading_no_img',
          blockVersion: 1,
          variant: 'inverted',
          enabled: true,
          data: {
            title: 'The Menu',
            menuColumns: [
              {
                items: [
                  {
                    title: 'Charred cabbage',
                    description: 'Apple glaze, dill oil',
                    priceLabel: '36 zl',
                  },
                ],
              },
              {
                items: [
                  {
                    title: 'Smoked trout',
                    description: 'Cucumber, cultured cream',
                    priceLabel: '44 zl',
                  },
                ],
              },
              {
                items: [
                  {
                    title: 'Duck ravioli',
                    description: 'Burnt orange, sage',
                    priceLabel: '48 zl',
                  },
                ],
              },
            ],
            emptyStateText: 'Brak pozycji w tej kategorii.',
          },
          source: null,
          meta: {},
        },
      ],
    }, null, 2)}\n`,
    'utf8',
  );

  execFileSync(process.execPath, [generatorPath, '--input', inputPath, '--output', outputPath], {
    stdio: 'pipe',
  });

  const output = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

  assert.deepEqual(
    output.blocks.map((block) => ({ id: block.id, blockKey: block.blockKey, variant: block.variant })),
    [
      {
        id: 'menu-two-columns-01',
        blockKey: 'menu_two_columns_with_no_heading_no_img',
        variant: 'surface',
      },
      {
        id: 'menu-three-columns-01',
        blockKey: 'menu_three_columns_with_with_heading_no_img',
        variant: 'inverted',
      },
    ],
  );
  assert.deepEqual(output.blocks[0].content.variant, 'surface');
  assert.equal(output.blocks[0].content.title, null);
  assert.equal(output.blocks[1].content.title, 'The Menu');
  assert.equal(
    output.blocks[1].description,
    'Instancja bloku menu_three_columns_with_with_heading_no_img bez opisu AI. Edytuj tylko pola wskazane przez editableFields i respektuj contentSource oraz doNotEditDirectly.',
  );
  assert.ok(output.blocks[1].editableFields.includes('content.variant'));
});

test('AI schema generator supports the new direct-edit download, editorial, and premium carousel blocks', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bulwar-ai-direct-edit-'));
  const inputPath = path.join(tempDir, 'direct-edit.page_builder_schema.json');
  const outputPath = path.join(tempDir, 'direct-edit.page_builder_schema_for_ai.json');

  fs.writeFileSync(
    inputPath,
    `${JSON.stringify({
      version: 1,
      page: {
        slug: 'direct-edit-preview',
        title: 'Direct Edit Preview',
        status: 'draft',
      },
      sections: [
        {
          id: 'block-download-01',
          blockKey: 'block_download',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            title: 'Pakiet bankietowy',
            subtitle: 'Pobierz wersje PDF przygotowana dla eventow premium.',
            primaryCta: {
              label: 'Pobierz pakiet',
              href: '/pdf/premium.pdf',
            },
            secondaryCta: {
              label: 'Zobacz online',
              href: '/menu-okolicznosciowe-premium',
            },
            helperText: 'PDF gotowy do wysylki klientom',
            versionLabel: 'PDF PRO',
            fileMeta: '4.1 MB',
            panelCaption: 'Rozszerzona oferta dla wydarzen premium',
            features: [
              {
                icon: 'events',
                title: 'Rozbudowane propozycje dla gali i jubileuszy',
              },
            ],
          },
          source: null,
          meta: {},
        },
        {
          id: 'editorial-style-01',
          blockKey: 'big_img_and_bolded_tex_editorial_style_block',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            title: 'Editorial portrait',
            story: 'One tall image and one bold editorial text block.',
            image: {
              src: '/react/images/editorial.jpg',
              alt: 'Editorial portrait image',
            },
          },
          source: null,
          meta: {},
        },
        {
          id: 'premium-catering-01',
          blockKey: 'premium_call_to_action_with_image_carousel',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            heading: 'Catering wielkanocny',
            description: 'Contained direct-edit CTA with six carousel images.',
            buttonText: 'ZAMOW ONLINE',
            buttonHref: '/catering-wielkanocny',
            images: [
              { src: '/react/images/1.jpg', alt: 'Obraz 1' },
              { src: '/react/images/2.jpg', alt: 'Obraz 2' },
              { src: '/react/images/3.jpg', alt: 'Obraz 3' },
              { src: '/react/images/4.jpg', alt: 'Obraz 4' },
              { src: '/react/images/5.jpg', alt: 'Obraz 5' },
              { src: '/react/images/6.jpg', alt: 'Obraz 6' },
            ],
          },
          source: null,
          meta: {},
        },
      ],
    }, null, 2)}\n`,
    'utf8',
  );

  execFileSync(process.execPath, [generatorPath, '--input', inputPath, '--output', outputPath], {
    stdio: 'pipe',
  });

  const output = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

  assert.deepEqual(
    output.blocks.map((block) => ({ id: block.id, blockKey: block.blockKey })),
    [
      { id: 'block-download-01', blockKey: 'block_download' },
      {
        id: 'editorial-style-01',
        blockKey: 'big_img_and_bolded_tex_editorial_style_block',
      },
      {
        id: 'premium-catering-01',
        blockKey: 'premium_call_to_action_with_image_carousel',
      },
    ],
  );
  assert.ok(output.blocks[0].editableFields.includes('content.secondaryCta.label'));
  assert.ok(output.blocks[0].editableFields.includes('content.helperText'));
  assert.ok(output.blocks[1].editableFields.includes('content.story'));
  assert.ok(output.blocks[2].editableFields.includes('content.images[].src'));
  assert.ok(output.blocks[2].editableFields.includes('content.images[].alt'));
  assert.equal(output.blocks[2].content.images.length, 6);
});

test('AI schema generator supports the new direct-edit hero and about blocks', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bulwar-ai-hero-about-'));
  const inputPath = path.join(tempDir, 'hero-about.page_builder_schema.json');
  const outputPath = path.join(tempDir, 'hero-about.page_builder_schema_for_ai.json');

  fs.writeFileSync(
    inputPath,
    `${JSON.stringify({
      version: 1,
      page: {
        slug: 'hero-about-preview',
        title: 'Hero About Preview',
        status: 'draft',
      },
      sections: [
        {
          id: 'hero-py32-01',
          blockKey: 'hero_simple_no_text_py32',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            imageSrc: '/react/images/home_hero.jpg',
            alt: 'Hero preview py32',
          },
          source: null,
          meta: {},
        },
        {
          id: 'hero-wide-01',
          blockKey: 'hero_simple_no_text_normal_wide',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            imageSrc: '/react/images/home_hero.jpg',
            alt: 'Hero preview wide',
          },
          source: null,
          meta: {},
        },
        {
          id: 'about-2-simple-01',
          blockKey: 'about_2_simple',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            title: 'O restauracji',
            paragraphs: [
              'Od 2011 roku prowadzimy restauracje z autorska kuchnia.',
              'Z przyjemnoscia ugoscimy Panstwa na lunchu i kolacji.',
            ],
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
      ],
    }, null, 2)}\n`,
    'utf8',
  );

  execFileSync(process.execPath, [generatorPath, '--input', inputPath, '--output', outputPath], {
    stdio: 'pipe',
  });

  const output = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

  assert.deepEqual(
    output.blocks.map((block) => ({ id: block.id, blockKey: block.blockKey })),
    [
      { id: 'hero-py32-01', blockKey: 'hero_simple_no_text_py32' },
      { id: 'hero-wide-01', blockKey: 'hero_simple_no_text_normal_wide' },
      { id: 'about-2-simple-01', blockKey: 'about_2_simple' },
    ],
  );
  assert.ok(output.blocks[0].editableFields.includes('content.imageSrc'));
  assert.ok(output.blocks[0].editableFields.includes('content.alt'));
  assert.ok(output.blocks[1].editableFields.includes('content.imageSrc'));
  assert.ok(output.blocks[2].editableFields.includes('content.paragraphs[]'));
  assert.ok(output.blocks[2].editableFields.includes('content.image1.src'));
  assert.ok(output.blocks[2].editableFields.includes('content.image2.alt'));
  assert.equal(
    output.blocks[2].description,
    'Instancja bloku about_2_simple bez opisu AI. Edytuj tylko pola wskazane przez editableFields i respektuj contentSource oraz doNotEditDirectly.',
  );
});

test('AI schema generator supports the simple heading and paragraph direct-edit block', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bulwar-ai-simple-heading-'));
  const inputPath = path.join(tempDir, 'simple-heading.page_builder_schema.json');
  const outputPath = path.join(tempDir, 'simple-heading.page_builder_schema_for_ai.json');

  fs.writeFileSync(
    inputPath,
    `${JSON.stringify({
      version: 1,
      page: {
        slug: 'polityka-prywatnosci',
        title: 'Polityka prywatnosci',
        status: 'draft',
      },
      sections: [
        {
          id: 'simple-heading-01',
          blockKey: 'simple_heading_and_paragraph',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            eyebrow: 'Polityka prywatności',
            title: 'Jak przetwarzamy dane osobowe',
            richTextHtml: '<p><strong>Administrator danych</strong> przetwarza dane zgodnie z przepisami.</p><ul><li>kontakt telefoniczny</li></ul>',
          },
          source: null,
          meta: {},
        },
      ],
    }, null, 2)}\n`,
    'utf8',
  );

  execFileSync(process.execPath, [generatorPath, '--input', inputPath, '--output', outputPath], {
    stdio: 'pipe',
  });

  const output = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

  assert.deepEqual(
    output.blocks.map((block) => ({ id: block.id, blockKey: block.blockKey })),
    [{ id: 'simple-heading-01', blockKey: 'simple_heading_and_paragraph' }],
  );
  assert.equal(output.blocks[0].content.eyebrow, 'Polityka prywatności');
  assert.ok(output.blocks[0].editableFields.includes('content.eyebrow'));
  assert.ok(output.blocks[0].editableFields.includes('content.title'));
  assert.ok(output.blocks[0].editableFields.includes('content.richTextHtml'));
  assert.equal(
    output.blocks[0].description,
    'Instancja bloku simple_heading_and_paragraph bez opisu AI. Edytuj tylko pola wskazane przez editableFields i respektuj contentSource oraz doNotEditDirectly.',
  );
});

test('AI schema generator falls back safely for a new block without a dedicated descriptor', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bulwar-ai-generic-fallback-'));
  const inputPath = path.join(tempDir, 'generic-fallback.page_builder_schema.json');
  const outputPath = path.join(tempDir, 'generic-fallback.page_builder_schema_for_ai.json');

  fs.writeFileSync(
    inputPath,
    `${JSON.stringify({
      version: 1,
      page: {
        slug: 'generic-fallback',
        title: 'Generic Fallback',
        status: 'draft',
      },
      sections: [
        {
          id: 'future-block-01',
          blockKey: 'future_registry_block',
          blockVersion: 1,
          variant: 'surface',
          enabled: true,
          data: {
            title: 'Future block title',
            emptyStateText: 'Brak danych.',
            menuColumns: [
              {
                items: [
                  {
                    title: 'Should stay source-backed',
                    priceLabel: '99 zl',
                  },
                ],
              },
            ],
          },
          source: {
            sourceType: 'woo_category',
            sourceValue: 'future-category',
            options: {
              splitIntoColumns: 2,
            },
          },
          meta: {},
        },
      ],
    }, null, 2)}\n`,
    'utf8',
  );

  execFileSync(process.execPath, [generatorPath, '--input', inputPath, '--output', outputPath], {
    stdio: 'pipe',
  });

  const output = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

  assert.equal(output.blocks[0].blockKey, 'future_registry_block');
  assert.equal(output.blocks[0].contentSource, 'woo_category');
  assert.equal(output.blocks[0].content.source.sourceValue, 'future-category');
  assert.ok(output.blocks[0].editableFields.includes('content.source.sourceValue'));
  assert.ok(output.blocks[0].doNotEditDirectly.includes('content.data.menuColumns'));
  assert.equal(
    output.blocks[0].description,
    'Instancja bloku future_registry_block nie ma dedykowanego descriptora AI. Edytuj tylko pola wskazane przez editableFields i respektuj contentSource oraz doNotEditDirectly.',
  );
});

test('AI schema generator reads block description from section meta.ai.description', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bulwar-ai-instance-description-'));
  const inputPath = path.join(tempDir, 'instance-description.page_builder_schema.json');
  const outputPath = path.join(tempDir, 'instance-description.page_builder_schema_for_ai.json');

  fs.writeFileSync(
    inputPath,
    `${JSON.stringify({
      version: 1,
      page: {
        slug: 'instance-description',
        title: 'Instance Description',
        status: 'draft',
      },
      sections: [
        {
          id: 'block-download-01',
          blockKey: 'block_download',
          blockVersion: 1,
          variant: null,
          enabled: true,
          data: {
            title: 'Pakiet bankietowy',
            subtitle: 'Pobierz wersje PDF przygotowana dla eventow premium.',
            primaryCta: {
              label: 'Pobierz pakiet',
              href: '/pdf/premium.pdf',
            },
            secondaryCta: {
              label: 'Zobacz online',
              href: '/menu-okolicznosciowe-premium',
            },
            helperText: 'PDF gotowy do wysylki klientom',
            versionLabel: 'PDF PRO',
            fileMeta: '4.1 MB',
            panelCaption: 'Rozszerzona oferta dla wydarzen premium',
            features: [],
          },
          source: null,
          meta: {
            ai: {
              description: 'Sekcja udostepnia PDF oferty premium do pobrania z dwoma CTA.',
            },
          },
        },
      ],
    }, null, 2)}\n`,
    'utf8',
  );

  execFileSync(process.execPath, [generatorPath, '--input', inputPath, '--output', outputPath], {
    stdio: 'pipe',
  });

  const output = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

  assert.equal(output.blocks[0].description, 'Sekcja udostepnia PDF oferty premium do pobrania z dwoma CTA.');
});