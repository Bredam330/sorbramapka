import { jsPDF } from "jspdf";
import { formatPLN } from "./format";

async function fetchFontBase64(url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function utworzDokument() {
  const doc = new jsPDF();
  const [regular, bold] = await Promise.all([
    fetchFontBase64("/fonts/LiberationSans-Regular.ttf"),
    fetchFontBase64("/fonts/LiberationSans-Bold.ttf"),
  ]);
  doc.addFileToVFS("LiberationSans-Regular.ttf", regular);
  doc.addFont("LiberationSans-Regular.ttf", "Liberation", "normal");
  doc.addFileToVFS("LiberationSans-Bold.ttf", bold);
  doc.addFont("LiberationSans-Bold.ttf", "Liberation", "bold");
  doc.setFont("Liberation", "normal");
  return doc;
}

export async function generujPdfWyceny(wycena) {
  const doc = await utworzDokument();
  const marginX = 15;
  const pageWidth = 210;
  let y = 20;

  doc.setFont("Liberation", "bold");
  doc.setFontSize(20);
  doc.text("SOR-BRAM", marginX, y);

  doc.setFont("Liberation", "normal");
  doc.setFontSize(11);
  doc.text("Wycena", marginX, y + 7);
  doc.text(new Date(wycena.data).toLocaleDateString("pl-PL"), pageWidth - marginX, y, { align: "right" });

  y += 15;
  doc.setDrawColor(210);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 10;

  doc.setFont("Liberation", "bold");
  doc.setFontSize(11);
  doc.text("Klient", marginX, y);
  y += 6;
  doc.setFont("Liberation", "normal");
  const telefon = wycena.klienci?.telefon;
  const adres = wycena.klienci?.adres;
  if (telefon) {
    doc.text(`Telefon: ${telefon}`, marginX, y);
    y += 6;
  }
  if (adres) {
    doc.text(`Adres: ${adres}`, marginX, y);
    y += 6;
  }
  if (!telefon && !adres) {
    doc.text("—", marginX, y);
    y += 6;
  }

  y += 4;
  doc.setFont("Liberation", "bold");
  doc.text("Zakres prac", marginX, y);
  y += 6;
  doc.setFont("Liberation", "normal");
  const linieOpisu = doc.splitTextToSize(wycena.tresc || "—", pageWidth - marginX * 2);
  doc.text(linieOpisu, marginX, y);
  y += linieOpisu.length * 6 + 4;

  if (wycena.wymiar_a) {
    y += 4;
    doc.setFont("Liberation", "bold");
    doc.text("Wymiary montażowe (brama skrzydłowa)", marginX, y);
    y += 6;
    doc.setFont("Liberation", "normal");
    const wymiary = [
      wycena.wymiar_a && `A — wymiar słupka: ${wycena.wymiar_a} mm`,
      wycena.wymiar_b && `B — wysokość mocowania: ${wycena.wymiar_b} mm`,
      wycena.wymiar_c && `C — wymiar do osi ramienia: ${wycena.wymiar_c} mm`,
      wycena.wymiar_d && `D — długość ramienia: ${wycena.wymiar_d} mm`,
      wycena.kat_otwarcia && `α — kąt otwarcia: ${wycena.kat_otwarcia}°`,
    ].filter(Boolean);
    for (const linia of wymiary) {
      doc.text(linia, marginX, y);
      y += 6;
    }
  }

  y += 8;
  doc.setDrawColor(210);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 12;

  doc.setFont("Liberation", "bold");
  doc.setFontSize(15);
  doc.text(`Kwota: ${formatPLN(wycena.kwota)}`, marginX, y);

  const nazwaPliku = `wycena-${(telefon || wycena.id).replace(/\s+/g, "")}.pdf`;
  doc.save(nazwaPliku);
}
