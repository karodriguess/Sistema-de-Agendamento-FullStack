import { api } from "./api";

export async function getAgendamentos() {
  const response = await api.get("/Agendamentos");
  return response.data;
}
