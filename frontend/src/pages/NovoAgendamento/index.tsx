import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getProfissionais } from "../../services/profissionais";
import { getServicos } from "../../services/servicos";
import { getDisponibilidades } from "../../services/disponibilidades";
import {
  criarAgendamento,
  getMeusAgendamentos,
  remarcarAgendamento,
} from "../../services/agendamentos";

interface Profissional {
  _id: string;
  nome: string;
  especialidade: string;
}

interface Servico {
  _id: string;
  nome: string;
  descricao: string;
  duracao: number;
  preco: number;
}

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const NOMES_DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const NOMES_DIAS_COMPLETOS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function toYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toMesParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getDiasDoMes(ano: number, mes: number): (Date | null)[] {
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const diasVazios = primeiroDia.getDay();
  const dias: (Date | null)[] = Array(diasVazios).fill(null);
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    dias.push(new Date(ano, mes, d));
  }
  return dias;
}

function formatarData(dataStr: string): string {
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  const d = new Date(ano, mes - 1, dia);
  return `${NOMES_DIAS_COMPLETOS[d.getDay()]}, ${dia} de ${
    NOMES_MESES[mes - 1]
  } de ${ano}`;
}

const ETAPAS = ["Profissional", "Serviço", "Data", "Horário", "Confirmação"];

export function NovoAgendamento() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const remarcarId = searchParams.get("remarcar");

  const [step, setStep] = useState(1);

  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [horariosPorData, setHorariosPorData] = useState<
    Record<string, string[]>
  >({});

  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [servico, setServico] = useState<Servico | null>(null);
  const [data, setData] = useState<string | null>(null);
  const [horario, setHorario] = useState<string | null>(null);

  const [mesAtual, setMesAtual] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  const [loadingProf, setLoadingProf] = useState(true);
  const [loadingServ, setLoadingServ] = useState(false);
  const [loadingDisp, setLoadingDisp] = useState(false);
  const [carregandoRemarcar, setCarregandoRemarcar] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    getProfissionais()
      .then(setProfissionais)
      .finally(() => setLoadingProf(false));
  }, []);

  // Pré-preencher quando modo remarcar
  useEffect(() => {
    if (!remarcarId) return;

    async function preencherRemarcar() {
      setCarregandoRemarcar(true);
      try {
        const agendamentos = await getMeusAgendamentos();
        const agendamento = agendamentos.find(
          (a: any) => a._id === remarcarId
        );
        if (!agendamento) return;

        const prof = agendamento.profissionalId;
        const serv = agendamento.servicoId;

        const profissionalPreenchido: Profissional = {
          _id: prof._id,
          nome: prof.nome,
          especialidade: prof.especialidade,
        };

        const servicoPreenchido: Servico = {
          _id: serv._id,
          nome: serv.nome,
          preco: serv.preco,
          duracao: serv.duracao,
          descricao: "",
        };

        setProfissional(profissionalPreenchido);
        setServico(servicoPreenchido);

        setLoadingServ(true);
        getServicos(prof._id)
          .then(setServicos)
          .finally(() => setLoadingServ(false));

        setStep(3);
      } catch {
        setErro("Erro ao carregar agendamento para remarcação.");
      } finally {
        setCarregandoRemarcar(false);
      }
    }

    preencherRemarcar();
  }, [remarcarId]);

  useEffect(() => {
    if (!profissional) return;
    carregarMes(mesAtual);
  }, [profissional, mesAtual]);

  async function carregarMes(mes: Date) {
    if (!profissional) return;
    setLoadingDisp(true);
    try {
      const disps = await getDisponibilidades(
        profissional._id,
        toMesParam(mes)
      );
      const mapa: Record<string, string[]> = {};
      for (const item of disps) {
        mapa[item.data] = item.horarios;
      }
      setHorariosPorData(mapa);
    } finally {
      setLoadingDisp(false);
    }
  }

  function selecionarProfissional(p: Profissional) {
    setProfissional(p);
    setServico(null);
    setData(null);
    setHorario(null);
    setHorariosPorData({});
    setSucesso(false);
    setErro(null);
    setServicos([]);
    setLoadingServ(true);
    getServicos(p._id)
      .then(setServicos)
      .finally(() => setLoadingServ(false));
    setStep(2);
  }

  function selecionarServico(s: Servico) {
    setServico(s);
    setData(null);
    setHorario(null);
    setStep(3);
  }

  function selecionarData(dateKey: string) {
    setData(dateKey);
    setHorario(null);
    setStep(4);
  }

  function selecionarHorario(h: string) {
    setHorario(h);
    setStep(5);
  }

  function voltarPara(s: number) {
    setErro(null);
    setStep(s);
  }

  function navegarMes(delta: number) {
    setMesAtual(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );
  }

  async function confirmar() {
    if (!profissional || !servico || !data || !horario) return;
    setConfirmando(true);
    setErro(null);
    try {
      if (remarcarId) {
        await remarcarAgendamento(remarcarId, data, horario);
      } else {
        await criarAgendamento({
          profissionalId: profissional._id,
          servicoId: servico._id,
          data,
          horario,
        });
      }
      setSucesso(true);
    } catch (e: any) {
      setErro(
        e?.response?.data?.error ?? "Erro ao confirmar. Tente novamente."
      );
    } finally {
      setConfirmando(false);
    }
  }

  function novoAgendamento() {
    setProfissional(null);
    setServico(null);
    setData(null);
    setHorario(null);
    setHorariosPorData({});
    setSucesso(false);
    setErro(null);
    setStep(1);
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const hojeKey = toYYYYMMDD(hoje);
  const diasDoMes = getDiasDoMes(mesAtual.getFullYear(), mesAtual.getMonth());

  if (carregandoRemarcar) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Carregando agendamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6  flex items-center justify-between shadow-md">
        <button
          onClick={() =>
            navigate(remarcarId ? "/ver-agendamentos" : "/meus-agendamentos")
          }
          className="texte-base font-semibold cursor-pointer"
        >
          <div className="flex items-center gap-3 p-3 mb-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow">
              <span className="text-pink-600 font-bold text-sm">C</span>
            </div>
            <h2 className="text-white font-semibold text-lg tracking-wide">
              Studio
            </h2>
          </div>
        </button>
        <button
          onClick={signOut}
          className="text-sm text-white font-semibold transition-colors cursor-pointer"
        >
          Sair
        </button>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Indicador de progresso */}
        <div className="flex items-center gap-0 mb-8">
          {ETAPAS.map((label, i) => {
            const num = i + 1;
            const ativo = num === step;
            const concluido = num < step;
            return (
              <div
                key={num}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer
                      ${
                        ativo
                          ? "bg-pink-700 text-white shadow-md scale-110"
                          : ""
                      }
                      ${concluido ? "bg-emerald-700 text-white" : ""}
                      ${
                        !ativo && !concluido
                          ? "bg-white text-slate-400 border border-slate-200"
                          : ""
                      }
                    `}
                  >
                    {concluido ? "✓" : num}
                  </div>
                  <span
                    className={`text-[10px] font-medium hidden sm:block ${
                      ativo ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < ETAPAS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-1 ${
                      concluido ? "bg-emerald-800" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div key={step} className="step-in">
          {/* ── Etapa 1: Profissional ── */}
          {step === 1 && (
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Escolha o profissional
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                Selecione com quem deseja ser atendido.
              </p>

              {loadingProf ? (
                <div className="text-center text-slate-400 text-sm py-12">
                  Carregando...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profissionais.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => selecionarProfissional(p)}
                      className="bg-white rounded-xl shadow-sm p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all border border-transparent hover:border-slate-200 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold mb-3 group-hover:bg-pink-800 group-hover:text-white transition-colors">
                        {p.nome.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        {p.nome}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {p.especialidade}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Etapa 2: Serviço ── */}
          {step === 2 && (
            <section>
              <button
                onClick={() => voltarPara(1)}
                className="text-xs text-slate-400 hover:text-slate-700 mb-4 flex items-center gap-1 transition-colors cursor-pointer"
              >
                ← Voltar
              </button>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Escolha o serviço
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                Profissional:{" "}
                <span className="font-medium text-slate-700">
                  {profissional?.nome}
                </span>
              </p>

              {loadingServ ? (
                <div className="text-center text-slate-400 text-sm py-12">
                  Carregando...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicos.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => selecionarServico(s)}
                      className="bg-white rounded-xl shadow-sm p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all border border-transparent hover:border-slate-200 cursor-pointer"
                    >
                      <p className="text-sm font-semibold text-slate-800 mb-2">
                        {s.nome}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {s.duracao} min
                        </span>
                        <span className="text-xs font-semibold text-emerald-600">
                          R$ {Number(s.preco).toFixed(2)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Etapa 3: Calendário ── */}
          {step === 3 && (
            <section>
              <button
                onClick={() => voltarPara(remarcarId ? 3 : 2)}
                className="text-xs text-slate-400 hover:text-slate-700 mb-4 flex items-center gap-1 transition-colors cursor-pointer"
              >
                ← Voltar
              </button>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                {remarcarId ? "Escolha a nova data" : "Escolha a data"}
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                Serviço:{" "}
                <span className="font-medium text-slate-700">
                  {servico?.nome}
                </span>
              </p>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <button
                    onClick={() => navegarMes(-1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer"
                  >
                    ‹
                  </button>
                  <span className="text-sm font-semibold text-slate-700">
                    {NOMES_MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
                  </span>
                  <button
                    onClick={() => navegarMes(1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer"
                  >
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-7 mb-2">
                  {NOMES_DIAS_SEMANA.map((nome) => (
                    <div
                      key={nome}
                      className="text-center text-[11px] font-semibold text-slate-400 uppercase py-1"
                    >
                      {nome}
                    </div>
                  ))}
                </div>

                {loadingDisp ? (
                  <div className="text-center text-slate-400 text-sm py-8">
                    Carregando disponibilidades...
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-y-1">
                    {diasDoMes.map((dia, idx) => {
                      if (!dia) return <div key={`empty-${idx}`} />;
                      const key = toYYYYMMDD(dia);
                      const isPast = dia < hoje;
                      const isHoje = key === hojeKey;
                      const temHorarios =
                        (horariosPorData[key]?.length ?? 0) > 0;
                      const disabled = isPast || !temHorarios;

                      return (
                        <div key={key} className="flex flex-col items-center">
                          <button
                            onClick={() => !disabled && selecionarData(key)}
                            disabled={disabled}
                            className={`
                              w-9 h-9 rounded-full text-sm font-medium transition-all flex items-center justify-center
                              ${
                                disabled
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "cursor-pointer hover:bg-slate-100"
                              }
                              ${
                                isHoje && !disabled
                                  ? "ring-2 ring-slate-400 text-slate-700"
                                  : ""
                              }
                              ${!disabled && !isHoje ? "text-slate-700" : ""}
                            `}
                          >
                            {dia.getDate()}
                          </button>
                          {temHorarios && !isPast ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />
                          ) : (
                            <span className="w-1.5 h-1.5 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Dias com ponto verde têm horários disponíveis
                </p>
              </div>
            </section>
          )}

          {/* ── Etapa 4: Horário ── */}
          {step === 4 && data && (
            <section>
              <button
                onClick={() => voltarPara(3)}
                className="text-xs text-slate-400 hover:text-slate-700 mb-4 flex items-center gap-1 transition-colors cursor-pointer"
              >
                ← Voltar
              </button>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                {remarcarId ? "Escolha o novo horário" : "Escolha o horário"}
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                {formatarData(data)}
              </p>

              <div className="bg-white rounded-xl shadow-sm p-6">
                {(horariosPorData[data]?.length ?? 0) === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">
                    Nenhum horário disponível para este dia.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {horariosPorData[data].map((h) => (
                      <button
                        key={h}
                        onClick={() => selecionarHorario(h)}
                        className="text-sm py-2.5 rounded-lg font-medium bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Etapa 5: Confirmação ── */}
          {step === 5 && (
            <section>
              {!sucesso ? (
                <>
                  <button
                    onClick={() => voltarPara(4)}
                    className="text-xs text-slate-400 hover:text-slate-700 mb-4 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    ← Voltar
                  </button>
                  <h2 className="text-lg font-bold text-slate-800 mb-1">
                    {remarcarId
                      ? "Confirme a remarcação"
                      : "Confirme o agendamento"}
                  </h2>
                  <p className="text-sm text-slate-500 mb-5">
                    Revise as informações antes de confirmar.
                  </p>

                  <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                    <dl className="divide-y divide-slate-100">
                      <div className="flex justify-between py-3">
                        <dt className="text-sm text-slate-400">Profissional</dt>
                        <dd className="text-sm font-semibold text-slate-800 text-right">
                          {profissional?.nome}
                          <span className="block text-xs font-normal text-slate-400">
                            {profissional?.especialidade}
                          </span>
                        </dd>
                      </div>
                      <div className="flex justify-between py-3">
                        <dt className="text-sm text-slate-400">Serviço</dt>
                        <dd className="text-sm font-semibold text-slate-800 text-right">
                          {servico?.nome}
                          <span className="block text-xs font-normal text-emerald-600">
                            R$ {Number(servico?.preco).toFixed(2)}
                          </span>
                        </dd>
                      </div>
                      <div className="flex justify-between py-3">
                        <dt className="text-sm text-slate-400">Data</dt>
                        <dd className="text-sm font-semibold text-slate-800 text-right">
                          {data ? formatarData(data) : ""}
                        </dd>
                      </div>
                      <div className="flex justify-between py-3">
                        <dt className="text-sm text-slate-400">Horário</dt>
                        <dd className="text-sm font-semibold text-slate-800">
                          {horario}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {erro && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                      {erro}
                    </p>
                  )}

                  <button
                    onClick={confirmar}
                    disabled={confirmando}
                    className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-medium py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    {confirmando
                      ? "Confirmando..."
                      : remarcarId
                      ? "Confirmar Remarcação"
                      : "Confirmar Agendamento"}
                  </button>
                </>
              ) : remarcarId ? (
                /* Sucesso - modo remarcação */
                <div className="text-center gap-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mx-auto mb-4">
                    ✓
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">
                    Remarcação confirmada!
                  </h2>
                  <p className="text-sm text-slate-500 mb-1">
                    {profissional?.nome} · {servico?.nome}
                  </p>
                  <p className="text-sm text-slate-500 mb-8">
                    {data ? formatarData(data) : ""} às {horario}
                  </p>
                  <button
                    onClick={() => navigate("/ver-agendamentos")}
                    className="text-sm bg-emerald-800 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Ver meus agendamentos
                  </button>
                </div>
              ) : (
                /* Sucesso - novo agendamento */
                <div className="text-center gap-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mx-auto mb-4">
                    ✓
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">
                    Agendamento confirmado!
                  </h2>
                  <p className="text-sm text-slate-500 mb-1">
                    {profissional?.nome} · {servico?.nome}
                  </p>
                  <p className="text-sm text-slate-500 mb-8">
                    {data ? formatarData(data) : ""} às {horario}
                  </p>
                  <div>
                    <button
                      onClick={novoAgendamento}
                      className="text-sm bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 m-4 rounded-xl transition-colors cursor-pointer"
                    >
                      Fazer novo agendamento
                    </button>
                    <button
                      onClick={() => navigate("/ver-agendamentos")}
                      className="text-sm bg-emerald-800 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Ver meus agendamentos
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
