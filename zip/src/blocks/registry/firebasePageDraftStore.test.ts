import assert from "node:assert/strict";
import test from "node:test";

import {
  createFirestoreFirebasePageDraftStore,
  type FirestoreLike,
} from "./firebasePageDraftStore";

const createBaseDraft = () => ({
  pageSlug: "menu-kolacje",
  pageKind: "restaurant_menu",
  CompanyName: null,
  websiteUrl: null,
  title: "Kolacje",
  templateKey: "restaurant-menu",
  status: "draft" as const,
  blocksOrder: [
    "simple_heading_and_paragraph-01",
    "menu_two_columns_with_with_heading_no_img-01",
  ],
  blocks: {
    "simple_heading_and_paragraph-01": {
      id: "simple_heading_and_paragraph-01",
      blockKey: "simple_heading_and_paragraph",
      blockVersion: 1,
      variant: null,
      enabled: true,
      data: {
        eyebrow: "Draft page",
        title: "Kolacje",
        richTextHtml: "<p>Editorial copy</p>",
      },
      source: null,
      meta: {},
    },
    "menu_two_columns_with_with_heading_no_img-01": {
      id: "menu_two_columns_with_with_heading_no_img-01",
      blockKey: "menu_two_columns_with_with_heading_no_img",
      blockVersion: 1,
      variant: "surface",
      enabled: true,
      data: {
        title: "Kolacje",
        menuColumns: [],
        emptyStateText: "Brak pozycji w tej kategorii.",
      },
      source: {
        sourceType: "woo_category",
        sourceValue: "TODO_WOO_CATEGORY_SLUG",
        options: {
          splitIntoColumns: 2,
        },
      },
      meta: {},
    },
  },
  compiled: {
    page_builder_schema: null,
    page_builder_schema_for_ai: null,
  },
  needsCompile: true,
  needsPublish: false,
  needsDeploy: false,
});

const createInMemoryFirestore = (): FirestoreLike & {
  records: Map<string, Map<string, unknown>>;
} => {
  const records = new Map<string, Map<string, unknown>>();

  return {
    records,
    collection(collectionName: string) {
      if (!records.has(collectionName)) {
        records.set(collectionName, new Map());
      }

      const collectionRecords = records.get(collectionName)!;

      return {
        doc(documentId?: string) {
          const resolvedId = documentId ?? `generated-${collectionRecords.size + 1}`;

          return {
            id: resolvedId,
            async set(value: unknown) {
              collectionRecords.set(resolvedId, structuredClone(value));
            },
            async get() {
              return {
                id: resolvedId,
                exists: collectionRecords.has(resolvedId),
                data() {
                  return collectionRecords.get(resolvedId);
                },
              };
            },
          };
        },
      };
    },
  };
};

test("Firestore draft store saves and loads FirebasePageDraft by default pageSlug doc id", async () => {
  const firestore = createInMemoryFirestore();
  const store = createFirestoreFirebasePageDraftStore({ firestore });

  const saved = await store.saveDraft(createBaseDraft());
  const loaded = await store.loadDraft("menu-kolacje");

  assert.equal(saved.collectionName, "pageBuilderDrafts");
  assert.equal(saved.docId, "menu-kolacje");
  assert.equal(loaded?.pageSlug, "menu-kolacje");
  assert.equal(loaded?.blocksOrder[1], "menu_two_columns_with_with_heading_no_img-01");
  assert.equal(loaded?.workflow?.requiresSourceMapping, true);
});

test("Firestore draft store upserts an existing draft under an explicit doc id", async () => {
  const firestore = createInMemoryFirestore();
  const store = createFirestoreFirebasePageDraftStore({ firestore, collectionName: "customDrafts" });

  await store.saveDraft(createBaseDraft(), { docId: "draft-001" });
  const upserted = await store.upsertDraft(
    {
      ...createBaseDraft(),
      title: "Kolacje updated",
    },
    { docId: "draft-001" },
  );
  const loaded = await store.loadDraft("draft-001");

  assert.equal(upserted.collectionName, "customDrafts");
  assert.equal(upserted.docId, "draft-001");
  assert.equal(loaded?.title, "Kolacje updated");
  assert.equal(firestore.records.get("customDrafts")?.size, 1);
});