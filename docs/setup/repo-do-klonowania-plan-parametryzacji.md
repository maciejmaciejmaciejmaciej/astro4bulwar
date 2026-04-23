# Plan Parametryzacji Repo Dla Wdrozenia Nowego Klienta

Ten dokument pokazuje, co trzeba przepiac przy wdrozeniu nowego klienta. Nie opisuje juz samego klonowania jako celu, tylko parametry potrzebne do domkniecia Fazy wdrozeniowej i Fazy produkcyjnej.

Primary flow jest teraz bootstrap-first:

- edytujesz `/.env.client.local`
- uruchamiasz `node SCRIPTS/bootstrap-client-config.js --write`
- generated artefacts przepinaja React, Astro, page-builder runtime i local deploy

Lista nizej dalej jest przydatna jako audit surface, ale nie jako rekomendowany pierwszy krok operatora.

## 1. Czego nie wolno przenosic 1:1

- `id_rsa`, `id_rsa.pub`
- `temp_wp_config.php`
- stare lokalne `.env*`

To sa rzeczy starego srodowiska, nie nowego klienta.

## 2. Parametry wspolne dla obu faz

- domena klienta
- slug testowy
- host SSH i user SSH
- `public_html`
- katalogi backupow
- fallbacki runtime do WordPressa i WooCommerce
- konfiguracja bridge i slotow

## 3. Parametry Fazy wdrozeniowej

W Fazie wdrozeniowej przepinasz to, co ma doprowadzic do dzialajacego `domena.pl/astro`.

### Astro

- `astro-site/astro.config.mjs`
- `astro-site/src/lib/config.ts`
- linki i stale URL w komponentach Astro

### React

- `zip/src/pages/TestowaBlueprintPage.tsx`
- `zip/src/App.tsx`
- `zip/src/blocks/registry/fetchWordPressPageBuilderSchema.ts`
- `zip/src/blocks/registry/wordpressApi.ts`
- `zip/src/blocks/registry/wooStoreApi.ts`
- `zip/components/CheckoutDrawer.tsx`

### Deploy i operacje

- `deploy-react.sh`
- `SCRIPTS/deploy-astro-static.ps1`
- `SCRIPTS/rollback-astro-static.ps1`
- `.github/workflows/deploy-astro-dhosting.yml`
- `set-bridge-config.sh`
- `get_db.js`, `get_settings.js`, `import.php`
- `verify-*.sh`
- `wpcli-create-test-order.php`
- `SCRIPTS/seed-testowa-blueprint-schema.*`
- `SCRIPTS/run_upload.js`, `SCRIPTS/upload_products.js`, `SCRIPTS/sync_catering_category.js`

## 4. Parametry Fazy produkcyjnej

W Fazie produkcyjnej przepinasz to, co ma wystawic to samo Astro pod root domeny.

- finalny publiczny URL root
- routing lub vhost dla root domeny
- canonicale na root domene
- sitemap tylko dla root domeny
- `robots.txt` pod finalna ekspozycje
- zachowanie `/astro` po cutoverze: `301` albo `noindex`

## 5. Najwazniejsze zamiany tekstowe w repo

- `https://old-client.example` -> nowa domena klienta
- `testowa-blueprint` -> nowy slug testowy
- stare `public_html` -> nowe `public_html`
- stary host SSH -> nowy host SSH
- stary user SSH -> nowy user SSH

## 6. Kolejnosc prac

1. Parametry wspolne
2. Parametry Fazy wdrozeniowej
3. Deploy do `/astro`
4. Test Fazy wdrozeniowej
5. Parametry Fazy produkcyjnej
6. Cutover na root domeny
7. Test produkcyjny

## 7. Regula dhosting po deployu

Po kazdym deployu wymus prawa:

```bash
find <katalog> -type d -exec chmod 755 {} \;
find <katalog> -type f -exec chmod 644 {} \;
```

Brak tego kroku potrafi skonczyc sie 403 albo biala strona.
