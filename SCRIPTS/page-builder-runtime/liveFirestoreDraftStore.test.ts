import assert from "node:assert/strict";
import test from "node:test";

import type { FirestoreLike } from "../../zip/src/blocks/registry/firebasePageDraftStore.ts";
import {
  createLiveFirestoreFirebasePageDraftStore,
  parsePageBuilderFirestoreEnv,
} from "./liveFirestoreDraftStore.ts";

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

const createInMemoryFirestore = (): FirestoreLike => {
  const records = new Map<string, Map<string, unknown>>();

  return {
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

test("live Firestore adapter builds a shared store with firebase-admin modules injected", async () => {
  const firestore = createInMemoryFirestore();
  let capturedCredential:
    | {
        projectId: string;
        clientEmail: string;
        privateKey: string;
      }
    | null = null;
  let capturedAppName = "";
  let capturedDatabaseId: string | undefined;

  const store = await createLiveFirestoreFirebasePageDraftStore({
    env: {
      projectId: "bulwar-test",
      clientEmail: "runtime@bulwar-test.iam.gserviceaccount.com",
      privateKey: "line-1\nline-2",
      collectionName: "customDrafts",
      databaseId: "draft-db",
      appName: "page-builder-runtime-test",
    },
    loadAdminApp: async () => ({
      cert(serviceAccount) {
        capturedCredential = serviceAccount;
        return { serviceAccount };
      },
      getApp() {
        throw new Error("App not initialized");
      },
      initializeApp(_options, appName) {
        capturedAppName = appName ?? "";
        return { appName };
      },
    }),
    loadAdminFirestore: async () => ({
      getFirestore(_app, databaseId) {
        capturedDatabaseId = databaseId;
        return firestore;
      },
    }),
  });

  await store.saveDraft(createBaseDraft(), { docId: "draft-001" });
  const loaded = await store.loadDraft("draft-001");

  assert.equal(capturedAppName, "page-builder-runtime-test");
  assert.equal(capturedDatabaseId, "draft-db");
  assert.equal(capturedCredential?.projectId, "bulwar-test");
  assert.equal(capturedCredential?.privateKey, "line-1\nline-2");
  assert.equal(loaded?.pageSlug, "menu-kolacje");
});

test("Firestore env parser enforces required values and normalizes escaped newlines", () => {
  const env = parsePageBuilderFirestoreEnv({
    PAGE_BUILDER_FIREBASE_PROJECT_ID: "bulwar-test",
    PAGE_BUILDER_FIREBASE_CLIENT_EMAIL: "runtime@bulwar-test.iam.gserviceaccount.com",
    PAGE_BUILDER_FIREBASE_PRIVATE_KEY: "line-1\\nline-2",
  });

  assert.equal(env.collectionName, "pageBuilderDrafts");
  assert.equal(env.appName, "page-builder-runtime");
  assert.equal(env.privateKey, "line-1\nline-2");
  assert.throws(
    () => parsePageBuilderFirestoreEnv({ PAGE_BUILDER_FIREBASE_PROJECT_ID: "bulwar-test" }),
    /PAGE_BUILDER_FIREBASE_CLIENT_EMAIL/,
  );
});