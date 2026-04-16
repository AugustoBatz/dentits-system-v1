import axios from "axios";
import type { ClinicalRecordPayload, PaginatedResponse, Patient, TreatmentPlan, TreatmentPlanPayload } from "../types/patient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

export async function getPatients(page: number, pageSize: number, search = ""): Promise<PaginatedResponse<Patient>> {
  const { data } = await api.get<PaginatedResponse<Patient>>("/patients", {
    params: { page, pageSize, search },
  });

  return data;
}

export async function createPatient(payload: ClinicalRecordPayload): Promise<Patient> {
  const { data } = await api.post<Patient>("/patients", payload);
  return data;
}

export async function getPatient(id: number): Promise<Patient> {
  const { data } = await api.get<Patient>(`/patients/${id}`);
  return data;
}

export async function updatePatient(id: number, payload: ClinicalRecordPayload): Promise<Patient> {
  const { data } = await api.put<Patient>(`/patients/${id}`, payload);
  return data;
}

export async function deletePatient(id: number): Promise<void> {
  await api.delete(`/patients/${id}`);
}

export async function getTreatmentPlans(patientId: number): Promise<TreatmentPlan[]> {
  const { data } = await api.get<TreatmentPlan[]>(`/patients/${patientId}/treatment-plans`);
  return data;
}

export async function createTreatmentPlan(patientId: number, payload: TreatmentPlanPayload): Promise<TreatmentPlan> {
  const { data } = await api.post<TreatmentPlan>(`/patients/${patientId}/treatment-plans`, payload);
  return data;
}
