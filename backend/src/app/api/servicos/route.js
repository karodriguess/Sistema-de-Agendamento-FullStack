import { connectDB } from "../../../lib/mongodb";
import Servico from "../../../models/Servico";

export async function POST(req) {
  try {
    await connectDB();
    const role = req.headers.get("x-user-role");

    if (role !== "admin") {
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
      descricao: body.descricao,
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

    const servicos = await Servico.find({
      ativo: true,
    });

    return Response.json(servicos);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
