import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createTreatmentPlan, getTreatmentPlans } from "../services/patients";
import type { Patient, TreatmentPlan, TreatmentPlanPayload } from "../types/patient";

interface TreatmentPlanViewProps {
  patient: Patient | null;
}

const emptyPlan: TreatmentPlanPayload = {
  tooth: "",
  diagnosisProcedure: "",
  unitCost: 0,
  observations: "",
  plannedDate: "",
};

export function TreatmentPlanView({ patient }: TreatmentPlanViewProps) {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TreatmentPlanPayload>(emptyPlan);

  const loadPlans = async () => {
    if (!patient) {
      setPlans([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTreatmentPlans(patient.id);
      setPlans(data);
    } catch (requestError) {
      console.error(requestError);
      setError("No fue posible cargar el plan de tratamiento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlans();
  }, [patient?.id]);

  const handleChange = <TField extends keyof TreatmentPlanPayload>(field: TField, value: TreatmentPlanPayload[TField]) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setFormData(emptyPlan);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!patient) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createTreatmentPlan(patient.id, formData);
      closeModal();
      await loadPlans();
    } catch (requestError) {
      console.error(requestError);
      setError("No fue posible guardar el plan de tratamiento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!patient) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">Selecciona un paciente desde la lista para visualizar su plan de tratamiento.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Volver a Pacientes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-700">Paciente seleccionado</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">{patient.fullName}</h3>
            <p className="mt-1 text-sm text-slate-500">
              Código {patient.userCode} · Documento {patient.personalData.documentType} {patient.personalData.documentNumber}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Volver a Pacientes
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-700"
            >
              Agregar Plan
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Pieza</th>
                <th className="px-6 py-4">Diagnóstico / Procedimiento</th>
                <th className="px-6 py-4">Costo Unitario</th>
                <th className="px-6 py-4">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Cargando plan de tratamiento...
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Aún no hay planes cargados para este paciente.
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{plan.plannedDate}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{plan.tooth}</td>
                    <td className="px-6 py-4">{plan.diagnosisProcedure}</td>
                    <td className="px-6 py-4">${plan.unitCost.toFixed(2)}</td>
                    <td className="px-6 py-4">{plan.observations || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-medium text-brand-700">Agregar Plan</p>
                <h4 className="mt-1 text-xl font-semibold text-slate-900">{patient.fullName}</h4>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>

            <form className="grid gap-4 px-6 py-6 md:grid-cols-2" onSubmit={handleSubmit}>
              <Field label="Fecha">
                <input
                  type="date"
                  value={formData.plannedDate}
                  onChange={(event) => handleChange("plannedDate", event.target.value)}
                  required
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </Field>

              <Field label="Pieza">
                <input
                  type="text"
                  value={formData.tooth}
                  onChange={(event) => handleChange("tooth", event.target.value)}
                  placeholder="Ej.: 16"
                  required
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </Field>

              <Field label="Diagnóstico / Procedimiento" className="md:col-span-2">
                <input
                  type="text"
                  value={formData.diagnosisProcedure}
                  onChange={(event) => handleChange("diagnosisProcedure", event.target.value)}
                  required
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </Field>

              <Field label="Costo Unitario">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={String(formData.unitCost)}
                  onChange={(event) => handleChange("unitCost", Number(event.target.value))}
                  required
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </Field>

              <Field label="Observaciones" className="md:col-span-2">
                <textarea
                  rows={4}
                  value={formData.observations}
                  onChange={(event) => handleChange("observations", event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </Field>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Guardando..." : "Guardar plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function Field({ label, children, className = "" }: FieldProps) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
