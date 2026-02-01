interface ImportMetaEnv {
  readonly VITE_BASE_API: string;
  readonly VITE_BASE_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
