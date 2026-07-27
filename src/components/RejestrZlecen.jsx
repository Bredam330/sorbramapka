import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { formatPLN, MIESIACE } from "../lib/format";
import ZlecenieForm from "./ZlecenieForm";

function monthRange(year, month) {
  const start = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
  const end = new Date(Date.UTC(year, month + 1, 1)).toISOString().slice(0, 10);
  return { start, end };
}

export default function RejestrZlecen() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [zlecenia, setZlecenia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true);
    const { start, end } = monthRange(year, month);
    const { data } = await supabase
      .from("zlecenia")
      .select("*, klienci(nazwa, adres)")
      .gte("data", start)
      .lt("data", end)
      .order("data", { ascending: false });
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

  async function toggleZaplacone(z) {
    await supabase.from("zlecenia").update({ zaplacone: !z.zaplacone }).eq("id", z.id);
    load();
  }

  async function deleteZlecenie(id) {
    if (!confirm("Usunąć to zlecenie?")) return;
    await supabase.from("zlecenia").delete().eq("id", id);
    load();
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
        {doZaplaty > 0 && (
          <p className="text-sm text-accent">Do zapłaty: {formatPLN(doZaplaty)}</p>
        )}
      </div>

      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Zlecenia</p>
        {loading && <p className="text-sm text-neutral-500">Ładowanie...</p>}
        {!loading && zlecenia.length === 0 && (
          <p className="text-sm text-neutral-500">Brak zleceń w tym miesiącu.</p>
        )}
        <div className="space-y-2">
          {zlecenia.map((z) => (
            <div
              key={z.id}
              onClick={() => setEditing(z)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 cursor-pointer hover:border-neutral-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 shrink-0">
                      {new Date(z.data).toLocaleDateString("pl-PL", { day: "2-digit", month: "short" })}
                      {z.godzina && ` ${z.godzina.slice(0, 5)}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleZaplacone(z);
                      }}
                      className="font-medium truncate hover:underline"
                    >
                      {z.klienci?.nazwa} {z.zaplacone ? "✓" : ""}
                    </button>
                    {!z.zaplacone && (
                      <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded shrink-0">
                        DO ZAPŁATY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {z.klienci?.adres}
                    {z.klienci?.adres && z.urzadzenie ? " — " : ""}
                    {z.urzadzenie}
                  </p>
                  {z.opis && <p className="text-xs text-neutral-500 truncate">{z.opis}</p>}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteZlecenie(z.id);
                  }}
                  className="text-neutral-600 hover:text-red-400 shrink-0"
                >
                  🗑
                </button>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-neutral-400">
                <span>Przychód {formatPLN(z.przychod)}</span>
                <span>Części {formatPLN(z.koszt_czesci)}</span>
                <span className="text-accent">+{formatPLN(z.zysk)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowForm(true)}
        style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        className="fixed left-1/2 -translate-x-1/2 bg-accent hover:bg-orange-600 transition-colors rounded-full px-6 py-3 font-medium shadow-lg shadow-black/40"
      >
        + Nowe zlecenie
      </button>

      {showForm && (
        <ZlecenieForm
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {editing && (
        <ZlecenieForm
          zlecenie={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
