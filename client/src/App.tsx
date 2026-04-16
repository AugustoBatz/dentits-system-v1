import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { emptyClinicalRecord } from "./constants/clinicalRecord";
import { PatientForm } from "./components/PatientForm";
import { PatientsTable } from "./components/PatientsTable";
import { Sidebar } from "./components/Sidebar";
import { TreatmentPlanView } from "./components/TreatmentPlanView";
import { createPatient, deletePatient, getPatient, getPatients, updatePatient } from "./services/patients";
import type { ClinicalRecordPayload, PaginationMeta, Patient } from "./types/patient";

const defaultMeta: PaginationMeta = {
  page: 1,
  pageSize: 5,
  totalItems: 0,
  totalPages: 1,
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const pageTitle = useMemo(() => {
    if (location.pathname === "/") {
      return "Lista de Pacientes";
    }

    if (location.pathname === "/patients/new") {
      return "Nuevo Paciente";
    }

    if (location.pathname.includes("/edit")) {
      return "Editar Ficha Clínica";
    }

    if (location.pathname.includes("/treatment-plan")) {
      return "Plan de Tratamiento";
    }

    return "Gestión Clínica";
  }, [location.pathname]);

  const formInitialValue = useMemo<ClinicalRecordPayload>(() => {
    if (!editingPatient) {
      return emptyClinicalRecord;
    }

    return {
      personalData: editingPatient.personalData,
      medicalHistory: editingPatient.medicalHistory,
      dentalHistory: editingPatient.dentalHistory,
      painStatus: editingPatient.painStatus,
    };
  }, [editingPatient]);

  const loadPatients = async (page = meta.page, search = searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPatients(page, defaultMeta.pageSize, search);
      setPatients(response.items);
      setMeta(response.meta);
    } catch (requestError) {
      console.error(requestError);
      setError("No fue posible cargar los pacientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPatients(1, searchQuery);
  }, [searchQuery]);

  const handleSubmit = async (payload: ClinicalRecordPayload): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (editingPatient) {
        await updatePatient(editingPatient.id, payload);
      } else {
        await createPatient(payload);
      }

      setEditingPatient(null);
      await loadPatients(1, searchQuery);
      navigate("/");
      return true;
    } catch (requestError) {
      console.error(requestError);
      setError("No fue posible guardar la ficha clínica.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    navigate(`/patients/${patient.id}/edit`);
  };

  const handleDelete = async (patient: Patient) => {
    const confirmed = window.confirm(`¿Eliminar la ficha de ${patient.fullName}?`);
    if (!confirmed) {
      return;
    }

    try {
      setError(null);
      await deletePatient(patient.id);
      await loadPatients(meta.page, searchQuery);
    } catch (requestError) {
      console.error(requestError);
      setError("No fue posible eliminar el paciente.");
    }
  };

  const handleOpenTreatmentPlan = (patient: Patient) => {
    navigate(`/patients/${patient.id}/treatment-plan`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <Sidebar />

      <main className="flex-1">
        <div className="border-b border-slate-200 bg-white/80 px-6 py-6 backdrop-blur-lg md:px-10">
          <p className="text-sm font-medium text-brand-700">Gestión Clínica</p>
          <h2 className="mt-1 text-3xl font-semibold">{pageTitle}</h2>
          <p className="mt-2 text-sm text-slate-500">Administración de pacientes, fichas clínicas y planes de tratamiento en un solo lugar.</p>
        </div>

        <div className="space-y-6 px-6 py-6 md:px-10">
          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

          <Routes>
            <Route
              path="/"
              element={
                <PatientsTable
                  patients={patients}
                  meta={meta}
                  loading={loading}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onPageChange={(page) => void loadPatients(page, searchQuery)}
                  onOpenTreatmentPlan={handleOpenTreatmentPlan}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              }
            />
            <Route
              path="/patients/new"
              element={
                <PatientForm
                  mode="create"
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  onCancelEdit={() => navigate("/")}
                />
              }
            />
            <Route path="/patients/:id/edit" element={<PatientEditRoute onSubmit={handleSubmit} isSubmitting={isSubmitting} setError={setError} setEditingPatient={setEditingPatient} formInitialValue={formInitialValue} />} />
            <Route path="/patients/:id/treatment-plan" element={<TreatmentPlanRoute setError={setError} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

interface PatientEditRouteProps {
  onSubmit: (payload: ClinicalRecordPayload) => Promise<boolean>;
  isSubmitting: boolean;
  setError: (value: string | null) => void;
  setEditingPatient: (patient: Patient | null) => void;
  formInitialValue: ClinicalRecordPayload;
}

function PatientEditRoute({ onSubmit, isSubmitting, setError, setEditingPatient, formInitialValue }: PatientEditRouteProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPatient = async () => {
      if (!id) {
        setError("Paciente no encontrado.");
        navigate("/", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const patient = await getPatient(Number(id));
        if (active) {
          setEditingPatient(patient);
        }
      } catch (requestError) {
        console.error(requestError);
        if (active) {
          setError("No fue posible cargar la ficha clínica.");
          navigate("/", { replace: true });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPatient();

    return () => {
      active = false;
      setEditingPatient(null);
    };
  }, [id, navigate, setEditingPatient, setError]);

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 text-sm text-slate-500 shadow-sm">Cargando ficha clínica...</div>;
  }

  return (
    <PatientForm
      initialValue={formInitialValue}
      mode="edit"
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      onCancelEdit={() => {
        setEditingPatient(null);
        navigate("/");
      }}
    />
  );
}

function TreatmentPlanRoute({ setError }: { setError: (value: string | null) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPatient = async () => {
      if (!id) {
        setError("Paciente no encontrado.");
        navigate("/", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getPatient(Number(id));
        if (active) {
          setPatient(data);
        }
      } catch (requestError) {
        console.error(requestError);
        if (active) {
          setError("No fue posible cargar el paciente.");
          navigate("/", { replace: true });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPatient();

    return () => {
      active = false;
    };
  }, [id, navigate, setError]);

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 text-sm text-slate-500 shadow-sm">Cargando plan de tratamiento...</div>;
  }

  return <TreatmentPlanView patient={patient} />;
}
