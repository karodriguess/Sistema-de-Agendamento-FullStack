import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import {
  getProfissionais,
  createProfissional,
  deleteProfissional,
  updateProfissional,
} from "../../services/profissionais";

interface Profissional {
  _id: string;
  nome: string;
  especialidade: string;
}

export function Profissionais() {
  const [nome, setNome] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadProfissionais = useCallback(async () => {
    const data = await getProfissionais();
    setProfissionais(data);
  }, []);

  useEffect(() => {
    loadProfissionais();
  }, [loadProfissionais]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateProfissional(editingId, { nome, especialidade });
      setEditingId(null);
    } else {
      await createProfissional({ nome, especialidade });
    }
    setNome("");
    setEspecialidade("");
    loadProfissionais();
  }

  async function handleDelete(id: string) {
    await deleteProfissional(id);
    loadProfissionais();
  }

  function handleEdit(profissional: Profissional) {
    setEditingId(profissional._id);
    setNome(profissional.nome);
    setEspecialidade(profissional.especialidade);
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 min-h-screen p-8">
        <p className="text-xs text-slate-400 mb-1">Pages / Profissionais</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          Profissionais
        </h1>

        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
            {editingId ? "Editar Profissional" : "Novo Profissional"}
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
              placeholder="Especialidade"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {editingId ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Nome
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Especialidade
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {profissionais.map((profissional) => (
                <tr
                  key={profissional._id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    {profissional.nome}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {profissional.especialidade}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-5">
                      <button
                        onClick={() => handleEdit(profissional)}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(profissional._id)}
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
      </main>
    </div>
  );
}
