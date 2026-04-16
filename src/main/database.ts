import { app } from "electron";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

function resolveTemplatePath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "prisma", "template.db");
  }
  return path.join(app.getAppPath(), "prisma", "template.db");
}

function resolveSchemaPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "prisma", "schema.prisma");
  }
  return path.join(app.getAppPath(), "prisma", "schema.prisma");
}

function resolvePrismaCliPath(): string {
  return require.resolve("prisma/build/index.js");
}

function resolveSchemaEnginePath(): string | null {
  if (app.isPackaged) {
    const packagedEngine = path.join(process.resourcesPath, "prisma-engines", "schema-engine-windows.exe");
    return fs.existsSync(packagedEngine) ? packagedEngine : null;
  }

  try {
    return require.resolve("@prisma/engines/schema-engine-windows.exe");
  } catch {
    return null;
  }
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
  const template = resolveTemplatePath();
  const schemaPath = resolveSchemaPath();
  const schemaEnginePath = resolveSchemaEnginePath();

  fs.mkdirSync(userData, { recursive: true });

  if (!fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0) {
    if (!fs.existsSync(template)) {
      throw new Error(
        `No se encontró la base plantilla en ${template}. Ejecuta "npm run db:template" antes de empaquetar.`,
      );
    }
    fs.copyFileSync(template, dbPath);
    console.log("Base plantilla copiada a AppData:", dbPath);
  }

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`No se encontró el schema de Prisma en ${schemaPath}.`);
  }

  process.env.DATABASE_URL = sqliteDatabaseUrl(dbPath);
  fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);

  try {
    console.log("Ejecutando prisma db push para sincronizar la base de datos...");
    execFileSync(
      process.execPath,
      [resolvePrismaCliPath(), "db", "push", "--skip-generate", "--schema", schemaPath],
      {
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL,
          ELECTRON_RUN_AS_NODE: "1",
          ...(schemaEnginePath
            ? {
                PRISMA_SCHEMA_ENGINE_BINARY: schemaEnginePath,
              }
            : {}),
        },
        stdio: "pipe",
      },
    );
    console.log("Prisma db push completado correctamente.");
  } catch (error) {
    const details =
      error instanceof Error && "stderr" in error
        ? String(error.stderr)
        : error instanceof Error
          ? error.message
          : String(error);
    console.error("No fue posible ejecutar prisma db push sobre la base de AppData.");
    console.error(details);
    throw error;
  }

  return dbPath;
}
