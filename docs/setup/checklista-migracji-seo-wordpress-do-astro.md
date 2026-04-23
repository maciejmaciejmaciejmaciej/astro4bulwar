# Checklista SEO Przejscia Z Fazy Wdrozeniowej Do Produkcyjnej Astro

Uzywaj tej listy wtedy, gdy Faza wdrozeniowa jest juz domknieta i dzialajace Astro pod `/astro` ma przejsc na root domeny jako finalny, publiczny front.

Jesli choc jeden punkt z fazy przed cutoverem nie jest zamkniety, nie rob przejscia na root domeny.

## 1. Przed cutoverem produkcyjnym

- [ ] Potwierdz, ze `domena.pl/astro` dziala poprawnie i jest technicznie gotowe do roli produkcyjnego frontu.
- [ ] Zrob mape URL: stary URL -> finalny URL root domeny -> typ odpowiedzi (`200`, `301`, `410`).
- [ ] Ustal, co dzieje sie z technicznym wariantem `/astro` po cutoverze: `301` albo `noindex`.
- [ ] Ustal finalna regule canonical: po produkcji canonical ma wskazywac root domeny, nie `/astro`.
- [ ] Przygotuj finalny sitemap tylko dla root domeny.
- [ ] Przygotuj `robots.txt` dla finalnej ekspozycji produkcyjnej.
- [ ] Upewnij sie, ze po przejsciu nie zostana dwa indeksowalne warianty tej samej tresci: root i `/astro`.
- [ ] Zweryfikuj parity najwazniejszych landingow: tresc, H1, title, meta description, linkowanie.

## 2. W trakcie cutoveru

- [ ] Wystaw tylko jeden publiczny wariant strony jako indeksowalny: root domeny.
- [ ] Wlacz `301` ze starych URL lub technicznych powierzchni tam, gdzie to potrzebne.
- [ ] Sprawdz recznie kluczowe URL-e po przejsciu: root, kilka landingow, kontakt, menu, slug testowy jesli ma zostac techniczny.
- [ ] Sprawdz canonical na produkcji: ma wskazywac root domeny, nie `/astro`, nie stara domene.
- [ ] Sprawdz, ze sitemap i `robots.txt` odpowiadaja finalnej ekspozycji.
- [ ] Sprawdz, ze `/astro` nie jest drugim publicznym duplikatem.

## 3. Po starcie produkcyjnym

- [ ] Monitoruj Search Console i coverage dla root domeny.
- [ ] Sprawdz, czy Google nie wybiera `/astro` zamiast root domeny jako canonicala.
- [ ] Przejrzyj 404 i dopisz redirecty, jesli potrzeba.
- [ ] Zweryfikuj, ze w menu, stopce, OG URL, danych strukturalnych i CTA nie zostaly linki do starej domeny lub do technicznego `/astro`.
- [ ] Potwierdz, ze nowe strony dalej moga byc tworzone tym samym workflow repo + agenci.

## 4. Twarde zasady

- Nie zostawiaj indeksowalnego duplikatu tej samej strony pod root domeny i pod `/astro`.
- Nie licz na canonical jako zamiennik `301`, jesli techniczny wariant `/astro` ma zniknac z publicznej ekspozycji.
- Nie publikuj sitemap zawierajacego mieszanke root domeny i technicznych URL-i `/astro`.
- Nie rob cutoveru, dopoki Faza wdrozeniowa nie daje stabilnego `domena.pl/astro`.
