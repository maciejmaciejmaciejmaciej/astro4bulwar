# Sekwencyjny Przewodnik Wdrozenia Nowego Klienta

Ten dokument jest napisany prosto: co robisz teraz, po co to robisz i co musi juz dzialac, zanim przejdziesz dalej.

Bootstrap-first flow jest opisany w `docs/setup/bootstrap-nowego-klienta.md`.
Ten dokument dalej zostaje jako przewodnik wdrozeniowy, ale glownym mechanizmem parametryzacji repo nie jest juz reczne przepinanie stringow tylko lokalny bootstrap klienta.

## Krok 0. Przyjmij model dwufazowy

### Co robisz

Przyjmujesz model:

- Faza wdrozeniowa: Astro dziala pod `/astro`
- Faza produkcyjna: to samo Astro przechodzi na root domeny

### Po co

Bo to oddziela bezpieczne uruchomienie techniczne od publicznego cutoveru.

### Co musi byc jasne

Workflow repo i agentow po przejsciu do produkcji sie nie zmienia.

## Faza wdrozeniowa

### Krok 1. Przygotuj kartke projektu

Spisujesz domeny, SSH, `public_html`, backupy, slug testowy, adres lokalu, webhooki i klucze.

Idziesz dalej dopiero wtedy, gdy nie zgadujesz zadnej z tych rzeczy.

### Krok 2. Zduplikuj repo i wyczysc rzeczy starego klienta

Usuwasz lub odkadasz poza repo: `id_rsa`, `id_rsa.pub`, `temp_wp_config.php`, stare lokalne `.env*`.

Nastepnie tworzysz nowe `/.env.client.local` z `/.env.client.example` i uruchamiasz bootstrap klienta.

Idziesz dalej dopiero wtedy, gdy repo nie ma dostepow do starego srodowiska.

### Krok 3. Postaw WordPress + WooCommerce

Najpierw musi dzialac backend.

Idziesz dalej dopiero wtedy, gdy domena otwiera WordPressa i WooCommerce jest aktywny.

### Krok 4. Wgraj i ustaw bridge

Aktywujesz `bulwar-bridge`, ustawiasz stale i sprawdzasz health endpoint.

Idziesz dalej dopiero wtedy, gdy `success=true` i `missingRequiredConstants=[]`.

### Krok 5. Przygotuj `/react` i `/astro`

Tworzysz lub potwierdzasz istnienie katalogow `/react` i `/astro` oraz katalogow backupow.

Idziesz dalej dopiero wtedy, gdy masz gdzie wdrozyc oba fronty.

### Krok 6. Przepnij konfiguracje Astro

Generujesz `astro-site/.env.local` przez bootstrap klienta i sprawdzasz linki, logo oraz stare trasy testowe.

Idziesz dalej dopiero wtedy, gdy Astro celuje w nowego klienta.

### Krok 7. Przepnij konfiguracje React

Generujesz `zip/.env.local` przez bootstrap klienta i sprawdzasz runtime React bez fallbacku do starej domeny.

Idziesz dalej dopiero wtedy, gdy React nie pobiera danych ze starego backendu.

### Krok 8. Przepnij deploy lokalny i CI

Bootstrap klienta generuje wspolny env dla local deploy, a workflow GitHub ma miec zgodne variables/secrets dla nowego klienta.

Idziesz dalej dopiero wtedy, gdy wszystkie deploye celuja w nowy serwer.

### Krok 9. Wdroz React do `/react`

Budujesz React i sprawdzasz `https://domena.pl/react/`.

Idziesz dalej dopiero wtedy, gdy refresh nie daje 404.

### Krok 10. Wdroz Astro do `/astro`

Budujesz Astro i sprawdzasz `https://domena.pl/astro/<slug>/`.

Idziesz dalej dopiero wtedy, gdy front Astro dziala pod `/astro`.

### Krok 11. Popraw uprawnienia

Po deployu wymuszasz `755` dla katalogow i `644` dla plikow.

Idziesz dalej dopiero wtedy, gdy nie ma 403 i bialej strony.

### Krok 12. Zamknij Faze wdrozeniowa

Sprawdzasz:

- health endpoint
- React pod `/react`
- Astro pod `/astro`
- brak fallbacku do starej domeny
- minimum jeden test krytyczny

## Bramka przed produkcja

Do Fazy produkcyjnej przechodzisz dopiero wtedy, gdy `domena.pl/astro` jest stabilne i gotowe do pokazania klientowi.

## Faza produkcyjna

### Krok 13. Zdecyduj, jak Astro przejmie root domeny

Ustalasz techniczny sposob cutoveru: routing, vhost, rewrite albo przepiecie miejsca publikacji.

### Krok 14. Wystaw Astro pod `domena.pl`

To jest dalej ten sam produkt Astro, tylko pod innym publicznym adresem.

### Krok 15. Zaktualizuj SEO i ekspozycje publiczna

Ustawiasz canonicale, sitemap, robots i zachowanie `/astro` po cutoverze.

`/astro` nie moze zostac drugim indeksowalnym duplikatem tej samej tresci.

### Krok 16. Zrob test po cutoverze

Sprawdzasz:

- `https://domena.pl/`
- canonicale
- sitemap
- robots
- redirect albo noindex dla `/astro`

## Co zostaje bez zmian po cutoverze

Po przejsciu do produkcji dalej pracujesz tak samo:

- tworzysz strony przez repo
- tworzysz strony przez agentow
- utrzymujesz tresc przez WordPress i `page_builder_schema`
- traktujesz Faze wdrozeniowa jako normalny tryb dalszej pracy technicznej
