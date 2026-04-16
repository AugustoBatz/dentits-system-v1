import type { PaginationMeta, Patient } from "../types/patient";

interface PatientsTableProps {
  patients: Patient[];
  meta: PaginationMeta;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onOpenTreatmentPlan: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export function PatientsTable({
  patients,
  meta,
  loading,
  searchQuery,
  onSearchChange,
  onPageChange,
  onOpenTreatmentPlan,
  onEdit,
  onDelete,
}: PatientsTableProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Pacientes registrados</h3>
            <p className="text-sm text-slate-500">Busca por nombre o apellido y navega los resultados por páginas.</p>
          </div>

          <label className="w-full md:max-w-sm">
            <span className="mb-2 block text-sm font-medium text-slate-700">Buscar por nombre</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Ej.: María González"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Consulta</th>
                <th className="px-6 py-4">Dolor</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    Cargando pacientes...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    {searchQuery.trim()
                      ? "No se encontraron pacientes para esa búsqueda."
                      : 'No hay pacientes cargados. Usa la vista "Nuevo Paciente" para crear el primero.'}
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-slate-700">
                        {patient.userCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{patient.fullName}</div>
                      <div className="text-xs text-slate-500">{patient.personalData.gender || "Sin especificar"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {patient.personalData.documentType} {patient.personalData.documentNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>{patient.personalData.phone}</div>
                      <div className="text-xs text-slate-500">{patient.personalData.email || "Sin email"}</div>
                    </td>
                    <td className="px-6 py-4">{patient.dentalHistory.reasonForConsultation || "Control general"}</td>
                    <td className="px-6 py-4">
                      {patient.painStatus.isInPain ? `Nivel ${patient.painStatus.painLevel}/10` : "Sin dolor"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenTreatmentPlan(patient)}
                          className="rounded-xl bg-brand-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700"
                        >
                          Plan de Tratamiento
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(patient)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(patient)}
                          className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-sm">
        <div className="text-sm text-slate-500">
          Página {meta.page} de {meta.totalPages} · {meta.totalItems} pacientes
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPageChange(meta.page - 1)}
            disabled={meta.page <= 1}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => onPageChange(meta.page + 1)}
            disabled={meta.page >= meta.totalPages}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
