export function formatPLN(value) {
  return `${Number(value ?? 0).toFixed(2).replace(".", ",")} zł`;
}

export const MIESIACE = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];
