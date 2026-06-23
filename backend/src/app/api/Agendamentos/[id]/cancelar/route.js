import { connectDB } from "../../../../../lib/mongodb";
import Agendamento from "../../../../../models/Agendamento";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");

    const agendamento = await Agendamento.findById(params.id);

    if (!agendamento) {
      return Response.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    if (role !== "admin" && agendamento.clienteId.toString() !== userId) {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    agendamento.status = "cancelado_cliente";
    await agendamento.save();

    return Response.json({
      message: "Agendamento cancelado com sucesso",
      agendamento,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
