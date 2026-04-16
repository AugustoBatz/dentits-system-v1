import type { ReactNode } from "react";
import type {
  ClinicalRecordPayload,
  DentalHistory,
  MedicalHistory,
  PainStatus,
  Patient,
  PersonalData,
} from "../types/patient";
type Draft = ClinicalRecordPayload;

interface Props {
  mode: "new" | "edit";
  userCode?: string;
  value: Draft;
  onChange: (next: Draft) => void;
  onSave: () => void;
  onCancel?: () => void;
  saving?: boolean;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export function ClinicalRecordForm({
  mode,
  userCode,
  value,
  onChange,
  onSave,
  onCancel,
  saving,
}: Props) {
  const setPersonal = (patch: Partial<PersonalData>) =>
    onChange({
      ...value,
      personalData: { ...value.personalData, ...patch },
    });
  const setMedical = (patch: Partial<MedicalHistory>) =>
    onChange({
      ...value,
      medicalHistory: { ...value.medicalHistory, ...patch },
    });
  const setDental = (patch: Partial<DentalHistory>) =>
    onChange({
      ...value,
      dentalHistory: { ...value.dentalHistory, ...patch },
    });
  const setPain = (patch: Partial<PainStatus>) =>
    onChange({
      ...value,
      painStatus: { ...value.painStatus, ...patch },
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Ficha clínica dental
          </h2>
          <p className="text-sm text-slate-500">
            {mode === "new"
              ? "Nuevo paciente"
              : `Paciente ${userCode ?? ""}`.trim()}
          </p>
        </div>
        <div className="flex gap-2">
          {onCancel ? (
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={onCancel}
            >
              Cancelar
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-teal-700 disabled:opacity-50"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-teal-700">
          Datos personales
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre">
            <input
              className={inputClass}
              value={value.personalData.firstName}
              onChange={(e) => setPersonal({ firstName: e.target.value })}
            />
          </Field>
          <Field label="Apellido">
            <input
              className={inputClass}
              value={value.personalData.lastName}
              onChange={(e) => setPersonal({ lastName: e.target.value })}
            />
          </Field>
          <Field label="Tipo de documento">
            <input
              className={inputClass}
              value={value.personalData.documentType}
              onChange={(e) => setPersonal({ documentType: e.target.value })}
            />
          </Field>
          <Field label="Número de documento">
            <input
              className={inputClass}
              value={value.personalData.documentNumber}
              onChange={(e) => setPersonal({ documentNumber: e.target.value })}
            />
          </Field>
          <Field label="Fecha de nacimiento">
            <input
              type="date"
              className={inputClass}
              value={value.personalData.birthDate.slice(0, 10)}
              onChange={(e) => setPersonal({ birthDate: e.target.value })}
            />
          </Field>
          <Field label="Género">
            <select
              className={inputClass}
              value={value.personalData.gender}
              onChange={(e) => setPersonal({ gender: e.target.value })}
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </Field>
          <Field label="Teléfono">
            <input
              className={inputClass}
              value={value.personalData.phone}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => setPersonal({ phone: e.target.value.replace(/\D/g, "") })}
            />
          </Field>
          <Field label="Correo electrónico">
            <input
              type="email"
              className={inputClass}
              value={value.personalData.email}
              onChange={(e) => setPersonal({ email: e.target.value })}
            />
          </Field>
          <Field label="Dirección">
            <input
              className={inputClass}
              value={value.personalData.address}
              onChange={(e) => setPersonal({ address: e.target.value })}
            />
          </Field>
          <Field label="Ocupación">
            <input
              className={inputClass}
              value={value.personalData.occupation}
              onChange={(e) => setPersonal({ occupation: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-teal-700">
          Antecedentes médicos
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Alergias">
            <textarea
              className={`${inputClass} min-h-[72px]`}
              value={value.medicalHistory.allergies}
              onChange={(e) => setMedical({ allergies: e.target.value })}
            />
          </Field>
          <Field label="Medicación actual">
            <textarea
              className={`${inputClass} min-h-[72px]`}
              value={value.medicalHistory.currentMedications}
              onChange={(e) =>
                setMedical({ currentMedications: e.target.value })
              }
            />
          </Field>
          <Field label="Enfermedades sistémicas">
            <textarea
              className={`${inputClass} min-h-[72px]`}
              value={value.medicalHistory.systemicDiseases}
              onChange={(e) => setMedical({ systemicDiseases: e.target.value })}
            />
          </Field>
          <Field label="Cirugías previas">
            <textarea
              className={`${inputClass} min-h-[72px]`}
              value={value.medicalHistory.surgeries}
              onChange={(e) => setMedical({ surgeries: e.target.value })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={value.medicalHistory.pregnant}
              onChange={(e) => setMedical({ pregnant: e.target.checked })}
            />
            Embarazo
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={value.medicalHistory.smoker}
              onChange={(e) => setMedical({ smoker: e.target.checked })}
            />
            Fumador/a
          </label>
          <div className="sm:col-span-2">
            <Field label="Notas médicas">
              <textarea
                className={`${inputClass} min-h-[88px]`}
                value={value.medicalHistory.medicalNotes}
                onChange={(e) => setMedical({ medicalNotes: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-teal-700">
          Antecedentes odontológicos
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Última visita odontológica">
            <input
              type="date"
              className={inputClass}
              value={value.dentalHistory.lastDentalVisit.slice(0, 10)}
              onChange={(e) =>
                setDental({ lastDentalVisit: e.target.value })
              }
            />
          </Field>
          <Field label="Motivo de consulta">
            <input
              className={inputClass}
              value={value.dentalHistory.reasonForConsultation}
              onChange={(e) =>
                setDental({ reasonForConsultation: e.target.value })
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Tratamientos previos">
              <textarea
                className={`${inputClass} min-h-[72px]`}
                value={value.dentalHistory.previousTreatments}
                onChange={(e) =>
                  setDental({ previousTreatments: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Frecuencia de cepillado">
            <input
              className={inputClass}
              value={value.dentalHistory.brushingFrequency}
              onChange={(e) =>
                setDental({ brushingFrequency: e.target.value })
              }
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={value.dentalHistory.flossing}
              onChange={(e) => setDental({ flossing: e.target.checked })}
            />
            Uso de hilo dental
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={value.dentalHistory.bleedingGums}
              onChange={(e) => setDental({ bleedingGums: e.target.checked })}
            />
            Sangrado de encías
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={value.dentalHistory.bruxism}
              onChange={(e) => setDental({ bruxism: e.target.checked })}
            />
            Bruxismo
          </label>
          <div className="sm:col-span-2">
            <Field label="Notas odontológicas">
              <textarea
                className={`${inputClass} min-h-[88px]`}
                value={value.dentalHistory.dentalNotes}
                onChange={(e) => setDental({ dentalNotes: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-amber-800">
          Dolor actual
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={value.painStatus.isInPain}
              onChange={(e) => setPain({ isInPain: e.target.checked })}
            />
            Refiere dolor en este momento
          </label>
          <Field label="Intensidad (0–10)">
            <input
              type="number"
              min={0}
              max={10}
              className={inputClass}
              value={value.painStatus.painLevel}
              onChange={(e) =>
                setPain({ painLevel: Math.min(10, Math.max(0, Number(e.target.value) || 0)) })
              }
            />
          </Field>
          <Field label="Localización">
            <input
              className={inputClass}
              value={value.painStatus.painLocation}
              onChange={(e) => setPain({ painLocation: e.target.value })}
            />
          </Field>
          <Field label="Duración">
            <input
              className={inputClass}
              value={value.painStatus.painDuration}
              onChange={(e) => setPain({ painDuration: e.target.value })}
            />
          </Field>
          <Field label="Desencadenante">
            <input
              className={inputClass}
              value={value.painStatus.painTrigger}
              onChange={(e) => setPain({ painTrigger: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Descripción del dolor">
              <textarea
                className={`${inputClass} min-h-[80px]`}
                value={value.painStatus.painDescription}
                onChange={(e) =>
                  setPain({ painDescription: e.target.value })
                }
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-800 sm:col-span-2">
            <input
              type="checkbox"
              checked={value.painStatus.takesMedication}
              onChange={(e) =>
                setPain({ takesMedication: e.target.checked })
              }
            />
            Toma medicación para el dolor
          </label>
        </div>
      </section>
    </div>
  );
}

export function draftFromPatient(p: Patient): Draft {
  return {
    personalData: { ...p.personalData },
    medicalHistory: { ...p.medicalHistory },
    dentalHistory: { ...p.dentalHistory },
    painStatus: { ...p.painStatus },
  };
}
