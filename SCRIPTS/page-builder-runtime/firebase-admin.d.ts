declare module "firebase-admin/app" {
  export type ServiceAccount = {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
  };

  export function cert(serviceAccount: ServiceAccount): unknown;
  export function getApp(appName?: string): unknown;
  export function initializeApp(
    options?: { credential?: unknown; projectId?: string },
    appName?: string,
  ): unknown;
}

declare module "firebase-admin/firestore" {
  export function getFirestore(app?: unknown, databaseId?: string): any;
}