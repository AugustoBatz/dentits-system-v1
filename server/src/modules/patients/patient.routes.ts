import { Router } from "express";
import {
  createPatientHandler,
  createTreatmentPlanHandler,
  deletePatientHandler,
  getPatientHandler,
  listTreatmentPlansHandler,
  listPatientsHandler,
  updatePatientHandler,
} from "./patient.controller";

export const patientRouter = Router();

patientRouter.get("/", listPatientsHandler);
patientRouter.get("/:id", getPatientHandler);
patientRouter.get("/:id/treatment-plans", listTreatmentPlansHandler);
patientRouter.post("/", createPatientHandler);
patientRouter.post("/:id/treatment-plans", createTreatmentPlanHandler);
patientRouter.put("/:id", updatePatientHandler);
patientRouter.delete("/:id", deletePatientHandler);
