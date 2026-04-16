import pkg from "@prisma/client";
import { toPatientData } from "../src/modules/patients/patient.mapper";
import type { ClinicalRecordInput } from "../src/modules/patients/patient.types";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

function createSeedUserCode(sequence: number): string {
  return sequence.toString(16).toUpperCase().padStart(6, "0");
}

const mockPatients: ClinicalRecordInput[] = [
  {
    personalData: {
      firstName: "María",
      lastName: "González",
      documentType: "DNI",
      documentNumber: "30111222",
      birthDate: "1989-05-10",
      gender: "Femenino",
      phone: "+54 11 4444 1101",
      email: "maria.gonzalez@example.com",
      address: "Av. Corrientes 1234, Buenos Aires",
      occupation: "Docente",
    },
    medicalHistory: {
      allergies: "Penicilina",
      currentMedications: "Ibuprofeno ocasional",
      systemicDiseases: "Hipotiroidismo controlado",
      surgeries: "Apendicectomía",
      pregnant: false,
      smoker: false,
      medicalNotes: "Control endocrinológico anual.",
    },
    dentalHistory: {
      lastDentalVisit: "2025-11-01",
      reasonForConsultation: "Control anual y profilaxis",
      previousTreatments: "Ortodoncia en adolescencia",
      brushingFrequency: "3 veces al día",
      flossing: true,
      bleedingGums: false,
      bruxism: false,
      dentalNotes: "Buena adherencia a controles.",
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
  },
  {
    personalData: {
      firstName: "Carlos",
      lastName: "Pérez",
      documentType: "DNI",
      documentNumber: "28444999",
      birthDate: "1978-09-22",
      gender: "Masculino",
      phone: "+54 11 4444 1102",
      email: "carlos.perez@example.com",
      address: "Calle Mitre 455, La Plata",
      occupation: "Arquitecto",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "Losartán",
      systemicDiseases: "Hipertensión",
      surgeries: "",
      pregnant: false,
      smoker: false,
      medicalNotes: "Requiere control de presión previo a procedimientos largos.",
    },
    dentalHistory: {
      lastDentalVisit: "2025-08-17",
      reasonForConsultation: "Dolor intermitente en molar superior",
      previousTreatments: "Endodoncia hace 3 años",
      brushingFrequency: "2 veces al día",
      flossing: false,
      bleedingGums: true,
      bruxism: true,
      dentalNotes: "Usa placa de descanso de manera irregular.",
    },
    painStatus: {
      isInPain: true,
      painLevel: 6,
      painLocation: "Molar superior derecho",
      painDuration: "7 días",
      painTrigger: "Frío",
      painDescription: "Punzante al ingerir bebidas frías",
      takesMedication: true,
    },
  },
  {
    personalData: {
      firstName: "Lucía",
      lastName: "Ramírez",
      documentType: "DNI",
      documentNumber: "33555111",
      birthDate: "1995-02-14",
      gender: "Femenino",
      phone: "+54 11 4444 1103",
      email: "lucia.ramirez@example.com",
      address: "Belgrano 789, Rosario",
      occupation: "Diseñadora UX",
    },
    medicalHistory: {
      allergies: "Látex",
      currentMedications: "",
      systemicDiseases: "",
      surgeries: "",
      pregnant: false,
      smoker: false,
      medicalNotes: "Solicita procedimientos con anestesia local sin látex.",
    },
    dentalHistory: {
      lastDentalVisit: "2024-12-10",
      reasonForConsultation: "Alineación estética",
      previousTreatments: "Blanqueamiento",
      brushingFrequency: "3 veces al día",
      flossing: true,
      bleedingGums: false,
      bruxism: false,
      dentalNotes: "Interesada en ortodoncia invisible.",
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
  },
  {
    personalData: {
      firstName: "Jorge",
      lastName: "Mendoza",
      documentType: "DNI",
      documentNumber: "25666777",
      birthDate: "1971-07-02",
      gender: "Masculino",
      phone: "+54 11 4444 1104",
      email: "jorge.mendoza@example.com",
      address: "San Martín 1550, Córdoba",
      occupation: "Chofer",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "Metformina",
      systemicDiseases: "Diabetes tipo 2",
      surgeries: "Colecistectomía",
      pregnant: false,
      smoker: true,
      medicalNotes: "Control glucémico previo a extracciones.",
    },
    dentalHistory: {
      lastDentalVisit: "2023-10-05",
      reasonForConsultation: "Inflamación gingival",
      previousTreatments: "Exodoncia de terceros molares",
      brushingFrequency: "1 vez al día",
      flossing: false,
      bleedingGums: true,
      bruxism: false,
      dentalNotes: "Higiene oral deficiente; sugerir plan periodontal.",
    },
    painStatus: {
      isInPain: true,
      painLevel: 4,
      painLocation: "Encía inferior izquierda",
      painDuration: "3 días",
      painTrigger: "Masticación",
      painDescription: "Sensación pulsátil y molestia al cepillarse",
      takesMedication: false,
    },
  },
  {
    personalData: {
      firstName: "Ana",
      lastName: "Suárez",
      documentType: "DNI",
      documentNumber: "31222333",
      birthDate: "1987-11-30",
      gender: "Femenino",
      phone: "+54 11 4444 1105",
      email: "ana.suarez@example.com",
      address: "Rivadavia 980, Mendoza",
      occupation: "Contadora",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      systemicDiseases: "",
      surgeries: "",
      pregnant: true,
      smoker: false,
      medicalNotes: "Segundo trimestre de embarazo.",
    },
    dentalHistory: {
      lastDentalVisit: "2025-06-20",
      reasonForConsultation: "Limpieza y educación preventiva",
      previousTreatments: "Operatoria simple",
      brushingFrequency: "3 veces al día",
      flossing: true,
      bleedingGums: true,
      bruxism: false,
      dentalNotes: "Solicita recomendaciones de higiene durante el embarazo.",
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
  },
];

async function main() {
  for (const [index, patient] of mockPatients.entries()) {
    await prisma.patient.upsert({
      where: { documentNumber: patient.personalData.documentNumber },
      update: toPatientData(patient),
      create: {
        ...toPatientData(patient),
        userCode: createSeedUserCode(index + 1),
      },
    });
  }

  console.log(`Se cargaron ${mockPatients.length} pacientes de prueba.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
