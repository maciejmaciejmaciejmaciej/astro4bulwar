# Wdrozenie nowego klienta: Astro + WordPress + WooCommerce

## Jak czytac ten pakiet

Nazwy czesci plikow w `docs/setup/` nadal zawieraja slowo `klonowania` historycznie, ale sam workflow dotyczy wdrozenia nowego klienta, a nie samej duplikacji repo.

Jesli ten dokument jest za gesty, zacznij od tych plikow:

- `docs/setup/day-1-checklista-klonowania.md` -> szybka checklista Fazy wdrozeniowej
- `docs/setup/tabela-zadan-klonowania.md` -> tabela zadan z podzialem na fazy
- `docs/setup/template-manifest-nowej-instancji.md` -> pusty manifest wdrozenia klienta
- `docs/setup/gotowy-przyklad-manifestu-nowej-instancji.md` -> manifest z przykladowymi danymi
- `docs/setup/sekwencyjny-przewodnik-klonowania.md` -> wersja krok po kroku
- `docs/setup/repo-do-klonowania-plan-parametryzacji.md` -> techniczny plan przepiecia repo
- `docs/setup/checklista-migracji-seo-wordpress-do-astro.md` -> checklista przejscia do root domeny

## Model dwufazowy

Ten proces ma 2 fazy.

### 1. Faza wdrozeniowa

W tej fazie:

- duplikujesz repo jako baze dla nowego klienta
- przygotowujesz katalogi `/react` i `/astro`
- przepinasz domeny, slugi, SSH i sciezki deployowe
- uruchamiasz frontend Astro pod `domena.pl/astro`
- dalej pracujesz z repo i agentami tak jak w obecnym projekcie

Cel tej fazy jest prosty:

`domena.pl/astro` ma dzialac jako w pelni funkcjonalna strona Astro dla nowego klienta.

### 2. Faza produkcyjna

W tej fazie:

- nie zmieniasz sposobu pracy z repo, agentami ani page builderem
- nie budujesz nowego produktu od zera
- wykonujesz tylko czynnosci potrzebne do tego, zeby ten sam front Astro byl widoczny pod glowna domena

Cel tej fazy jest prosty:

zamiast `domena.pl/astro` publiczny front ma byc dostepny jako `domena.pl`.

## Faza wdrozeniowa

### Co robisz

1. Duplikujesz repo jako baze dla nowego klienta.
2. Usuwasz stare sekrety i artefakty techniczne, ktorych nie wolno dziedziczyc.
3. Wypelniasz manifest nowego klienta.
4. Stawiasz WordPress i WooCommerce.
5. Wgrywasz i konfigurujesz `bulwar-bridge`.
6. Tworzysz lub przygotowujesz docelowe katalogi `/react` i `/astro` na serwerze.
7. Przepinasz domeny, slugi, SSH i sciezki deployowe.
8. Budujesz i wdrazasz React pod `/react`.
9. Budujesz i wdrazasz Astro pod `/astro`.
10. Poprawiasz uprawnienia `755/644` i robisz test koncowy.

### Co ma byc wynikiem

Na koniec Fazy wdrozeniowej ma dzialac:

- `https://domena.pl/react/`
- `https://domena.pl/astro/nowy-slug-testowy/`
- `https://domena.pl/wp-json/bulwar/v1/health`

## Warunek przejscia do Fazy produkcyjnej

Do Fazy produkcyjnej przechodzisz dopiero wtedy, gdy:

- Astro dziala poprawnie pod `/astro`
- React dziala poprawnie pod `/react`, jesli jest potrzebny publicznie
- bridge health zwraca `success=true`
- runtime nie odpytuje starej domeny
- canonicale, assety i linki nie wskazuja na stare srodowisko
- manualny deploy zostal potwierdzony przed CI

## Faza produkcyjna

### Co robisz

1. Wybierasz sposob wystawienia Astro na root domeny.
2. Przepinasz ekspozycje publiczna z `domena.pl/astro` na `domena.pl`.
3. Aktualizujesz canonicale, sitemap, robots i redirecty pod root domeny.
4. Ustalasz los technicznego adresu `/astro` po cutoverze:
   - albo `301` na root
   - albo `noindex`, jesli ma zostac tylko jako surface techniczny
5. Potwierdzasz, ze publiczna, indeksowalna wersja jest tylko jedna: root domeny.

### Czego ta faza nie zmienia

Po przejsciu do produkcji nie zmienia sie:

- workflow pracy z repo
- workflow pracy z agentami
- sposob tworzenia nowych stron w Astro
- sposob utrzymywania tresci przez WordPress i `page_builder_schema`

Zmienia sie tylko publiczna ekspozycja gotowego Astro.

## Co trzeba przepiac w repo

Najwazniejsze grupy zmian sa nadal te same:

- domeny i slugi
- host SSH i user SSH
- `public_html`, `/react`, `/astro`, backupy
- fallbacki runtime WordPress i WooCommerce API
- konfiguracja bridge
- deploy lokalny i deploy CI
- w Fazie produkcyjnej dodatkowo:
  - root domeny
  - canonicale
  - sitemap
  - robots
  - redirect lub noindex dla `/astro`

## Najczestsze pulapki

- traktowanie duplikacji repo jako celu zamiast jako pierwszego kroku wdrozenia
- brak jasnego rozdzialu miedzy faza wdrozeniowa i produkcyjna
- probowanie zrobienia root domeny od razu, bez potwierdzonego `/astro`
- zostawienie indeksowalnych duplikatow pod `/astro` i pod root domeny jednoczesnie
- zostawienie fallbacku do starej domeny klienta zamiast do aktualnej konfiguracji bootstrapu
- brak poprawy uprawnien `755/644` po deployu na dhosting

## Najkrotsza odpowiedz

Ten proces wyglada tak:

1. Faza wdrozeniowa:
   - duplikujesz repo
   - tworzysz `/react` i `/astro`
   - przepinasz domeny, slugi, SSH i sciezki deployowe
   - doprowadzasz do dzialajacego `domena.pl/astro`

2. Faza produkcyjna:
   - wystawiasz to samo Astro z `/astro` jako `domena.pl`
   - aktualizujesz SEO i ekspozycje publiczna
   - dalej pracujesz z repo i agentami tak samo jak w Fazie wdrozeniowej
