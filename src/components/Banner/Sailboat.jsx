import './Sailboat.css';

export default function Sailboat() {
  return (
    <div className="bdmap-sailboat" aria-hidden="true">
      <div className="bdmap-sailboat__orientation">
        <svg className="bdmap-sailboat__art" viewBox="0 0 160 90">
          <path className="bdmap-sailboat__mast" d="M79 13v57" />
          <path className="bdmap-sailboat__sail bdmap-sailboat__sail--light" d="M75 19 43 61h32Z" />
          <path className="bdmap-sailboat__sail bdmap-sailboat__sail--warm" d="M84 25 116 61H84Z" />
          <path className="bdmap-sailboat__hull" d="M22 65q58 15 116 0l-15 14q-43 13-86 0Z" />
          <path className="bdmap-sailboat__waterline" d="M30 84q48-8 96 0" />
          <circle className="bdmap-sailboat__sun" cx="80" cy="61" r="3" />
        </svg>
      </div>
    </div>
  );
}
