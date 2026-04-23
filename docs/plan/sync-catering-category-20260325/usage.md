# sync_catering_category.js

Krótka instrukcja operatora dla `SCRIPTS/sync_catering_category.js`.

## Co robi skrypt

- bierze jeden plik JSON z jedną kategorią cateringu
- lokalnie waliduje shape zgodny z frontendem
- dopasowuje kategorię do `zip/src/data/cateringWielkanocny.json` po `id`, nazwie albo slugu
- jeśli w payloadzie brakuje `id`, próbuje zachować istniejące lokalne ID kategorii i produktów
- w trybie pełnym wysyła tymczasowy JSON i tymczasowy worker PHP przez SSH na WordPress v2, robi upsert kategorii `product_cat` i produktów WooCommerce, a potem zapisuje zwrócone kanoniczne ID do lokalnego JSON-a frontendowego

## Wymagany shape wejścia

Root musi być jednym obiektem kategorii:

```json
{
  "id": 17,
  "nazwa_kategorii": "Zupy",
  "opis_kategorii": "Opis kategorii",
  "image_url": "/react/images/zupy.webp",
  "pozycje": [
    {
      "id": 14,
      "zespolona_nazwa_z_opisem": "Rosół z kury domowej...",
      "gramatura": "0,9 l",
      "cena": 68,
      "vegan": false,
      "vegetarian": false
    },
    {
      "id": 15,
      "nazwa_produktu": "Barszcz bardzo czerwony",
      "opis_produktu": "gotowany z suszonymi borowikami...",
      "gramatura": "0,9 l",
      "cena": 78,
      "vegan": true,
      "vegetarian": true
    }
  ]
}
```

Zasady:

- `image_url` musi zaczynać się od `/react/images/`
- `pozycje` musi być tablicą
- każda pozycja musi mieć `gramatura`, `cena`, `vegan`, `vegetarian`
- treść produktu jest w jednym z dwóch wariantów:
  - `zespolona_nazwa_z_opisem`
  - albo komplet `nazwa_produktu` + `opis_produktu`
- `id` kategorii i produktów jest opcjonalne dla create flow, ale w stałym użyciu warto je zachowywać

## Komendy

Walidacja lokalna bez zapisu i bez Woo:

```bash
node SCRIPTS/sync_catering_category.js --input path/to/category.json --local-validate
```

Podgląd lokalnego matchingu bez zapisu i bez Woo:

```bash
node SCRIPTS/sync_catering_category.js --input path/to/category.json --dry-run
```

Pełny sync do Woo + zapis lokalnego JSON-a:

```bash
node SCRIPTS/sync_catering_category.js --input path/to/category.json
```

## Co aktualizuje lokalnie

- aktualizuje tylko `zip/src/data/cateringWielkanocny.json`
- podmienia jedną dopasowaną kategorię albo dopisuje nową na końcu
- nie rusza innych kategorii

## Co zmienia w Woo

- tworzy albo aktualizuje termin `product_cat`
- tworzy albo aktualizuje proste produkty Woo w tej kategorii
- ustawia nazwę, opis, cenę, przypisanie do kategorii i meta:
  - `gramatura`
  - `vegan`
  - `vegetarian`
  - `bulwar_catering_signature`
  - pola pomocnicze dla trybu `combined` albo `split`

## Ważne uwagi

- tryby `--local-validate` i `--dry-run` są lokalne i nie dotykają produkcji
- pełny sync wymaga działającego `scp`, `ssh`, klucza `id_rsa` w root repo i dostępu do hosta `client@client.ssh.host`
- target WordPress jest na stałe ustawiony na `/home/client-user/domains/client.example/public_html`
- skrypt po sukcesie zapisuje kanoniczne ID zwrócone przez Woo do `zip/src/data/cateringWielkanocny.json`
- skrypt nie usuwa brakujących produktów z Woo; zakres to create/update jednej kategorii
- fallback dopasowania bez `id` opiera się o nazwę/sluga kategorii i sygnaturę treści produktu, więc przy danych produkcyjnych lepiej podawać istniejące `id`
