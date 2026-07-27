import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const STATUSY = {
  nowe: { label: "Nowe", className: "bg-accent/20 text-accent" },
  w_trakcie: { label: "W trakcie", className: "bg-neutral-700 text-neutral-200" },
  zamkniete: { label: "Zamknięte", className: "bg-green-700/30 text-green-400" },
};

export default function Zapytania() {
  const [zapytania, setZapytania] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("zapytania")
      .select("*")
      .order("created_at", { ascending: false });
    setZapytania(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    await supabase.from("zapytania").update({ status }).eq("id", id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400 uppercase tracking-wide">Zapytania ze strony sorbram.pl</p>
      </div>

      {loading && <p className="text-sm text-neutral-500">Ładowanie...</p>}
      {!loading && zapytania.length === 0 && (
        <p className="text-sm text-neutral-500">
          Brak zapytań. Formularz kontaktowy na sorbram.pl trafia tu automatycznie przez n8n.
        </p>
      )}

      <div className="space-y-2">
        {zapytania.map((z) => (
          <div key={z.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium truncate">{z.imie || "Bez imienia"}</p>
                <p className="text-xs text-neutral-500 truncate">
                  {[z.telefon, z.email].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded shrink-0 ${STATUSY[z.status].className}`}>
                {STATUSY[z.status].label}
              </span>
            </div>
            {z.tresc && <p className="text-sm text-neutral-300">{z.tresc}</p>}
            <div className="flex gap-3 text-xs">
              {z.status !== "w_trakcie" && (
                <button onClick={() => setStatus(z.id, "w_trakcie")} className="text-neutral-400 hover:underline">
                  W trakcie
                </button>
              )}
              {z.status !== "zamkniete" && (
                <button onClick={() => setStatus(z.id, "zamkniete")} className="text-green-400 hover:underline">
                  Zamknij
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
