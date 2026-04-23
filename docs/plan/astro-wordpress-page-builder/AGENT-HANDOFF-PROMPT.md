# Agent Handoff Prompt

Skopiuj poniższy prompt do nowego agenta, jeśli ma pracować nad page-builderem Astro/WordPress bez robienia długiego przeglądu całej dokumentacji.

## Prompt Do Wklejenia

```text
Pracujesz w obszarze page-builder Astro/WordPress w repo BULWAR APP.

Nie zaczynaj od szerokiego przeglądu całego docs/plan. Zacznij od tych plików i traktuj je jako źródła prawdy w tej kolejności:

1. docs/plan/astro-wordpress-page-builder/README.md
2. docs/plan/astro-wordpress-page-builder/page-builder-authoring-workflow.md
3. docs/plan/astro-wordpress-page-builder/implementation-plan.md
4. docs/plan/astro-wordpress-page-builder/agentic-page-builder-blueprint.md

Zasady pracy w tym obszarze:

- Bieżący workflow operatora jest opisany w page-builder-authoring-workflow.md.
- README.md jest indeksem startowym i ma skrócić wejście w temat.
- Agentic blueprint opisuje architekturę docelową, nie zawsze bieżący workflow day-to-day.
- Starsze pliki research_findings_*.yaml traktuj jako historyczne snapshoty i evidence, nie jako bieżącą prawdę operacyjną.
- Astro slug discovery jest już automatyczny z endpointu WordPress `GET /wp-json/bulwar/v1/page-builder/pages`.
- Nie zakładaj już ręcznego TEST_PAGE_SLUGS jako aktualnego workflow.
- Runtime CLI istnieje pod `SCRIPTS/page-builder-runtime/cli.ts` i jest wspieraną ścieżką create-or-update/publish.
- Runtime CLI może auto-ładować lokalny plik `.env.page-builder.local`; nie wymagaj ręcznych exportów sekretów, jeśli ten plik już istnieje.
- Bridge endpoint `POST /wp-json/bulwar/v1/page-builder/pages/{slug}` sam z siebie aktualizuje istniejącą stronę; create-or-update dla strony zapewnia runtime przez core WordPress pages API.
- React proof nadal jest ograniczony i nie jest główną ścieżką weryfikacji dla nowych stron.

Cel bieżącego zadania:

[WSTAW TUTAJ KONKRETNY CEL]

Sposób odpowiedzi:

- Najpierw potwierdź, z których 2-4 plików startowych korzystasz.
- Nie rób ponownego audytu całego folderu, jeśli README i workflow wystarczają.
- Jeśli znajdziesz rozjazd między kodem a dokumentacją, popraw najpierw dokument kanoniczny, a nie historyczny snapshot.
- Jeśli zadanie dotyczy utworzenia lub publikacji strony, opieraj się przede wszystkim na page-builder-authoring-workflow.md i runtime CLI.
```

## Kiedy Używać

- Gdy odpalasz nowego agenta do prac w `docs/plan/astro-wordpress-page-builder/`
- Gdy chcesz zlecić stworzenie lub publikację nowej strony bez powtarzania całego kontekstu
- Gdy chcesz ograniczyć ryzyko, że agent zacznie od starych snapshotów YAML

## Czego Ten Prompt Nie Zastępuje

- Nie zastępuje [README.md](README.md) jako indeksu dokumentacji
- Nie zastępuje [page-builder-authoring-workflow.md](page-builder-authoring-workflow.md) jako workflow truth
- Nie zastępuje konkretnego celu zadania, który nadal trzeba dopisać w miejscu `[WSTAW TUTAJ KONKRETNY CEL]`