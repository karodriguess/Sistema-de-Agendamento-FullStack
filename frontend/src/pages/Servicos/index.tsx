import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import {
  getServicos,
  createServico,
  updateServico,
  deleteServico,
} from "../../services/servicos";

interface Servico {
  _id: string;
  nome: string;
  descricao: string;
  duracao: number;
  preco: number;
}

export function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [preco, setPreco] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadServicos() {
    const data = await getServicos();
    setServicos(data);
  }

  function handleEdit(servico: Servico) {
    setEditingId(servico._id);
    setNome(servico.nome);
    setDescricao(servico.descricao);
    setDuracao(String(servico.duracao));
    setPreco(String(servico.preco));
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja excluir este serviço?")) return;
    await deleteServico(id);
    loadServicos();
  }

  useEffect(() => {
    loadServicos();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateServico(editingId, {
        nome,
        descricao,
        duracao: Number(duracao),
        preco: Number(preco),
      });
      setEditingId(null);
    } else {
      await createServico({
        nome,
        descricao,
        duracao: Number(duracao),
        preco: Number(preco),
      });
    }
    setNome("");
    setDescricao("");
    setDuracao("");
    setPreco("");
    loadServicos();
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 min-h-screen p-8">
        <p className="text-xs text-slate-400 mb-1">Pages / Serviços</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Serviços</h1>

        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
            {editingId ? "Editar Serviço" : "Novo Serviço"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
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
            className="mt-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {editingId ? "Atualizar" : "Salvar"}
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Duração</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Preço</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico) => (
                <tr key={servico._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-700 font-medium">{servico.nome}</td>
                  <td className="px-6 py-4 text-slate-500">{servico.duracao} min</td>
                  <td className="px-6 py-4 text-slate-500">R$ {servico.preco}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(servico)}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(servico._id)}
                        className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
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
      </main>
    </div>
  );
}
