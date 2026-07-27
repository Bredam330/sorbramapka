import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { formatPLN, MIESIACE } from "../lib/format";

function monthRange(year, month) {
  const start = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
  const end = new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 10);
  return { start, end };
}

function buildGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function Kalendarz() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [zlecenia, setZlecenia] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    async function load() {
      const { start, end } = monthRange(year, month);
      const { data } = await supabase
        .from("zlecenia")
        .select("*, klienci(nazwa)")
        .gte("data", start)
        .lt("data", end);
      setZlecenia(data ?? []);
      setSelectedDay(null);
    }
    load();
  }, [year, month]);

  function changeMonth(delta) {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; } else if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
  }

  const cells = buildGrid(year, month);
  const zleceniaByDay = {};
  for (const z of zlecenia) {
    const day = Number(z.data.slice(8, 10));
    (zleceniaByDay[day] ??= []).push(z);
  }

  const dniTygodnia = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
  const dayEntries = selectedDay ? zleceniaByDay[selectedDay] ?? [] : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => changeMonth(-1)} className="text-neutral-400 hover:text-neutral-200 px-1">‹</button>
          <span className="font-medium text-sm">{MIESIACE[month]} {year}</span>
          <button onClick={() => changeMonth(1)} className="text-neutral-400 hover:text-neutral-200 px-1">›</button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-neutral-500 mb-1">
          {dniTygodnia.map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const entries = day ? zleceniaByDay[day] ?? [] : [];
            const isToday =
              day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            return (
              <button
                key={i}
                disabled={!day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative ${
                  !day ? "invisible" : selectedDay === day ? "bg-accent text-black font-semibold" : "hover:bg-neutral-800"
                } ${isToday && selectedDay !== day ? "border border-accent" : ""}`}
              >
                {day}
                {entries.length > 0 && (
                  <span className={`w-1 h-1 rounded-full mt-0.5 ${selectedDay === day ? "bg-black" : "bg-accent"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">
            {selectedDay} {MIESIACE[month].toLowerCase()}
          </p>
          {dayEntries.length === 0 && <p className="text-sm text-neutral-500">Brak zleceń tego dnia.</p>}
          <div className="space-y-2">
            {dayEntries.map((z) => (
              <div key={z.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  {z.godzina && <span className="text-xs text-neutral-500">{z.godzina.slice(0, 5)}</span>}
                  <p className="font-medium">{z.klienci?.nazwa}</p>
                </div>
                <p className="text-xs text-neutral-500">{z.urzadzenie} {z.opis}</p>
                <p className="text-xs text-accent mt-1">{formatPLN(z.przychod)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
