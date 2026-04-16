import type { Request, Response } from "express";
import { clinicalRecordSchema, patientsListQuerySchema, treatmentPlanSchema } from "./patient.schemas";
import {
  createPatient,
  createTreatmentPlan,
  deletePatient,
  getPatientById,
  listPatients,
  listTreatmentPlans,
  updatePatient,
} from "./patient.service";

function parseId(request: Request): number | null {
  const id = Number(request.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function listPatientsHandler(request: Request, response: Response) {
  const query = patientsListQuerySchema.parse(request.query);
  const result = await listPatients(query.page, query.pageSize, query.search);
  return response.json(result);
}

export async function getPatientHandler(request: Request, response: Response) {
  const id = parseId(request);
  if (!id) {
    return response.status(400).json({ message: "Identificador inválido" });
  }

  const patient = await getPatientById(id);

  if (!patient) {
    return response.status(404).json({ message: "Paciente no encontrado" });
  }

  return response.json(patient);
}

export async function createPatientHandler(request: Request, response: Response) {
  const payload = clinicalRecordSchema.parse(request.body);
  const patient = await createPatient(payload);
  return response.status(201).json(patient);
}

export async function updatePatientHandler(request: Request, response: Response) {
  const id = parseId(request);
  if (!id) {
    return response.status(400).json({ message: "Identificador inválido" });
  }

  const payload = clinicalRecordSchema.parse(request.body);
  const patient = await updatePatient(id, payload);

  if (!patient) {
    return response.status(404).json({ message: "Paciente no encontrado" });
  }

  return response.json(patient);
}

export async function deletePatientHandler(request: Request, response: Response) {
  const id = parseId(request);
  if (!id) {
    return response.status(400).json({ message: "Identificador inválido" });
  }

  const deleted = await deletePatient(id);

  if (!deleted) {
    return response.status(404).json({ message: "Paciente no encontrado" });
  }

  return response.status(204).send();
}

export async function listTreatmentPlansHandler(request: Request, response: Response) {
  const id = parseId(request);
  if (!id) {
    return response.status(400).json({ message: "Identificador inválido" });
  }

  const plans = await listTreatmentPlans(id);

  if (!plans) {
    return response.status(404).json({ message: "Paciente no encontrado" });
  }

  return response.json(plans);
}

export async function createTreatmentPlanHandler(request: Request, response: Response) {
  const id = parseId(request);
  if (!id) {
    return response.status(400).json({ message: "Identificador inválido" });
  }

  const payload = treatmentPlanSchema.parse(request.body);
  const plan = await createTreatmentPlan(id, payload);

  if (!plan) {
    return response.status(404).json({ message: "Paciente no encontrado" });
  }

  return response.status(201).json(plan);
}
