# Roadmapa SEO / AI Visibility dla Astro + WordPress

> Historyczna roadmapa planistyczna.
> Czesci dotyczace `TEST_PAGE_SLUGS` sa juz nieaktualne, bo Astro korzysta teraz z build-time discovery slugow z WordPress.
> Aktualna procedura operacyjna jest opisana w `docs/plan/astro-wordpress-page-builder/page-builder-authoring-workflow.md`.

## Założenie

Zakładam statyczny build Astro zasilany z WordPressowego `page_builder_schema`, gdzie priorytetem nie jest „więcej meta tagów”, tylko spójny kontrakt danych, poprawne generowanie tras i przewidywalne renderowanie head. W obecnym stanie repo najważniejsze punkty styku to:

- `astro-site/src/layouts/BaseLayout.astro` — dziś renderuje praktycznie tylko `title`, viewport i fonty.
- `astro-site/src/pages/[slug].astro` — dziś generuje trasy z build-time endpointu WordPress, ale nadal nie renderuje pełnego SEO head.
- `astro-site/src/lib/types.ts` — dziś trzyma `seo` jako luźny `record`, więc kontrakt SEO nie jest wymuszony.
- `astro-site/src/lib/wordpress.ts` — już normalizuje `schema.seo`, ale bez silnego kontraktu po stronie typów/renderingu.
- `astro-site/astro.config.mjs` — dziś ma `site` i `base`, ale bez sitemap i bez polityki indeksacji dla stagingu/testów.
- `astro-site/src/lib/config.ts` — nie ogranicza już builda do jednego testowego sluga; problemem pozostaje raczej kontrakt SEO i polityka indeksacji.

## Do zrobienia w 1 dzień

### 1. Uszczelnić integralność migracji WordPress -> Astro

- Doprecyzować kontrakt SEO w `astro-site/src/lib/types.ts`: zamiast `seo: Record<string, unknown>` wprowadzić jawne pola typu `title`, `description`, `canonicalPath` lub `canonicalUrl`, `robots`, `ogImage`, `noindex`.
- Utrzymać normalizację wejścia w `astro-site/src/lib/wordpress.ts`, ale zakończyć ją walidacją tego kontraktu, żeby build psuł się wcześnie, a nie po cichu produkował ubogi head.
- Ustalić, czy `astro-site/astro.config.mjs` z `base: '/astro/'` opisuje staging czy docelowy publiczny URL. Jeśli to staging, canonical i sitemap nie mogą wskazywać ścieżek stagingowych.

### 2. Wyrenderować prawdziwy head na poziomie layoutu

- Rozszerzyć `astro-site/src/layouts/BaseLayout.astro`, aby przyjmował pełny obiekt SEO i renderował co najmniej: `title`, `meta description`, `link rel="canonical"`, `meta robots`, podstawowe Open Graph i Twitter card.
- W `astro-site/src/pages/[slug].astro` zbudować ten obiekt z `page_builder_schema.seo` i przekazać do layoutu zamiast składać tylko `const title = ...`.
- Dodać `link rel="sitemap"` w head po wdrożeniu sitemap, zgodnie z rekomendacją Astro dla `@astrojs/sitemap`.

### 3. Odblokować prawidłowe generowanie tras statycznych

- To zostało już wykonane: Astro korzysta z endpointu WordPress zwracającego listę buildowalnych slugów.
- Dalsza praca w tym obszarze dotyczy już nie discovery samego w sobie, tylko reguł SEO: które buildowalne strony mają trafiać do indeksacji, sitemap i canonical.
- Od razu wyciąć z indeksacji strony testowe, drafty i stagingowe.

### 4. Dodać sitemap i robots

- W `astro-site/astro.config.mjs` dodać integrację `@astrojs/sitemap` i oprzeć ją o poprawne `site`.
- Użyć filtra sitemap, aby nie wpuszczać tras testowych lub `noindex`.
- Dodać `astro-site/src/pages/robots.txt.ts`, żeby dynamicznie wskazywać `Sitemap: .../sitemap-index.xml` i jasno rozdzielić politykę dla produkcji vs stagingu.

### 5. Zamknąć pętlę weryfikacyjną

- Uruchomić `npm run build` w `astro-site/` i sprawdzić wygenerowane HTML dla co najmniej jednej strony pod kątem `title`, `description`, canonical i robots.
- Zweryfikować obecność `sitemap-index.xml`, `sitemap-0.xml` i `robots.txt` w output.
- Ręcznie sprawdzić, czy testowy slug nie trafia do sitemap/canonical produkcyjnego URL, jeśli nadal ma status POC.

## Do zrobienia w 1 tydzień

### 1. Zrobić z SEO pełnoprawną część kontraktu `page_builder_schema`

- Ustalić jedną, stabilną strukturę `seo` w WordPress i Astro zamiast luźnego worka pól. Najlepiej trzymać tam także `schemaType`, `summary`, `lastModified` i politykę indeksacji.
- Rozszerzyć `astro-site/src/lib/types.ts`, `astro-site/src/lib/wordpress.ts` i `astro-site/src/pages/[slug].astro`, tak aby każda opublikowana strona miała ten sam przewidywalny zestaw metadanych.
- Jeżeli część pól ma być obowiązkowa tylko dla publikacji, wymusić to na etapie builda.

### 2. Dodać structured data z danych już istniejących w page builderze

- Dodać osobny mapper, np. `astro-site/src/lib/structuredData.ts`, który buduje JSON-LD zamiast składać go inline w layoutach.
- Na poziomie `astro-site/src/layouts/BaseLayout.astro` lub `astro-site/src/pages/[slug].astro` wyrenderować przynajmniej `Organization` lub `Restaurant` dla serwisu oraz `WebPage` dla każdej strony.
- Dla bloków menu opartych o `menu-category-photo-parallax-full-width` rozważyć `Menu`, `MenuSection` i `MenuItem`, bo to już wynika z istniejących danych sekcji.

### 3. Ustabilizować politykę indeksacji i kanonicznych URL-i

- Rozdzielić staging, testy i produkcję na poziomie configu: `astro-site/astro.config.mjs`, ewentualnie osobne wartości `site/base` dla deploy preview vs produkcji.
- Wprowadzić regułę: tylko strony `published` i bez `noindex` trafiają do `getStaticPaths()`, sitemap i canonical produkcyjnego.
- Dodać ochronę przed duplikacją URL-i, np. kiedy WordPress zwróci slug testowy albo kilka wersji tej samej strony.

### 4. Zautomatyzować weryfikację

- Dodać testy kontraktu dla `astro-site/src/lib/types.ts` i `astro-site/src/lib/wordpress.ts`, żeby błędne SEO payloady nie przechodziły niezauważone.
- Dodać smoke-check dla wygenerowanego HTML, np. sprawdzenie obecności canonical, description i JSON-LD dla przykładowego sluga.
- Dodać checklistę operatorską po buildzie: podgląd HTML, walidacja sitemap, walidacja robots, szybki test Rich Results.

### 5. Dopiero na końcu rozszerzać AI visibility

- Jeśli baza SEO będzie już stabilna, można dodać prosty, jawny `summary` per strona w `page_builder_schema.seo`, który będzie źródłem dla description, Open Graph i ewentualnych przyszłych feedów dla crawlerów AI.
- Nie stawiać `llms.txt` ani podobnych dodatków przed kanonicznym URL, sitemap, robots i JSON-LD. Dla tego projektu większy efekt da spójność kontraktu i renderingu niż kolejny eksperymentalny plik.

## Kolejność realizacji

1. `astro-site/astro.config.mjs` + decyzja o publicznym URL i stagingu.
2. `astro-site/src/lib/types.ts` + `astro-site/src/lib/wordpress.ts` jako kontrakt SEO.
3. `astro-site/src/pages/[slug].astro` jako źródło tras i danych dla head.
4. `astro-site/src/layouts/BaseLayout.astro` jako finalny renderer metadanych.
5. `sitemap`, `robots`, JSON-LD i automatyczna weryfikacja.

## Definicja sukcesu

- Każda opublikowana strona z `page_builder_schema` ma poprawny `title`, `description`, canonical i przewidywalne robots.
- Build Astro generuje wszystkie publiczne slugi, a nie tylko testowy POC.
- Sitemap i robots są zgodne z faktycznym publicznym URL-em.
- JSON-LD wynika z danych strony i bloków, a nie z ręcznie rozproszonej logiki.
- Weryfikacja wykrywa błędny payload SEO przed wdrożeniem.