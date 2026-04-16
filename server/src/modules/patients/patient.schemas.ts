import { z } from "zod";

const requiredText = z.string().trim().min(1, "Campo requerido");
const freeText = z.string().trim().max(1000, "Texto demasiado largo");
const phoneText = z.string().trim().min(1, "Campo requerido").regex(/^\d+$/, "El teléfono solo debe contener números");
const genderText = z.enum(["Masculino", "Femenino"]).or(z.literal(""));
const currencyNumber = z.coerce.number().min(0, "El costo debe ser mayor o igual a 0");

export const clinicalRecordSchema = z.object({
  personalData: z.object({
    firstName: requiredText,
    lastName: requiredText,
    documentType: requiredText,
    documentNumber: requiredText,
    birthDate: requiredText,
    gender: genderText,
    phone: phoneText,
    email: freeText,
    address: freeText,
    occupation: freeText,
  }),
  medicalHistory: z.object({
    allergies: freeText,
    currentMedications: freeText,
    systemicDiseases: freeText,
    surgeries: freeText,
    pregnant: z.boolean(),
    smoker: z.boolean(),
    medicalNotes: freeText,
  }),
  dentalHistory: z.object({
    lastDentalVisit: freeText,
    reasonForConsultation: freeText,
    previousTreatments: freeText,
    brushingFrequency: freeText,
    flossing: z.boolean(),
    bleedingGums: z.boolean(),
    bruxism: z.boolean(),
    dentalNotes: freeText,
  }),
  painStatus: z.object({
    isInPain: z.boolean(),
    painLevel: z.number().int().min(0).max(10),
    painLocation: freeText,
    painDuration: freeText,
    painTrigger: freeText,
    painDescription: freeText,
    takesMedication: z.boolean(),
  }),
});

export const patientsListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(20).default(5),
  search: z.string().trim().max(100).default(""),
});

export const treatmentPlanSchema = z.object({
  tooth: requiredText,
  diagnosisProcedure: requiredText,
  unitCost: currencyNumber,
  observations: freeText,
  plannedDate: requiredText,
});
