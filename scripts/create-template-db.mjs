import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const templatePath = path.join(root, "prisma", "template.db");
const force = process.env.FORCE_TEMPLATE_DB === "1";

if (!force && fs.existsSync(templatePath)) {
  console.log(
    "prisma/template.db ya existe. Usa FORCE_TEMPLATE_DB=1 para regenerar.",
  );
  process.exit(0);
}

if (fs.existsSync(templatePath)) {
  fs.unlinkSync(templatePath);
}

/**
 * Relativa al directorio del schema (`prisma/`) → `prisma/template.db`.
 * Evita URLs absolutas `file:///D:/...`, que en Windows suelen dar "os error 161"
 * con el schema engine de Prisma.
 */
const databaseUrl = "file:./template.db";

execSync("npx prisma migrate deploy", {
  cwd: root,
  env: { ...process.env, DATABASE_URL: databaseUrl },
  stdio: "inherit",
});

execSync("npx prisma db seed", {
  cwd: root,
  env: { ...process.env, DATABASE_URL: databaseUrl },
  stdio: "inherit",
});
