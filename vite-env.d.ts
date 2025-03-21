interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
  VITE_BACKEND_STORAGE_URL: string;
  VITE_CLOUDINARY_CLOUD_NAME: string;
  VITE_CLOUDINARY_API_KEY: string;
  // Add other environment variables as needed
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
