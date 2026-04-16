import { useCallback, useEffect, useState } from "react";
import { listPatients } from "../api/patientsApi";
import type { Patient } from "../types/patient";

interface Props {
  onEdit: (p: Patient) => void;
  onDelete: (p: Patient) => void;
  onOpenTreatmentPlan: (p: Patient) => void;
  refreshKey: number;
}

export function PatientsTable({ onEdit, onDelete, onOpenTreatmentPlan, refreshKey }: Props) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Patient[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    pageSize,
    totalItems: 0,
    totalPages: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listPatients(page, pageSize, q);
      setRows(res.items);
      setMeta(res.meta);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar pacientes");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, q]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Pacientes registrados</h3>
            <p className="text-sm text-slate-500">Busca por nombre y navega los resultados por paginas.</p>
          </div>

          <label className="w-full md:max-w-sm">
            <span className="mb-2 block text-sm font-medium text-slate-700">Buscar por nombre</span>
            <input
              type="search"
              placeholder="Ej.: Maria Gonzalez"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Codigo</th>
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
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                  {q.trim() ? "No se encontraron pacientes para esa busqueda." : 'No hay pacientes cargados. Usa la vista "Nuevo Paciente" para crear el primero.'}
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-slate-700">
                    {p.userCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{p.fullName}</div>
                    <div className="text-xs text-slate-500">{p.personalData.gender || "Sin especificar"}</div>
                  </td>
                  <td className="px-6 py-4">
                    {p.personalData.documentType} {p.personalData.documentNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div>{p.personalData.phone}</div>
                    <div className="text-xs text-slate-500">{p.personalData.email || "Sin email"}</div>
                  </td>
                  <td className="px-6 py-4">{p.dentalHistory.reasonForConsultation || "Control general"}</td>
                  <td className="px-6 py-4">
                    {p.painStatus.isInPain ? `Nivel ${p.painStatus.painLevel}/10` : "Sin dolor"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenTreatmentPlan(p)}
                        className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700"
                      >
                        Plan de Tratamiento
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(p)}
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
          Pagina {meta.page} de {meta.totalPages} · {meta.totalItems} pacientes
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={meta.page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={meta.page >= meta.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
