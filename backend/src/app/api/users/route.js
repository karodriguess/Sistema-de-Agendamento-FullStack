import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    const usuarios = await User.find({}).select("-senha");

    return Response.json({ usuarios });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const senhaHash = await bcrypt.hash(body.senha, 10);

    const novoUsuario = await User.create({
      nome: body.nome,
      email: body.email,
      senha: senhaHash,
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
