import { prisma } from "../../lib/prisma";
import { toPatientData, toPatientRecord } from "./patient.mapper";
import type { ClinicalRecordInput, PaginatedPatientsResponse, PatientRecord, TreatmentPlanInput, TreatmentPlanRecord } from "./patient.types";

const PATIENT_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PATIENT_CODE_LENGTH = 6;

function buildPatientSearchWhere(search: string) {
  const normalized = search.trim();

  if (!normalized) {
    return {};
  }

  const terms = normalized.split(/\s+/);

  return {
    AND: terms.map((term) => ({
      OR: [{ firstName: { contains: term } }, { lastName: { contains: term } }],
    })),
  };
}

function createPatientCodeCandidate(): string {
  let code = "";

  for (let index = 0; index < PATIENT_CODE_LENGTH; index += 1) {
    const randomIndex = Math.floor(Math.random() * PATIENT_CODE_ALPHABET.length);
    code += PATIENT_CODE_ALPHABET[randomIndex];
  }

  return code;
}

async function generateUniquePatientCode(): Promise<string> {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const userCode = createPatientCodeCandidate();
    const existingPatient = await prisma.patient.findUnique({
      where: { userCode },
      select: { id: true },
    });

    if (!existingPatient) {
      return userCode;
    }
  }

  throw new Error("No fue posible generar un código único para el paciente.");
}

export async function listPatients(page: number, pageSize: number, search: string): Promise<PaginatedPatientsResponse> {
  const where = buildPatientSearchWhere(search);
  const totalItems = await prisma.patient.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const patients = await prisma.patient.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return {
    items: patients.map(toPatientRecord),
    meta: {
      page: currentPage,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

export async function getPatientById(id: number): Promise<PatientRecord | null> {
  const patient = await prisma.patient.findUnique({ where: { id } });
  return patient ? toPatientRecord(patient) : null;
}

export async function createPatient(input: ClinicalRecordInput): Promise<PatientRecord> {
  const patient = await prisma.patient.create({
    data: {
      ...toPatientData(input),
      userCode: await generateUniquePatientCode(),
    },
  });

  return toPatientRecord(patient);
}

export async function updatePatient(id: number, input: ClinicalRecordInput): Promise<PatientRecord | null> {
  const existingPatient = await prisma.patient.findUnique({ where: { id } });

  if (!existingPatient) {
    return null;
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: toPatientData(input),
  });

  return toPatientRecord(patient);
}

export async function deletePatient(id: number): Promise<boolean> {
  const existingPatient = await prisma.patient.findUnique({ where: { id } });

  if (!existingPatient) {
    return false;
  }

  await prisma.patient.delete({ where: { id } });
  return true;
}

function toTreatmentPlanRecord(plan: {
  id: number;
  tooth: string;
  diagnosisProcedure: string;
  unitCost: number;
  observations: string | null;
  plannedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}): TreatmentPlanRecord {
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

export async function listTreatmentPlans(patientId: number): Promise<TreatmentPlanRecord[] | null> {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { id: true },
  });

  if (!patient) {
    return null;
  }

  const plans = await prisma.treatmentPlan.findMany({
    where: { patientId },
    orderBy: [{ plannedDate: "desc" }, { createdAt: "desc" }],
  });

  return plans.map(toTreatmentPlanRecord);
}

export async function createTreatmentPlan(patientId: number, input: TreatmentPlanInput): Promise<TreatmentPlanRecord | null> {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { id: true },
  });

  if (!patient) {
    return null;
  }

  const plan = await prisma.treatmentPlan.create({
    data: {
      patientId,
      tooth: input.tooth.trim(),
      diagnosisProcedure: input.diagnosisProcedure.trim(),
      unitCost: input.unitCost,
      observations: input.observations.trim() || null,
      plannedDate: new Date(input.plannedDate),
    },
  });

  return toTreatmentPlanRecord(plan);
}
