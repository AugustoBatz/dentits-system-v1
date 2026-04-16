import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "src", "generated");
const target = path.join(root, "dist", "generated");

if (!fs.existsSync(source)) {
  console.log("No existe src/generated; omitiendo copia del cliente Prisma.");
  process.exit(0);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });

console.log("Cliente Prisma copiado a dist/generated.");
