// src/env.d.ts

interface ImportMetaEnv {
  readonly VITE_DB_URL: string;
  readonly VITE_DB_ANON_KEY: string;
  // If you have more, add them here:
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}