# Scrape Bootstrap -> Firebase Draft -> Compile Mapping

## Cel

Ten dokument opisuje docelowy workflow bootstrapu strony z wyniku scrape do draftu w Firebase, a następnie do kompilacji `page_builder_schema` i `page_builder_schema_for_ai`.

To jest wyłącznie notatka projektowa dla target-state.

Obecny kanoniczny flow operacyjny nadal pozostaje repo-first i jest opisany w `docs/plan/astro-wordpress-page-builder/page-builder-authoring-workflow.md`.

## Status

- target-state design note, nie bieżący workflow produkcyjny
- Firebase draft jest working draft store, nie publish truth
- registry w repo pozostaje źródłem prawdy dla dozwolonych bloków i ich kontraktów
- compile zawsze produkuje oba payloady WordPress: `page_builder_schema` i `page_builder_schema_for_ai`

## Decyzje architektoniczne

1. Funkcja bootstrapująca to `createPageDraftFromScrape`.
2. `createPageDraftFromScrape` nie publikuje do WordPressa i nie omija registry.
3. Registry jest źródłem prawdy dla `blockKey`, `version`, `defaultData` i `sourceSchema`.
4. Draft w Firebase przechowuje stabilne `id`, `blocksOrder`, mapę `blocks`, pełne `data` i jawne `source`, a nie tylko uproszczony payload AI.
5. Draft może przechowywać metadane pochodzenia scrape, ale nie może stawać się nowym miejscem definiowania kontraktu bloku.
6. Compile jest osobną warstwą translacji: draft -> `page_builder_schema` oraz draft -> `page_builder_schema_for_ai`.
7. Bootstrap ze scrape ma charakter structure-only: może używać slugu, URL, page kind i kandydatów SEO, ale nie traktuje body content, tekstów, pozycji menu, opisów ani cen z plików output jako źródła treści do direct edit.
8. Dla stron menu restauracji source of truth dla produktów i nazw kategorii pozostaje WooCommerce, więc draft od pierwszej wersji musi używać bloków Woo-backed z jawnym `source`, a nie statycznych list produktów wpisanych ze scrape.
9. Jeśli w chwili bootstrapu nie ma jeszcze zatwierdzonego mapowania do konkretnej kategorii Woo, workflow ma utworzyć poprawną strukturę z placeholderem lub flagą `requiresSourceMapping`, ale nadal nie wolno kopiować produktów ze scrape do `data.menuColumns` jako treści kanonicznej.

## Odpowiedzialności

### `createPageDraftFromScrape`

- przyjmuje znormalizowany wynik scrape, page kind i slug strony
- używa scrape wyłącznie jako źródła metadanych i wskazówek strukturalnych
- ignoruje body content, listy produktów, ceny i teksty opisowe z plików output jako dane kanoniczne strony
- odczytuje dozwolone bloki z registry
- wybiera tylko zatwierdzone `blockKey` lub jawnie zdefiniowane recipe strony
- klonuje `defaultData` dla każdego użytego bloku
- dla stron menu restauracji buduje strukturę z bloków Woo-backed i nie przenosi do draftu ręcznie rozpisanych pozycji menu
- wypełnia wyłącznie pola bezpieczne względem kontraktu bloku i będące własnością tego bloku
- ustawia `source` tylko wtedy, gdy istnieje jawna, zatwierdzona reguła źródła albo placeholder wymagający późniejszego mapowania
- zapisuje draft do Firebase z zachowaniem stabilnych `id`

### Firebase draft

- przechowuje aktualny stan roboczy strony
- pozwala agentowi lub operatorowi poprawiać `data`, `source` i kolejność bloków
- nie jest publikowalnym kontraktem WordPress sam w sobie
- dla bloków menu Woo-backed przechowuje binding do Woo i ustawienia strukturalne, ale nie jest właścicielem listy produktów

### Compile

- waliduje draft względem registry
- generuje render payload do `page_builder_schema`
- generuje editing payload do `page_builder_schema_for_ai`
- zachowuje 1:1 mapowanie bloków po `id`

## Kontrakty

### Kontrakt wejściowy bootstrapu

`createPageDraftFromScrape(scrapeDocument, options)` powinno pracować na wyniku scrape znormalizowanym do prostego modelu struktury strony:

```json
{
  "pageSlug": "menu-dania-glowne",
  "pageKind": "restaurant_menu",
  "title": "Dania Główne",
  "sourcePath": "zip/SRIPTS/wp-seo-scraper/output/menu-dania-glowne/content.md",
  "sourceUrl": "https://bulwarrestauracja.pl/menu/dania-glowne/",
  "seo": {
    "title": "Dania Główne – BulwaR – Restauracja na Starym Rynku w Poznaniu"
  },
  "structureHints": {
    "templateKey": "restaurant-menu",
    "requiresWooMenu": true
  }
}
```

W tym kontrakcie nie ma list produktów ani treści do direct edit. Normalizer może zachować body scrape do audytu lub operator review, ale bootstrap struktury nie używa go do wypełniania `menuColumns`, opisów i cen.

### Docelowy kontrakt draftu w Firebase

```json
{
  "pageSlug": "menu-dania-glowne",
  "title": "Dania Główne",
  "status": "draft",
  "sourcePath": "zip/SRIPTS/wp-seo-scraper/output/menu-dania-glowne/content.md",
  "blocksOrder": [
    "simple_heading_and_paragraph-01",
    "menu_two_columns_with_with_heading_no_img-01",
    "menu_two_columns_with_with_heading_no_img-02"
  ],
  "blocks": {
    "simple_heading_and_paragraph-01": {
      "id": "simple_heading_and_paragraph-01",
      "blockKey": "simple_heading_and_paragraph",
      "blockVersion": 1,
      "enabled": true,
      "variant": null,
      "data": {},
      "source": null
    },
    "menu_two_columns_with_with_heading_no_img-01": {
      "id": "menu_two_columns_with_with_heading_no_img-01",
      "blockKey": "menu_two_columns_with_with_heading_no_img",
      "blockVersion": 1,
      "enabled": true,
      "variant": "surface",
      "data": {
        "title": "Sekcja menu",
        "menuColumns": [],
        "emptyStateText": "Brak pozycji w tej kategorii."
      },
      "source": {
        "sourceType": "woo_category",
        "sourceValue": "TODO_WOO_CATEGORY_SLUG",
        "options": {
          "splitIntoColumns": 2
        }
      }
    },
    "menu_two_columns_with_with_heading_no_img-02": {
      "id": "menu_two_columns_with_with_heading_no_img-02",
      "blockKey": "menu_two_columns_with_with_heading_no_img",
      "blockVersion": 1,
      "enabled": true,
      "variant": "surface",
      "data": {
        "title": "Sekcja menu",
        "menuColumns": [],
        "emptyStateText": "Brak pozycji w tej kategorii."
      },
      "source": {
        "sourceType": "woo_category",
        "sourceValue": "TODO_WOO_CATEGORY_SLUG_2",
        "options": {
          "splitIntoColumns": 2
        }
      }
    }
  },
  "compiled": {
    "page_builder_schema": null,
    "page_builder_schema_for_ai": null
  },
  "workflow": {
    "requiresSourceMapping": true,
    "unresolvedSourceBlockIds": [
      "menu_two_columns_with_with_heading_no_img-01",
      "menu_two_columns_with_with_heading_no_img-02"
    ],
    "needsCompile": true,
    "needsPublish": false,
    "needsDeploy": false
  },
  "needsCompile": true,
  "needsPublish": false,
  "needsDeploy": false
}
```

Minimalne reguły tego kontraktu:

- `blocksOrder` jest jedynym źródłem kolejności wizualnej
- `blocks` jest mapą po stabilnym `id`
- każdy blok trzyma pełne `data` zgodne z registry
- każdy blok trzyma jawne `source`, nawet gdy jest `null`
- dla bloków menu restauracji `source` jest wymaganym bindingiem do WooCommerce, a `data.menuColumns` jest wyłącznie polem resolvera lub placeholderem technicznym
- top-level `needsCompile`, `needsPublish` i `needsDeploy` pozostają flagami lifecycle draftu; obiekt `workflow` dodaje osobne bramki walidacyjne dla mapowania źródeł
- `workflow.requiresSourceMapping = true` oznacza, że draft nie może przejść do compile albo publish bez jawnego przypisania brakujących źródeł Woo
- `workflow.unresolvedSourceBlockIds[]` wskazuje dokładnie, które instancje bloków nadal czekają na mapowanie `source`
- compile nie zgaduje brakujących `blockKey` ani `blockVersion`

### Pola workflow dla mapowania źródeł

Dla stron menu restauracji draft powinien mieć jawne pola kontrolne, które blokują kompilację do czasu poprawnego przypisania Woo source:

```json
{
  "workflow": {
    "requiresSourceMapping": true,
    "unresolvedSourceBlockIds": [
      "menu_two_columns_with_with_heading_no_img-01"
    ],
    "sourceMappingNotes": {
      "menu_two_columns_with_with_heading_no_img-01": "Wybierz slug albo id kategorii Woo dla sekcji menu.",
      "menu_two_columns_with_with_heading_no_img-02": "Powiaz sekcje z druga kategoria Woo lub oznacz blok jako disabled."
    },
    "needsCompile": true,
    "needsPublish": false,
    "needsDeploy": false
  }
}
```

Zasady dla tych pól:

- `requiresSourceMapping` jest ustawiane przez bootstrap, gdy recipe strony wymaga `woo_category` albo `woo_products`, ale mapping nie jest jeszcze znany
- `unresolvedSourceBlockIds` musi zawierać stabilne `id` wszystkich bloków, które nie mogą zostać bezpiecznie skompilowane
- compile step musi zwrócić błąd kontrolowany, jeśli `requiresSourceMapping = true` albo jeśli którykolwiek blok z listy nadal ma placeholder `sourceValue`
- po zatwierdzeniu wszystkich bindingów system ustawia `requiresSourceMapping = false` i czyści `unresolvedSourceBlockIds`

## Reguły mapowania

### Registry -> Firebase draft

- `registry.blockKey` -> `draft.blocks[id].blockKey`
- `registry.version` -> `draft.blocks[id].blockVersion`
- `registry.defaultData` -> bazowy `draft.blocks[id].data`
- `registry.sourceSchema` -> walidacja `draft.blocks[id].source`
- registry wybiera pola do wypełnienia; scrape nie może dopisywać arbitralnych kluczy poza kontrakt `data`
- dla bloków z `supportedSourceTypes = ["woo_category"]` bootstrap musi tworzyć binding Woo zamiast kopiować pozycje menu ze scrape
- dla stron menu restauracji bootstrap czyści lub zostawia puste `menuColumns` w draftowym `data`, bo runtime resolver Woo jest właścicielem listy produktów

### Firebase draft -> `page_builder_schema`

- `draft.pageSlug`, `draft.title`, `draft.status` -> `page.slug`, `page.title`, `page.status`
- `draft.blocksOrder[]` determinuje kolejność `sections[]`
- `draft.blocks[id].id` -> `sections[].id`
- `draft.blocks[id].blockKey` -> `sections[].blockKey`
- `draft.blocks[id].blockVersion` -> `sections[].blockVersion`
- `draft.blocks[id].data` -> `sections[].data`
- `draft.blocks[id].source` -> `sections[].source`

### Firebase draft -> `page_builder_schema_for_ai`

- każdy wpis `draft.blocks[id]` daje dokładnie jeden wpis w `blocks[]`
- `id` i `blockKey` muszą zostać zachowane bez zmiany
- `content` jest projekcją danych edytowalnych z `draft.blocks[id].data`
- `contentSource`, `editableFields`, `editRoute` i `doNotEditDirectly` są wyprowadzane z kontraktu registry i stanu `source`
- przy `source = null` AI dostaje edytowalne pola statyczne
- przy aktywnym `source` AI dostaje instrukcje routingu edycji zamiast ręcznego nadpisywania runtime-resolved danych
- dla `woo_category` i `woo_products` AI nigdy nie dostaje prawa do ręcznej edycji list produktów, cen ani nazw pozycji menu; direct edit może dotyczyć tylko strukturalnych pól bloku, np. obrazu, anchora, pustego stanu albo samego bindingu `source`

## Krótki workflow operacyjny

1. Scraper zapisuje surowy wynik do `content.md`.
2. Normalizer wydobywa wyłącznie metadane strukturalne, np. slug, URL, page kind i kandydatów SEO; body content oraz listy produktów ze scrape nie są traktowane jako treść kanoniczna.
3. `createPageDraftFromScrape` wybiera zatwierdzone bloki z registry i zakłada pierwszy draft w Firebase jako poprawną strukturę strony.
4. Dla stron menu restauracji bootstrap od razu tworzy Woo-backed bloki menu i wymaga jawnego `source` do WooCommerce zamiast direct edit pozycji menu.
5. Operator albo agent poprawia draft w Firebase bez publikacji do WordPress, ale nie wpisuje ręcznie produktów menu do bloków Woo-backed.
6. Compile waliduje draft względem registry i produkuje oba payloady WordPress.
7. Dopiero osobny publish flow zapisuje `page_builder_schema` i `page_builder_schema_for_ai` do WordPress.

## Spec modułu Code w Make

Moduł Code w Make nie jest edytorem produktów menu. Jego rolą jest walidacja draftu, kontrola source mappingu i deterministyczna kompilacja do obu payloadów WordPress.

### Cel modułu

Wejście:

- aktualny dokument draftu z Firebase
- aktualny `page_builder_schema` z WordPress albo z ostatniego compiled snapshotu
- aktualny `page_builder_schema_for_ai` z WordPress albo z ostatniego compiled snapshotu
- opcjonalne zatwierdzone mapowania `source` przekazane przez operatora albo wcześniejszy krok scenariusza

Wyjście:

- `compiled.page_builder_schema`
- `compiled.page_builder_schema_for_ai`
- zaktualizowany draft z przeliczonym `workflow`
- jawny wynik walidacji `compileResult`

### Kontrakt wejściowy modułu

```json
{
  "firebaseDraft": {
    "pageSlug": "menu-dania-glowne",
    "workflow": {
      "requiresSourceMapping": true,
      "unresolvedSourceBlockIds": [
        "menu_two_columns_with_with_heading_no_img-01"
      ]
    },
    "blocksOrder": [
      "simple_heading_and_paragraph-01",
      "menu_two_columns_with_with_heading_no_img-01"
    ],
    "blocks": {
      "menu_two_columns_with_with_heading_no_img-01": {
        "id": "menu_two_columns_with_with_heading_no_img-01",
        "blockKey": "menu_two_columns_with_with_heading_no_img",
        "blockVersion": 1,
        "enabled": true,
        "variant": "surface",
        "data": {
          "title": "Sekcja menu",
          "menuColumns": [],
          "emptyStateText": "Brak pozycji w tej kategorii."
        },
        "source": {
          "sourceType": "woo_category",
          "sourceValue": "TODO_WOO_CATEGORY_SLUG",
          "options": {
            "splitIntoColumns": 2
          }
        }
      }
    }
  },
  "currentPageBuilderSchema": {},
  "currentPageBuilderSchemaForAi": {},
  "approvedSourceMappings": {
    "menu_two_columns_with_with_heading_no_img-01": {
      "sourceType": "woo_category",
      "sourceValue": "zupy",
      "options": {
        "splitIntoColumns": 2
      }
    }
  }
}
```

### Kontrakt wyjściowy modułu

```json
{
  "ok": true,
  "compileResult": {
    "status": "compiled",
    "errors": [],
    "warnings": []
  },
  "firebaseDraft": {
    "workflow": {
      "requiresSourceMapping": false,
      "unresolvedSourceBlockIds": [],
      "needsCompile": false,
      "needsPublish": true,
      "needsDeploy": false
    }
  },
  "compiled": {
    "page_builder_schema": {},
    "page_builder_schema_for_ai": {}
  }
}
```

### Reguły działania modułu

1. Moduł najpierw wstrzykuje do draftu wyłącznie zatwierdzone `approvedSourceMappings`.
2. Moduł waliduje każdy blok przez registry po `blockKey`, `blockVersion`, `data` i `source`.
3. Jeśli `workflow.requiresSourceMapping = true` albo którykolwiek blok nadal ma placeholder typu `TODO_WOO_CATEGORY_SLUG`, moduł zwraca `ok = false` i nie produkuje publishable output.
4. Dla bloków z `sourceType = "woo_category"` albo `sourceType = "woo_products"` moduł nie bierze produktów, cen ani opisów z `firebaseDraft.blocks[*].data.menuColumns`.
5. Dla bloków Woo-backed `page_builder_schema_for_ai` ma zawierać tylko pola strukturalne i routing edycji, np. `contentSource`, `editableFields`, `editRoute`, `doNotEditDirectly`.
6. Kompilacja zawsze produkuje oba payloady razem: `page_builder_schema` oraz `page_builder_schema_for_ai`.
7. Sukces kompilacji ustawia `needsCompile = false` i `needsPublish = true`; publish jest osobnym krokiem scenariusza.

### Twarde zakazy dla modułu Code

- nie wolno przepisywać body content ze scrape do list produktów w blokach menu
- nie wolno generować nowych kategorii Woo z tekstu scrape
- nie wolno zmieniać kolejności bloków poza `blocksOrder`
- nie wolno zmieniać `id` bloków
- nie wolno publikować tylko jednego z dwóch payloadów WordPress

## Przykład: `menu-dania-glowne`

Plik wejściowy `zip/SRIPTS/wp-seo-scraper/output/menu-dania-glowne/content.md` zawiera m.in.:

- tytuł strony: `Dania Główne`
- URL strony i kandydatów SEO
- dużo treści body, w tym nazwy dań, opisy i ceny

Docelowy bezpieczny bootstrap nie powinien traktować nazw dań, opisów i cen z tego pliku jako payloadu direct edit. Dla menu restauracji poprawny draft ma budować wyłącznie strukturę strony oraz binding do WooCommerce, np.:

```json
{
  "pageSlug": "menu-dania-glowne",
  "title": "Dania Główne",
  "workflow": {
    "requiresSourceMapping": true,
    "unresolvedSourceBlockIds": [
      "menu_two_columns_with_with_heading_no_img-01",
      "menu_two_columns_with_with_heading_no_img-02",
      "menu_two_columns_with_with_heading_no_img-03"
    ],
    "needsCompile": true,
    "needsPublish": false,
    "needsDeploy": false
  },
  "blocksOrder": [
    "simple_heading_and_paragraph-01",
    "menu_two_columns_with_with_heading_no_img-01",
    "menu_two_columns_with_with_heading_no_img-02",
    "menu_two_columns_with_with_heading_no_img-03"
  ],
  "blocks": {
    "simple_heading_and_paragraph-01": {
      "id": "simple_heading_and_paragraph-01",
      "blockKey": "simple_heading_and_paragraph",
      "blockVersion": 1,
      "enabled": true,
      "variant": null,
      "data": {
        "eyebrow": "Menu",
        "title": "Dania Główne",
        "richTextHtml": "<p>Opis sekcji wprowadzajacej strony menu.</p>"
      },
      "source": null
    },
    "menu_two_columns_with_with_heading_no_img-01": {
      "id": "menu_two_columns_with_with_heading_no_img-01",
      "blockKey": "menu_two_columns_with_with_heading_no_img",
      "blockVersion": 1,
      "enabled": true,
      "variant": "surface",
      "data": {
        "title": "Zupy",
        "menuColumns": [],
        "emptyStateText": "Brak pozycji w tej kategorii."
      },
      "source": {
        "sourceType": "woo_category",
        "sourceValue": "TODO_WOO_CATEGORY_SLUG_ZUPY",
        "options": {
          "splitIntoColumns": 2
        }
      }
    },
    "menu_two_columns_with_with_heading_no_img-02": {
      "id": "menu_two_columns_with_with_heading_no_img-02",
      "blockKey": "menu_two_columns_with_with_heading_no_img",
      "blockVersion": 1,
      "enabled": true,
      "variant": "surface",
      "data": {
        "title": "Pierogi i przystawki",
        "menuColumns": [],
        "emptyStateText": "Brak pozycji w tej kategorii."
      },
      "source": {
        "sourceType": "woo_category",
        "sourceValue": "TODO_WOO_CATEGORY_SLUG_PIEROGI_I_PRZYSTAWKI",
        "options": {
          "splitIntoColumns": 2
        }
      }
    },
    "menu_two_columns_with_with_heading_no_img-03": {
      "id": "menu_two_columns_with_with_heading_no_img-03",
      "blockKey": "menu_two_columns_with_with_heading_no_img",
      "blockVersion": 1,
      "enabled": true,
      "variant": "surface",
      "data": {
        "title": "Dania główne",
        "menuColumns": [],
        "emptyStateText": "Brak pozycji w tej kategorii."
      },
      "source": {
        "sourceType": "woo_category",
        "sourceValue": "TODO_WOO_CATEGORY_SLUG_DANIA_GLOWNE",
        "options": {
          "splitIntoColumns": 2
        }
      }
    }
  }
}
```

W tym przykładzie:

- nagłówek strony trafia do `simple_heading_and_paragraph`
- każda sekcja menu dostaje osobny blok Woo-backed z własnym `source`
- `workflow.requiresSourceMapping = true` blokuje compile do czasu zatwierdzenia mappingu kategorii Woo
- listy produktów, ceny i nazwy dań nie są kopiowane ze scrape do `data.menuColumns`
- `source.sourceValue` musi pochodzić z zatwierdzonego mapowania kategorii Woo, a nie z domysłów na podstawie body content
- `page_builder_schema_for_ai` dla tych bloków musi zabraniać direct edit produktów i kierować zmiany produktowe do WooCommerce

## Anti-rules

- nie traktuj tej notatki jako zamiennika obecnego repo-first workflow
- nie zapisuj logiki kontraktów bloków wyłącznie w Firebase
- nie generuj bloków spoza registry
- nie używaj body content z plików output do wypełniania treści bloków menu, opisów dań ani cen
- nie traktuj produktów menu restauracji jako direct edit w Firebase ani w `page_builder_schema_for_ai`
- nie wpisuj ręcznie `menuColumns[].items` dla bloków z `sourceType = "woo_category"` lub `sourceType = "woo_products"`
- nie zgaduj mapowań `woo_category` wyłącznie na podstawie tekstu scrape; mapping musi pochodzić z zatwierdzonej recepty, operatora albo jawnej konfiguracji
- nie twórz hero image na podstawie `FEATURED IMAGE` ze scrape tylko dlatego, że taki wpis istnieje w markdown
- nie kompiluj do jednego payloadu; oba: `page_builder_schema` i `page_builder_schema_for_ai` są wymagane