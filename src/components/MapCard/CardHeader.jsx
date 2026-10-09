function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="bdmap-avatar-icon">
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor" />
    </svg>
  );
}

/** Top of the card: photo, "<name>-এর বাংলাদেশ" and the big visited count. */
export default function CardHeader({ labels, name, photo }) {
  return (
    <div className="bdmap-card-head">
      <div className="bdmap-avatar">
        {photo ? <img src={photo} alt={name} /> : <PersonIcon />}
      </div>
      <div className="bdmap-head-text">
        <p className="bdmap-eyebrow">{labels.eyebrow}</p>
        <h2 className="bdmap-title">{labels.title}</h2>
      </div>
      <div className="bdmap-count">
        {labels.count}
        <span>/{labels.total}</span>
      </div>
    </div>
  );
}
