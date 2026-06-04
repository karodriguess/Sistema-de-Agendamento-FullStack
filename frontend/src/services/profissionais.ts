import { api } from "./api";

export async function getProfissionais() {
  const response = await api.get("/profissionais");

  return response.data;
}

export async function createProfissional(data: {
  nome: string;
  especialidade: string;
}) {
  const response = await api.post("/profissionais", data);

  return response.data;
}

export async function deleteProfissional(id: string) {
  const response = await api.delete(`/profissionais/${id}`);

  return response.data;
}
export async function updateProfissional(
  id: string,
  data: {
    nome: string;
    especialidade: string;
  }
) {
  const response = await api.put(`/profissionais/${id}`, data);

  return response.data;
}
