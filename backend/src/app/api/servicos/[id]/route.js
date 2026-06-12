import { connectDB } from "../../../../lib/mongodb";
import Servico from "../../../../models/Servico";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const role = req.headers.get("x-user-role");

    if (role !== "admin") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await req.json();

    const servico = await Servico.findByIdAndUpdate(
      params.id,
      {
        nome: body.nome,
        descricao: body.descricao,
        duracao: body.duracao,
        preco: body.preco,
      },
      { new: true }
    );

    return Response.json(servico);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const role = req.headers.get("x-user-role");

    if (role !== "admin") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    await Servico.findByIdAndUpdate(params.id, {
      ativo: false,
    });

    return Response.json({
      message: "Serviço removido com sucesso",
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
