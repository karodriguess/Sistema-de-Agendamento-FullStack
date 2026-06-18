import { connectDB } from "../../../lib/mongodb";
import Servico from "../../../models/Servico";
import jwt from "jsonwebtoken";

export async function POST(req) {
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

    const body = await req.json();

    const servico = await Servico.create({
      nome: body.nome,
      duracao: body.duracao,
      preco: body.preco,
    });

    return Response.json(
      {
        message: "Serviço criado com sucesso",
        servico,
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

    const servicos = await Servico.find();

    return Response.json(servicos);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
