import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // procurar usuário
    const usuario = await User.findOne({
      email: body.email,
    });

    // usuário não encontrado
    if (!usuario) {
      return Response.json(
        {
          error: "Usuário não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    // comparar senha
    const senhaCorreta = await bcrypt.compare(body.senha, usuario.senha);

    // senha inválida
    if (!senhaCorreta) {
      return Response.json(
        {
          error: "Senha inválida",
        },
        {
          status: 401,
        }
      );
    }

    // gerar token JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return Response.json({
      message: "Login realizado 🚀",
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
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
