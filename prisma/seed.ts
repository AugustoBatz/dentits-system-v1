import pkg from "../src/generated/client/index.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.patient.count();
  if (count > 0) {
    return;
  }

  await prisma.patient.createMany({
    data: [
      {
        userCode: "PAC-001",
        firstName: "Maria",
        lastName: "Gonzalez",
        documentType: "DNI",
        documentNumber: "30111222",
        birthDate: new Date("1990-05-12"),
        gender: "Femenino",
        phone: "541155551001",
        email: "maria.g@email.com",
        address: "Av. Corrientes 1234",
        occupation: "Disenadora",
        allergies: "Penicilina",
        currentMedications: "Ninguna",
        systemicDiseases: "Ninguna",
        surgeries: "Apendicectomia 2015",
        pregnant: false,
        smoker: false,
        medicalNotes: "Control anual OK",
        lastDentalVisit: new Date("2024-08-01"),
        reasonForConsultation: "Control",
        previousTreatments: "Obturaciones multiples",
        brushingFrequency: "2x dia",
        flossing: true,
        bleedingGums: false,
        bruxism: true,
        dentalNotes: "Bruxismo leve",
        isInPain: false,
        painLevel: 0,
        painLocation: "",
        painDuration: "",
        painTrigger: "",
        painDescription: "",
        takesMedication: false,
      },
      {
        userCode: "PAC-002",
        firstName: "Juan",
        lastName: "Perez",
        documentType: "DNI",
        documentNumber: "28999111",
        birthDate: new Date("1985-11-03"),
        gender: "Masculino",
        phone: "541155552002",
        email: "juan.perez@email.com",
        address: "Calle Falsa 456",
        occupation: "Ingeniero",
        allergies: "Ninguna conocida",
        currentMedications: "Losartan 50mg",
        systemicDiseases: "Hipertension controlada",
        surgeries: "",
        pregnant: false,
        smoker: true,
        medicalNotes: "Fumador 5 cig/dia",
        lastDentalVisit: new Date("2023-01-15"),
        reasonForConsultation: "Dolor molar",
        previousTreatments: "Extraccion 18",
        brushingFrequency: "1x dia",
        flossing: false,
        bleedingGums: true,
        bruxism: false,
        dentalNotes: "Gingivitis leve",
        isInPain: true,
        painLevel: 7,
        painLocation: "Molar inferior derecho",
        painDuration: "3 dias",
        painTrigger: "Frio / dulce",
        painDescription: "Punzante, intermitente",
        takesMedication: true,
      },
    ],
  });

  const maria = await prisma.patient.findUnique({
    where: { userCode: "PAC-001" },
    select: { id: true },
  });

  if (maria) {
    await prisma.treatmentPlan.createMany({
      data: [
        {
          patientId: maria.id,
          tooth: "16",
          diagnosisProcedure: "Obturacion compuesta",
          unitCost: 45000,
          observations: "Control en 30 dias",
          plannedDate: new Date("2026-04-10"),
        },
        {
          patientId: maria.id,
          tooth: "21",
          diagnosisProcedure: "Limpieza y profilaxis",
          unitCost: 30000,
          observations: "Reforzar higiene oral",
          plannedDate: new Date("2026-04-12"),
        },
      ],
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
