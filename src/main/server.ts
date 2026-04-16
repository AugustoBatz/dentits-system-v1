import pkg from "../generated/client/index.js";
import cors from "cors";
import express, { type Request, type Response } from "express";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const PATIENT_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PATIENT_CODE_LENGTH = 6;

function toPatientDto(p: {
  id: number;
  userCode: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: Date;
  gender: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  occupation: string | null;
  allergies: string | null;
  currentMedications: string | null;
  systemicDiseases: string | null;
  surgeries: string | null;
  pregnant: boolean;
  smoker: boolean;
  medicalNotes: string | null;
  lastDentalVisit: Date | null;
  reasonForConsultation: string | null;
  previousTreatments: string | null;
  brushingFrequency: string | null;
  flossing: boolean;
  bleedingGums: boolean;
  bruxism: boolean;
  dentalNotes: string | null;
  isInPain: boolean;
  painLevel: number;
  painLocation: string | null;
  painDuration: string | null;
  painTrigger: string | null;
  painDescription: string | null;
  takesMedication: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: p.id,
    userCode: p.userCode,
    fullName: `${p.firstName} ${p.lastName}`.trim(),
    personalData: {
      firstName: p.firstName,
      lastName: p.lastName,
      documentType: p.documentType,
      documentNumber: p.documentNumber,
      birthDate: p.birthDate.toISOString(),
      gender: p.gender ?? "",
      phone: p.phone,
      email: p.email ?? "",
      address: p.address ?? "",
      occupation: p.occupation ?? "",
    },
    medicalHistory: {
      allergies: p.allergies ?? "",
      currentMedications: p.currentMedications ?? "",
      systemicDiseases: p.systemicDiseases ?? "",
      surgeries: p.surgeries ?? "",
      pregnant: p.pregnant,
      smoker: p.smoker,
      medicalNotes: p.medicalNotes ?? "",
    },
    dentalHistory: {
      lastDentalVisit: p.lastDentalVisit ? p.lastDentalVisit.toISOString() : "",
      reasonForConsultation: p.reasonForConsultation ?? "",
      previousTreatments: p.previousTreatments ?? "",
      brushingFrequency: p.brushingFrequency ?? "",
      flossing: p.flossing,
      bleedingGums: p.bleedingGums,
      bruxism: p.bruxism,
      dentalNotes: p.dentalNotes ?? "",
    },
    painStatus: {
      isInPain: p.isInPain,
      painLevel: p.painLevel,
      painLocation: p.painLocation ?? "",
      painDuration: p.painDuration ?? "",
      painTrigger: p.painTrigger ?? "",
      painDescription: p.painDescription ?? "",
      takesMedication: p.takesMedication,
    },
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function toTreatmentPlanDto(plan: {
  id: number;
  tooth: string;
  diagnosisProcedure: string;
  unitCost: number;
  observations: string | null;
  plannedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: plan.id,
    tooth: plan.tooth,
    diagnosisProcedure: plan.diagnosisProcedure,
    unitCost: plan.unitCost,
    observations: plan.observations ?? "",
    plannedDate: plan.plannedDate.toISOString().slice(0, 10),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  };
}

function normalizeNullableText(value: unknown): string | null {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : null;
}

function normalizeGender(value: unknown): string | null {
  const normalized = String(value ?? "").trim();
  if (!normalized) return null;
  if (normalized === "Masculino" || normalized === "Femenino") return normalized;
  throw new Error("El genero debe ser Masculino o Femenino");
}

function normalizePhone(value: unknown): string {
  const normalized = String(value ?? "").replace(/\D/g, "");
  if (!normalized) {
    throw new Error("El telefono es obligatorio y solo debe contener numeros");
  }
  return normalized;
}

function parseBody(body: Record<string, unknown>) {
  const pd = (body.personalData ?? {}) as Record<string, unknown>;
  const mh = (body.medicalHistory ?? {}) as Record<string, unknown>;
  const dh = (body.dentalHistory ?? {}) as Record<string, unknown>;
  const ps = (body.painStatus ?? {}) as Record<string, unknown>;
  const painLevel = Math.min(10, Math.max(0, Number(ps.painLevel ?? 0) || 0));

  return {
    firstName: String(pd.firstName ?? "").trim(),
    lastName: String(pd.lastName ?? "").trim(),
    documentType: String(pd.documentType ?? "DNI").trim(),
    documentNumber: String(pd.documentNumber ?? "").trim(),
    birthDate: new Date(String(pd.birthDate || new Date().toISOString())),
    gender: normalizeGender(pd.gender),
    phone: normalizePhone(pd.phone),
    email: normalizeNullableText(pd.email),
    address: normalizeNullableText(pd.address),
    occupation: normalizeNullableText(pd.occupation),
    allergies: normalizeNullableText(mh.allergies),
    currentMedications: normalizeNullableText(mh.currentMedications),
    systemicDiseases: normalizeNullableText(mh.systemicDiseases),
    surgeries: normalizeNullableText(mh.surgeries),
    pregnant: Boolean(mh.pregnant),
    smoker: Boolean(mh.smoker),
    medicalNotes: normalizeNullableText(mh.medicalNotes),
    lastDentalVisit: dh.lastDentalVisit
      ? new Date(String(dh.lastDentalVisit))
      : null,
    reasonForConsultation: normalizeNullableText(dh.reasonForConsultation),
    previousTreatments: normalizeNullableText(dh.previousTreatments),
    brushingFrequency: normalizeNullableText(dh.brushingFrequency),
    flossing: Boolean(dh.flossing),
    bleedingGums: Boolean(dh.bleedingGums),
    bruxism: Boolean(dh.bruxism),
    dentalNotes: normalizeNullableText(dh.dentalNotes),
    isInPain: Boolean(ps.isInPain),
    painLevel,
    painLocation: normalizeNullableText(ps.painLocation),
    painDuration: normalizeNullableText(ps.painDuration),
    painTrigger: normalizeNullableText(ps.painTrigger),
    painDescription: normalizeNullableText(ps.painDescription),
    takesMedication: Boolean(ps.takesMedication),
  };
}

async function nextUserCode(): Promise<string> {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    let userCode = "";
    for (let index = 0; index < PATIENT_CODE_LENGTH; index += 1) {
      const randomIndex = Math.floor(Math.random() * PATIENT_CODE_ALPHABET.length);
      userCode += PATIENT_CODE_ALPHABET[randomIndex];
    }

    const existing = await prisma.patient.findUnique({
      where: { userCode },
      select: { id: true },
    });

    if (!existing) {
      return userCode;
    }
  }

  throw new Error("No fue posible generar un codigo unico para el paciente");
}

function parseTreatmentPlanBody(body: Record<string, unknown>) {
  const unitCost = Math.max(0, Number(body.unitCost ?? 0) || 0);

  return {
    tooth: String(body.tooth ?? "").trim(),
    diagnosisProcedure: String(body.diagnosisProcedure ?? "").trim(),
    unitCost,
    observations: normalizeNullableText(body.observations),
    plannedDate: new Date(String(body.plannedDate ?? "")),
  };
}

export function startServer(): Promise<number> {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.get("/api/patients", async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const pageSize = Math.min(
      20,
      Math.max(1, parseInt(String(req.query.pageSize), 10) || 5),
    );
    const q =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : typeof req.query.q === "string"
          ? req.query.q.trim()
          : "";

    const where = q
      ? {
          AND: q.split(/\s+/).map((term) => ({
            OR: [
              { firstName: { contains: term } },
              { lastName: { contains: term } },
              { documentNumber: { contains: term } },
              { userCode: { contains: term } },
            ],
          })),
        }
      : {};

    const totalItems = await prisma.patient.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * pageSize;
    const rows = await prisma.patient.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    });

    res.json({
      items: rows.map(toPatientDto),
      meta: {
        page: currentPage,
        pageSize,
        totalItems,
        totalPages,
      },
    });
  });

  app.get("/api/patients/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    const row = await prisma.patient.findUnique({ where: { id } });
    if (!row) {
      res.status(404).json({ error: "Paciente no encontrado" });
      return;
    }
    res.json(toPatientDto(row));
  });

  app.post("/api/patients", async (req: Request, res: Response) => {
    try {
      const data = parseBody(req.body as Record<string, unknown>);
      const userCode = await nextUserCode();
      const created = await prisma.patient.create({
        data: { ...data, userCode },
      });
      res.status(201).json(toPatientDto(created));
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: e instanceof Error ? e.message : "No se pudo crear el paciente" });
    }
  });

  app.put("/api/patients/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    try {
      const data = parseBody(req.body as Record<string, unknown>);
      const updated = await prisma.patient.update({
        where: { id },
        data,
      });
      res.json(toPatientDto(updated));
    } catch (e) {
      res.status(400).json({ message: e instanceof Error ? e.message : "Paciente no encontrado" });
    }
  });

  app.delete("/api/patients/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    try {
      await prisma.patient.delete({ where: { id } });
      res.status(204).send();
    } catch {
      res.status(404).json({ message: "Paciente no encontrado" });
    }
  });

  app.get("/api/patients/:id/treatment-plans", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "ID invalido" });
      return;
    }

    const patient = await prisma.patient.findUnique({ where: { id }, select: { id: true } });
    if (!patient) {
      res.status(404).json({ message: "Paciente no encontrado" });
      return;
    }

    const plans = await prisma.treatmentPlan.findMany({
      where: { patientId: id },
      orderBy: [{ plannedDate: "desc" }, { createdAt: "desc" }],
    });

    res.json(plans.map(toTreatmentPlanDto));
  });

  app.post("/api/patients/:id/treatment-plans", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "ID invalido" });
      return;
    }

    try {
      const patient = await prisma.patient.findUnique({ where: { id }, select: { id: true } });
      if (!patient) {
        res.status(404).json({ message: "Paciente no encontrado" });
        return;
      }

      const data = parseTreatmentPlanBody(req.body as Record<string, unknown>);
      const created = await prisma.treatmentPlan.create({
        data: {
          patientId: id,
          ...data,
        },
      });

      res.status(201).json(toTreatmentPlanDto(created));
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: e instanceof Error ? e.message : "No se pudo crear el plan" });
    }
  });

  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (addr && typeof addr === "object") {
        resolve(addr.port);
        return;
      }
      reject(new Error("No se pudo obtener el puerto del servidor"));
    });
    server.on("error", reject);
  });
}
