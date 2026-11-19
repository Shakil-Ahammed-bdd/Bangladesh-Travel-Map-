import './WaterLilyBloom.css';

export default function WaterLilyBloom() {
  return (
    <svg className="bdmap-water-lily-bloom" viewBox="0 0 100 82" aria-hidden="true">
      <g className="bdmap-water-lily-bloom__petals">
        <path className="bdmap-water-lily-bloom__petal bdmap-water-lily-bloom__petal--back" d="M50 68C34 57 29 39 40 22c9 12 12 27 10 46Z" />
        <path className="bdmap-water-lily-bloom__petal bdmap-water-lily-bloom__petal--back" d="M50 68c16-11 21-29 10-46-9 12-12 27-10 46Z" />
        <path className="bdmap-water-lily-bloom__petal" d="M49 68C20 63 17 43 27 31c12 5 20 18 22 37Z" />
        <path className="bdmap-water-lily-bloom__petal" d="M51 68c29-5 32-25 22-37-12 5-20 18-22 37Z" />
        <path className="bdmap-water-lily-bloom__petal bdmap-water-lily-bloom__petal--front" d="M50 69C30 58 31 41 39 32c8 7 11 19 11 37Z" />
        <path className="bdmap-water-lily-bloom__petal bdmap-water-lily-bloom__petal--front" d="M50 69c20-11 19-28 11-37-8 7-11 19-11 37Z" />
      </g>
      <circle className="bdmap-water-lily-bloom__center" cx="50" cy="65" r="5" />
    </svg>
  );
}
