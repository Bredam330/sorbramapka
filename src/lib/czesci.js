import { supabase } from "./supabase";

export async function pobierzUzyteCzesci(zlecenieId) {
  const { data } = await supabase
    .from("zlecenie_czesci")
    .select("id, czesc_id, ilosc, cena_jednostkowa, czesci(nazwa)")
    .eq("zlecenie_id", zlecenieId);
  return (data ?? []).map((row) => ({
    czesc_id: row.czesc_id,
    nazwa: row.czesci?.nazwa ?? "",
    ilosc: row.ilosc,
    cena_zakupu: Number(row.cena_jednostkowa ?? 0),
  }));
}

export async function zmienStanCzesci(czescId, delta) {
  const { data } = await supabase.from("czesci").select("ilosc").eq("id", czescId).single();
  const nowy = Math.max(0, (data?.ilosc ?? 0) + delta);
  await supabase.from("czesci").update({ ilosc: nowy }).eq("id", czescId);
}

export async function przywrocStanDlaZlecenia(zlecenieId) {
  const uzyte = await pobierzUzyteCzesci(zlecenieId);
  for (const u of uzyte) {
    await zmienStanCzesci(u.czesc_id, u.ilosc);
  }
  await supabase.from("zlecenie_czesci").delete().eq("zlecenie_id", zlecenieId);
}

export async function zapiszUzyteCzesci(zlecenieId, uzyteCzesci) {
  for (const u of uzyteCzesci) {
    await supabase.from("zlecenie_czesci").insert({
      zlecenie_id: zlecenieId,
      czesc_id: u.czesc_id,
      ilosc: u.ilosc,
      cena_jednostkowa: u.cena_zakupu,
    });
    await zmienStanCzesci(u.czesc_id, -u.ilosc);
  }
}
