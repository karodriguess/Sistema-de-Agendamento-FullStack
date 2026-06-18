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

const DAYS = [
  { num: 1, label: "Segunda" },
  { num: 2, label: "Terça" },
  { num: 3, label: "Quarta" },
  { num: 4, label: "Quinta" },
  { num: 5, label: "Sexta" },
  { num: 6, label: "Sábado" },
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

const emptySchedule = (): Record<number, string[]> =>
  Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, []]));

export function Disponibilidades() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [profissionalId, setProfissionalId] = useState("");
  const [schedule, setSchedule] = useState<Record<number, string[]>>(
    emptySchedule()
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfissionais().then(setProfissionais);
  }, []);

  useEffect(() => {
    if (!profissionalId) {
      setSchedule(emptySchedule());
      return;
    }
    getDisponibilidades(profissionalId).then((data) => {
      const next = emptySchedule();
      for (const { diaSemana, horarios } of data) {
        next[diaSemana] = horarios;
      }
      setSchedule(next);
    });
  }, [profissionalId]);

  function toggleSlot(diaSemana: number, horario: string) {
    setSchedule((prev) => {
      const day = prev[diaSemana] ?? [];
      const updated = day.includes(horario)
        ? day.filter((h) => h !== horario)
        : [...day, horario].sort();
      return { ...prev, [diaSemana]: updated };
    });
    setSaved(false);
  }

  function selectAll(diaSemana: number) {
    setSchedule((prev) => ({ ...prev, [diaSemana]: [...TIME_SLOTS] }));
    setSaved(false);
  }

  function clearDay(diaSemana: number) {
    setSchedule((prev) => ({ ...prev, [diaSemana]: [] }));
    setSaved(false);
  }

  async function handleSave() {
    if (!profissionalId) return;
    setSaving(true);
    try {
      const dias = Object.entries(schedule).map(([diaSemana, horarios]) => ({
        diaSemana: Number(diaSemana),
        horarios,
      }));
      await salvarDisponibilidades(profissionalId, dias);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-slate-100 min-h-screen p-8">
        <p className="text-xs text-slate-400 mb-1">Pages / Disponibilidades</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          Disponibilidades
        </h1>

        {/* Professional selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
            Selecionar Profissional
          </label>
          <select
            value={profissionalId}
            onChange={(e) => setProfissionalId(e.target.value)}
            className="w-full md:w-80 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
          >
            <option value="">— Selecione um profissional —</option>
            {profissionais.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nome} · {p.especialidade}
              </option>
            ))}
          </select>
        </div>

        {/* Schedule grid */}
        {profissionalId ? (
          <>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {DAYS.map((day) => {
                  const daySlots = schedule[day.num] ?? [];
                  const allSelected = daySlots.length === TIME_SLOTS.length;
                  return (
                    <div
                      key={day.num}
                      className="bg-white rounded-xl shadow-sm p-3 flex flex-col"
                    >
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-2">
                        {day.label}
                      </h3>

                      <div className="flex gap-1 mb-3 justify-center">
                        <button
                          onClick={() =>
                            allSelected ? clearDay(day.num) : selectAll(day.num)
                          }
                          className="text-[10px] px-2 py-0.5 rounded border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                          {allSelected ? "Limpar" : "Todos"}
                        </button>
                      </div>

                      <div className="flex flex-col gap-1">
                        {TIME_SLOTS.map((slot) => {
                          const selected = daySlots.includes(slot);
                          return (
                            <button
                              key={slot}
                              onClick={() => toggleSlot(day.num, slot)}
                              className={`text-xs py-1.5 rounded-md font-medium transition-all cursor-pointer ${
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
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-medium px-8 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {saving ? "Salvando..." : "Salvar Disponibilidades"}
              </button>
              {saved && (
                //
                <button className="bg-emerald-700 px-8 py-2.5 rounded-lg">
                  <span className="text-sm text-white font-medium ">
                    Salvo com sucesso!
                  </span>
                </button>
              )}
            </div>
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
