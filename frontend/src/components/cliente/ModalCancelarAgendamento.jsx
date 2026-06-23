import { useEffect } from "react";

export default function ModalCancelarAgendamento({
  onVoltar,
  onConfirmar,
  cancelando,
}) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onVoltar();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onVoltar]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onVoltar()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-7 h-7 text-red-500"
            >
              <path
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Cancelar agendamento
            </h2>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Tem certeza que deseja cancelar este agendamento? Esta ação não
              pode ser desfeita.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirmar}
            disabled={cancelando}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {cancelando ? "Cancelando..." : "Confirmar cancelamento"}
          </button>
          <button
            onClick={onVoltar}
            disabled={cancelando}
            className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
