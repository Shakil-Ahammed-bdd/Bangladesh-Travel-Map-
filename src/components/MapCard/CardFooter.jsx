/** Bottom of the card: progress bar, "৯% বাংলাদেশ ঘোরা হয়েছে" and the district/division counts. */
export default function CardFooter({ labels, percent }) {
  return (
    <div className="bdmap-card-foot">
      <div className="bdmap-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="bdmap-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="bdmap-foot-row">
        <strong>{labels.pct}</strong>
        <span>{labels.stats}</span>
      </div>
    </div>
  );
}
