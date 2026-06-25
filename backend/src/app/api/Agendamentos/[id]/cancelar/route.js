import { connectDB } from "../../../../../../lib/mongodb";
import Agendamento from "../../../../../../models/Agendamento";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Token não enviado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = await params;

    const agendamento = await Agendamento.findById(id);

    if (!agendamento) {
      return Response.json(
        { error: "Falha ao cancelar. Tente novamente" },
        { status: 404 }
      );
    }

    // segurança: só dono pode cancelar
    if (agendamento.clienteId.toString() !== decoded.id) {
      return Response.json(
        { error: "Sem permissão para cancelar este agendamento" },
        { status: 403 }
      );
    }

    agendamento.status = "cancelado_cliente";
    await agendamento.save();

    return Response.json({
      message: "Agendamento cancelado com sucesso",
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
