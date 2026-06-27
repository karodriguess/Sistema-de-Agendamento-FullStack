import { connectDB } from "../../../../../lib/mongodb";
import Agendamento from "../../../../../models/Agendamento";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();

    // Next.js 16
    const { id } = await params;

    // Token
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Token não enviado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const agendamento = await Agendamento.findById(id);

    if (!agendamento) {
      return Response.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Apenas o cliente dono do agendamento pode remarcar
    if (agendamento.clienteId.toString() !== decoded.id) {
      return Response.json(
        { error: "Sem permissão para remarcar este agendamento" },
        { status: 403 }
      );
    }

    // Verifica conflito de horário
    const conflito = await Agendamento.findOne({
      _id: { $ne: id },
      profissionalId: agendamento.profissionalId,
      data: body.data,
      horario: body.horario,
      status: {
        $nin: ["cancelado", "cancelado_cliente"],
      },
    });

    if (conflito) {
      return Response.json({ error: "Horário indisponível" }, { status: 400 });
    }

    // Salva histórico
    agendamento.dataAnterior = agendamento.data;
    agendamento.horarioAnterior = agendamento.horario;

    // Atualiza
    agendamento.data = body.data;
    agendamento.horario = body.horario;
    agendamento.status = "remarcado_cliente";

    await agendamento.save();

    return Response.json({
      message: "Agendamento remarcado com sucesso",
      agendamento,
    });
  } catch (error) {
    console.error(error);

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
