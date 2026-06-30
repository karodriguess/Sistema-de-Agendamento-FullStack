import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";

interface DashboardData {
  totalClientes: number;
  totalProfissionais: number;
  totalServicos: number;
  totalAgendamentos: number;
  agendamentosHoje: number;
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={1.5}
      className="w-6 h-6"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={1.5}
      className="w-6 h-6"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={1.5}
      className="w-6 h-6"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={1.5}
      className="w-6 h-6"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={1.5}
      className="w-6 h-6"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get("/dashboard");
        setDashboard(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-slate-400 text-sm">Carregando...</p>
      </div>
    );
  }

  const cards = [
    {
      label: "Clientes",
      value: dashboard?.totalClientes ?? 0,
      icon: <PersonIcon />,
      sub: "Total registrado",
    },
    {
      label: "Profissionais",
      value: dashboard?.totalProfissionais ?? 0,
      icon: <UsersIcon />,
      sub: "Total registrado",
    },
    {
      label: "Serviços",
      value: dashboard?.totalServicos ?? 0,
      icon: <BriefcaseIcon />,
      sub: "Total registrado",
    },
    {
      label: "Agendamentos",
      value: dashboard?.totalAgendamentos ?? 0,
      icon: <CalendarIcon />,
      sub: "Total registrado",
    },
    {
      label: "Hoje",
      value: dashboard?.agendamentosHoje ?? 0,
      icon: <ClockIcon />,
      sub: "Agendamentos do dia",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 min-h-screen p-8">
        <p className="text-xs text-slate-400 mb-1">Pages / Dashboard</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-10">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {cards.map(({ label, value, icon, sub }) => (
            <div key={label} className="pt-6">
              <div className="bg-white rounded-xl p-5 shadow-sm relative">
                <div className="absolute -top-5 right-4 w-10 h-10 bg-pink-800 font-semibold rounded-xl flex items-center justify-center shadow-lg">
                  {icon}
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {value}
                </p>
                <p className="text-xs text-slate-400 mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
