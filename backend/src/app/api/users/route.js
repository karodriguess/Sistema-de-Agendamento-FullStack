import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const novoUsuario = await User.create({
      nome: body.nome,
      email: body.email,
      senha: body.senha,
      perfil: body.perfil,
    });

    return Response.json(
      {
        message: "Usuário criado com sucesso 🚀",
        usuario: novoUsuario,
      },
      {
        status: 201,
      }
    );
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
