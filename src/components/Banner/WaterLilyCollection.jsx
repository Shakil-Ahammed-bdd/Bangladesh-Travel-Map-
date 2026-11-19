import WaterLily from './WaterLily';
import './WaterLilyCollection.css';

const lilies = [
  { className: 'bdmap-water-lily--one', delay: '0s', scale: 1.08 },
  { className: 'bdmap-water-lily--two', delay: '3s', scale: 0.84 },
  { className: 'bdmap-water-lily--three', delay: '6s', scale: 0.94 },
  { className: 'bdmap-water-lily--four', delay: '9s', scale: 0.78 },
];

export default function WaterLilyCollection() {
  return (
    <div className="bdmap-water-lilies" aria-hidden="true">
      {lilies.map((lily) => <WaterLily key={lily.className} {...lily} />)}
    </div>
  );
}
