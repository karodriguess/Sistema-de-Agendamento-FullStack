import { api } from "./api";

export async function getServicos(profissionalId?: string) {
  const url = profissionalId
    ? `/servicos?profissionalId=${profissionalId}`
    : "/servicos";
  const response = await api.get(url);
  return response.data;
}

export async function createServico(data: {
  nome: string;
  duracao: number;
  preco: number;
  profissionalId?: string;
}) {
  const response = await api.post("/servicos", data);
  return response.data;
}

export async function updateServico(
  id: string,
  data: {
    nome: string;
    duracao: number;
    preco: number;
    profissionalId?: string;
  }
) {
  const response = await api.put(`/servicos/${id}`, data);
  return response.data;
}

export async function deleteServico(id: string) {
  const response = await api.delete(`/servicos/${id}`);
  return response.data;
}
