# Day 1 Checklista Fazy Wdrozeniowej

Ta checklista nie opisuje calego lifecycle klienta. Ona sprawdza tylko gotowosc do Fazy wdrozeniowej.

## Uzupelnij zanim zaczniesz pierwszy deploy Astro pod `/astro`

- [ ] Mam wypelniony manifest nowego klienta.
- [ ] Repo zostalo zduplikowane jako baza dla nowego klienta.
- [ ] Stare sekrety i artefakty zostaly usuniete lub odlozone poza repo: `id_rsa`, `id_rsa.pub`, `temp_wp_config.php`, stare `.env*`.
- [ ] Nowy WordPress + WooCommerce dziala.
- [ ] Plugin `wordpress-plugin/bulwar-bridge` jest aktywny.
- [ ] Stale bridge sa ustawione.
- [ ] Docelowe katalogi `/react` i `/astro` sa przygotowane na serwerze.
- [ ] Domeny, slugi, SSH i sciezki deployowe sa przepiete na nowego klienta.
- [ ] Reczny deploy React i Astro jest gotowy do uruchomienia.
- [ ] Jest plan poprawy uprawnien `755/644` po deployu.

## Minimalna kolejnosc na pierwszy dzien

1. Postaw backend WordPress + WooCommerce.
2. Wgraj i ustaw bridge.
3. Przygotuj `/react` i `/astro`.
4. Przepnij config i skrypty deployowe.
5. Wdroz React do `/react`.
6. Wdroz Astro do `/astro`.
7. Sprawdz health endpoint i testowa strone Astro.
8. Dopiero potem mysl o Fazie produkcyjnej i CI.

## Warunek zamkniecia Fazy wdrozeniowej

Faza wdrozeniowa jest zamknieta dopiero wtedy, gdy `domena.pl/astro` dziala poprawnie jako w pelni funkcjonalny front Astro.
