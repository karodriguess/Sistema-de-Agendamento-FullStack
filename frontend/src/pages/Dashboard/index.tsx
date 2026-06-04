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
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-50 min-h-screen p-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-500">Clientes</h3>

            <p className="text-3xl font-bold mt-2">
              {dashboard?.totalClientes ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-500">Profissionais</h3>

            <p className="text-3xl font-bold mt-2">
              {dashboard?.totalProfissionais ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-500">Serviços</h3>

            <p className="text-3xl font-bold mt-2">
              {dashboard?.totalServicos ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-500">Agendamentos</h3>

            <p className="text-3xl font-bold mt-2">
              {dashboard?.totalAgendamentos ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-500">Hoje</h3>

            <p className="text-3xl font-bold mt-2">
              {dashboard?.agendamentosHoje ?? 0}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
