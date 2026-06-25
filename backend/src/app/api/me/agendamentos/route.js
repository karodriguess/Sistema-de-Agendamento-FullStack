import { connectDB } from "../../../../lib/mongodb";
import Agendamento from "../../../../models/Agendamento";
import Profissional from "../../../../models/Profissional";
import Servico from "../../../../models/Servico";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { error: "Token não enviado ou inválido" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.perfil === "admin") {
      return Response.json(
        { error: "Administradores não possuem agendamentos de cliente" },
        { status: 403 }
      );
    }

    const agendamentos = await Agendamento.find({
      clienteId: decoded.id,
      status: {
        $in: ["confirmado", "remarcado_cliente"],
      },
    })
      .populate("profissionalId", "nome especialidade")
      .populate("servicoId", "nome preco duracao")
      .sort({ data: 1, horario: 1 });

    return Response.json(agendamentos, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error.message || "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}
