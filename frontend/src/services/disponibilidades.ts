import { api } from "./api";

export async function getDisponibilidades(profissionalId: string, mes: string) {
  const response = await api.get(
    `/disponibilidades?profissionalId=${profissionalId}&mes=${mes}`
  );
  return response.data as { data: string; horarios: string[] }[];
}

export async function salvarDisponibilidades(
  profissionalId: string,
  dias: { data: string; horarios: string[] }[]
) {
  const response = await api.put("/disponibilidades", { profissionalId, dias });
  return response.data;
}
