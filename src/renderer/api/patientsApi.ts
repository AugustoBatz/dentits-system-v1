import { mockPatients } from "../data/mockPatients";
import type { ClinicalRecordPayload, PaginatedPatients, Patient, TreatmentPlan, TreatmentPlanPayload } from "../types/patient";

const mockTreatmentPlans = new Map<number, TreatmentPlan[]>();

function useMockOnly(): boolean {
  return import.meta.env.VITE_USE_MOCK === "1";
}

async function apiBase(): Promise<string | null> {
  if (useMockOnly()) return null;
  if (window.dentis) {
    return window.dentis.getApiBase();
  }
  return null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = await apiBase();
  if (!base) {
    throw new Error("API no disponible (modo mock o fuera de Electron)");
  }
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const parsed = JSON.parse(text) as { message?: string; error?: string };
      throw new Error(parsed.message || parsed.error || res.statusText);
    } catch {
      throw new Error(text || res.statusText);
    }
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

function paginateMock(
  page: number,
  pageSize: number,
  q: string,
): PaginatedPatients {
  let items = [...mockPatients];
  if (q.trim()) {
    const lower = q.toLowerCase();
    items = items.filter(
      (p) =>
        p.fullName.toLowerCase().includes(lower) ||
        p.personalData.documentNumber.includes(q) ||
        p.userCode.toLowerCase().includes(lower),
    );
  }
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    meta: { page: currentPage, pageSize, totalItems, totalPages },
  };
}

export async function listPatients(
  page: number,
  pageSize: number,
  q: string,
): Promise<PaginatedPatients> {
  if (useMockOnly() || !(await apiBase())) {
    return paginateMock(page, pageSize, q);
  }
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (q.trim()) params.set("search", q.trim());
  return request<PaginatedPatients>(`/api/patients?${params.toString()}`);
}

export async function getPatient(id: number): Promise<Patient> {
  if (useMockOnly() || !(await apiBase())) {
    const p = mockPatients.find((x) => x.id === id);
    if (!p) throw new Error("No encontrado");
    return p;
  }
  return request<Patient>(`/api/patients/${id}`);
}

export async function createPatient(
  body: ClinicalRecordPayload,
): Promise<Patient> {
  if (useMockOnly() || !(await apiBase())) {
    const nextId = Math.max(0, ...mockPatients.map((p) => p.id)) + 1;
    const p: Patient = {
      id: nextId,
      userCode: `${String(nextId).padStart(6, "0")}`,
      fullName: `${body.personalData.firstName} ${body.personalData.lastName}`.trim(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPatients.unshift(p);
    return p;
  }
  return request<Patient>("/api/patients", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updatePatient(
  id: number,
  body: ClinicalRecordPayload,
): Promise<Patient> {
  if (useMockOnly() || !(await apiBase())) {
    const idx = mockPatients.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error("No encontrado");
    const prev = mockPatients[idx];
    const p: Patient = {
      ...prev,
      fullName: `${body.personalData.firstName} ${body.personalData.lastName}`.trim(),
      personalData: body.personalData,
      medicalHistory: body.medicalHistory,
      dentalHistory: body.dentalHistory,
      painStatus: body.painStatus,
      updatedAt: new Date().toISOString(),
    };
    mockPatients[idx] = p;
    return p;
  }
  return request<Patient>(`/api/patients/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deletePatient(id: number): Promise<void> {
  if (useMockOnly() || !(await apiBase())) {
    const idx = mockPatients.findIndex((x) => x.id === id);
    if (idx >= 0) mockPatients.splice(idx, 1);
    mockTreatmentPlans.delete(id);
    return;
  }
  await request<void>(`/api/patients/${id}`, { method: "DELETE" });
}

export async function getTreatmentPlans(patientId: number): Promise<TreatmentPlan[]> {
  if (useMockOnly() || !(await apiBase())) {
    return mockTreatmentPlans.get(patientId) ?? [];
  }
  return request<TreatmentPlan[]>(`/api/patients/${patientId}/treatment-plans`);
}

export async function createTreatmentPlan(patientId: number, payload: TreatmentPlanPayload): Promise<TreatmentPlan> {
  if (useMockOnly() || !(await apiBase())) {
    const nextId = Math.max(0, ...(mockTreatmentPlans.get(patientId) ?? []).map((plan) => plan.id)) + 1;
    const item: TreatmentPlan = {
      id: nextId,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const current = mockTreatmentPlans.get(patientId) ?? [];
    mockTreatmentPlans.set(patientId, [item, ...current]);
    return item;
  }

  return request<TreatmentPlan>(`/api/patients/${patientId}/treatment-plans`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
