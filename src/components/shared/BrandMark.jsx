import './BrandMark.css';

/** The little map-pin logo used in the navbar and the footer. */
export default function BrandMark() {
  return (
    <span className="bdmap-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
    </span>
  );
}
