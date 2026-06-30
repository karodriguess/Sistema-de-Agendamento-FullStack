import { api } from "./api";

export async function getAgendamentos() {
  const response = await api.get("/Agendamentos");
  return response.data;
}

export async function getMeusAgendamentos() {
  const response = await api.get("/me/agendamentos");
  return response.data;
}

export async function getHorariosDisponiveis(
  profissionalId: string,
  data: string
) {
  const response = await api.get(
    `/Agendamentos/disponiveis?profissionalId=${profissionalId}&data=${data}`
  );
  return response.data.horarios as string[];
}

export async function criarAgendamento(dados: {
  profissionalId: string;
  servicoId: string;
  data: string;
  horario: string;
}) {
  const response = await api.post("/Agendamentos", dados);
  return response.data;
}

export async function cancelarAgendamento(id: string) {
  const response = await api.patch(`/Agendamentos/${id}`, {
    status: "cancelado",
  });
  return response.data;
}

export async function cancelarAgendamentoCliente(id: string) {
  const response = await api.patch(`/Agendamentos/${id}/cancelar`);
  return response.data;
}

export async function remarcarAgendamento(
  id: string,
  data: string,
  horario: string
) {
  const response = await api.patch(`/Agendamentos/${id}/remarcar`, {
    data,
    horario,
  });
  return response.data;
}
