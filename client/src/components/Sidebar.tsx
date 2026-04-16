import { NavLink } from "react-router-dom";

const items: Array<{ to: string; label: string; description: string }> = [
  {
    to: "/",
    label: "Pacientes",
    description: "Consulta y administra la información de pacientes.",
  },
  {
    to: "/patients/new",
    label: "Nuevo Paciente",
    description: "Registra un nuevo paciente desde un único formulario.",
  },
];

export function Sidebar() {
  return (
    <aside className="flex w-full flex-col border-r border-slate-200 bg-slate-900 text-white lg:w-72">
      <div className="border-b border-slate-800 px-6 py-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Odontología</p>
        <h1 className="mt-3 text-2xl font-semibold">Dentis Soft</h1>
        <p className="mt-2 text-sm text-slate-400">Plataforma para la gestión de pacientes y fichas clínicas.</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {items.map((item) => {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `block w-full rounded-2xl px-4 py-4 text-left transition ${
                  isActive ? "bg-brand-500 text-white shadow-lg shadow-brand-900/30" : "bg-slate-800/60 text-slate-200 hover:bg-slate-800"
                }`
              }
            >
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="mt-1 text-xs text-slate-300">{item.description}</div>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
