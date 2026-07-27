export default function DiagramBramySkrzydlowej({ a, b, c, d, kat }) {
  const label = (value, unit) => (value ? `${value}${unit}` : "");

  return (
    <svg viewBox="0 0 320 250" className="w-full max-w-xs mx-auto text-neutral-400">
      <line x1="20" y1="228" x2="300" y2="228" stroke="currentColor" strokeWidth="1.5" />

      <rect x="92" y="40" width="46" height="188" fill="none" stroke="currentColor" strokeWidth="1.5" />

      <line x1="92" y1="24" x2="138" y2="24" stroke="currentColor" strokeWidth="1" />
      <line x1="92" y1="19" x2="92" y2="29" stroke="currentColor" strokeWidth="1" />
      <line x1="138" y1="19" x2="138" y2="29" stroke="currentColor" strokeWidth="1" />
      <text x="115" y="14" textAnchor="middle" fontSize="11" fill="currentColor">
        A {label(a, "")}
      </text>

      <line x1="70" y1="120" x2="70" y2="228" stroke="currentColor" strokeWidth="1" />
      <line x1="65" y1="120" x2="75" y2="120" stroke="currentColor" strokeWidth="1" />
      <line x1="65" y1="228" x2="75" y2="228" stroke="currentColor" strokeWidth="1" />
      <text x="50" y="178" fontSize="11" fill="currentColor">
        B {label(b, "")}
      </text>

      <line x1="52" y1="150" x2="52" y2="228" stroke="currentColor" strokeWidth="1" />
      <line x1="47" y1="150" x2="57" y2="150" stroke="currentColor" strokeWidth="1" />
      <line x1="47" y1="228" x2="57" y2="228" stroke="currentColor" strokeWidth="1" />
      <text x="32" y="193" fontSize="11" fill="currentColor">
        C {label(c, "")}
      </text>

      <circle cx="138" cy="150" r="3" fill="currentColor" />
      <line x1="138" y1="150" x2="262" y2="128" stroke="currentColor" strokeWidth="2" />
      <text x="205" y="115" textAnchor="middle" fontSize="11" fill="currentColor">
        D {label(d, "")}
      </text>

      <path d="M 262 128 A 132 132 0 0 1 178 228" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
      <text x="228" y="198" fontSize="11" fill="currentColor">
        α {label(kat, "°")}
      </text>
    </svg>
  );
}
