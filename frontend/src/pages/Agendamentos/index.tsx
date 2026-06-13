import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { getAgendamentos } from "../../services/agendamentos";
import { getProfissionais } from "../../services/profissionais";

interface Agendamento {
  _id: string;
  clienteId: {
    nome: string;
    telefone?: string;
    email: string;
  };
  profissionalId: {
    _id: string;
    nome: string;
    especialidade: string;
  };
  servicoId: {
    nome: string;
    preco: number;
  };
  data: string;
  horario: string;
  status: "agendado" | "cancelado" | "concluido";
}

interface Profissional {
  _id: string;
  nome: string;
}

const statusStyles: Record<string, string> = {
  agendado: "bg-blue-50 text-blue-600",
  concluido: "bg-emerald-50 text-emerald-600",
  cancelado: "bg-red-50 text-red-500",
};

const statusLabels: Record<string, string> = {
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [filtroProf, setFiltroProf] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [ags, profs] = await Promise.all([
        getAgendamentos(),
        getProfissionais(),
      ]);
      setAgendamentos(ags);
      setProfissionais(profs);
      setLoading(false);
    }
    load();
  }, []);

  const filtrados =
    filtroProf === "todos"
      ? agendamentos
      : agendamentos.filter((a) => a.profissionalId?._id === filtroProf);

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 min-h-screen p-8">
        <p className="text-xs text-slate-400 mb-1">Pages / Agendamentos</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Agendamentos</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
            Filtrar por Profissional
          </h2>
          <select
            value={filtroProf}
            onChange={(e) => setFiltroProf(e.target.value)}
            className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white min-w-[240px]"
          >
            <option value="todos">Todos os profissionais</option>
            {profissionais.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="px-6 py-8 text-sm text-slate-500">Carregando...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Cliente
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Telefone
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Serviço
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Profissional
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Data
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Horário
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-slate-400 text-sm"
                    >
                      Nenhum agendamento encontrado.
                    </td>
                  </tr>
                ) : (
                  filtrados.map((a) => (
                    <tr
                      key={a._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {a.clienteId?.nome ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {a.clienteId?.telefone ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {a.servicoId?.nome ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {a.profissionalId?.nome ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(a.data)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{a.horario}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[a.status] ?? ""}`}
                        >
                          {statusLabels[a.status] ?? a.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
