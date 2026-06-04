import { connectDB } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

import User from "../../../models/User";
import Profissional from "../../../models/Profissional";
import Servico from "../../../models/Servico";
import Agendamento from "../../../models/Agendamento";

export async function GET(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        {
          error: "Token não enviado",
        },
        {
          status: 401,
        }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.perfil !== "admin") {
      return Response.json(
        {
          error: "Acesso negado",
        },
        {
          status: 403,
        }
      );
    }

    const hoje = new Date().toISOString().split("T")[0];

    const totalClientes = await User.countDocuments({
      perfil: "cliente",
    });

    const totalProfissionais = await Profissional.countDocuments();

    const totalServicos = await Servico.countDocuments();

    const totalAgendamentos = await Agendamento.countDocuments();

    const agendamentosHoje = await Agendamento.countDocuments({
      data: hoje,
    });

    return Response.json({
      totalClientes,
      totalProfissionais,
      totalServicos,
      totalAgendamentos,
      agendamentosHoje,
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
