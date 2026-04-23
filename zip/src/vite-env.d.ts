/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORDPRESS_BASE_URL?: string;
  readonly VITE_BRIDGE_BASE_URL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_REACT_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}