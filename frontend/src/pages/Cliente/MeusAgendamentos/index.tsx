import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export function MeusAgendamentos() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 p-3 mb-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow">
                <span className="text-pink-600 font-bold text-sm">C</span>
              </div>

              <h2 className="text-slate-900 font-semibold text-lg tracking-wide">
                Studio
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/ver-agendamentos")}
              className="flex items-center gap-2 bg-pink-800 hover:bg-pink-900 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Ver meus Agendamentos
            </button>

            <button
              onClick={signOut}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 px-8 py-6">
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-pink-600 text-2xl mx-auto mb-4">
              📅
            </div>

            <p className="text-slate-500 font-medium mb-4">
              Gerencie seus horários
            </p>

            <button
              onClick={() => navigate("/novo-agendamento")}
              className="text-sm bg-slate-900 text-white px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <span className="text-base leading-none mr-3">+</span>
              Agendar agora
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
