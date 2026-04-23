import {
  createFirestoreFirebasePageDraftStore,
  type FirebasePageDraftStore,
  type FirestoreLike,
} from "../../zip/src/blocks/registry/firebasePageDraftStore.ts";

const DEFAULT_COLLECTION_NAME = "pageBuilderDrafts";
const DEFAULT_APP_NAME = "page-builder-runtime";

const requireNonEmptyEnv = (value: string | undefined, variableName: string): string => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }

  return trimmedValue;
};

const normalizeOptionalEnv = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : undefined;
};

export type PageBuilderFirestoreEnv = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  collectionName: string;
  databaseId?: string;
  appName: string;
};

type FirebaseAdminAppModule = {
  cert(serviceAccount: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  }): unknown;
  getApp(appName?: string): unknown;
  initializeApp(
    options?: { credential?: unknown; projectId?: string },
    appName?: string,
  ): unknown;
};

type FirebaseAdminFirestoreModule = {
  getFirestore(app?: unknown, databaseId?: string): FirestoreLike;
};

const loadFirebaseAdminApp = async (): Promise<FirebaseAdminAppModule> => {
  return import("firebase-admin/app") as Promise<FirebaseAdminAppModule>;
};

const loadFirebaseAdminFirestore = async (): Promise<FirebaseAdminFirestoreModule> => {
  return import("firebase-admin/firestore") as Promise<FirebaseAdminFirestoreModule>;
};

export const parsePageBuilderFirestoreEnv = (
  env: NodeJS.ProcessEnv = process.env,
): PageBuilderFirestoreEnv => {
  return {
    projectId: requireNonEmptyEnv(env.PAGE_BUILDER_FIREBASE_PROJECT_ID, "PAGE_BUILDER_FIREBASE_PROJECT_ID"),
    clientEmail: requireNonEmptyEnv(
      env.PAGE_BUILDER_FIREBASE_CLIENT_EMAIL,
      "PAGE_BUILDER_FIREBASE_CLIENT_EMAIL",
    ),
    privateKey: requireNonEmptyEnv(
      env.PAGE_BUILDER_FIREBASE_PRIVATE_KEY,
      "PAGE_BUILDER_FIREBASE_PRIVATE_KEY",
    ).replace(/\\n/g, "\n"),
    collectionName:
      normalizeOptionalEnv(env.PAGE_BUILDER_FIREBASE_DRAFT_COLLECTION) ?? DEFAULT_COLLECTION_NAME,
    databaseId: normalizeOptionalEnv(env.PAGE_BUILDER_FIREBASE_DATABASE_ID),
    appName: normalizeOptionalEnv(env.PAGE_BUILDER_FIREBASE_APP_NAME) ?? DEFAULT_APP_NAME,
  };
};

export const createLiveFirestoreFirebasePageDraftStore = async ({
  env = parsePageBuilderFirestoreEnv(process.env),
  loadAdminApp = loadFirebaseAdminApp,
  loadAdminFirestore = loadFirebaseAdminFirestore,
}: {
  env?: PageBuilderFirestoreEnv;
  loadAdminApp?: () => Promise<FirebaseAdminAppModule>;
  loadAdminFirestore?: () => Promise<FirebaseAdminFirestoreModule>;
} = {}): Promise<FirebasePageDraftStore> => {
  const adminApp = await loadAdminApp();
  const adminFirestore = await loadAdminFirestore();

  let app: unknown;

  try {
    app = adminApp.getApp(env.appName);
  } catch {
    app = adminApp.initializeApp(
      {
        credential: adminApp.cert({
          projectId: env.projectId,
          clientEmail: env.clientEmail,
          privateKey: env.privateKey,
        }),
        projectId: env.projectId,
      },
      env.appName,
    );
  }

  const firestore = env.databaseId
    ? adminFirestore.getFirestore(app, env.databaseId)
    : adminFirestore.getFirestore(app);

  return createFirestoreFirebasePageDraftStore({
    firestore,
    collectionName: env.collectionName,
  });
};