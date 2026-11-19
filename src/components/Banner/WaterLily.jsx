import WaterLilyBloom from './WaterLilyBloom';
import './WaterLily.css';

export default function WaterLily({ className = '', delay = '0s', scale = 1 }) {
  return (
    <div
      className={`bdmap-water-lily ${className}`.trim()}
      style={{ '--lily-delay': delay, '--lily-scale': scale }}
      aria-hidden="true"
    >
      <span className="bdmap-water-lily__leaf bdmap-water-lily__leaf--left" />
      <span className="bdmap-water-lily__leaf bdmap-water-lily__leaf--right" />
      <span className="bdmap-water-lily__ripple" />
      <WaterLilyBloom />
    </div>
  );
}
