export default function DiagramBramySkrzydlowej({ a, b, c, d, kat }) {
  const label = (letter, value) => (value ? `${letter} ${value}` : letter);

  return (
    <svg viewBox="0 0 320 240" className="w-full max-w-[300px] mx-auto text-neutral-400">
      <defs>
        <marker id="dimArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="currentColor" />
        </marker>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        </pattern>
      </defs>

      {/* ground */}
      <line x1="20" y1="210" x2="300" y2="210" stroke="currentColor" strokeWidth="1.5" />
      <rect x="20" y="210" width="280" height="12" fill="url(#hatch)" />

      {/* gate leaf profile (block), hatched to read as solid section */}
      <rect x="150" y="20" width="50" height="50" fill="url(#hatch)" stroke="currentColor" strokeWidth="1.5" />

      {/* mounting bracket from block down to pivot */}
      <rect x="158" y="70" width="14" height="70" fill="none" stroke="currentColor" strokeWidth="1" />

      {/* A: block width, top */}
      <line x1="150" y1="8" x2="150" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="200" y1="8" x2="200" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="152" y1="12" x2="198" y2="12" stroke="currentColor" strokeWidth="1" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x="175" y="6" textAnchor="middle" fontSize="11" fill="currentColor">
        {label("A", a)}
      </text>

      {/* B: top of block to pivot */}
      <line x1="112" y1="20" x2="128" y2="20" stroke="currentColor" strokeWidth="1" />
      <line x1="112" y1="140" x2="128" y2="140" stroke="currentColor" strokeWidth="1" />
      <line x1="120" y1="22" x2="120" y2="138" stroke="currentColor" strokeWidth="1" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x="111" y="45" textAnchor="end" fontSize="11" fill="currentColor">
        {label("B", b)}
      </text>

      {/* C: bottom of block to pivot, nested */}
      <line x1="128" y1="70" x2="144" y2="70" stroke="currentColor" strokeWidth="1" />
      <line x1="128" y1="140" x2="144" y2="140" stroke="currentColor" strokeWidth="1" />
      <line x1="136" y1="72" x2="136" y2="138" stroke="currentColor" strokeWidth="1" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x="127" y="130" textAnchor="end" fontSize="11" fill="currentColor">
        {label("C", c)}
      </text>

      {/* pivot (hinge plate + bolt) */}
      <circle cx="165" cy="140" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="165" cy="140" r="2" fill="currentColor" />

      {/* arm with adjustment slots */}
      <line x1="171" y1="140" x2="259" y2="140" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="195" y1="136" x2="195" y2="144" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="191" y1="140" x2="199" y2="140" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="225" y1="136" x2="225" y2="144" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="221" y1="140" x2="229" y2="140" stroke="#0a0a0a" strokeWidth="1.5" />

      {/* knuckle at gate end */}
      <circle cx="265" cy="140" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="265" cy="140" r="2" fill="currentColor" />

      {/* D: arm length, horizontal above the arm */}
      <line x1="171" y1="118" x2="171" y2="126" stroke="currentColor" strokeWidth="1" />
      <line x1="265" y1="118" x2="265" y2="126" stroke="currentColor" strokeWidth="1" />
      <line x1="173" y1="122" x2="263" y2="122" stroke="currentColor" strokeWidth="1" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x="217" y="114" textAnchor="middle" fontSize="11" fill="currentColor">
        {label("D", d)}
      </text>

      {/* swing arc to closed-leaf position */}
      <path
        d="M 265 140 A 140 140 0 0 1 200 210"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      {/* angle arc at the pivot */}
      <path d="M 205 140 A 40 40 0 0 1 191 176" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <text x="222" y="168" fontSize="11" fill="currentColor">
        {label("α", kat ? `${kat}°` : "")}
      </text>

      {/* closed-leaf ghost position */}
      <rect x="196" y="142" width="8" height="68" fill="url(#hatch)" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}
