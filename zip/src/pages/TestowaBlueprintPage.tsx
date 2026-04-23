import { startTransition, useEffect, useState } from "react";

import { fetchWordPressPageBuilderSchema } from "../blocks/registry/fetchWordPressPageBuilderSchema";
import type { PageBuilderSchema } from "../blocks/registry/pageBuilderSchema";
import { resolvePageBuilderSchemaSources } from "../blocks/registry/resolvePageBuilderSources";
import { renderPageBuilderSections } from "../blocks/registry/renderPageBuilderSections";

const PAGE_BUILDER_SLUG = "testowa-blueprint";

export default function TestowaBlueprintPage() {
  const [pageSchema, setPageSchema] = useState<PageBuilderSchema | null>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetchWordPressPageBuilderSchema(PAGE_BUILDER_SLUG, abortController.signal)
      .then((schema) => resolvePageBuilderSchemaSources(schema, abortController.signal))
      .then((resolvedSchema) => {
        startTransition(() => {
          setPageSchema(resolvedSchema);
          setSourceError(null);
        });
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) {
          return;
        }

        const message = error instanceof Error
          ? error.message
          : "Nie udało się pobrać danych WooCommerce.";

        console.error("Failed to resolve page builder sources", error);

        startTransition(() => {
          setSourceError(message);
        });
      });

    return () => {
      abortController.abort();
    };
  }, []);

  return (
      <main className="overflow-hidden">
        {pageSchema ? renderPageBuilderSections(pageSchema) : (
          <div className="page-margin py-10">
            <p className="font-body text-sm text-zinc-500">Ładowanie page_builder_schema z WordPressa...</p>
          </div>
        )}
        {sourceError ? (
          <div className="page-margin py-10">
            <p className="font-body text-sm text-zinc-500">{sourceError}</p>
          </div>
        ) : null}
      </main>
  );
}
