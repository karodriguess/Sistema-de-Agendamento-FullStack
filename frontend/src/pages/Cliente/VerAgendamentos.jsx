import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getMeusAgendamentos,
  cancelarAgendamentoCliente,
} from "../../services/agendamentos";
import CardAgendamento from "../../components/cliente/CardAgendamento";
import ModalCancelarAgendamento from "../../components/cliente/ModalCancelarAgendamento";

function CalendarEmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      className="w-16 h-16 text-slate-300"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" strokeWidth={2} />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin w-6 h-6 text-pink-600"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function VerAgendamentos() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [modalCancelarAberto, setModalCancelarAberto] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  async function carregarAgendamentos() {
    setCarregando(true);
    setErro("");
    try {
      const dados = await getMeusAgendamentos();
      setAgendamentos(dados);
    } catch {
      setErro("Erro ao carregar agendamentos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  function abrirModalCancelar(agendamento) {
    setAgendamentoSelecionado(agendamento);
    setModalCancelarAberto(true);
  }

  function fecharModalCancelar() {
    setAgendamentoSelecionado(null);
    setModalCancelarAberto(false);
  }

  async function confirmarCancelamento() {
    if (!agendamentoSelecionado) return;
    setCancelando(true);
    setErro("");
    try {
      await cancelarAgendamentoCliente(agendamentoSelecionado._id);
      setAgendamentos((prev) =>
        prev.filter((a) => a._id !== agendamentoSelecionado._id)
      );
      fecharModalCancelar();
      setMensagemSucesso("Agendamento cancelado com sucesso.");
      setTimeout(() => setMensagemSucesso(""), 4000);
    } catch (e) {
      setErro(
        e?.response?.data?.error ?? "Erro ao cancelar. Tente novamente."
      );
      fecharModalCancelar();
    } finally {
      setCancelando(false);
    }
  }

  function handleRemarcar(agendamento) {
    navigate(`/novo-agendamento?remarcar=${agendamento._id}`);
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate("/meus-agendamentos")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow">
              <span className="text-pink-600 font-bold text-sm">C</span>
            </div>
            <h2 className="text-slate-900 font-semibold text-lg tracking-wide group-hover:text-slate-700 transition-colors">
              Studio
            </h2>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/novo-agendamento")}
              className="hidden sm:flex items-center gap-2 bg-pink-800 hover:bg-pink-900 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <span className="text-base leading-none">+</span>
              Novo agendamento
            </button>
            <button
              onClick={signOut}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 px-6 sm:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Título */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                Meus Agendamentos
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Gerencie seus horários de forma rápida e prática.
              </p>
            </div>

            {/* Feedback de sucesso */}
            {mensagemSucesso && (
              <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3.5 rounded-xl text-sm font-medium">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4 shrink-0"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {mensagemSucesso}
              </div>
            )}

            {/* Feedback de erro */}
            {erro && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm font-medium">
                {erro}
              </div>
            )}

            {/* Estado de carregamento */}
            {carregando && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <SpinnerIcon />
                <p className="text-sm text-slate-400">
                  Carregando agendamentos...
                </p>
              </div>
            )}

            {/* Estado vazio */}
            {!carregando && agendamentos.length === 0 && !erro && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-6">
                  <CalendarEmptyIcon />
                </div>
                <h2 className="text-lg font-semibold text-slate-700 mb-2">
                  Você ainda não possui agendamentos.
                </h2>
                <p className="text-sm text-slate-400 mb-8 max-w-xs">
                  Que tal agendar seu próximo horário agora mesmo?
                </p>
                <button
                  onClick={() => navigate("/novo-agendamento")}
                  className="bg-pink-800 hover:bg-pink-900 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Fazer um agendamento
                </button>
              </div>
            )}

            {/* Lista de cards */}
            {!carregando && agendamentos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {agendamentos.map((agendamento) => (
                  <CardAgendamento
                    key={agendamento._id}
                    agendamento={agendamento}
                    onRemarcar={handleRemarcar}
                    onCancelar={abrirModalCancelar}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de cancelamento */}
      {modalCancelarAberto && (
        <ModalCancelarAgendamento
          onVoltar={fecharModalCancelar}
          onConfirmar={confirmarCancelamento}
          cancelando={cancelando}
        />
      )}
    </div>
  );
}
