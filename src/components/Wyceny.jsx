import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { formatPLN } from "../lib/format";
import DiagramBramySkrzydlowej from "./DiagramBramySkrzydlowej";

const STATUSY = {
  wyslana: { label: "Wysłana", className: "bg-neutral-700 text-neutral-200" },
  zaakceptowana: { label: "Zaakceptowana", className: "bg-green-700/30 text-green-400" },
  odrzucona: { label: "Odrzucona", className: "bg-red-700/30 text-red-400" },
};

const emptyForm = {
  telefon: "",
  tresc: "",
  kwota: "",
  bramaSkrzydlowa: false,
  wymiarA: "",
  wymiarB: "",
  wymiarC: "",
  wymiarD: "",
  kat: "",
};

export default function Wyceny() {
  const [wyceny, setWyceny] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("wyceny")
      .select("*, klienci(telefon, adres)")
      .order("data", { ascending: false });
    setWyceny(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    let klientId = null;
    if (form.telefon.trim()) {
      const { data: existing } = await supabase
        .from("klienci")
        .select("id")
        .eq("telefon", form.telefon.trim())
        .maybeSingle();
      klientId = existing?.id;
      if (!klientId) {
        const { data: created } = await supabase
          .from("klienci")
          .insert({ telefon: form.telefon.trim() })
          .select("id")
          .single();
        klientId = created?.id;
      }
    }

    await supabase.from("wyceny").insert({
      klient_id: klientId,
      tresc: form.tresc.trim(),
      kwota: Number(form.kwota) || 0,
      wymiar_a: form.bramaSkrzydlowa && form.wymiarA ? Number(form.wymiarA) : null,
      wymiar_b: form.bramaSkrzydlowa && form.wymiarB ? Number(form.wymiarB) : null,
      wymiar_c: form.bramaSkrzydlowa && form.wymiarC ? Number(form.wymiarC) : null,
      wymiar_d: form.bramaSkrzydlowa && form.wymiarD ? Number(form.wymiarD) : null,
      kat_otwarcia: form.bramaSkrzydlowa && form.kat ? Number(form.kat) : null,
    });

    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    load();
  }

  async function setStatus(id, status) {
    await supabase.from("wyceny").update({ status }).eq("id", id);
    load();
  }

  async function pobierzPdf(w) {
    setGeneratingId(w.id);
    const { generujPdfWyceny } = await import("../lib/pdf");
    await generujPdfWyceny(w);
    setGeneratingId(null);
  }

  async function utworzZlecenie(w) {
    await supabase.from("zlecenia").insert({
      klient_id: w.klient_id,
      opis: w.tresc,
      przychod: w.kwota,
      koszt_czesci: 0,
    });
    alert("Utworzono zlecenie w Rejestrze zleceń.");
  }

  const inputClass =
    "w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400 uppercase tracking-wide">Wyceny</p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-sm bg-accent hover:bg-orange-600 transition-colors rounded-lg px-3 py-1.5 font-medium"
        >
          + Nowa wycena
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
          <input
            required
            type="tel"
            placeholder="Numer telefonu"
            value={form.telefon}
            onChange={(e) => setForm((f) => ({ ...f, telefon: e.target.value }))}
            className={inputClass}
          />
          <input
            placeholder="Zakres prac"
            value={form.tresc}
            onChange={(e) => setForm((f) => ({ ...f, tresc: e.target.value }))}
            className={inputClass}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Kwota"
            value={form.kwota}
            onChange={(e) => setForm((f) => ({ ...f, kwota: e.target.value }))}
            className={inputClass}
          />

          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={form.bramaSkrzydlowa}
              onChange={(e) => setForm((f) => ({ ...f, bramaSkrzydlowa: e.target.checked }))}
              className="accent-accent"
            />
            Brama skrzydłowa — dodaj wymiary montażowe
          </label>

          {form.bramaSkrzydlowa && (
            <div className="bg-neutral-800/60 rounded-xl p-3 space-y-3">
              <DiagramBramySkrzydlowej
                a={form.wymiarA}
                b={form.wymiarB}
                c={form.wymiarC}
                d={form.wymiarD}
                kat={form.kat}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400">A — wymiar słupka (mm)</label>
                  <input
                    type="number"
                    value={form.wymiarA}
                    onChange={(e) => setForm((f) => ({ ...f, wymiarA: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">B — wysokość mocowania (mm)</label>
                  <input
                    type="number"
                    value={form.wymiarB}
                    onChange={(e) => setForm((f) => ({ ...f, wymiarB: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">C — wymiar do osi ramienia (mm)</label>
                  <input
                    type="number"
                    value={form.wymiarC}
                    onChange={(e) => setForm((f) => ({ ...f, wymiarC: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">D — długość ramienia (mm)</label>
                  <input
                    type="number"
                    value={form.wymiarD}
                    onChange={(e) => setForm((f) => ({ ...f, wymiarD: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">α — kąt otwarcia (°)</label>
                  <input
                    type="number"
                    value={form.kat}
                    onChange={(e) => setForm((f) => ({ ...f, kat: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-accent hover:bg-orange-600 transition-colors rounded-lg py-2 font-medium disabled:opacity-50"
          >
            {saving ? "Zapisywanie..." : "Zapisz wycenę"}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-neutral-500">Ładowanie...</p>}
      {!loading && wyceny.length === 0 && <p className="text-sm text-neutral-500">Brak wycen.</p>}

      <div className="space-y-2">
        {wyceny.map((w) => (
          <div key={w.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium truncate">{w.klienci?.telefon ?? "Bez klienta"}</p>
                <p className="text-xs text-neutral-500 truncate">{w.tresc}</p>
                {w.wymiar_a && (
                  <p className="text-xs text-neutral-500 truncate">
                    A {w.wymiar_a} · B {w.wymiar_b} · C {w.wymiar_c} · D {w.wymiar_d}mm
                    {w.kat_otwarcia ? ` · α ${w.kat_otwarcia}°` : ""}
                  </p>
                )}
              </div>
              <span className={`text-[10px] px-2 py-1 rounded shrink-0 ${STATUSY[w.status].className}`}>
                {STATUSY[w.status].label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{formatPLN(w.kwota)}</span>
              <div className="flex gap-2 text-xs items-center">
                <button
                  onClick={() => pobierzPdf(w)}
                  disabled={generatingId === w.id}
                  className="text-neutral-300 hover:text-neutral-100 disabled:opacity-50"
                >
                  {generatingId === w.id ? "Generuję..." : "PDF"}
                </button>
                {w.status === "wyslana" && (
                  <>
                    <button onClick={() => setStatus(w.id, "zaakceptowana")} className="text-green-400 hover:underline">
                      Zaakceptowana
                    </button>
                    <button onClick={() => setStatus(w.id, "odrzucona")} className="text-red-400 hover:underline">
                      Odrzucona
                    </button>
                  </>
                )}
                {w.status === "zaakceptowana" && (
                  <button onClick={() => utworzZlecenie(w)} className="text-accent hover:underline">
                    Utwórz zlecenie
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
