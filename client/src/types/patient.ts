export interface PersonalData {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
}

export interface MedicalHistory {
  allergies: string;
  currentMedications: string;
  systemicDiseases: string;
  surgeries: string;
  pregnant: boolean;
  smoker: boolean;
  medicalNotes: string;
}

export interface DentalHistory {
  lastDentalVisit: string;
  reasonForConsultation: string;
  previousTreatments: string;
  brushingFrequency: string;
  flossing: boolean;
  bleedingGums: boolean;
  bruxism: boolean;
  dentalNotes: string;
}

export interface PainStatus {
  isInPain: boolean;
  painLevel: number;
  painLocation: string;
  painDuration: string;
  painTrigger: string;
  painDescription: string;
  takesMedication: boolean;
}

export interface TreatmentPlan {
  id: number;
  tooth: string;
  diagnosisProcedure: string;
  unitCost: number;
  observations: string;
  plannedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentPlanPayload {
  tooth: string;
  diagnosisProcedure: string;
  unitCost: number;
  observations: string;
  plannedDate: string;
}

export interface ClinicalRecordPayload {
  personalData: PersonalData;
  medicalHistory: MedicalHistory;
  dentalHistory: DentalHistory;
  painStatus: PainStatus;
}

export interface Patient extends ClinicalRecordPayload {
  id: number;
  userCode: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
