# Manifest Wdrozenia Nowego Klienta

Ten plik wypelniasz zanim dotkniesz konfiguracji i skryptow.

Jesli pusty formularz jest za trudny na start, otworz najpierw `docs/setup/gotowy-przyklad-manifestu-nowej-instancji.md` i podmien w nim dane przykladowe na swoje.

## 1. Tozsamosc projektu

- Nazwa projektu:
- Nazwa repo:
- Opis projektu w 1 zdaniu:
- Data startu:
- Osoba odpowiedzialna:

## 2. Model pracy

- Czy proces ma 2 fazy: `TAK / NIE`
- Czy Faza wdrozeniowa konczy sie dzialajacym `domena.pl/astro`: `TAK / NIE`
- Czy Faza produkcyjna ma wystawic to samo Astro pod `domena.pl`: `TAK / NIE`

## 3. Faza wdrozeniowa

- Domena glowna klienta:
- WordPress backend URL:
- React bedzie dostepny pod:
- Astro w Fazie wdrozeniowej bedzie dostepne pod:
- Nowy slug testowy page buildera:
- Czy katalog `/react` jest przygotowany:
- Czy katalog `/astro` jest przygotowany:
- Czy backupy sa przygotowane:

## 4. Faza produkcyjna

- Finalny publiczny URL Astro:
- Czy root domeny przejmuje Astro: `TAK / NIE`
- Co dzieje sie z `/astro` po cutoverze: `301 / noindex / inna decyzja`
- Jak robimy cutover: `routing / vhost / move plikow / inny sposob`
- Czy canonical ma wskazywac root domeny: `TAK / NIE`
- Czy sitemap ma zawierac tylko root domeny: `TAK / NIE`
- Czy `/astro` ma byc zablokowane przed indeksacja po cutoverze: `TAK / NIE`

## 5. Serwer i dostep

- Hosting provider:
- Host SSH:
- User SSH:
- Port SSH, jesli inny niz domyslny:
- Lokalizacja klucza SSH lokalnie:
- Czy klucz jest nowy dla tej instancji:
- Docelowy katalog `public_html`:
- Docelowy katalog React live:
- Docelowy katalog Astro live:
- Katalog backupow Astro:
- Katalog backupow React, jesli bedzie osobny:

## 6. WordPress i WooCommerce

- URL WordPressa:
- Czy WordPress juz dziala:
- Czy WooCommerce jest aktywny:
- Czy plugin `bulwar-bridge` jest aktywny:
- ID produktu technicznego / special product:
- Czy potrzebny jest import produktow:
- Czy potrzebny jest sync kategorii:

## 7. Bridge i logika dostawy

- `BULWAR_BRIDGE_STORE_ORIGIN_LINE1`:
- `BULWAR_BRIDGE_STORE_ORIGIN_CITY`:
- `BULWAR_BRIDGE_STORE_ORIGIN_POSTAL_CODE`:
- `BULWAR_BRIDGE_STORE_ORIGIN_COUNTRY`:
- `BULWAR_BRIDGE_DELIVERY_BASE_FEE`:
- `BULWAR_BRIDGE_DELIVERY_PRICE_PER_KM`:
- `BULWAR_BRIDGE_FREE_DELIVERY_THRESHOLD`:
- `BULWAR_BRIDGE_TIMEZONE`:
- `BULWAR_BRIDGE_MAKE_WEBHOOK_URL`:

## 8. API keys i integracje

- Google Maps API key:
- Gemini API key, jesli potrzebny:
- APP_URL, jesli potrzebny:
- Webhook Make:
- Inne webhooki:
- Inne klucze lub sekrety:

## 9. Sloty i kalendarz

- Czy `slots.json` bedzie kopiowany czy tworzony od nowa:
- Zakres dat startowych:
- Godziny dostaw:
- Godziny odbioru:
- Capacity per slot:
- Dni blackout:
- Wyjatki / overrides:
- Osoba akceptujaca logike slotow:

## 10. Skrypty i pliki do przepiecia

- [ ] `deploy-react.sh`
- [ ] `SCRIPTS/deploy-astro-static.ps1`
- [ ] `SCRIPTS/rollback-astro-static.ps1`
- [ ] `.github/workflows/deploy-astro-dhosting.yml`
- [ ] `astro-site/astro.config.mjs`
- [ ] `astro-site/src/lib/config.ts`
- [ ] `zip/src/pages/TestowaBlueprintPage.tsx`
- [ ] `zip/src/blocks/registry/fetchWordPressPageBuilderSchema.ts`
- [ ] `zip/src/blocks/registry/wordpressApi.ts`
- [ ] `zip/src/blocks/registry/wooStoreApi.ts`
- [ ] `zip/components/CheckoutDrawer.tsx`
- [ ] `wordpress-plugin/bulwar-bridge/config/slots.json`
- [ ] `set-bridge-config.sh`
- [ ] `get_db.js`
- [ ] `get_settings.js`
- [ ] `import.php`
- [ ] `verify-order.sh`
- [ ] `verify-latest-order.sh`
- [ ] `verify-order-item-meta.sh`
- [ ] `verify-order-item-meta-latest.sh`
- [ ] `verify-latest-order-full.sh`
- [ ] `wpcli-create-test-order.php`
- [ ] `SCRIPTS/seed-testowa-blueprint-schema.php`
- [ ] `SCRIPTS/seed-testowa-blueprint-schema.sh`
- [ ] `SCRIPTS/run_upload.js`
- [ ] `SCRIPTS/upload_products.js`
- [ ] `SCRIPTS/sync_catering_category.js`

## 11. Globalne find and replace

- Stara domena do usuniecia:
- Nowa domena do wstawienia:
- Stary slug do usuniecia:
- Nowy slug do wstawienia:
- Stare `public_html` do usuniecia:
- Nowe `public_html` do wstawienia:
- Stary host SSH do usuniecia:
- Nowy host SSH do wstawienia:
- Stary user SSH do usuniecia:
- Nowy user SSH do wstawienia:

## 12. Bramka po Fazie wdrozeniowej

- Health endpoint dziala:
- React live dziala:
- Astro live pod `/astro` dziala:
- Uprawnienia `755/644` poprawione:
- 1 test zamowienia wykonany:
- Manualny proof przed CI:

## 13. Bramka po Fazie produkcyjnej

- Root domeny pokazuje Astro:
- Canonicale wskazuja root domeny:
- Sitemap zawiera root domeny:
- `/astro` nie jest drugim indeksowalnym duplikatem:
- Redirecty lub noindex dla `/astro` sa ustawione:
- Search Console i robots sa zgodne z finalna ekspozycja:

## 14. Decyzja startowa

- Czy klient jest gotowy do Fazy wdrozeniowej:
- Czy klient jest gotowy do Fazy produkcyjnej:
- Co jeszcze blokuje deploy:
- Kto zatwierdza start:
- Data zatwierdzenia:
