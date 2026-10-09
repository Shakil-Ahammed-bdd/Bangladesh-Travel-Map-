import BrandMark from '../shared/BrandMark';
import LanguageToggle from './LanguageToggle';
import './Navbar.css';

/**
 * Top bar: logo + name, page links, language switch, and a menu button on phones.
 * onNavigate(id) scrolls to a section ("top", "bdmap-map", "bdmap-districts").
 */
export default function Navbar({ t, lang, onLangChange, menuOpen, onMenuToggle, onNavigate }) {
  const links = [
    ['top', t.navHome],
    ['bdmap-map', t.navMap],
    ['bdmap-districts', t.navList],
  ];

  return (
    <nav className="bdmap-nav" aria-label="Main">
      <a className="bdmap-brand" href="#bdmap-top" onClick={(e) => { e.preventDefault(); onNavigate('top'); }}>
        <BrandMark />
        <span className="bdmap-brand-name">{t.appTitle}</span>
      </a>

      <ul className={`bdmap-nav-links ${menuOpen ? 'open' : ''}`} id="bdmap-nav-links">
        {links.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} onClick={(e) => { e.preventDefault(); onNavigate(id); }}>{label}</a>
          </li>
        ))}
      </ul>

      <div className="bdmap-nav-right">
        <LanguageToggle lang={lang} onChange={onLangChange} />
        <button
          type="button"
          className="bdmap-menu-btn"
          aria-label={t.menu}
          aria-expanded={menuOpen}
          aria-controls="bdmap-nav-links"
          onClick={onMenuToggle}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
