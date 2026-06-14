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
        <h1 className="text-3xl font-medium mb-6 text-center">Criar Conta</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded p-3  focus:outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-3  focus:outline-none"
          />

          <input
            type="tel"
            placeholder="Telefone (ex: 11999999999)"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full border rounded p-3  focus:outline-none"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border rounded p-3  focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded hover:scale-105  transition-all
    duration-300 cursor-pointer"
          >
            Criar Conta
          </button>
        </form>

        <p className="mt-4 text-center hover:">
          Já possui conta?{" "}
          <Link
            to="/"
            className="text-blue-600  relative
    after:absolute
    after:left-0
    after:bottom-0
    after:h-[1px]
    after:w-0
    after:bg-slate-900
    after:duration-200
    hover:after:w-full hover:text-slate-900 "
          >
            Agendar
          </Link>
        </p>
      </div>
    </div>
  );
}
