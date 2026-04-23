# Tabela Zadan Wdrozenia Nowego Klienta

To jest wersja do pracy operacyjnej. Idziesz wiersz po wierszu. Nie myslisz o calym projekcie naraz.

| Faza | Etap | Co robisz | Gdzie to robisz | Jak sprawdzasz, ze jest OK | Kiedy isc dalej |
| --- | --- | --- | --- | --- | --- |
| Wdrozeniowa | 1 | Wypelniasz manifest klienta | `docs/setup/template-manifest-nowej-instancji.md` albo gotowy przyklad | masz komplet danych klienta | gdy nic kluczowego nie jest puste |
| Wdrozeniowa | 2 | Duplikujesz repo i czyscisz sekrety | root repo | nie ma `id_rsa`, `temp_wp_config.php`, starych `.env*` | gdy repo nie celuje w stare srodowisko |
| Wdrozeniowa | 3 | Stawiasz WordPress + WooCommerce | nowy serwer | domena otwiera WordPress, WooCommerce jest aktywny | gdy backend zyje samodzielnie |
| Wdrozeniowa | 4 | Wgrywasz i ustawiasz bridge | `wordpress-plugin/bulwar-bridge/` | `wp-json/bulwar/v1/health` zwraca `success=true` | gdy bridge jest gotowy |
| Wdrozeniowa | 5 | Ustawiasz sloty i logike dostawy | `wordpress-plugin/bulwar-bridge/config/slots.json` | konfiguracja odpowiada nowemu klientowi | gdy biznes akceptuje kalendarz |
| Wdrozeniowa | 6 | Przygotowujesz `/react` i `/astro` | serwer docelowy | katalogi i backupy istnieja | gdy jest gotowe miejsce pod deploy |
| Wdrozeniowa | 7 | Przepinasz runtime Astro | `astro-site/astro.config.mjs`, `astro-site/src/lib/config.ts` | brak starej domeny i starego sluga w configu | gdy Astro celuje w nowy backend |
| Wdrozeniowa | 8 | Przepinasz runtime React | `zip/src/...`, `zip/components/...` | runtime nie pobiera danych ze starej domeny | gdy fallbacki sa czyste |
| Wdrozeniowa | 9 | Przepinasz deploy lokalny i CI | `deploy-react.sh`, `SCRIPTS/*.ps1`, `.github/workflows/...` | skrypty i workflow celuja w nowy serwer | gdy target deployu jest poprawny |
| Wdrozeniowa | 10 | Budujesz i wdrazasz React | `zip/` + serwer | `domena.pl/react/` dziala bez 404 po refreshu | gdy React dziala live |
| Wdrozeniowa | 11 | Budujesz i wdrazasz Astro | `astro-site/` + serwer | `domena.pl/astro/<slug>/` dziala | gdy Astro dziala live |
| Wdrozeniowa | 12 | Poprawiasz uprawnienia | serwer dhosting | brak 403 i bialej strony | zawsze po deployu |
| Wdrozeniowa | 13 | Robisz test koncowy fazy | przegladarka + health endpoint | dziala health, `/react`, `/astro/<slug>` | gdy faza wdrozeniowa jest zamknieta |
| Produkcyjna | 14 | Wybierasz sposob wystawienia Astro na root | serwer / hosting / routing | jest jasne jak `domena.pl/astro` stanie sie `domena.pl` | gdy plan cutoveru jest zatwierdzony |
| Produkcyjna | 15 | Wystawiasz Astro pod root domeny | serwer / routing | `domena.pl` pokazuje ten sam front Astro | gdy root dziala |
| Produkcyjna | 16 | Ustawiasz SEO root domeny | canonicale, sitemap, robots, redirecty | tylko root domeny jest publicznie indeksowalny | gdy nie ma duplikacji root vs `/astro` |
| Produkcyjna | 17 | Ustalasz los `/astro` po cutoverze | serwer / SEO | `/astro` ma `301` albo `noindex` | gdy nie ma drugiego indeksowalnego wariantu |
| Produkcyjna | 18 | Robisz test po cutoverze | przegladarka, curl, Search Console | dziala `domena.pl`, SEO wskazuje root | gdy klient moze wejsc na produkcje |

## Najkrotsza zasada pracy

1. Najpierw domykasz Faze wdrozeniowa.
2. Potem dopiero robisz Faze produkcyjna.
3. Workflow repo i agentow po przejsciu na root domeny zostaje taki sam.
