import { api } from "./api";

export async function getServicos() {
  const response = await api.get("/servicos");

  return response.data;
}

export async function createServico(data: {
  nome: string;
  descricao: string;
  duracao: number;
  preco: number;
}) {
  const response = await api.post("/servicos", data);

  return response.data;
}

export async function updateServico(
  id: string,
  data: {
    nome: string;
    descricao: string;
    duracao: number;
    preco: number;
  }
) {
  const response = await api.put(`/servicos/${id}`, data);

  return response.data;
}

export async function deleteServico(id: string) {
  const response = await api.delete(`/servicos/${id}`);

  return response.data;
}
