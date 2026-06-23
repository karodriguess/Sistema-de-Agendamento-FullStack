const NOMES_MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const NOMES_DIAS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  const d = new Date(ano, mes - 1, dia);
  return `${NOMES_DIAS[d.getDay()]}, ${dia} de ${NOMES_MESES[mes - 1]} de ${ano}`;
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" strokeLinecap="round" />
    </svg>
  );
}

export default function CardAgendamento({ agendamento, onRemarcar, onCancelar }) {
  const profissional = agendamento.profissionalId;
  const servico = agendamento.servicoId;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-700 font-bold text-sm shrink-0">
            {profissional?.nome?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {servico?.nome ?? "Serviço"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              com {profissional?.nome ?? "Profissional"}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <UserIcon />
          <span>{profissional?.especialidade ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <CalendarIcon />
          <span>{formatarData(agendamento.data)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <ClockIcon />
          <span>{agendamento.horario}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onRemarcar(agendamento)}
          className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
        >
          Remarcar
        </button>
        <button
          onClick={() => onCancelar(agendamento)}
          className="flex-1 text-xs font-semibold py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
