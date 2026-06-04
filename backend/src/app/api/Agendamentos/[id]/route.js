import { connectDB } from "../../../../lib/mongodb";
import Agendamento from "../../../../models/Agendamento";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();

    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role");

    const agendamento = await Agendamento.findById(params.id);

    if (!agendamento) {
      return Response.json(
        {
          error: "Agendamento não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    // Cliente só altera o próprio agendamento
    if (role !== "admin" && agendamento.clienteId.toString() !== userId) {
      return Response.json(
        {
          error: "Acesso negado",
        },
        {
          status: 403,
        }
      );
    }

    agendamento.status = body.status;

    await agendamento.save();

    return Response.json({
      message: "Status atualizado",
      agendamento,
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
