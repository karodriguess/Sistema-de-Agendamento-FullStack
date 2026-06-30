import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import {
  getServicos,
  createServico,
  updateServico,
  deleteServico,
} from "../../services/servicos";
import { getProfissionais } from "../../services/profissionais";

interface Profissional {
  _id: string;
  nome: string;
  especialidade: string;
}

interface Servico {
  _id: string;
  nome: string;
  duracao: number;
  preco: number;
  profissionalId?: { _id: string; nome: string } | null;
}

export function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState("");
  const [preco, setPreco] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadServicos() {
    const data = await getServicos();
    setServicos(data);
  }

  function handleEdit(servico: Servico) {
    setEditingId(servico._id);
    setNome(servico.nome);
    setDuracao(String(servico.duracao));
    setPreco(String(servico.preco));
    setProfissionalId(servico.profissionalId?._id ?? "");
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja excluir este serviço?")) return;
    await deleteServico(id);
    loadServicos();
  }

  useEffect(() => {
    loadServicos();
    getProfissionais().then(setProfissionais);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      nome,
      duracao: Number(duracao),
      preco: Number(preco),
      profissionalId: profissionalId || undefined,
    };
    if (editingId) {
      await updateServico(editingId, payload);
      setEditingId(null);
    } else {
      await createServico(payload);
    }
    setNome("");
    setDuracao("");
    setPreco("");
    setProfissionalId("");
    loadServicos();
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 min-h-screen px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-20 md:p-8">
        <p className="text-xs text-slate-400 mb-1">Pages / Serviços</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Serviços</h1>

        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
            {editingId ? "Editar Serviço" : "Novo Serviço"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <select
              value={profissionalId}
              onChange={(e) => setProfissionalId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
            >
              <option value="">— Selecione o profissional —</option>
              {profissionais.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nome} · {p.especialidade}
                </option>
              ))}
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Duração (min)"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <input
              type="number"
              placeholder="Preço (R$)"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {editingId ? "Atualizar" : "Salvar"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNome("");
                setDuracao("");
                setPreco("");
                setProfissionalId("");
              }}
              className="mt-4 ml-3 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </form>

        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Nome
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Profissional
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Duração
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Preço
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico) => (
                <tr
                  key={servico._id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    {servico.nome}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {servico.profissionalId?.nome ?? (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {servico.duracao} min
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    R$ {servico.preco}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(servico)}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(servico._id)}
                        className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden flex flex-col gap-3">
          {servicos.map((servico) => (
            <div key={servico._id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-slate-700 font-medium">{servico.nome}</p>
                <p className="text-slate-500 text-sm">R$ {servico.preco}</p>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                {servico.profissionalId?.nome ?? (
                  <span className="text-slate-300">—</span>
                )}{" "}
                · {servico.duracao} min
              </p>
              <div className="flex gap-3 mt-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleEdit(servico)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(servico._id)}
                  className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
