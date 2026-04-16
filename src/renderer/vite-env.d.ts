/// <reference types="vite/client" />

interface DentisPreload {
  getApiBase: () => Promise<string>;
  exportLogs: () => Promise<{ canceled: boolean; filePath?: string }>;
  getLogPath: () => Promise<string>;
}

declare global {
  interface Window {
    dentis?: DentisPreload;
  }
}

interface ImportMetaEnv {
  readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
