import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";

import bcrypt from "bcryptjs";

export async function POST(req) {
  console.log("ENTROU NA ROTA REGISTER");
  try {
    await connectDB();

    console.log("1️⃣ iniciou rota");

    console.log("2️⃣ banco conectado");

    const body = await req.json();

    console.log("3️⃣ body recebido", body);

    const senhaHash = await bcrypt.hash(body.senha, 10);

    console.log("4️⃣ senha criptografada");

    const usuario = await User.create({
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      senha: senhaHash,
      perfil: body.perfil || "cliente",
    });

    console.log("5️⃣ usuário criado");

    return Response.json({
      message: "Usuário criado 🚀",
      usuario,
    });
  } catch (error) {
    console.log("🔴 ERRO COMPLETO:");
    console.log(error);

    return Response.json({
      error: error.message,
    });
  }
}
