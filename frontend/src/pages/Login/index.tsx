import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Login() {
  const { signIn } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      console.log("BOTÃO CLICADO");
      await signIn(email, senha);
      navigate("/dashboard");
    } catch {
      alert("Email ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4">
      <div
        className="w
      -full max-w-5xl bg-white rounded-[28px] shadow-sm overflow-hidden grid md:grid-cols-2"
      >
        {/* Lado Esquerdo */}
        <div className="p-10 md:p-14 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-5 h-5 rounded-full bg-yellow-200"></div>

              <span className="text-gray-700 font-medium">Agendamento</span>
            </div>

            <h1 className="text-4xl font-normal text-[#1f1f1f] mb-4">
              Fazer login
            </h1>

            <p className="text-gray-600 text-lg">
              Entre para acessar seu painel de agendamentos.
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-10">Sistema de Agendamento</p>
        </div>

        {/* Lado Direito */}
        <div className="p-10 md:p-14 flex items-center">
          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-md
                  px-4
                  py-4
                  outline-none
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                "
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-md
                  px-4
                  py-4
                  outline-none
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                "
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  transition
                  text-white
                  px-8
                  py-3
                  rounded-full
                  font-medium
                "
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
