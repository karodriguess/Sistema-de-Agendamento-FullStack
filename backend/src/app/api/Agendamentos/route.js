import { connectDB } from "../../../lib/mongodb";
import Agendamento from "../../../models/Agendamento";
import Servico from "../../../models/Servico";
import Profissional from "../../../models/Profissional";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Token não enviado" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.perfil === "admin") {
      return Response.json(
        { error: "Administradores não podem realizar agendamentos" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const clienteId = decoded.id;

    if (
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
        $nin: ["cancelado", "cancelado_cliente"],
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
      .populate("clienteId", "nome email telefone")
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
