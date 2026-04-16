import type { ClinicalRecordPayload } from "../types/patient";

export const emptyClinicalRecord: ClinicalRecordPayload = {
  personalData: {
    firstName: "",
    lastName: "",
    documentType: "DNI",
    documentNumber: "",
    birthDate: "",
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
