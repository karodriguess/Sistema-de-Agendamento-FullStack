import { connectDB } from "../../../../lib/mongodb";
import Agendamento from "../../../../models/Agendamento";

export async function GET(req) {
  try {
    await connectDB();

    const clienteId = req.headers.get("x-user-id");

    const agendamentos = await Agendamento.find({
      clienteId,
    })
      .populate("profissionalId", "nome especialidade")
      .populate("servicoId", "nome preco duracao")
      .sort({
        data: 1,
      });

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
