import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { api } from "../../services/api";

export function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        nome,
        email,
        telefone,
        senha,
      });

      alert("Conta criada com sucesso!");

      navigate("/");
    } catch {
      alert("Erro ao criar conta");
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-6">Criar Conta</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded p-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-3"
          />

          <input
            type="tel"
            placeholder="Telefone (ex: 11999999999)"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full border rounded p-3"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border rounded p-3"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            Criar Conta
          </button>
        </form>

        <p className="mt-4 text-center">
          Já possui conta?{" "}
          <Link to="/" className="text-blue-600">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
