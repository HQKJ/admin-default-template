/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GLOB_APP_TITLE: string;
  readonly VITE_APP_BASE_API: string;
  readonly VITE_APP_HOMEPAGE: string;
  readonly VITE_IS_SUPPLIER: string;
  readonly VITE_APP_ENV: 'development' | 'production';
  readonly VITE_APP_SUP_EMAIL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
