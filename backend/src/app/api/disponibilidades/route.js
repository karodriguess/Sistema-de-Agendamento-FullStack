import { connectDB } from "../../../lib/mongodb";
import Disponibilidade from "../../../models/Disponibilidade";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const profissionalId = searchParams.get("profissionalId");
    const mes = searchParams.get("mes"); // formato "YYYY-MM", ex: "2026-06"

    const query = {};
    if (profissionalId) query.profissionalId = profissionalId;
    if (mes) query.data = { $regex: `^${mes}-` };

    const disponibilidades = await Disponibilidade.find(query).populate(
      "profissionalId"
    );

    return Response.json(disponibilidades);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Token não enviado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.perfil !== "admin") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { profissionalId, dias } = await req.json();

    if (!profissionalId || !Array.isArray(dias)) {
      return Response.json({ error: "Dados inválidos" }, { status: 400 });
    }

    for (const { data, horarios } of dias) {
      await Disponibilidade.findOneAndUpdate(
        { profissionalId, data },
        { $set: { horarios } },
        { upsert: true, new: true }
      );
    }

    return Response.json({ message: "Disponibilidades salvas com sucesso" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
