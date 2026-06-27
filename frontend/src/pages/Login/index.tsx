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
      await signIn(email, senha);
      const usuario = await signIn(email, senha);

      if (usuario.perfil === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/meus-agendamentos");
      }
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
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow">
                <span className="text-pink-600 font-bold text-sm">C</span>
              </div>

              <h2 className="text-slate-900 font-semibold text-lg tracking-wide">
                Studio
              </h2>
            </div>

            <h1 className="text-4xl font-normal text-[#1f1f1f] mb-4">
              Fazer login
            </h1>

            <p className="text-gray-600 text-lg">
              Entre para acessar seu painel de agendamentos.
            </p>
          </div>

          <p className="text-sm text-gray-700 mt-4">
            Não possui conta?{" "}
            <a
              href="/cadastro"
              className="text-blue-700 relative
    after:absolute
    after:left-0
    after:bottom-0
    after:w-0
    after:bg-slate-900
    after:duration-200
    hover:after:w-full hover:text-slate-900"
            >
              Criar conta
            </a>
          </p>
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
                   focus:outline-none
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
                   focus:outline-none
                "
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="
                   bg-pink-800 text-white hover:bg-pink-700 transition-all 
                  px-8
                  py-3
                  rounded-full
                  font-medium
                  cursor-pointer
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
