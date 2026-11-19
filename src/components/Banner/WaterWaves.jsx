import './WaterWaves.css';

export default function WaterWaves() {
  return (
    <svg className="bdmap-water-waves" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <path id="bdmap-wave-upper" d="M0 25Q60 8 120 25t120 0" />
        <path id="bdmap-wave-lower" d="M0 25Q60 42 120 25t120 0" />
      </defs>
      <g className="bdmap-water-waves__track bdmap-water-waves__track--slow">
        {[0, 240, 480, 720, 960, 1200].map((x) => <use key={`upper-${x}`} href="#bdmap-wave-upper" x={x} y="14" />)}
        {[0, 240, 480, 720, 960, 1200].map((x) => <use key={`lower-${x}`} href="#bdmap-wave-lower" x={x} y="74" />)}
      </g>
      <g className="bdmap-water-waves__track bdmap-water-waves__track--fast">
        {[0, 240, 480, 720, 960, 1200].map((x) => <use key={`lower-${x}`} href="#bdmap-wave-lower" x={x} y="128" />)}
        {[0, 240, 480, 720, 960, 1200].map((x) => <use key={`upper-${x}`} href="#bdmap-wave-upper" x={x} y="176" />)}
      </g>
    </svg>
  );
}
