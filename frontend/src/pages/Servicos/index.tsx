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
    if (!confirm("Deseja excluir este serviço?")) {
      return;
    }

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

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Serviços</h1>

        <form onSubmit={handleCreate} className="flex gap-4 mb-8 flex-wrap">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Duração"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="border p-2 rounded"
          />

          <button type="submit" className="bg-blue-600 text-white px-4 rounded">
            {editingId ? "Atualizar" : "Salvar"}
          </button>
        </form>

        <table className="w-full bg-white rounded">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Duração</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {servicos.map((servico) => (
              <tr key={servico._id}>
                <td>{servico._id}</td>
                <td>{servico.nome}</td>
                <td>{servico.duracao}</td>
                <td>R$ {servico.preco}</td>

                <td>
                  <button
                    onClick={() => handleEdit(servico)}
                    className="text-blue-500 mr-4"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(servico._id)}
                    className="text-red-500"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
