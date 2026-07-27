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

      {/* gate leaf / post profile, hatched to read as solid section */}
      <rect x="150" y="20" width="50" height="50" fill="url(#hatch)" stroke="currentColor" strokeWidth="1.5" />

      {/* A: block width, top */}
      <line x1="150" y1="8" x2="150" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="200" y1="8" x2="200" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="152" y1="12" x2="198" y2="12" stroke="currentColor" strokeWidth="1" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x="175" y="6" textAnchor="middle" fontSize="11" fill="currentColor">
        {label("A", a)}
      </text>

      {/* B: ground to top of post */}
      <line x1="104" y1="20" x2="120" y2="20" stroke="currentColor" strokeWidth="1" />
      <line x1="104" y1="210" x2="120" y2="210" stroke="currentColor" strokeWidth="1" />
      <line x1="112" y1="22" x2="112" y2="208" stroke="currentColor" strokeWidth="1" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x="103" y="115" textAnchor="end" fontSize="11" fill="currentColor">
        {label("B", b)}
      </text>

      {/* C: ground to arm pivot, mounted near the bottom of the post */}
      <line x1="122" y1="85" x2="138" y2="85" stroke="currentColor" strokeWidth="1" />
      <line x1="122" y1="210" x2="138" y2="210" stroke="currentColor" strokeWidth="1" />
      <line x1="130" y1="87" x2="130" y2="208" stroke="currentColor" strokeWidth="1" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x="121" y="150" textAnchor="end" fontSize="11" fill="currentColor">
        {label("C", c)}
      </text>

      {/* arm, angled upward from the pivot at the base of the post to the leaf bracket */}
      <line x1="150" y1="85" x2="250" y2="45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="181" y1="76" x2="189" y2="66" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="211" y1="64" x2="219" y2="54" stroke="#0a0a0a" strokeWidth="1.5" />

      {/* pivot (hinge plate + bolt), mounted on the post near its base */}
      <circle cx="150" cy="85" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="150" cy="85" r="2" fill="currentColor" />

      {/* knuckle at the leaf bracket */}
      <circle cx="250" cy="45" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="250" cy="45" r="2" fill="currentColor" />

      {/* D: arm length, dimension line offset parallel to the arm */}
      <line x1="150" y1="85" x2="144.8" y2="72" stroke="currentColor" strokeWidth="1" />
      <line x1="250" y1="45" x2="244.8" y2="32" stroke="currentColor" strokeWidth="1" />
      <line x1="144.8" y1="72" x2="244.8" y2="32" stroke="currentColor" strokeWidth="1" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x="193" y="42" textAnchor="middle" fontSize="11" fill="currentColor">
        {label("D", d)}
      </text>

      {/* swing arc to the closed-leaf ghost position */}
      <path
        d="M 250 45 A 175 175 0 0 1 216 210"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <path d="M 235 85 A 42 42 0 0 1 220 122" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <text x="245" y="110" fontSize="11" fill="currentColor">
        {label("α", kat ? `${kat}°` : "")}
      </text>

      {/* closed-leaf ghost position */}
      <rect x="208" y="47" width="8" height="163" fill="url(#hatch)" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}
