import { app, dialog } from "electron";
import fs from "node:fs";
import path from "node:path";
import log from "electron-log";

const appLogPath = path.join(app.getPath("userData"), "app.log");

export function configureLogging() {
  log.initialize();
  log.transports.file.resolvePathFn = () => appLogPath;
  log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";
  log.transports.file.level = "info";
  log.transports.console.level = "info";

  const originalConsoleLog = console.log.bind(console);
  const originalConsoleError = console.error.bind(console);
  const originalConsoleWarn = console.warn.bind(console);

  console.log = (...args: unknown[]) => {
    log.info(...args);
    originalConsoleLog(...args);
  };

  console.warn = (...args: unknown[]) => {
    log.warn(...args);
    originalConsoleWarn(...args);
  };

  console.error = (...args: unknown[]) => {
    log.error(...args);
    originalConsoleError(...args);
  };

  process.on("uncaughtException", (error) => {
    log.error("uncaughtException", error);
  });

  process.on("unhandledRejection", (reason) => {
    log.error("unhandledRejection", reason);
  });
}

export function getLogPath() {
  return appLogPath;
}

export async function exportLogs() {
  if (!fs.existsSync(appLogPath)) {
    fs.writeFileSync(appLogPath, "");
  }

  const defaultPath = path.join(app.getPath("documents"), `dentis-soft-logs-${new Date().toISOString().slice(0, 10)}.log`);
  const result = await dialog.showSaveDialog({
    title: "Exportar Logs de Error",
    defaultPath,
    filters: [{ name: "Archivo de log", extensions: ["log"] }],
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }

  fs.copyFileSync(appLogPath, result.filePath);
  return { canceled: false, filePath: result.filePath };
}
