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
  status: "agendado" | "cancelado" | "cancelado_cliente" | "remarcado_cliente";
}

interface Profissional {
  _id: string;
  nome: string;
}

const statusStyles: Record<string, string> = {
  agendado: "bg-green-100 text-green-700 border border-green-200",

  remarcado_cliente: "bg-amber-100 text-amber-700 border border-amber-200",

  cancelado: "bg-red-100 text-red-700 border border-red-200",

  cancelado_cliente: "bg-red-100 text-red-700 border border-red-200",
};

const statusLabels: Record<string, string> = {
  agendado: "Agendado",

  remarcado_cliente: "Remarcado",

  cancelado: "Cancelado",

  cancelado_cliente: "Cancelado",
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function getHojeStr() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

export function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [filtroProf, setFiltroProf] = useState("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState<"todos" | "hoje" | "data">(
    "todos"
  );
  const [dataSelecionada, setDataSelecionada] = useState("");
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

  const filtrados = agendamentos.filter((a) => {
    const matchProf =
      filtroProf === "todos" || a.profissionalId?._id === filtroProf;

    const matchPeriodo =
      filtroPeriodo === "hoje"
        ? a.data === getHojeStr()
        : filtroPeriodo === "data"
        ? a.data === dataSelecionada
        : true;

    return matchProf && matchPeriodo;
  });

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 min-h-screen px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-20 md:p-8">
        <p className="text-xs text-slate-400 mb-1">Pages / Agendamentos</p>

        <h1 className="text-2xl font-bold text-slate-800 mb-8">Agendamentos</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
            Filtros
          </h2>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <select
              value={filtroProf}
              onChange={(e) => setFiltroProf(e.target.value)}
              className="w-full sm:w-auto border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
            >
              <option value="todos">Todos os profissionais</option>

              {profissionais.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nome}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setFiltroPeriodo(filtroPeriodo === "hoje" ? "todos" : "hoje");
                setDataSelecionada("");
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                filtroPeriodo === "hoje"
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Hoje
            </button>

            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => {
                const value = e.target.value;
                setDataSelecionada(value);
                setFiltroPeriodo(value ? "data" : "todos");
              }}
              className="w-full sm:w-auto border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
            />
          </div>
        </div>

        <div
          className={
            loading
              ? "bg-white rounded-xl shadow-sm overflow-hidden"
              : "hidden md:block bg-white rounded-xl shadow-sm overflow-hidden"
          }
        >
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
                      <td className="px-6 py-4 font-medium text-slate-700">
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
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                            statusStyles[a.status] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>

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

        {!loading && (
          <div className="md:hidden flex flex-col gap-3">
            {filtrados.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm px-6 py-10 text-center text-slate-400 text-sm">
                Nenhum agendamento encontrado.
              </div>
            ) : (
              filtrados.map((a) => (
                <div key={a._id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-slate-700">
                      {a.clienteId?.nome ?? "-"}
                    </p>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                        statusStyles[a.status] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                      {statusLabels[a.status] ?? a.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Telefone
                      </p>
                      <p className="text-slate-600 text-sm mt-0.5">
                        {a.clienteId?.telefone ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Serviço
                      </p>
                      <p className="text-slate-600 text-sm mt-0.5">
                        {a.servicoId?.nome ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Profissional
                      </p>
                      <p className="text-slate-600 text-sm mt-0.5">
                        {a.profissionalId?.nome ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Data
                      </p>
                      <p className="text-slate-600 text-sm mt-0.5">
                        {formatDate(a.data)} · {a.horario}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
