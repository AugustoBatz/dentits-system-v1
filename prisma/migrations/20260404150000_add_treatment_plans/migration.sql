CREATE TABLE "TreatmentPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "tooth" TEXT NOT NULL,
    "diagnosisProcedure" TEXT NOT NULL,
    "unitCost" REAL NOT NULL,
    "observations" TEXT,
    "plannedDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TreatmentPlan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "TreatmentPlan_patientId_idx" ON "TreatmentPlan"("patientId");
