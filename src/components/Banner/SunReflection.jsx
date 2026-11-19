import './SunReflection.css';

export default function SunReflection() {
  return (
    <svg className="bdmap-sun-reflection" viewBox="0 0 800 260" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="bdmap-reflection-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe7ad" stopOpacity=".72" />
          <stop offset="1" stopColor="#f4b783" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="bdmap-sun-reflection__glow" d="M365 0h70l180 260H185Z" fill="url(#bdmap-reflection-fade)" />
      <g className="bdmap-sun-reflection__glints" fill="#ffe5aa">
        <path d="M354 15h92v4h-92zm-27 18h146v3H327zm24 19h98v4h-98zm-74 25h247v3H277zm35 21h178v4H312zm-81 27h340v4H231zm58 26h225v4H289zm-105 29h435v5H184zm42 28h348v4H226zm-137 31h622v5H89z" />
      </g>
    </svg>
  );
}
