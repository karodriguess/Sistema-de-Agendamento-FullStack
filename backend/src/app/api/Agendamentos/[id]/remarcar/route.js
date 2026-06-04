import { connectDB } from "../../../../../lib/mongodb";
import Agendamento from "../../../../../models/Agendamento";

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

    // Cliente só remarca o próprio
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

    // Verificar conflito
    const conflito = await Agendamento.findOne({
      _id: {
        $ne: params.id,
      },
      profissionalId: agendamento.profissionalId,
      data: body.data,
      horario: body.horario,
      status: {
        $ne: "cancelado",
      },
    });

    if (conflito) {
      return Response.json(
        {
          error: "Horário indisponível",
        },
        {
          status: 400,
        }
      );
    }

    agendamento.data = body.data;
    agendamento.horario = body.horario;

    await agendamento.save();

    return Response.json({
      message: "Agendamento remarcado",
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
