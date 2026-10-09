import BrandMark from '../shared/BrandMark';
import { CREATOR } from '../../data/creator';
import './Footer.css';

/** Green footer: name + tagline, the "Made by" button (opens the about card) and social icons. */
export default function Footer({ t, onOpenAbout }) {
  return (
    <footer className="bdmap-footer">
      <div className="bdmap-footer-main">
        <div className="bdmap-footer-brand">
          <BrandMark />
          <div>
            <p className="bdmap-footer-title">{t.appTitle}</p>
            <p className="bdmap-footer-tagline">{t.tagline}</p>
          </div>
        </div>

        <div className="bdmap-footer-credit">
          <button type="button" className="bdmap-madeby bdmap-madeby-footer" onClick={onOpenAbout}>
            <img src={CREATOR.photo} alt="" />
            <span>{t.madeBy} <strong>{CREATOR.name}</strong></span>
          </button>

          <ul className="bdmap-social" aria-label={t.findMe}>
            {CREATOR.links.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${CREATOR.name} — ${l.label}`} title={l.label}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={l.path} /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="bdmap-footer-copy">© {new Date().getFullYear()} {t.appTitle} · {CREATOR.name}. {t.rights}</p>
    </footer>
  );
}
