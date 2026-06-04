import { connectDB } from "../../../lib/mongodb";
import Disponibilidade from "../../../models/Disponibilidade";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const disponibilidade = await Disponibilidade.create({
      profissionalId: body.profissionalId,
      diaSemana: body.diaSemana,
      horarios: body.horarios,
    });

    return Response.json(
      {
        message: "Disponibilidade criada",
        disponibilidade,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const disponibilidades = await Disponibilidade.find().populate(
      "profissionalId"
    );

    return Response.json(disponibilidades);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
