import { connectDB } from "../../../../../lib/mongodb";
import Agendamento from "../../../../../models/Agendamento";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  try {
    console.log("=== CANCELAMENTO ===");

    await connectDB();
    console.log("Banco conectado");

    const authHeader = req.headers.get("authorization");
    console.log("Authorization:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Token não enviado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);

    const { id } = await params;
    console.log("ID recebido:", id);

    const agendamento = await Agendamento.findById(id);
    console.log("Agendamento encontrado:", agendamento);

    if (!agendamento) {
      return Response.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    console.log("Cliente do agendamento:", agendamento.clienteId);
    console.log("Cliente do token:", decoded.id);

    if (agendamento.clienteId.toString() !== decoded.id) {
      return Response.json({ error: "Sem permissão" }, { status: 403 });
    }

    agendamento.status = "cancelado_cliente";
    console.log("Status alterado");

    await agendamento.save();
    console.log("Agendamento salvo");

    return Response.json({
      message: "Agendamento cancelado com sucesso",
    });
  } catch (error) {
    console.error("ERRO:", error);

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
