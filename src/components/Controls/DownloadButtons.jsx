const FORMATS = ['jpg', 'png', 'pdf'];

/** "Download: JPG | PNG | PDF". `exporting` is the format being made right now (or ''). */
export default function DownloadButtons({ t, exporting, exportError, onExport }) {
  return (
    <div className="bdmap-downloads">
      <span className="bdmap-dl-label">{t.download}:</span>
      {FORMATS.map((f) => (
        <button
          key={f}
          type="button"
          className="bdmap-btn small"
          disabled={!!exporting}
          aria-busy={exporting === f}
          onClick={() => onExport(f)}
        >
          {exporting === f ? '…' : f.toUpperCase()}
        </button>
      ))}
      {exportError && <span className="bdmap-error">{t.exportErr}</span>}
    </div>
  );
}
