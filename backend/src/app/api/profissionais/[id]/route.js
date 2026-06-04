import { connectDB } from "../../../../lib/mongodb";
import Profissional from "../../../../models/Profissional";
import jwt from "jsonwebtoken";

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

    await Profissional.findByIdAndDelete(params.id);

    return Response.json({
      message: "Profissional excluído com sucesso",
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

    const body = await req.json();

    const profissional = await Profissional.findByIdAndUpdate(
      params.id,
      {
        nome: body.nome,
        especialidade: body.especialidade,
      },
      {
        new: true,
      }
    );

    return Response.json({
      message: "Profissional atualizado com sucesso",
      profissional,
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
