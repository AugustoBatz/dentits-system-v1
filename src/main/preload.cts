import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("dentis", {
  getApiBase: (): Promise<string> => ipcRenderer.invoke("dentis:get-api-base"),
  exportLogs: (): Promise<{ canceled: boolean; filePath?: string }> => ipcRenderer.invoke("dentis:export-logs"),
  getLogPath: (): Promise<string> => ipcRenderer.invoke("dentis:get-log-path"),
});
