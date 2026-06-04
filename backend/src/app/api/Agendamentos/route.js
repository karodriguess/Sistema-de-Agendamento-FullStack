import { connectDB } from "../../../lib/mongodb";
import Agendamento from "../../../models/Agendamento";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    if (
      !body.clienteId ||
      !body.profissionalId ||
      !body.servicoId ||
      !body.data ||
      !body.horario
    ) {
      return Response.json(
        {
          error: "Todos os campos são obrigatórios",
        },
        {
          status: 400,
        }
      );
    }

    const conflito = await Agendamento.findOne({
      profissionalId: body.profissionalId,
      data: body.data,
      horario: body.horario,
      status: {
        $ne: "cancelado",
      },
    });

    if (conflito) {
      return Response.json(
        {
          error: "Horário já reservado",
        },
        {
          status: 400,
        }
      );
    }
    const clienteId = req.headers.get("x-user-id");
    const agendamento = await Agendamento.create({
      clienteId,
      profissionalId: body.profissionalId,
      servicoId: body.servicoId,
      data: body.data,
      horario: body.horario,
    });

    return Response.json(
      {
        message: "Agendamento criado",
        agendamento,
      },
      {
        status: 201,
      }
    );
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

export async function GET() {
  try {
    await connectDB();

    const agendamentos = await Agendamento.find()
      .populate("clienteId", "nome email perfil")
      .populate("profissionalId", "nome especialidade")
      .populate("servicoId", "nome preco duracao")
      .sort({ createdAt: -1 });

    return Response.json(agendamentos);
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
