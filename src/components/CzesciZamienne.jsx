import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { formatPLN } from "../lib/format";

const emptyForm = { nazwa: "", symbol: "", ilosc: "", cenaZakupu: "", cenaSprzedazy: "" };

export default function CzesciZamienne() {
  const [czesci, setCzesci] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("czesci").select("*").order("nazwa", { ascending: true });
    setCzesci(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    await supabase.from("czesci").insert({
      nazwa: form.nazwa.trim(),
      symbol: form.symbol.trim() || null,
      ilosc: Number(form.ilosc) || 0,
      cena_zakupu: form.cenaZakupu ? Number(form.cenaZakupu) : null,
      cena_sprzedazy: form.cenaSprzedazy ? Number(form.cenaSprzedazy) : null,
    });

    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    load();
  }

  async function zmienIlosc(cz, delta) {
    const ilosc = Math.max(0, cz.ilosc + delta);
    await supabase.from("czesci").update({ ilosc }).eq("id", cz.id);
    load();
  }

  async function usun(id) {
    if (!confirm("Usunąć tę część z magazynu?")) return;
    await supabase.from("czesci").delete().eq("id", id);
    load();
  }

  const inputClass =
    "w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400 uppercase tracking-wide">Części zamienne</p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-sm bg-accent hover:bg-orange-600 transition-colors rounded-lg px-3 py-1.5 font-medium"
        >
          + Nowa część
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
          <input
            required
            placeholder="Nazwa (np. FAAC E024S centrala)"
            value={form.nazwa}
            onChange={(e) => setForm((f) => ({ ...f, nazwa: e.target.value }))}
            className={inputClass}
          />
          <input
            placeholder="Symbol / numer katalogowy"
            value={form.symbol}
            onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
            className={inputClass}
          />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-neutral-400">Ilość</label>
              <input
                type="number"
                value={form.ilosc}
                onChange={(e) => setForm((f) => ({ ...f, ilosc: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400">Cena zakupu</label>
              <input
                type="number"
                step="0.01"
                value={form.cenaZakupu}
                onChange={(e) => setForm((f) => ({ ...f, cenaZakupu: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400">Cena sprzedaży</label>
              <input
                type="number"
                step="0.01"
                value={form.cenaSprzedazy}
                onChange={(e) => setForm((f) => ({ ...f, cenaSprzedazy: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-accent hover:bg-orange-600 transition-colors rounded-lg py-2 font-medium disabled:opacity-50"
          >
            {saving ? "Zapisywanie..." : "Zapisz część"}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-neutral-500">Ładowanie...</p>}
      {!loading && czesci.length === 0 && <p className="text-sm text-neutral-500">Brak części w magazynie.</p>}

      <div className="space-y-2">
        {czesci.map((cz) => (
          <div key={cz.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium truncate">{cz.nazwa}</p>
                {cz.symbol && <p className="text-xs text-neutral-500 truncate">{cz.symbol}</p>}
              </div>
              <button onClick={() => usun(cz.id)} className="text-neutral-600 hover:text-red-400 shrink-0">
                🗑
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => zmienIlosc(cz, -1)}
                  className="w-7 h-7 flex items-center justify-center bg-neutral-800 rounded-lg hover:bg-neutral-700"
                >
                  −
                </button>
                <span className={`text-sm font-semibold w-6 text-center ${cz.ilosc === 0 ? "text-red-400" : ""}`}>
                  {cz.ilosc}
                </span>
                <button
                  onClick={() => zmienIlosc(cz, 1)}
                  className="w-7 h-7 flex items-center justify-center bg-neutral-800 rounded-lg hover:bg-neutral-700"
                >
                  +
                </button>
              </div>
              <div className="flex gap-3 text-xs text-neutral-400">
                {cz.cena_zakupu != null && <span>Zakup {formatPLN(cz.cena_zakupu)}</span>}
                {cz.cena_sprzedazy != null && <span className="text-accent">Sprzedaż {formatPLN(cz.cena_sprzedazy)}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
