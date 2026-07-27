export default function DiagramBramySkrzydlowej({ a, b, c, d, kat }) {
  const label = (letter, value) => (value ? `${letter} ${value}` : letter);

  return (
    <svg viewBox="0 0 320 230" className="w-full max-w-[280px] mx-auto text-neutral-400">
      {/* ground */}
      <line x1="20" y1="210" x2="300" y2="210" stroke="currentColor" strokeWidth="1.5" />

      {/* gate leaf profile (block) */}
      <rect x="150" y="20" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* A: block width, top */}
      <line x1="150" y1="12" x2="200" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="150" y1="8" x2="150" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="200" y1="8" x2="200" y2="16" stroke="currentColor" strokeWidth="1" />
      <text x="175" y="6" textAnchor="middle" fontSize="11" fill="currentColor">
        {label("A", a)}
      </text>

      {/* B: top of block to pivot */}
      <line x1="120" y1="20" x2="120" y2="140" stroke="currentColor" strokeWidth="1" />
      <line x1="115" y1="20" x2="125" y2="20" stroke="currentColor" strokeWidth="1" />
      <line x1="115" y1="140" x2="125" y2="140" stroke="currentColor" strokeWidth="1" />
      <text x="111" y="45" textAnchor="end" fontSize="11" fill="currentColor">
        {label("B", b)}
      </text>

      {/* C: bottom of block to pivot, nested */}
      <line x1="136" y1="70" x2="136" y2="140" stroke="currentColor" strokeWidth="1" />
      <line x1="131" y1="70" x2="141" y2="70" stroke="currentColor" strokeWidth="1" />
      <line x1="131" y1="140" x2="141" y2="140" stroke="currentColor" strokeWidth="1" />
      <text x="127" y="130" textAnchor="end" fontSize="11" fill="currentColor">
        {label("C", c)}
      </text>

      {/* pivot + horizontal arm */}
      <circle cx="165" cy="140" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="169" y1="140" x2="265" y2="140" stroke="currentColor" strokeWidth="2" />
      <circle cx="270" cy="140" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* D: arm length, horizontal above the arm */}
      <line x1="165" y1="122" x2="270" y2="122" stroke="currentColor" strokeWidth="1" />
      <line x1="165" y1="118" x2="165" y2="126" stroke="currentColor" strokeWidth="1" />
      <line x1="270" y1="118" x2="270" y2="126" stroke="currentColor" strokeWidth="1" />
      <text x="217" y="114" textAnchor="middle" fontSize="11" fill="currentColor">
        {label("D", d)}
      </text>

      {/* swing arc to closed-leaf position + angle */}
      <path
        d="M 270 140 A 140 140 0 0 1 205 210"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <line x1="205" y1="140" x2="205" y2="210" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
      <text x="238" y="180" fontSize="11" fill="currentColor">
        {label("α", kat ? `${kat}°` : "")}
      </text>
    </svg>
  );
}
