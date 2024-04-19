interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
  // Add other environment variables as needed
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
