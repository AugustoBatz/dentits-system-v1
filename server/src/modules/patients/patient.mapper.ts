import type { Patient } from "@prisma/client";
import type { ClinicalRecordInput, PatientRecord } from "./patient.types";

function nullableString(value: string): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function toPatientData(input: ClinicalRecordInput) {
  return {
    firstName: input.personalData.firstName.trim(),
    lastName: input.personalData.lastName.trim(),
    documentType: input.personalData.documentType.trim(),
    documentNumber: input.personalData.documentNumber.trim(),
    birthDate: new Date(input.personalData.birthDate),
    gender: nullableString(input.personalData.gender),
    phone: input.personalData.phone.trim(),
    email: nullableString(input.personalData.email),
    address: nullableString(input.personalData.address),
    occupation: nullableString(input.personalData.occupation),
    allergies: nullableString(input.medicalHistory.allergies),
    currentMedications: nullableString(input.medicalHistory.currentMedications),
    systemicDiseases: nullableString(input.medicalHistory.systemicDiseases),
    surgeries: nullableString(input.medicalHistory.surgeries),
    pregnant: input.medicalHistory.pregnant,
    smoker: input.medicalHistory.smoker,
    medicalNotes: nullableString(input.medicalHistory.medicalNotes),
    lastDentalVisit: input.dentalHistory.lastDentalVisit ? new Date(input.dentalHistory.lastDentalVisit) : null,
    reasonForConsultation: nullableString(input.dentalHistory.reasonForConsultation),
    previousTreatments: nullableString(input.dentalHistory.previousTreatments),
    brushingFrequency: nullableString(input.dentalHistory.brushingFrequency),
    flossing: input.dentalHistory.flossing,
    bleedingGums: input.dentalHistory.bleedingGums,
    bruxism: input.dentalHistory.bruxism,
    dentalNotes: nullableString(input.dentalHistory.dentalNotes),
    isInPain: input.painStatus.isInPain,
    painLevel: input.painStatus.isInPain ? input.painStatus.painLevel : 0,
    painLocation: nullableString(input.painStatus.painLocation),
    painDuration: nullableString(input.painStatus.painDuration),
    painTrigger: nullableString(input.painStatus.painTrigger),
    painDescription: nullableString(input.painStatus.painDescription),
    takesMedication: input.painStatus.takesMedication,
  };
}

function formatDate(value: Date | null): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

export function toPatientRecord(patient: Patient): PatientRecord {
  return {
    id: patient.id,
    userCode: patient.userCode,
    fullName: `${patient.firstName} ${patient.lastName}`,
    createdAt: patient.createdAt.toISOString(),
    updatedAt: patient.updatedAt.toISOString(),
    personalData: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      documentType: patient.documentType,
      documentNumber: patient.documentNumber,
      birthDate: formatDate(patient.birthDate),
      gender: patient.gender ?? "",
      phone: patient.phone,
      email: patient.email ?? "",
      address: patient.address ?? "",
      occupation: patient.occupation ?? "",
    },
    medicalHistory: {
      allergies: patient.allergies ?? "",
      currentMedications: patient.currentMedications ?? "",
      systemicDiseases: patient.systemicDiseases ?? "",
      surgeries: patient.surgeries ?? "",
      pregnant: patient.pregnant,
      smoker: patient.smoker,
      medicalNotes: patient.medicalNotes ?? "",
    },
    dentalHistory: {
      lastDentalVisit: formatDate(patient.lastDentalVisit),
      reasonForConsultation: patient.reasonForConsultation ?? "",
      previousTreatments: patient.previousTreatments ?? "",
      brushingFrequency: patient.brushingFrequency ?? "",
      flossing: patient.flossing,
      bleedingGums: patient.bleedingGums,
      bruxism: patient.bruxism,
      dentalNotes: patient.dentalNotes ?? "",
    },
    painStatus: {
      isInPain: patient.isInPain,
      painLevel: patient.painLevel,
      painLocation: patient.painLocation ?? "",
      painDuration: patient.painDuration ?? "",
      painTrigger: patient.painTrigger ?? "",
      painDescription: patient.painDescription ?? "",
      takesMedication: patient.takesMedication,
    },
  };
}
