import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <aside
      className="
      w-64
      bg-white
      border-r
      border-slate-200
      min-h-screen
      p-6
    "
    >
      <h2
        className="
        text-2xl
        font-semibold
        mb-10
        text-slate-800
      "
      >
        AgendaPro
      </h2>

      <nav className="flex flex-col gap-3">
        <Link to="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>

        <Link to="/profissionais" className="hover:text-blue-600">
          Profissionais
        </Link>

        <Link to="/servicos" className="hover:text-blue-600">
          Serviços
        </Link>

        <Link to="/agendamentos" className="hover:text-blue-600">
          Agendamentos
        </Link>

        <Link to="/meus-agendamentos" className="hover:text-blue-600">
          Meus Agendamentos
        </Link>
      </nav>
    </aside>
  );
}
