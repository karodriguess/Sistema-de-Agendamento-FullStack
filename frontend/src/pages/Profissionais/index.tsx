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
      await updateProfissional(editingId, {
        nome,
        especialidade,
      });

      setEditingId(null);
    } else {
      await createProfissional({
        nome,
        especialidade,
      });
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

      <main className="flex-1 p-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8">Profissionais</h1>

        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl shadow-sm mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border p-3 rounded"
            />

            <input
              type="text"
              placeholder="Especialidade"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              className="border p-3 rounded"
            />
          </div>

          <button
            className="
            mt-4
            bg-blue-600
            text-white
            px-6
            py-3
            rounded
          "
          >
            {editingId ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Nome</th>

                <th className="text-left p-4">Especialidade</th>

                <th className="text-left p-4">Ações</th>
              </tr>
            </thead>

            <tbody>
              {profissionais.map((profissional) => (
                <tr key={profissional._id} className="border-b">
                  <td className="p-4">{profissional.nome}</td>

                  <td className="p-4">{profissional.especialidade}</td>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(profissional)}
                      className="text-blue-500"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(profissional._id)}
                      className="text-red-500"
                    >
                      Excluir
                    </button>
                  </div>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
