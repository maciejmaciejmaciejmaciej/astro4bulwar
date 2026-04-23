# Bootstrap Nowego Klienta

To jest teraz glowny workflow przygotowania repo pod nowego klienta.

Nie zaczynasz od recznego find-and-replace po repo.
Zaczynasz od jednego lokalnego pliku klienta, a potem generujesz wszystkie potrzebne artefakty.

## 1. Co edytujesz recznie

Edytowalny input jest jeden:

- `/.env.client.local` — lokalny, gitignored source of truth dla klienta

Tworzysz go przez skopiowanie:

- `/.env.client.example` -> `/.env.client.local`

## 2. Gdzie trzymasz credentials lokalnie

### dhosting SSH

- `./id_rsa`
- plik jest gitignored
- skrypty PowerShell czytaja jego sciezke z `CLIENT_SSH_KEY_PATH` w `.env.client.local`
- domyslnie mozesz zostawic `./id_rsa`

### WordPress + Firebase do page buildera

Trzymasz je w `/.env.client.local`:

- `CLIENT_PAGE_BUILDER_WORDPRESS_USERNAME`
- `CLIENT_PAGE_BUILDER_WORDPRESS_APPLICATION_PASSWORD`
- `CLIENT_FIREBASE_PROJECT_ID`
- `CLIENT_FIREBASE_CLIENT_EMAIL`
- `CLIENT_FIREBASE_PRIVATE_KEY`

Runtime page-builder dostaje z tego wygenerowany plik:

- `/.env.page-builder.local`

Nie edytujesz go recznie.

### Bridge WordPressa

Bridge stale nie sa trzymane jako tracked sekret w repo.
Trzymasz je w `/.env.client.local`, a skrypt `set-bridge-config.sh` wstrzykuje je do docelowego `wp-config.php`.

Najwazniejsze pola:

- `CLIENT_BRIDGE_GOOGLE_MAPS_API_KEY`
- `CLIENT_BRIDGE_STORE_ORIGIN_LINE1`
- `CLIENT_BRIDGE_STORE_ORIGIN_CITY`
- `CLIENT_BRIDGE_STORE_ORIGIN_POSTAL_CODE`
- `CLIENT_BRIDGE_STORE_ORIGIN_COUNTRY`
- `CLIENT_BRIDGE_DELIVERY_BASE_FEE`
- `CLIENT_BRIDGE_DELIVERY_PRICE_PER_KM`
- `CLIENT_BRIDGE_FREE_DELIVERY_THRESHOLD`
- `CLIENT_BRIDGE_TIMEZONE`
- `CLIENT_BRIDGE_SPECIAL_PRODUCT_ID`
- `CLIENT_BRIDGE_MAKE_WEBHOOK_URL`

## 3. Co generujesz z bootstrapa

Po uruchomieniu:

```bash
node SCRIPTS/bootstrap-client-config.js --write
```

powstaja:

- `/.env.page-builder.local`
- `/.client.generated.env`
- `/zip/.env.local`
- `/astro-site/.env.local`

Te pliki sa artefaktami lokalnymi. Nie sa source of truth.

## 4. Standardowy flow nowego klienta

1. Skopiuj `/.env.client.example` do `/.env.client.local`.
2. Wpisz domene klienta, WordPress URL, SSH host/user, sciezki zdalne i credentials.
3. Wrzuc lokalny klucz SSH do `./id_rsa`.
4. Uruchom `node SCRIPTS/bootstrap-client-config.js --write`.
5. Zweryfikuj frontend:

```bash
cd zip && npm.cmd run lint
cd ../astro-site && npm run build
```

6. Lokalny deploy Astro i rollback biora dane z `/.client.generated.env`.
7. `set-bridge-config.sh` bierze dane bridge z `/.client.generated.env` i przestaje miec sekrety hardcoded w repo.
8. Legacy skrypty operacyjne `verify-*.sh`, `SCRIPTS/run_upload.js`, `SCRIPTS/upload_products.js` i `SCRIPTS/sync_catering_category.js` tez czytaja ten sam generated client config.

## 5. Co czyta ktory plik

### React

- `/zip/.env.local`
- krytyczne zmienne:
  - `VITE_WORDPRESS_BASE_URL`
  - `VITE_BRIDGE_BASE_URL`
  - `VITE_SITE_URL`
  - `VITE_REACT_BASE_PATH`

### Astro

- `/astro-site/.env.local`
- krytyczne zmienne:
  - `CLIENT_SITE_URL`
  - `CLIENT_ASTRO_BASE_PATH`
  - `PUBLIC_WORDPRESS_BASE_URL`

### Local deploy / bridge scripts

- `/.client.generated.env`

### Legacy operacyjne verify/upload/sync

- `/.client.generated.env`
- skrypty po bootstrapie biora z niego:
  - `CLIENT_REMOTE_WP_ROOT`
  - `CLIENT_SSH_HOST`
  - `CLIENT_SSH_USER`
  - `CLIENT_SSH_KEY_PATH`

## 6. CI / GitHub Actions

Workflow Astro oczekuje teraz tych GitHub Variables:

- `CLIENT_SITE_URL`
- `CLIENT_WORDPRESS_BASE_URL`
- `CLIENT_ASTRO_BASE_PATH`
- `CLIENT_REMOTE_ASTRO_PUBLIC_ROOT`
- `CLIENT_REMOTE_ASTRO_BACKUP_ROOT`
- `DHOSTING_SSH_HOST`
- `DHOSTING_SSH_USER`

oraz tego GitHub Secret:

- `DHOSTING_SSH_KEY`

## 7. Co dalej jest jeszcze manualne

Bootstrap domyka glowna sciezke nowego klienta: runtime, Astro, React, local deploy i bridge config.

Jesli zostana jeszcze jakies starsze skrypty poza tym zakresem, traktuj je jako osobny cleanup, a nie jako wymagany pierwszy krok nowego klienta.