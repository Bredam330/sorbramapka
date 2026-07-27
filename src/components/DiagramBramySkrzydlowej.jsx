export default function DiagramBramySkrzydlowej({ a, b, c, d, kat }) {
  const label = (letter, value) => (value ? `${letter} ${value}` : letter);

  return (
    <svg viewBox="0 0 300 210" className="w-full max-w-[280px] mx-auto text-neutral-400">
      {/* ground */}
      <line x1="15" y1="190" x2="290" y2="190" stroke="currentColor" strokeWidth="1.5" />

      {/* post */}
      <rect x="140" y="20" width="44" height="170" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* A: post width, top */}
      <line x1="140" y1="12" x2="184" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="140" y1="8" x2="140" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="184" y1="8" x2="184" y2="16" stroke="currentColor" strokeWidth="1" />
      <text x="162" y="6" textAnchor="middle" fontSize="11" fill="currentColor">
        {label("A", a)}
      </text>

      {/* B: ground to bracket top */}
      <line x1="112" y1="100" x2="112" y2="190" stroke="currentColor" strokeWidth="1" />
      <line x1="107" y1="100" x2="117" y2="100" stroke="currentColor" strokeWidth="1" />
      <line x1="107" y1="190" x2="117" y2="190" stroke="currentColor" strokeWidth="1" />
      <text x="103" y="112" textAnchor="end" fontSize="11" fill="currentColor">
        {label("B", b)}
      </text>

      {/* C: ground to arm pivot, nested inside B */}
      <line x1="88" y1="132" x2="88" y2="190" stroke="currentColor" strokeWidth="1" />
      <line x1="83" y1="132" x2="93" y2="132" stroke="currentColor" strokeWidth="1" />
      <line x1="83" y1="190" x2="93" y2="190" stroke="currentColor" strokeWidth="1" />
      <text x="79" y="184" textAnchor="end" fontSize="11" fill="currentColor">
        {label("C", c)}
      </text>

      {/* arm pivot + arm */}
      <circle cx="140" cy="132" r="3" fill="currentColor" />
      <line x1="140" y1="132" x2="252" y2="110" stroke="currentColor" strokeWidth="2" />
      <text x="196" y="98" textAnchor="middle" fontSize="11" fill="currentColor">
        {label("D", d)}
      </text>

      {/* swing arc + angle */}
      <path
        d="M 252 110 A 122 122 0 0 1 200 190"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <text x="222" y="168" fontSize="11" fill="currentColor">
        {label("α", kat ? `${kat}°` : "")}
      </text>
    </svg>
  );
}
