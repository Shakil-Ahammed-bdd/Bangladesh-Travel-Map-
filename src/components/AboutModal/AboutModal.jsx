import { useEffect, useRef } from 'react';
import { CREATOR } from '../../data/creator';
import './AboutModal.css';

/**
 * The "Made by" pop-up card: photo, name, short text and social buttons.
 * Closes with the ✕ button, the Esc key, or a click outside the card.
 * While it is open the page behind does not scroll, and on close the focus goes back to the button that opened it.
 */
export default function AboutModal({ t, onClose }) {
  const closeBtnRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement; // the button that opened the card
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    const focusTimer = setTimeout(() => closeBtnRef.current && closeBtnRef.current.focus(), 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      clearTimeout(focusTimer);
      if (opener && opener.focus) opener.focus();
    };
  }, []);

  // keep Tab inside the card while it is open
  function keepFocusInside(e) {
    if (e.key !== 'Tab') return;
    const items = e.currentTarget.querySelectorAll('button, a[href]');
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="bdmap-modal-backdrop" onClick={onClose}>
      <div
        className="bdmap-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bdmap-about-name"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={keepFocusInside}
      >
        <img className="bdmap-modal-photo" src={CREATOR.photo} alt={CREATOR.name} />
        <button type="button" className="bdmap-modal-close" ref={closeBtnRef} aria-label={t.close} onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
        </button>

        <div className="bdmap-modal-body">
          <h2 id="bdmap-about-name" className="bdmap-modal-name">{CREATOR.name}</h2>
          <p className="bdmap-modal-role">{t.aboutRole}</p>
          <p className="bdmap-modal-text">{t.aboutText}</p>
          <p className="bdmap-modal-connect">{t.connect}</p>
          <ul className="bdmap-modal-social">
            {CREATOR.links.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${CREATOR.name} — ${l.label}`} title={l.label} style={{ background: l.color }}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={l.path} /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
