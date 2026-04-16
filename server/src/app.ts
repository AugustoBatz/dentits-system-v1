import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import fs from "node:fs";
import path from "node:path";
import pkg from "@prisma/client";
import { ZodError } from "zod";
import { patientRouter } from "./modules/patients/patient.routes";

const { Prisma } = pkg;
export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/patients", patientRouter);

const clientDistPath = path.resolve(__dirname, "../../client/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api).*/, (_request, response) => {
    response.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (_request, response) => {
    response.json({
      message: "Backend de Dentis Soft operativo. Ejecuta el build del client para servir la UI estática.",
    });
  });
}

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Payload inválido",
      issues: error.issues,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = Array.isArray(error.meta?.target) ? error.meta.target.join(",") : "";
    const message = target.includes("userCode")
      ? "No fue posible asignar un código único al paciente"
      : "Ya existe un paciente con el mismo número de documento";

    return response.status(409).json({
      message,
    });
  }

  console.error(error);
  return response.status(500).json({ message: "Error interno del servidor" });
});
