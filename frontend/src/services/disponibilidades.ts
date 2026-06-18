import { api } from "./api";

export async function getDisponibilidades(profissionalId: string) {
  const response = await api.get(`/disponibilidades?profissionalId=${profissionalId}`);
  return response.data as { diaSemana: number; horarios: string[] }[];
}

export async function salvarDisponibilidades(
  profissionalId: string,
  dias: { diaSemana: number; horarios: string[] }[]
) {
  const response = await api.put("/disponibilidades", { profissionalId, dias });
  return response.data;
}
