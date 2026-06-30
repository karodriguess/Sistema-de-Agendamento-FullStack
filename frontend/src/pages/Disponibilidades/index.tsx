import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { getProfissionais } from "../../services/profissionais";
import {
  getDisponibilidades,
  salvarDisponibilidades,
} from "../../services/disponibilidades";

interface Profissional {
  _id: string;
  nome: string;
  especialidade: string;
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

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 7; h <= 20; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 20) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

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
  const diasVazios = primeiroDia.getDay(); // posição inicial (0=Dom)
  const dias: (Date | null)[] = Array(diasVazios).fill(null);
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    dias.push(new Date(ano, mes, d));
  }
  return dias;
}

export function Disponibilidades() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [profissionalId, setProfissionalId] = useState("");
  const [mesAtual, setMesAtual] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const [horariosPorData, setHorariosPorData] = useState<
    Record<string, string[]>
  >({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    getProfissionais().then(setProfissionais);
  }, []);

  useEffect(() => {
    if (!profissionalId) {
      setHorariosPorData({});
      setDataSelecionada(null);
      return;
    }
    carregarMes(mesAtual);
  }, [profissionalId, mesAtual]);

  async function carregarMes(mes: Date) {
    const param = toMesParam(mes);
    const data = await getDisponibilidades(profissionalId, param);
    const mapa: Record<string, string[]> = {};
    for (const item of data) {
      mapa[item.data] = item.horarios;
    }
    setHorariosPorData(mapa);
  }

  function navegarMes(delta: number) {
    setMesAtual((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      return next;
    });
    setDataSelecionada(null);
    setSaved(false);
  }

  function handleDiaClick(date: Date) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (date < hoje) return; // dias passados desabilitados
    const key = toYYYYMMDD(date);
    setDataSelecionada(key);
    setSaved(false);
  }

  function toggleSlot(horario: string) {
    if (!dataSelecionada) return;
    setHorariosPorData((prev) => {
      const atuais = prev[dataSelecionada] ?? [];
      const updated = atuais.includes(horario)
        ? atuais.filter((h) => h !== horario)
        : [...atuais, horario].sort();
      return { ...prev, [dataSelecionada]: updated };
    });
    setSaved(false);
  }

  function selectAll() {
    if (!dataSelecionada) return;
    setHorariosPorData((prev) => ({
      ...prev,
      [dataSelecionada]: [...TIME_SLOTS],
    }));
    setSaved(false);
  }

  function clearDay() {
    if (!dataSelecionada) return;
    setHorariosPorData((prev) => ({ ...prev, [dataSelecionada]: [] }));
    setSaved(false);
  }

  async function handleSave() {
    if (!profissionalId || !dataSelecionada) return;
    setSaving(true);
    setErro(null);
    try {
      const horarios = horariosPorData[dataSelecionada] ?? [];
      await salvarDisponibilidades(profissionalId, [
        { data: dataSelecionada, horarios },
      ]);
      setSaved(true);
    } catch (e: any) {
      setErro(e?.response?.data?.error ?? "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const hojeKey = toYYYYMMDD(hoje);

  const diasDoMes = getDiasDoMes(mesAtual.getFullYear(), mesAtual.getMonth());
  const horariosDiaSelecionado = dataSelecionada
    ? horariosPorData[dataSelecionada] ?? []
    : [];
  const allSelected = horariosDiaSelecionado.length === TIME_SLOTS.length;

  let labelDataSelecionada = "";
  if (dataSelecionada) {
    const [ano, mes, dia] = dataSelecionada.split("-").map(Number);
    const d = new Date(ano, mes - 1, dia);
    labelDataSelecionada = `${NOMES_DIAS_COMPLETOS[d.getDay()]}, ${dia} de ${
      NOMES_MESES[mes - 1]
    } de ${ano}`;
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 min-h-screen px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-20 md:p-8">
        <p className="text-xs text-slate-400 mb-1">Pages / Disponibilidades</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          Disponibilidades
        </h1>

        {/* Seletor de profissional */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
            Selecionar Profissional
          </label>
          <select
            value={profissionalId}
            onChange={(e) => {
              setProfissionalId(e.target.value);
              setDataSelecionada(null);
              setSaved(false);
            }}
            className="w-full sm:w-50 md:w-80 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
          >
            <option value="">— Selecione um profissional —</option>
            {profissionais.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nome} · {p.especialidade}
              </option>
            ))}
          </select>
        </div>

        {profissionalId ? (
          <>
            {/* Calendário */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              {/* Cabeçalho do mês */}
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

              {/* Nomes dos dias da semana */}
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

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-y-1">
                {diasDoMes.map((dia, idx) => {
                  if (!dia) return <div key={`empty-${idx}`} />;

                  const key = toYYYYMMDD(dia);
                  const isPast = dia < hoje;
                  const isHoje = key === hojeKey;
                  const isSelecionado = key === dataSelecionada;
                  const temHorarios = (horariosPorData[key]?.length ?? 0) > 0;

                  return (
                    <div key={key} className="flex flex-col items-center">
                      <button
                        onClick={() => handleDiaClick(dia)}
                        disabled={isPast}
                        className={`
                          w-9 h-9 rounded-full text-sm font-medium transition-all flex items-center justify-center
                          ${
                            isPast
                              ? "text-slate-300 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                          ${isSelecionado ? "bg-slate-800 text-white" : ""}
                          ${
                            isHoje && !isSelecionado
                              ? "ring-2 ring-slate-400 text-slate-700"
                              : ""
                          }
                          ${
                            !isPast && !isSelecionado && !isHoje
                              ? "text-slate-700 hover:bg-slate-100"
                              : ""
                          }
                        `}
                      >
                        {dia.getDate()}
                      </button>
                      {/* Ponto indicador de disponibilidade */}
                      {temHorarios && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />
                      )}
                      {!temHorarios && <span className="w-1.5 h-1.5 mt-0.5" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seletor de horários */}
            {dataSelecionada ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700">
                      {labelDataSelecionada}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {horariosDiaSelecionado.length} horário
                      {horariosDiaSelecionado.length !== 1 ? "s" : ""}{" "}
                      selecionado
                      {horariosDiaSelecionado.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={allSelected ? clearDay : selectAll}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {allSelected ? "Limpar tudo" : "Selecionar todos"}
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2 mb-6">
                  {TIME_SLOTS.map((slot) => {
                    const selected = horariosDiaSelecionado.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        className={`text-xs py-2 rounded-lg font-medium transition-all cursor-pointer ${
                          selected
                            ? "bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-medium px-8 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {saving ? "Salvando..." : "Salvar este dia"}
                    </button>
                    {saved && (
                      <span className="bg-emerald-700 px-6 py-2.5 rounded-lg text-sm text-white font-medium">
                        Salvo com sucesso!
                      </span>
                    )}
                  </div>
                  {erro && <p className="text-sm text-red-600">{erro}</p>}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center text-slate-400 text-sm">
                Clique em um dia no calendário para gerenciar os horários.
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-slate-400 text-sm">
            Selecione um profissional para gerenciar as disponibilidades.
          </div>
        )}
      </main>
    </div>
  );
}
