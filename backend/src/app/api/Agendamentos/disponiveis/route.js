import { connectDB } from "../../../../lib/mongodb";
import Agendamento, { STATUS_CANCELADOS } from "../../../../models/Agendamento";
import Disponibilidade from "../../../../models/Disponibilidade";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const profissionalId = searchParams.get("profissionalId");
    const data = searchParams.get("data"); // formato "YYYY-MM-DD"

    if (!profissionalId || !data) {
      return Response.json(
        { error: "profissionalId e data são obrigatórios" },
        { status: 400 }
      );
    }

    const disponibilidade = await Disponibilidade.findOne({
      profissionalId,
      data,
    });
    const horariosCadastrados = disponibilidade?.horarios ?? [];

    const agendamentosOcupados = await Agendamento.find({
      profissionalId,
      data,
      status: { $nin: STATUS_CANCELADOS },
    }).select("horario");

    const horariosOcupados = new Set(
      agendamentosOcupados.map((a) => a.horario)
    );

    const horarios = horariosCadastrados.filter(
      (h) => !horariosOcupados.has(h)
    );

    return Response.json({ horarios });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
