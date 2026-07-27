import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { formatPLN } from "../lib/format";
import { pobierzUzyteCzesci, przywrocStanDlaZlecenia, zapiszUzyteCzesci } from "../lib/czesci";

const today = () => new Date().toISOString().slice(0, 10);

export default function ZlecenieForm({ onClose, onSaved, zlecenie }) {
  const [form, setForm] = useState(
    zlecenie
      ? {
          telefon: zlecenie.klienci?.telefon ?? "",
          adres: zlecenie.klienci?.adres ?? "",
          urzadzenie: zlecenie.urzadzenie ?? "",
          opis: zlecenie.opis ?? "",
          przychod: String(zlecenie.przychod ?? ""),
          kosztCzesci: String(zlecenie.koszt_czesci ?? ""),
          data: zlecenie.data,
          godzina: zlecenie.godzina?.slice(0, 5) ?? "",
          zaplacone: zlecenie.zaplacone,
        }
      : {
          telefon: "",
          adres: "",
          urzadzenie: "",
          opis: "",
          przychod: "",
          kosztCzesci: "",
          data: today(),
          godzina: "",
          zaplacone: false,
        }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [dostepneCzesci, setDostepneCzesci] = useState([]);
  const [uzyteCzesci, setUzyteCzesci] = useState([]);
  const [wybranaCzescId, setWybranaCzescId] = useState("");
  const [wybranaIlosc, setWybranaIlosc] = useState("1");

  useEffect(() => {
    supabase
      .from("czesci")
      .select("id, nazwa, ilosc, cena_zakupu")
      .order("nazwa", { ascending: true })
      .then(({ data }) => setDostepneCzesci(data ?? []));

    if (zlecenie) {
      pobierzUzyteCzesci(zlecenie.id).then(setUzyteCzesci);
    }
  }, [zlecenie]);

  useEffect(() => {
    if (uzyteCzesci.length === 0) return;
    const suma = uzyteCzesci.reduce((s, u) => s + u.ilosc * u.cena_zakupu, 0);
    setForm((f) => ({ ...f, kosztCzesci: String(suma) }));
  }, [uzyteCzesci]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function dodajCzesc() {
    const cz = dostepneCzesci.find((c) => c.id === wybranaCzescId);
    if (!cz) return;
    const ilosc = Math.max(1, Number(wybranaIlosc) || 1);

    setUzyteCzesci((lista) => {
      const istniejacy = lista.find((u) => u.czesc_id === cz.id);
      if (istniejacy) {
        return lista.map((u) => (u.czesc_id === cz.id ? { ...u, ilosc: u.ilosc + ilosc } : u));
      }
      return [...lista, { czesc_id: cz.id, nazwa: cz.nazwa, ilosc, cena_zakupu: Number(cz.cena_zakupu ?? 0) }];
    });
    setWybranaCzescId("");
    setWybranaIlosc("1");
  }

  function usunCzesc(czescId) {
    setUzyteCzesci((lista) => lista.filter((u) => u.czesc_id !== czescId));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    let klientId;
    const { data: existing } = await supabase
      .from("klienci")
      .select("id")
      .eq("telefon", form.telefon.trim())
      .maybeSingle();

    if (existing) {
      klientId = existing.id;
      await supabase.from("klienci").update({ adres: form.adres.trim() }).eq("id", klientId);
    } else {
      const { data: created, error: klientError } = await supabase
        .from("klienci")
        .insert({ telefon: form.telefon.trim(), adres: form.adres.trim() })
        .select("id")
        .single();
      if (klientError) {
        setError(klientError.message);
        setSaving(false);
        return;
      }
      klientId = created.id;
    }

    const payload = {
      klient_id: klientId,
      data: form.data,
      godzina: form.godzina || null,
      urzadzenie: form.urzadzenie.trim(),
      opis: form.opis.trim(),
      przychod: Number(form.przychod) || 0,
      koszt_czesci: Number(form.kosztCzesci) || 0,
      zaplacone: form.zaplacone,
    };

    let zlecenieId = zlecenie?.id;

    if (zlecenie) {
      const { error: zlecenieError } = await supabase.from("zlecenia").update(payload).eq("id", zlecenie.id);
      if (zlecenieError) {
        setError(zlecenieError.message);
        setSaving(false);
        return;
      }
      await przywrocStanDlaZlecenia(zlecenie.id);
    } else {
      const { data: created, error: zlecenieError } = await supabase
        .from("zlecenia")
        .insert(payload)
        .select("id")
        .single();
      if (zlecenieError) {
        setError(zlecenieError.message);
        setSaving(false);
        return;
      }
      zlecenieId = created.id;
    }

    await zapiszUzyteCzesci(zlecenieId, uzyteCzesci);

    setSaving(false);
    onSaved();
  }

  const inputClass =
    "w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-20 px-0 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-md bg-neutral-900 border border-neutral-800 sm:rounded-2xl rounded-t-2xl p-5 space-y-3 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold">{zlecenie ? "Edytuj zlecenie" : "Nowe zlecenie"}</h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            ✕
          </button>
        </div>

        <input
          required
          type="tel"
          placeholder="Numer telefonu"
          value={form.telefon}
          onChange={(e) => update("telefon", e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Adres"
          value={form.adres}
          onChange={(e) => update("adres", e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Urządzenie (np. FAAC E024S)"
          value={form.urzadzenie}
          onChange={(e) => update("urzadzenie", e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Opis (np. wymiana centrali sterującej)"
          value={form.opis}
          onChange={(e) => update("opis", e.target.value)}
          className={inputClass}
        />

        <div className="bg-neutral-800/60 rounded-xl p-3 space-y-2">
          <label className="text-xs text-neutral-400">Użyte części zamienne</label>
          <select
            value={wybranaCzescId}
            onChange={(e) => setWybranaCzescId(e.target.value)}
            className={`${inputClass} w-full`}
          >
            <option value="">Wybierz część...</option>
            {dostepneCzesci.map((cz) => (
              <option key={cz.id} value={cz.id}>
                {cz.nazwa} (stan: {cz.ilosc})
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={wybranaIlosc}
              onChange={(e) => setWybranaIlosc(e.target.value)}
              className={`${inputClass} w-20 min-w-0 shrink-0`}
            />
            <button
              type="button"
              onClick={dodajCzesc}
              disabled={!wybranaCzescId}
              className="flex-1 bg-accent hover:bg-orange-600 transition-colors rounded-lg px-3 text-sm font-medium disabled:opacity-50"
            >
              Dodaj
            </button>
          </div>

          {uzyteCzesci.length > 0 && (
            <div className="space-y-1 pt-1">
              {uzyteCzesci.map((u) => (
                <div key={u.czesc_id} className="flex items-center justify-between text-sm">
                  <span className="truncate">
                    {u.ilosc}× {u.nazwa}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-neutral-400">{formatPLN(u.ilosc * u.cena_zakupu)}</span>
                    <button
                      type="button"
                      onClick={() => usunCzesc(u.czesc_id)}
                      className="text-neutral-600 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-400">Przychód</label>
            <input
              type="number"
              step="0.01"
              value={form.przychod}
              onChange={(e) => update("przychod", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Koszt części</label>
            <input
              type="number"
              step="0.01"
              value={form.kosztCzesci}
              onChange={(e) => update("kosztCzesci", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-400">Data</label>
            <input
              type="date"
              value={form.data}
              onChange={(e) => update("data", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Godzina</label>
            <input
              type="time"
              value={form.godzina}
              onChange={(e) => update("godzina", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={form.zaplacone}
            onChange={(e) => update("zaplacone", e.target.checked)}
            className="accent-accent"
          />
          Zapłacone
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-accent hover:bg-orange-600 transition-colors rounded-lg py-2 font-medium disabled:opacity-50"
        >
          {saving ? "Zapisywanie..." : zlecenie ? "Zapisz zmiany" : "Zapisz zlecenie"}
        </button>
      </form>
    </div>
  );
}
