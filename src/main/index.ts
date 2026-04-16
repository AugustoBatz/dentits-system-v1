import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureDatabaseFile } from "./database.js";
import { configureLogging, exportLogs, getLogPath } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let apiBase = "";
const contentSecurityPolicy =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' http://localhost:5173 http://127.0.0.1:* ws://localhost:5173 ws://127.0.0.1:5173;";

app.on("web-contents-created", (_event, contents) => {
  contents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = details.responseHeaders ?? {};
    responseHeaders["Content-Security-Policy"] = [contentSecurityPolicy];
    callback({ responseHeaders });
  });
});

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: "Dentis Soft",
    show: false,
  });

  mainWindow.once("ready-to-show", () => mainWindow?.show());

  mainWindow.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    const label = level === 3 ? "ERROR" : level === 2 ? "WARN" : "INFO";
    console.log(`[Renderer ${label}] ${message} (${sourceId}:${line})`);
  });

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("Renderer process gone", details);
  });

  mainWindow.webContents.on("unresponsive", () => {
    console.error("Renderer unresponsive");
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    void mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    void mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function bootstrap(): Promise<void> {
  configureLogging();
  console.log("Iniciando Dentis Soft");
  const dbPath = ensureDatabaseFile();
  console.log("Database file path:", dbPath);
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const { startServer } = await import("./server.js");
  const port = await startServer();
  apiBase = `http://127.0.0.1:${port}`;

  ipcMain.handle("dentis:get-api-base", () => apiBase);
  ipcMain.handle("dentis:export-logs", async () => exportLogs());
  ipcMain.handle("dentis:get-log-path", () => getLogPath());

  createWindow();
}

void app.whenReady().then(() => {
  void bootstrap();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
