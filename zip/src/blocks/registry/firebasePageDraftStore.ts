import {
  parseFirebasePageDraft,
  type FirebasePageDraft,
} from "./firebasePageDraft";

const DEFAULT_COLLECTION_NAME = "pageBuilderDrafts";

type FirestoreDocumentSnapshotLike = {
  id: string;
  exists: boolean;
  data(): unknown;
};

type FirestoreDocumentReferenceLike = {
  id: string;
  set(value: unknown): Promise<void>;
  get(): Promise<FirestoreDocumentSnapshotLike>;
};

type FirestoreCollectionReferenceLike = {
  doc(documentId?: string): FirestoreDocumentReferenceLike;
};

export type FirestoreLike = {
  collection(collectionName: string): FirestoreCollectionReferenceLike;
};

export type FirebasePageDraftStoreSaveResult = {
  collectionName: string;
  docId: string;
  draft: FirebasePageDraft;
};

export type FirebasePageDraftStore = {
  saveDraft(
    draft: FirebasePageDraft,
    options?: { docId?: string },
  ): Promise<FirebasePageDraftStoreSaveResult>;
  upsertDraft(
    draft: FirebasePageDraft,
    options?: { docId?: string },
  ): Promise<FirebasePageDraftStoreSaveResult>;
  loadDraft(docId: string): Promise<FirebasePageDraft | null>;
};

const cloneValue = <T,>(value: T): T => {
  return structuredClone(value);
};

const normalizeDraft = (draft: FirebasePageDraft): FirebasePageDraft => {
  return parseFirebasePageDraft(cloneValue(draft));
};

const resolveDocId = (draft: FirebasePageDraft, docId?: string): string => {
  return docId?.trim() || draft.pageSlug;
};

const buildSaveResult = (
  collectionName: string,
  docId: string,
  draft: FirebasePageDraft,
): FirebasePageDraftStoreSaveResult => {
  return {
    collectionName,
    docId,
    draft,
  };
};

export const createFirestoreFirebasePageDraftStore = ({
  firestore,
  collectionName = DEFAULT_COLLECTION_NAME,
}: {
  firestore: FirestoreLike;
  collectionName?: string;
}): FirebasePageDraftStore => {
  const saveToFirestore = async (
    draft: FirebasePageDraft,
    options?: { docId?: string },
  ): Promise<FirebasePageDraftStoreSaveResult> => {
    const parsedDraft = normalizeDraft(draft);
    const docId = resolveDocId(parsedDraft, options?.docId);
    const document = firestore.collection(collectionName).doc(docId);

    await document.set(cloneValue(parsedDraft));

    return buildSaveResult(collectionName, docId, parsedDraft);
  };

  return {
    saveDraft(draft, options) {
      return saveToFirestore(draft, options);
    },
    upsertDraft(draft, options) {
      return saveToFirestore(draft, options);
    },
    async loadDraft(docId) {
      const snapshot = await firestore.collection(collectionName).doc(docId).get();

      if (!snapshot.exists) {
        return null;
      }

      return normalizeDraft(snapshot.data() as FirebasePageDraft);
    },
  };
};

export const createInMemoryFirebasePageDraftStore = ({
  collectionName = DEFAULT_COLLECTION_NAME,
}: {
  collectionName?: string;
} = {}): FirebasePageDraftStore => {
  const records = new Map<string, FirebasePageDraft>();

  const writeDraft = async (
    draft: FirebasePageDraft,
    options?: { docId?: string },
  ): Promise<FirebasePageDraftStoreSaveResult> => {
    const parsedDraft = normalizeDraft(draft);
    const docId = resolveDocId(parsedDraft, options?.docId);

    records.set(docId, cloneValue(parsedDraft));

    return buildSaveResult(collectionName, docId, parsedDraft);
  };

  return {
    saveDraft(draft, options) {
      return writeDraft(draft, options);
    },
    upsertDraft(draft, options) {
      return writeDraft(draft, options);
    },
    async loadDraft(docId) {
      const draft = records.get(docId);

      if (!draft) {
        return null;
      }

      return normalizeDraft(draft);
    },
  };
};