import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { createPatient, deletePatient, getPatient, updatePatient } from "./api/patientsApi";
import { ClinicalRecordForm, draftFromPatient } from "./components/ClinicalRecordForm";
import { Sidebar } from "./components/Sidebar";
import { TreatmentPlanView } from "./components/TreatmentPlanView";
import { emptyClinicalPayload, type ClinicalRecordPayload } from "./types/patient";
import { PatientsTable } from "./components/PatientsTable";
import type { Patient } from "./types/patient";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [exportingLogs, setExportingLogs] = useState(false);
  const pageTitle = useMemo(() => {
    if (location.pathname === "/") return "Pacientes";
    if (location.pathname === "/patients/new") return "Nuevo Paciente";
    if (location.pathname.includes("/edit")) return "Editar Ficha Clinica";
    if (location.pathname.includes("/treatment-plan")) return "Plan de Tratamiento";
    return "Dentis Soft";
  }, [location.pathname]);

  useEffect(() => {
    const originalConsoleLog = console.log.bind(console);
    const originalConsoleError = console.error.bind(console);

    console.log = (...args: unknown[]) => {
      originalConsoleLog(...args);
    };

    console.error = (...args: unknown[]) => {
      originalConsoleError(...args);
    };

    const onError = (event: ErrorEvent) => {
      console.error("renderer.error", event.message, event.error);
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("renderer.unhandledRejection", event.reason);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <Sidebar />
      {notice ? (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900 shadow">
          {notice}
        </div>
      ) : null}
      <main className="flex flex-1 flex-col">
        <div className="border-b border-slate-200 bg-white/80 px-6 py-6 backdrop-blur-lg md:px-10">
          <p className="text-sm font-medium text-teal-700">Gestion Clinica</p>
          <h2 className="mt-1 text-3xl font-semibold">{pageTitle}</h2>
          <p className="mt-2 text-sm text-slate-500">Administracion de pacientes, fichas clinicas y planes de tratamiento en un solo lugar.</p>
        </div>

        <div className="flex-1 space-y-6 px-6 py-6 md:px-10">
          <Routes>
            <Route
              path="/"
              element={
                <PatientsTable
                  refreshKey={refreshKey}
                  onEdit={(patient) => navigate(`/patients/${patient.id}/edit`)}
                  onDelete={async (patient) => {
                    if (!confirm(`¿Eliminar la ficha de ${patient.fullName}?`)) return;
                    try {
                      await deletePatient(patient.id);
                      setNotice("Paciente eliminado.");
                      setRefreshKey((k) => k + 1);
                    } catch (e) {
                      setNotice(e instanceof Error ? e.message : "No se pudo eliminar.");
                    }
                  }}
                  onOpenTreatmentPlan={(patient) => navigate(`/patients/${patient.id}/treatment-plan`)}
                />
              }
            />
            <Route
              path="/patients/new"
              element={<PatientCreateRoute saving={saving} setSaving={setSaving} setNotice={setNotice} bump={() => setRefreshKey((k) => k + 1)} />}
            />
            <Route
              path="/patients/:id/edit"
              element={<PatientEditRoute saving={saving} setSaving={setSaving} setNotice={setNotice} bump={() => setRefreshKey((k) => k + 1)} />}
            />
            <Route path="/patients/:id/treatment-plan" element={<TreatmentPlanRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <footer className="border-t border-slate-200 bg-white px-6 py-4 md:px-10">
          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={exportingLogs}
              onClick={async () => {
                if (!window.dentis) return;
                setExportingLogs(true);
                try {
                  const result = await window.dentis.exportLogs();
                  if (!result.canceled) {
                    setNotice("Logs exportados correctamente.");
                  }
                } catch (error) {
                  console.error("exportLogs.failed", error);
                  setNotice("No fue posible exportar los logs.");
                } finally {
                  setExportingLogs(false);
                }
              }}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exportingLogs ? "Exportando..." : "Exportar Logs de Error"}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

function PatientCreateRoute({
  saving,
  setSaving,
  setNotice,
  bump,
}: {
  saving: boolean;
  setSaving: (value: boolean) => void;
  setNotice: (value: string | null) => void;
  bump: () => void;
}) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ClinicalRecordPayload>(emptyClinicalPayload());

  useEffect(() => {
    setDraft(emptyClinicalPayload());
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <ClinicalRecordForm
        mode="new"
        value={draft}
        onChange={setDraft}
        saving={saving}
        onSave={async () => {
          setSaving(true);
          setNotice(null);
          try {
            await createPatient(draft);
            setNotice("Paciente creado correctamente.");
            bump();
            navigate("/");
          } catch (e) {
            setNotice(e instanceof Error ? e.message : "No se pudo guardar.");
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}

function PatientEditRoute({
  saving,
  setSaving,
  setNotice,
  bump,
}: {
  saving: boolean;
  setSaving: (value: boolean) => void;
  setNotice: (value: string | null) => void;
  bump: () => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [draft, setDraft] = useState<ClinicalRecordPayload>(emptyClinicalPayload());

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!id) {
        navigate("/", { replace: true });
        return;
      }
      try {
        setLoading(true);
        const current = await getPatient(Number(id));
        if (active) {
          setPatient(current);
          setDraft(draftFromPatient(current));
        }
      } catch (e) {
        setNotice(e instanceof Error ? e.message : "No se pudo cargar la ficha.");
        navigate("/", { replace: true });
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [id, navigate, setNotice]);

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 text-sm text-slate-500 shadow-sm">Cargando ficha clinica...</div>;
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <ClinicalRecordForm
        mode="edit"
        userCode={patient.userCode}
        value={draft}
        onChange={setDraft}
        saving={saving}
        onCancel={() => navigate("/")}
        onSave={async () => {
          setSaving(true);
          setNotice(null);
          try {
            const updated = await updatePatient(patient.id, draft);
            setPatient(updated);
            setDraft(draftFromPatient(updated));
            setNotice("Cambios guardados.");
            bump();
          } catch (e) {
            setNotice(e instanceof Error ? e.message : "No se pudo guardar.");
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}

function TreatmentPlanRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) {
        navigate("/", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const current = await getPatient(Number(id));
        if (active) setPatient(current);
      } catch {
        navigate("/", { replace: true });
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [id, navigate]);

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 text-sm text-slate-500 shadow-sm">Cargando plan de tratamiento...</div>;
  }

  return <TreatmentPlanView patient={patient} />;
}
