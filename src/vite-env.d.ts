/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL: string;
  readonly VITE_CKAN_API_BASE: string;
  readonly VITE_FOODLAND_RECIPES_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
