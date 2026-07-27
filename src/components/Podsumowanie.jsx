import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { formatPLN, MIESIACE } from "../lib/format";

function monthRange(year, month) {
  const start = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
  const end = new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 10);
  return { start, end };
}

export default function Podsumowanie() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [zlecenia, setZlecenia] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { start, end } = monthRange(year, month);
    const { data } = await supabase
      .from("zlecenia")
      .select("przychod, koszt_czesci, zaplacone")
      .gte("data", start)
      .lt("data", end);
    setZlecenia(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [year, month]);

  function changeMonth(delta) {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  const przychod = zlecenia.reduce((sum, z) => sum + Number(z.przychod), 0);
  const koszty = zlecenia.reduce((sum, z) => sum + Number(z.koszt_czesci), 0);
  const zysk = przychod - koszty;
  const doZaplaty = zlecenia
    .filter((z) => !z.zaplacone)
    .reduce((sum, z) => sum + Number(z.przychod), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => changeMonth(-1)} className="text-neutral-400 hover:text-neutral-200 px-1">
            ‹
          </button>
          <span className="font-medium text-sm">
            {MIESIACE[month]} {year}
          </span>
          <button onClick={() => changeMonth(1)} className="text-neutral-400 hover:text-neutral-200 px-1">
            ›
          </button>
        </div>
        <span className="text-xs text-neutral-400">{zlecenia.length} zleceń</span>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Ładowanie...</p>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-wide">Zysk</p>
            <p className="text-3xl font-bold text-accent">{formatPLN(zysk)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-800/60 rounded-xl p-3">
              <p className="text-xs text-neutral-400 uppercase tracking-wide">Przychód</p>
              <p className="font-semibold">{formatPLN(przychod)}</p>
            </div>
            <div className="bg-neutral-800/60 rounded-xl p-3">
              <p className="text-xs text-neutral-400 uppercase tracking-wide">Części</p>
              <p className="font-semibold">{formatPLN(koszty)}</p>
            </div>
          </div>
          {doZaplaty > 0 && <p className="text-sm text-accent">Do zapłaty: {formatPLN(doZaplaty)}</p>}
        </div>
      )}
    </div>
  );
}
