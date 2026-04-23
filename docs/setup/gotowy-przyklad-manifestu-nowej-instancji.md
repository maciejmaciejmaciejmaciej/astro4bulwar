# Gotowy Przyklad Manifestu Wdrozenia Nowego Klienta

Najpierw podmien wszystkie wartosci przykladowe na dane nowego klienta. Potem idz etapami przez `docs/setup/tabela-zadan-klonowania.md`.

## Uzupelnij te 8 rzeczy najpierw

- [ ] Domena klienta: `https://example.pl`
- [ ] Host SSH: `example-host`
- [ ] User SSH: `deploy@example-host`
- [ ] `public_html`: `/home/klient.dhosting.pl/example.pl/public_html`
- [ ] Katalog backupow Astro: `/home/klient.dhosting.pl/example.pl/backups/astro`
- [ ] URL Fazy wdrozeniowej Astro: `https://example.pl/astro/landing-test-2026/`
- [ ] Finalny URL produkcyjny Astro: `https://example.pl/`
- [ ] Webhook Make: `https://hook.eu2.make.com/TODO-NEW-WEBHOOK`

## 1. Tozsamosc projektu

- Nazwa projektu: `Example Client Deployment`
- Nazwa repo: `example-client-astro`
- Cel w 1 zdaniu: `Wdrozenie nowego klienta w modelu WordPress + React + Astro z dwuetapowym przejsciem od /astro do root domeny.`
- Data startu: `2026-04-21`
- Operator techniczny: `TODO IMIE I NAZWISKO`
- Osoba decyzyjna po stronie biznesu: `TODO WLASCICIEL / MANAGER`

## 2. Model pracy

- Proces ma 2 fazy: `TAK`
- Faza wdrozeniowa konczy sie dzialajacym `https://example.pl/astro/landing-test-2026/`: `TAK`
- Faza produkcyjna wystawia to samo Astro pod `https://example.pl/`: `TAK`
- Workflow repo i agentow po cutoverze zostaje bez zmian: `TAK`

## 3. Faza wdrozeniowa

- Domena glowna klienta: `https://example.pl`
- WordPress backend URL: `https://example.pl`
- React live: `https://example.pl/react/`
- Astro live w Fazie wdrozeniowej: `https://example.pl/astro/landing-test-2026/`
- Nowy slug testowy: `landing-test-2026`
- Czy katalog `/react` jest przygotowany: `TAK`
- Czy katalog `/astro` jest przygotowany: `TAK`
- Czy backupy sa przygotowane: `TAK`

## 4. Faza produkcyjna

- Finalny publiczny URL Astro: `https://example.pl/`
- Czy root domeny przejmuje Astro: `TAK`
- Co dzieje sie z `/astro` po cutoverze: `301 na root` 
- Jak robimy cutover: `routing serwera lub przepiecie DocumentRoot`
- Canonical po produkcji wskazuje root domeny: `TAK`
- Sitemap po produkcji zawiera tylko root domeny: `TAK`
- `/astro` po produkcji nie jest indeksowalne: `TAK`

## 5. Serwer i dostep

- Hosting provider: `dhosting`
- Host SSH: `example-host`
- User SSH: `deploy@example-host`
- Port SSH: `22`
- Lokalny klucz SSH do tej instancji: `C:/Users/operator/.ssh/example_client_ed25519`
- Czy klucz jest nowy dla tej instancji: `TAK`
- Docelowy `public_html`: `/home/klient.dhosting.pl/example.pl/public_html`
- Docelowy katalog React live: `/home/klient.dhosting.pl/example.pl/public_html/react`
- Docelowy katalog Astro live: `/home/klient.dhosting.pl/example.pl/public_html/astro`
- Katalog backupow Astro: `/home/klient.dhosting.pl/example.pl/backups/astro`
- Katalog backupow React: `/home/klient.dhosting.pl/example.pl/backups/react`
- Czy stare klucze i artefakty zostaly usuniete z kopii repo: `TODO TAK / NIE`

## 6. WordPress i WooCommerce

- URL WordPressa: `https://example.pl`
- Czy WordPress juz dziala: `TAK`
- Czy WooCommerce jest aktywny: `TAK`
- Czy plugin `bulwar-bridge` jest wgrany i aktywny: `TAK`
- ID produktu technicznego / special product: `1234`
- Czy import produktow jest potrzebny: `TODO TAK / NIE`
- Czy sync kategorii jest potrzebny: `TODO TAK / NIE`
- Health endpoint: `https://example.pl/wp-json/bulwar/v1/health`

## 7. Bridge i logika dostawy

- `BULWAR_BRIDGE_STORE_ORIGIN_LINE1`: `ul. Przykladowa 10`
- `BULWAR_BRIDGE_STORE_ORIGIN_CITY`: `Warszawa`
- `BULWAR_BRIDGE_STORE_ORIGIN_POSTAL_CODE`: `00-001`
- `BULWAR_BRIDGE_STORE_ORIGIN_COUNTRY`: `PL`
- `BULWAR_BRIDGE_DELIVERY_BASE_FEE`: `9.90`
- `BULWAR_BRIDGE_DELIVERY_PRICE_PER_KM`: `2.50`
- `BULWAR_BRIDGE_FREE_DELIVERY_THRESHOLD`: `250`
- `BULWAR_BRIDGE_TIMEZONE`: `Europe/Warsaw`
- `BULWAR_BRIDGE_SPECIAL_PRODUCT_ID`: `1234`
- `BULWAR_BRIDGE_MAKE_WEBHOOK_URL`: `https://hook.eu2.make.com/TODO-NEW-WEBHOOK`
- Status health endpoint: `TODO success=true / missingRequiredConstants=[]`

## 8. API keys i integracje

- Google Maps API key: `TODO NEW GOOGLE MAPS KEY`
- Glowny webhook Make: `https://hook.eu2.make.com/TODO-NEW-WEBHOOK`
- Testowy webhook Make: `https://hook.eu2.make.com/TODO-TEST-WEBHOOK`
- APP_URL / public app origin: `https://example.pl`
- Inne webhooki: `TODO JESLI SA`
- Inne sekrety lub klucze: `TODO OPISAC, NIE WKLADAC PRAWDZIWYCH WARTOSCI DO REPO`

## 9. Sloty i kalendarz

- Czy `slots.json` kopiujemy czy ukladamy od nowa: `KOPIUJEMY JAKO BAZE, POTEM EDYTUJEMY`
- Data startu pierwszych slotow: `2026-05-01`
- Zakres pierwszej konfiguracji: `2026-05-01 do 2026-06-30`
- Godziny dostaw: `11:00-20:00`
- Godziny odbioru: `11:00-21:00`
- Capacity per slot: `12`
- Blackouty: `2026-05-03, 2026-05-26`
- Overrides / wyjatki: `2026-05-10 tylko odbior osobisty`
- Osoba akceptujaca logike slotow: `TODO MANAGER OPERACYJNY`

## 10. Pliki i skrypty do przepiecia

- Astro config: `astro-site/astro.config.mjs`
- Astro runtime config: `astro-site/src/lib/config.ts`
- React slug strony testowej: `zip/src/pages/TestowaBlueprintPage.tsx`
- React fallback page builder: `zip/src/blocks/registry/fetchWordPressPageBuilderSchema.ts`
- React WordPress API fallback: `zip/src/blocks/registry/wordpressApi.ts`
- React Woo API fallback: `zip/src/blocks/registry/wooStoreApi.ts`
- React checkout / bridge fallback: `zip/components/CheckoutDrawer.tsx`
- Deploy React: `deploy-react.sh`
- Deploy Astro: `SCRIPTS/deploy-astro-static.ps1`
- Rollback Astro: `SCRIPTS/rollback-astro-static.ps1`
- CI Astro: `.github/workflows/deploy-astro-dhosting.yml`
- Sloty bridge: `wordpress-plugin/bulwar-bridge/config/slots.json`
- Skrypty operacyjne do sprawdzenia: `set-bridge-config.sh`, `get_db.js`, `get_settings.js`, `import.php`, `verify-*.sh`, `wpcli-create-test-order.php`, `SCRIPTS/seed-testowa-blueprint-schema.*`, `SCRIPTS/run_upload.js`, `SCRIPTS/upload_products.js`, `SCRIPTS/sync_catering_category.js`

## 11. Globalne find and replace

- Stara domena do usuniecia: `https://old-client.example`
- Nowa domena do wstawienia: `https://example.pl`
- Stary slug do usuniecia: `testowa-blueprint`
- Nowy slug do wstawienia: `landing-test-2026`
- Stare `public_html` do usuniecia: `/home/stary-user/domains/old-client.example/public_html`
- Nowe `public_html` do wstawienia: `/home/klient.dhosting.pl/example.pl/public_html`
- Stary host SSH do usuniecia: `old-host`
- Nowy host SSH do wstawienia: `example-host`
- Stary user SSH do usuniecia: `old-user@old-host`
- Nowy user SSH do wstawienia: `deploy@example-host`

## 12. Bramka po Fazie wdrozeniowej

- Health endpoint ma zwrocic `success=true`
- React live pod `/react` ma dzialac
- Astro live pod `/astro` ma dzialac
- Runtime nie odpytuje starej domeny
- Uprawnienia `755/644` sa poprawione
- Jeden test zamowienia jest wykonany

## 13. Bramka po Fazie produkcyjnej

- Root domeny pokazuje Astro
- Canonical wskazuje root domeny
- Sitemap zawiera tylko root domeny
- `/astro` ma `301` lub `noindex`
- Nie ma drugiego indeksowalnego duplikatu
- Search Console i robots sa zgodne z finalna ekspozycja

## Jak tego uzywac w praktyce

1. Podmien wszystkie wartosci przykladowe na prawdziwe dane klienta.
2. Domknij najpierw Faze wdrozeniowa i doprowadz do dzialajacego `/astro`.
3. Nie przechodz do root domeny, dopoki `/astro` nie jest stabilne.
4. Potem wykonaj Faze produkcyjna i przepnij publiczna ekspozycje na root.
5. Po cutoverze dalej pracuj z repo i agentami tak samo jak przed nim.
