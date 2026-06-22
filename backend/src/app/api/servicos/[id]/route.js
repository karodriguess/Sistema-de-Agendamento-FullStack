import { connectDB } from "../../../../lib/mongodb";
import Servico from "../../../../models/Servico";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
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

    const { id } = await params;
    const body = await req.json();

    const servico = await Servico.findByIdAndUpdate(
      id,
      {
        nome: body.nome,
        duracao: body.duracao,
        preco: body.preco,
        profissionalId: body.profissionalId || null,
      },
      {
        new: true,
      }
    );

    return Response.json({
      message: "Serviço atualizado com sucesso",
      servico,
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

//DELETAR

export async function DELETE(req, { params }) {
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

    const { id } = await params;
    await Servico.findByIdAndDelete(id);

    return Response.json({
      message: "Serviço excluído com sucesso",
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
