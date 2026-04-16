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

export interface Patient {
  id: number;
  userCode: string;
  fullName: string;
  personalData: PersonalData;
  medicalHistory: MedicalHistory;
  dentalHistory: DentalHistory;
  painStatus: PainStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedPatients {
  items: Patient[];
  meta: PaginationMeta;
}

export type ClinicalRecordPayload = Omit<Patient, "id" | "userCode" | "fullName" | "createdAt" | "updatedAt">;

export function emptyClinicalPayload(): ClinicalRecordPayload {
  return {
    personalData: {
      firstName: "",
      lastName: "",
      documentType: "DNI",
      documentNumber: "",
      birthDate: new Date().toISOString().slice(0, 10),
      gender: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      systemicDiseases: "",
      surgeries: "",
      pregnant: false,
      smoker: false,
      medicalNotes: "",
    },
    dentalHistory: {
      lastDentalVisit: "",
      reasonForConsultation: "",
      previousTreatments: "",
      brushingFrequency: "",
      flossing: false,
      bleedingGums: false,
      bruxism: false,
      dentalNotes: "",
    },
    painStatus: {
      isInPain: false,
      painLevel: 0,
      painLocation: "",
      painDuration: "",
      painTrigger: "",
      painDescription: "",
      takesMedication: false,
    },
  };
}
