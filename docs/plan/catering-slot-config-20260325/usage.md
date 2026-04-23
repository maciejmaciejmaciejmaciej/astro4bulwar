# Instrukcja obsługi slotów

Plik konfiguracyjny:

- `wordpress-plugin/bulwar-bridge/config/slots.json`

Zasada działania:

- `delivery` i `pickup` to dwa osobne systemy slotów.
- Pokazują się tylko daty wpisane w tablicy `dates`.
- Jeśli daty nie ma w `dates`, to nie pokaże się w checkoutcie.
- `windows` określa zakres godzin dla danej daty.
- `defaultIntervalMinutes` określa długość pojedynczego slotu. Teraz: `15` minut.
- `defaultCapacity` określa pojemność pojedynczego slotu dla danego trybu.

Aktualna konfiguracja świąteczna:

- `delivery`
- `2026-04-02` od `10:00` do `18:00`
- `2026-04-03` od `10:00` do `18:00`
- `2026-04-04` od `10:00` do `15:00`
- `pickup`
- `2026-04-03` od `10:00` do `21:00`
- `2026-04-04` od `10:00` do `16:00`

Jak dodać nowy dzień:

```json
{
  "date": "2026-04-05",
  "windows": [
    { "start": "10:00", "end": "14:00" }
  ]
}
```

Jak dodać kilka okien godzinowych w jednym dniu:

```json
{
  "date": "2026-04-05",
  "windows": [
    { "start": "10:00", "end": "13:00" },
    { "start": "15:00", "end": "18:00" }
  ]
}
```

Jak wyłączyć dzień:

- Usuń wpis z tablicy `dates` dla `delivery` albo `pickup`.

Jak zmienić długość slotu:

- Zmień `defaultIntervalMinutes` na górze pliku, np. `30` dla slotów co 30 minut.

Jak zmienić pojemność slotu:

- Zmień `defaultCapacity` osobno w `delivery` albo `pickup`.

Wdrożenie:

- Po zmianie `slots.json` trzeba wrzucić plik na produkcję do:
- `/home/client-user/domains/client.example/public_html/wp-content/plugins/bulwar-bridge/config/slots.json`
- Po deployu trzeba ustawić prawa:
- katalogi `755`
- pliki `644`
