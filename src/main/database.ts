import { app } from "electron";
import fs from "node:fs";
import path from "node:path";

function resolveTemplatePath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "prisma", "template.db");
  }
  return path.join(app.getAppPath(), "prisma", "template.db");
}

/**
 * Prisma + SQLite en Windows no acepta bien `file:///C:/...` de pathToFileURL;
 * usar `file:/C:/ruta/con/barras` evita fallos al abrir la base.
 */
function sqliteDatabaseUrl(absFilePath: string): string {
  const resolved = path.resolve(absFilePath);
  const forward = resolved.replace(/\\/g, "/");

  if (process.platform === "win32" && /^[A-Za-z]:\//.test(forward)) {
    return `file:/${forward}`;
  }

  return `file:${forward}`;
}

/**
 * Asegura SQLite en userData y expone DATABASE_URL para Prisma antes de cargar el servidor.
 */
export function ensureDatabaseFile(): string {
  const userData = app.getPath("userData");
  const dbPath = path.join(userData, "dentis.db");

  fs.mkdirSync(userData, { recursive: true });

  if (!fs.existsSync(dbPath)) {
    const template = resolveTemplatePath();
    if (!fs.existsSync(template)) {
      throw new Error(
        `No se encontró la base plantilla en ${template}. Ejecuta "npm run db:template" antes de empaquetar.`,
      );
    }
    fs.copyFileSync(template, dbPath);
  }

  process.env.DATABASE_URL = sqliteDatabaseUrl(dbPath);
  fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
  return dbPath;
}
