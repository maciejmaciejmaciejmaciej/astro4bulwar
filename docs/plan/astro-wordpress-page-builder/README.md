# Start Here

Ten katalog ma trzy główne wejścia:

| Rola | Plik | Kiedy używać |
| --- | --- | --- |
| Bieżący workflow operatora | [page-builder-authoring-workflow.md](page-builder-authoring-workflow.md) | Gdy chcesz dziś złożyć i opublikować stronę |
| Architektura docelowa agenta | [agentic-page-builder-blueprint.md](agentic-page-builder-blueprint.md) | Gdy chcesz zrozumieć model agent + WordPress + Astro + Make |
| Plan systemu i kolejność dostarczania | [implementation-plan.md](implementation-plan.md) | Gdy chcesz sprawdzić kierunek, etapy i źródło planistycznej prawdy |

Krótka zasada: workflow operacyjny jest w [page-builder-authoring-workflow.md](page-builder-authoring-workflow.md), a runtime CLI tylko wykonuje ten flow przez [../../../SCRIPTS/page-builder-runtime/cli.ts](../../../SCRIPTS/page-builder-runtime/cli.ts).

Jeśli chcesz uruchomić nowego agenta bez tłumaczenia całego kontekstu, użyj gotowego [AGENT-HANDOFF-PROMPT.md](AGENT-HANDOFF-PROMPT.md).

Jeśli chcesz publikować bez ręcznego eksportowania sekretów w każdym terminalu, użyj lokalnego pliku [../../../.env.page-builder.local.example](../../../.env.page-builder.local.example) jako wzoru dla `.env.page-builder.local`. Runtime CLI ładuje ten plik automatycznie.

Ważne teraz: discovery slugów Astro jest już automatyczny z endpointu listingu stron WordPress. Nie traktuj ręcznej listy slugów jako aktualnej prawdy workflow.

## Co Jest Czym

### Źródła Prawdy

- [page-builder-authoring-workflow.md](page-builder-authoring-workflow.md) — kanoniczny workflow day-to-day dla operatora.
- [agentic-page-builder-blueprint.md](agentic-page-builder-blueprint.md) — docelowa architektura agentowa i przyszła integracja z Make.
- [implementation-plan.md](implementation-plan.md) — planistyczne source of truth dla całego systemu.

### Kontrakty I Specyfikacje

- [page-builder-schema-spec.md](page-builder-schema-spec.md) — kontrakt render payloadu `page_builder_schema`.
- [block-registry-spec.md](block-registry-spec.md) — kontrakt registry bloków.
- [mvp-block-data-contracts.md](mvp-block-data-contracts.md) — konkretne kontrakty danych bloków MVP.
- [blueprint-dsl-spec.md](blueprint-dsl-spec.md) — kontrakt blueprintu, jeśli pracujesz na warstwie blueprint/DSL.
- [global-css-adaptation-contract.md](global-css-adaptation-contract.md) — granice adaptacji CSS.
- [design-token-and-layout-whitelist.md](design-token-and-layout-whitelist.md) — whitelist layoutu i tokenów.

### Pomocnicze, Ale Nie Startowe

- [firebase-page-draft-mvp.md](firebase-page-draft-mvp.md) — opcjonalny wariant runtime draftów, nie główny workflow.
- [scrape-bootstrap-firebase-draft-mapping.md](scrape-bootstrap-firebase-draft-mapping.md) — przyszły albo specjalistyczny flow bootstrapu ze scrape do draftu.
- [react-wordpress-poc-status.md](react-wordpress-poc-status.md) — log milestone i POC, nie workflow truth.
- [plan.yaml](plan.yaml) — aktywny plan tego obszaru, nie główny dokument wejściowy dla operatora.

### Przykłady I Artefakty

- [testowa-blueprint.page_builder_schema.json](testowa-blueprint.page_builder_schema.json) — referencyjny render schema.
- [testowa-blueprint.page_builder_schema_for_ai.json](testowa-blueprint.page_builder_schema_for_ai.json) — referencyjny AI schema.
- [testowa-blueprint.firebase-draft.json](testowa-blueprint.firebase-draft.json) — przykład draftu runtime.
- [testowa-blueprint.dry-run.result.json](testowa-blueprint.dry-run.result.json) — artefakt dry-run.
- [testowa-blueprint.publish.result.json](testowa-blueprint.publish.result.json) — artefakt publikacji.
- [restauracja-na-wesele.firebase-draft.json](restauracja-na-wesele.firebase-draft.json) — przykład biznesowego draftu.
- [restauracja-na-wesele-source-mappings.json](restauracja-na-wesele-source-mappings.json) — przykład mapowania źródeł.
- [restauracja-na-wesele.publish.result.json](restauracja-na-wesele.publish.result.json) — wynik publikacji.
- [restauracja-na-wesele.publish.after-fix.result.json](restauracja-na-wesele.publish.after-fix.result.json) — wynik po poprawce.

## Czytaj W Tej Kolejności

### 1. Chcę Teraz Utworzyć Lub Opublikować Nową Stronę Astro

1. [page-builder-authoring-workflow.md](page-builder-authoring-workflow.md)
2. [../../../SCRIPTS/page-builder-runtime/cli.ts](../../../SCRIPTS/page-builder-runtime/cli.ts)
3. [page-builder-schema-spec.md](page-builder-schema-spec.md)
4. [mvp-block-data-contracts.md](mvp-block-data-contracts.md)
5. [testowa-blueprint.page_builder_schema.json](testowa-blueprint.page_builder_schema.json)
6. [testowa-blueprint.page_builder_schema_for_ai.json](testowa-blueprint.page_builder_schema_for_ai.json)

### 2. Chcę Zrozumieć Architekturę Agentową I Przyszłą Integrację Z Make

1. [implementation-plan.md](implementation-plan.md)
2. [agentic-page-builder-blueprint.md](agentic-page-builder-blueprint.md)
3. [page-builder-schema-spec.md](page-builder-schema-spec.md)
4. [block-registry-spec.md](block-registry-spec.md)
5. [firebase-page-draft-mvp.md](firebase-page-draft-mvp.md)
6. [scrape-bootstrap-firebase-draft-mapping.md](scrape-bootstrap-firebase-draft-mapping.md)

### 3. Chcę Przejrzeć Historyczne Audyty I Evidence

1. [react-wordpress-poc-status.md](react-wordpress-poc-status.md)
2. [research_findings_documentation-audit.yaml](research_findings_documentation-audit.yaml)
3. [research_findings_firebase-runtime-workflow.yaml](research_findings_firebase-runtime-workflow.yaml)
4. [research_findings_firebase_draft_impl_locations.yaml](research_findings_firebase_draft_impl_locations.yaml)
5. [research_findings_firebase_draft_runtime_state.yaml](research_findings_firebase_draft_runtime_state.yaml)
6. [research_findings_firebase_wp_page_schema_workflow.yaml](research_findings_firebase_wp_page_schema_workflow.yaml)
7. [research_findings_implementation_audit.yaml](research_findings_implementation_audit.yaml)
8. [research_findings_wordpress_page_creation.yaml](research_findings_wordpress_page_creation.yaml)
9. [testowa-blueprint.dry-run.result.json](testowa-blueprint.dry-run.result.json)
10. [testowa-blueprint.publish.result.json](testowa-blueprint.publish.result.json)
11. [restauracja-na-wesele.publish.result.json](restauracja-na-wesele.publish.result.json)

## Nie Zaczynaj Od Tego

Te pliki są snapshotami researchu i audytu. Są przydatne jako tło albo evidence, ale nie są aktualnym workflow truth:

- [research_findings_documentation-audit.yaml](research_findings_documentation-audit.yaml)
- [research_findings_firebase-runtime-workflow.yaml](research_findings_firebase-runtime-workflow.yaml)
- [research_findings_firebase_draft_impl_locations.yaml](research_findings_firebase_draft_impl_locations.yaml)
- [research_findings_firebase_draft_runtime_state.yaml](research_findings_firebase_draft_runtime_state.yaml)
- [research_findings_firebase_wp_page_schema_workflow.yaml](research_findings_firebase_wp_page_schema_workflow.yaml)
- [research_findings_implementation_audit.yaml](research_findings_implementation_audit.yaml)
- [research_findings_wordpress_page_creation.yaml](research_findings_wordpress_page_creation.yaml)

Jeśli nie wiesz, od czego zacząć, zacznij od [page-builder-authoring-workflow.md](page-builder-authoring-workflow.md).