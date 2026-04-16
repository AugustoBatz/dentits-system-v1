import { useEffect, useState, type FormEvent } from "react";
import { emptyClinicalRecord } from "../constants/clinicalRecord";
import type { ClinicalRecordPayload } from "../types/patient";

interface PatientFormProps {
  initialValue?: ClinicalRecordPayload;
  mode: "create" | "edit";
  isSubmitting: boolean;
  onSubmit: (payload: ClinicalRecordPayload) => Promise<boolean>;
  onCancelEdit: () => void;
}

export function PatientForm({
  initialValue,
  mode,
  isSubmitting,
  onSubmit,
  onCancelEdit,
}: PatientFormProps) {
  const [formData, setFormData] = useState<ClinicalRecordPayload>(initialValue ?? emptyClinicalRecord);
  const normalizedPainLevel = String(Math.min(10, Math.max(0, formData.painStatus.painLevel || 0)));

  useEffect(() => {
    setFormData(initialValue ?? emptyClinicalRecord);
  }, [initialValue]);

  const handleSectionChange = <TSection extends keyof ClinicalRecordPayload, TField extends keyof ClinicalRecordPayload[TSection]>(
    section: TSection,
    field: TField,
    value: ClinicalRecordPayload[TSection][TField],
  ) => {
    setFormData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isSuccess = await onSubmit(formData);

    if (mode === "create" && isSuccess) {
      setFormData(emptyClinicalRecord);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Datos personales</h2>
          <p className="text-sm text-slate-500">Información base para la ficha clínica.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input label="Nombres" value={formData.personalData.firstName} onChange={(value) => handleSectionChange("personalData", "firstName", value)} required />
          <Input label="Apellidos" value={formData.personalData.lastName} onChange={(value) => handleSectionChange("personalData", "lastName", value)} required />
          <Input label="Tipo de documento" value={formData.personalData.documentType} onChange={(value) => handleSectionChange("personalData", "documentType", value)} required />
          <Input label="Número de documento" value={formData.personalData.documentNumber} onChange={(value) => handleSectionChange("personalData", "documentNumber", value)} required />
          <Input label="Fecha de nacimiento" type="date" value={formData.personalData.birthDate} onChange={(value) => handleSectionChange("personalData", "birthDate", value)} required />
          <Select
            label="Género"
            value={formData.personalData.gender}
            onChange={(value) => handleSectionChange("personalData", "gender", value)}
            options={[
              { value: "", label: "Seleccionar" },
              { value: "Masculino", label: "Masculino" },
              { value: "Femenino", label: "Femenino" },
            ]}
          />
          <Input
            label="Teléfono"
            value={formData.personalData.phone}
            onChange={(value) => handleSectionChange("personalData", "phone", value.replace(/\D/g, ""))}
            required
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <Input label="Email" type="email" value={formData.personalData.email} onChange={(value) => handleSectionChange("personalData", "email", value)} />
          <Input label="Ocupación" value={formData.personalData.occupation} onChange={(value) => handleSectionChange("personalData", "occupation", value)} />
          <TextArea label="Dirección" value={formData.personalData.address} onChange={(value) => handleSectionChange("personalData", "address", value)} className="md:col-span-2 xl:col-span-3" />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Antecedentes médicos</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextArea label="Alergias" value={formData.medicalHistory.allergies} onChange={(value) => handleSectionChange("medicalHistory", "allergies", value)} />
          <TextArea label="Medicamentos actuales" value={formData.medicalHistory.currentMedications} onChange={(value) => handleSectionChange("medicalHistory", "currentMedications", value)} />
          <TextArea label="Enfermedades sistémicas" value={formData.medicalHistory.systemicDiseases} onChange={(value) => handleSectionChange("medicalHistory", "systemicDiseases", value)} />
          <TextArea label="Cirugías previas" value={formData.medicalHistory.surgeries} onChange={(value) => handleSectionChange("medicalHistory", "surgeries", value)} />
          <TextArea label="Notas médicas" value={formData.medicalHistory.medicalNotes} onChange={(value) => handleSectionChange("medicalHistory", "medicalNotes", value)} className="md:col-span-2" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Checkbox label="Embarazo" checked={formData.medicalHistory.pregnant} onChange={(value) => handleSectionChange("medicalHistory", "pregnant", value)} />
          <Checkbox label="Fumador" checked={formData.medicalHistory.smoker} onChange={(value) => handleSectionChange("medicalHistory", "smoker", value)} />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Antecedentes odontológicos</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="Última visita odontológica" type="date" value={formData.dentalHistory.lastDentalVisit} onChange={(value) => handleSectionChange("dentalHistory", "lastDentalVisit", value)} />
          <Input label="Frecuencia de cepillado" value={formData.dentalHistory.brushingFrequency} onChange={(value) => handleSectionChange("dentalHistory", "brushingFrequency", value)} />
          <TextArea label="Motivo de consulta" value={formData.dentalHistory.reasonForConsultation} onChange={(value) => handleSectionChange("dentalHistory", "reasonForConsultation", value)} />
          <TextArea label="Tratamientos previos" value={formData.dentalHistory.previousTreatments} onChange={(value) => handleSectionChange("dentalHistory", "previousTreatments", value)} />
          <TextArea label="Notas odontológicas" value={formData.dentalHistory.dentalNotes} onChange={(value) => handleSectionChange("dentalHistory", "dentalNotes", value)} className="md:col-span-2" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Checkbox label="Usa hilo dental" checked={formData.dentalHistory.flossing} onChange={(value) => handleSectionChange("dentalHistory", "flossing", value)} />
          <Checkbox label="Sangrado de encías" checked={formData.dentalHistory.bleedingGums} onChange={(value) => handleSectionChange("dentalHistory", "bleedingGums", value)} />
          <Checkbox label="Bruxismo" checked={formData.dentalHistory.bruxism} onChange={(value) => handleSectionChange("dentalHistory", "bruxism", value)} />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Estado de dolor</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="Localización del dolor" value={formData.painStatus.painLocation} onChange={(value) => handleSectionChange("painStatus", "painLocation", value)} />
          <Input label="Duración" value={formData.painStatus.painDuration} onChange={(value) => handleSectionChange("painStatus", "painDuration", value)} />
          <Input label="Detonante" value={formData.painStatus.painTrigger} onChange={(value) => handleSectionChange("painStatus", "painTrigger", value)} />
          <Input
            label="Nivel de dolor (0-10)"
            type="number"
            min={0}
            max={10}
            value={normalizedPainLevel}
            onChange={(value) => {
              if (value === "") {
                handleSectionChange("painStatus", "painLevel", 0);
                return;
              }

              const numericValue = Number(value);
              handleSectionChange("painStatus", "painLevel", Math.min(10, Math.max(0, numericValue)));
            }}
          />
          <TextArea label="Descripción del dolor" value={formData.painStatus.painDescription} onChange={(value) => handleSectionChange("painStatus", "painDescription", value)} className="md:col-span-2" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Checkbox label="Presenta dolor" checked={formData.painStatus.isInPain} onChange={(value) => handleSectionChange("painStatus", "isInPain", value)} />
          <Checkbox label="Toma medicación" checked={formData.painStatus.takesMedication} onChange={(value) => handleSectionChange("painStatus", "takesMedication", value)} />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {mode === "edit" ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancelar edición
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : mode === "edit" ? "Actualizar ficha" : "Guardar ficha"}
        </button>
      </div>
    </form>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
  min?: number;
  max?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
}

function Input({ label, value, onChange, type = "text", required, className = "", min, max, inputMode, pattern }: InputProps) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        min={min}
        max={max}
        inputMode={inputMode}
        pattern={pattern}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

function Select({ label, value, onChange, options, className = "" }: SelectProps) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      >
        {options.map((option) => (
          <option key={option.value || "empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function TextArea({ label, value, onChange, className = "" }: TextAreaProps) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
      />
      <span>{label}</span>
    </label>
  );
}
