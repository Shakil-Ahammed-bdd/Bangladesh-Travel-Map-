import { useEffect, useMemo, useState } from 'react';
import districtsData from '../data/districtsData';
import { DEFAULT_THEME_ID, THEMES } from '../data/themes';
import { layoutLabels } from '../utils/labels';
import { buildPdf, canvasToBlob, downloadBlob, renderCardCanvas } from '../utils/exportCard';
import './DistrictMap.css';

const DIVISIONS = [
  ['Dhaka', 'ঢাকা বিভাগ'],
  ['Chattogram', 'চট্টগ্রাম বিভাগ'],
  ['Rajshahi', 'রাজশাহী বিভাগ'],
  ['Khulna', 'খুলনা বিভাগ'],
  ['Barishal', 'বরিশাল বিভাগ'],
  ['Sylhet', 'সিলেট বিভাগ'],
  ['Rangpur', 'রংপুর বিভাগ'],
  ['Mymensingh', 'ময়মনসিংহ বিভাগ'],
];

const TEXT = {
  bn: {
    appTitle: 'বাংলাদেশ ভ্রমণ ম্যাপ',
    navHome: 'হোম',
    navMap: 'ম্যাপ',
    navList: 'জেলার তালিকা',
    menu: 'মেনু',
    bannerText: 'যেসব জেলায় ঘুরেছেন সেগুলো বেছে নিন, আর দেখুন আপনার বাংলাদেশ ধীরে ধীরে রঙিন হয়ে উঠছে। তারপর কার্ডটা ডাউনলোড করে বন্ধুদের সাথে শেয়ার করুন।',
    cta: 'ম্যাপ শুরু করুন',
    visitedStat: (n, t) => `${n}/${t} জেলা ঘোরা হয়েছে`,
    eyebrow: 'বাংলাদেশ ভ্রমণ ম্যাপ',
    eyebrowBanner: 'বাংলাদেশের ৬৪ জেলা',
    titleNamed: (n) => `${n}-এর বাংলাদেশ`,
    titleDefault: 'আমার বাংলাদেশ',
    namePh: 'আপনার নাম লিখুন',
    upload: 'ছবি আপলোড',
    change: 'ছবি পাল্টান',
    remove: 'ছবি সরান',
    photoErr: 'ছবিটি পড়া যায়নি, অন্য একটি ছবি চেষ্টা করুন।',
    showNames: 'জেলার নাম দেখতে চাই',
    on: 'চালু',
    off: 'বন্ধ',
    theme: 'থিম',
    download: 'ডাউনলোড',
    exportErr: 'ফাইল তৈরি করা যায়নি, আবার চেষ্টা করুন।',
    pct: (p) => `${p}% বাংলাদেশ ঘোরা হয়েছে`,
    stats: (n, k, t) => `${n}টি জেলা · ${t}টির মধ্যে ${k}টি বিভাগ`,
    search: 'জেলা খুঁজুন...',
    selectAll: 'সব বাছাই করুন',
    clearAll: 'সব মুছুন',
    divAll: 'সব বাছাই',
    mapLabel: 'বাংলাদেশের মানচিত্র',
    note: 'জেলার নামে ক্লিক করলে মানচিত্রে সেই জেলা রঙিন হয়ে যাবে। আপনার অগ্রগতি এই ব্রাউজারে সংরক্ষিত থাকবে।',
    empty: 'কোনো জেলা পাওয়া যায়নি।',
  },
  en: {
    appTitle: 'Bangladesh Travel Map',
    navHome: 'Home',
    navMap: 'Map',
    navList: 'Districts',
    menu: 'Menu',
    bannerText: 'Pick the districts you have visited and watch your Bangladesh fill up with colour. Then download your card and share it with friends.',
    cta: 'Start your map',
    visitedStat: (n, t) => `${n}/${t} districts visited`,
    eyebrow: 'Bangladesh travel map',
    eyebrowBanner: '64 districts of Bangladesh',
    titleNamed: (n) => `${n}'s Bangladesh`,
    titleDefault: 'My Bangladesh',
    namePh: 'Enter your name',
    upload: 'Upload photo',
    change: 'Change photo',
    remove: 'Remove photo',
    photoErr: "Couldn't read that image. Please try another one.",
    showNames: 'I want to see district names',
    on: 'On',
    off: 'Off',
    theme: 'Theme',
    download: 'Download',
    exportErr: "Couldn't create the file. Please try again.",
    pct: (p) => `${p}% of Bangladesh explored`,
    stats: (n, k, t) => `${n} districts · ${k} of ${t} divisions`,
    search: 'Search district...',
    selectAll: 'Select all',
    clearAll: 'Clear all',
    divAll: 'Select all',
    mapLabel: 'Map of Bangladesh',
    note: 'Click a district name to colour it on the map. Your progress is saved in this browser.',
    empty: 'No districts found.',
  },
};

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function formatNum(n, lang) {
  if (lang !== 'bn') return String(n);
  return String(n).replace(/\d/g, (c) => BN_DIGITS[+c]);
}

const STORAGE_KEY = 'bd-visited-districts';
const LANG_KEY = 'bd-lang';
const PROFILE_KEY = 'bd-profile';
const THEME_KEY = 'bd-theme';
const NAMES_KEY = 'bd-show-names';

function read(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}
function loadLang(defaultLang) {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === 'en' || saved === 'bn' ? saved : defaultLang;
  } catch {
    return defaultLang;
  }
}

/** Centre-crops the chosen image to a small square JPEG data URL (keeps localStorage small). */
function fileToAvatar(file, size = 320) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) * 0.2; // bias toward the top so faces stay in frame
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        canvas.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch (e) {
        reject(e);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('bad image'));
    };
    img.src = url;
  });
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="bdmap-avatar-icon">
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor" />
    </svg>
  );
}

/**
 * Interactive Bangladesh district map card (Bangla + English) with a profile
 * photo and name, plus PNG / JPG / PDF download of the card.
 * Props: defaultLang ('bn' | 'en'), default 'bn'.
 *        saveFile(blob, filename) -> Promise, optional custom saver (default: browser download).
 */
export default function DistrictMap({ defaultLang = 'bn', saveFile = downloadBlob }) {
  const [lang, setLang] = useState(() => loadLang(defaultLang));
  const [visited, setVisited] = useState(() => read(STORAGE_KEY, {}));
  const [profile, setProfile] = useState(() => read(PROFILE_KEY, { name: '', photo: '' }));
  const [themeId, setThemeId] = useState(() => {
    const saved = read(THEME_KEY, DEFAULT_THEME_ID);
    return THEMES.some((x) => x.id === saved) ? saved : DEFAULT_THEME_ID;
  });
  const [showNames, setShowNames] = useState(() => read(NAMES_KEY, true) !== false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [exporting, setExporting] = useState('');
  const [exportError, setExportError] = useState(false);
  const [query, setQuery] = useState('');
  const [openDivisions, setOpenDivisions] = useState(() => new Set(['Dhaka', 'Chattogram']));
  const t = TEXT[lang];

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(visited)); } catch { /* ignore */ }
  }, [visited]);
  useEffect(() => {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* ignore */ }
  }, [profile]);
  useEffect(() => {
    try { localStorage.setItem(NAMES_KEY, JSON.stringify(showNames)); } catch { /* ignore */ }
  }, [showNames]);
  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, JSON.stringify(themeId)); } catch { /* ignore */ }
  }, [themeId]);
  useEffect(() => {
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }
    document.documentElement.lang = lang;
  }, [lang]);

  const byDivision = useMemo(() => {
    const map = {};
    districtsData.districts.forEach((d) => {
      (map[d.division_en] = map[d.division_en] || []).push(d);
    });
    Object.values(map).forEach((list) => list.sort((a, b) => a.name_en.localeCompare(b.name_en)));
    return map;
  }, []);

  const total = districtsData.districts.length;
  const count = Object.values(visited).filter(Boolean).length;
  const percent = Math.round((count / total) * 100);
  const divisionsTouched = DIVISIONS.filter(([divEn]) =>
    (byDivision[divEn] || []).some((d) => visited[d.name_en])
  ).length;
  const nameOf = (d) => (lang === 'bn' ? d.name_bn : d.name_en);

  // Names of visited districts, with their label point on the map (empty when the option is off).
  const nameItems = useMemo(
    () =>
      showNames
        ? districtsData.districts
            .filter((d) => visited[d.name_en])
            .map((d) => ({ key: d.name_en, text: lang === 'bn' ? d.name_bn : d.name_en, cx: d.cx, cy: d.cy }))
        : [],
    [showNames, visited, lang]
  );
  const screenLabels = useMemo(
    () =>
      layoutLabels(nameItems, {
        fontSize: 9.5,
        measure: (text) => text.length * 9.5 * 0.62,
        bounds: { width: districtsData.width, height: districtsData.height },
      }),
    [nameItems]
  );
  const cleanName = profile.name.trim();
  const theme = THEMES.find((x) => x.id === themeId) || THEMES[0];
  const c = theme.colors;
  // Visited district buttons in the list use the selected theme's colour.
  const chipStyle = { '--chip-visited': c.accent, '--chip-on': c.onAccent, '--chip-hover': c.accentSoft };
  // These variables are set on the map card only, so the rest of the page keeps its own colours.
  const themeStyle = {
    '--bg': c.panel, '--panel': c.bg, '--ink': c.ink, '--ink-soft': c.soft, '--line': c.line,
    '--green': c.accent, '--green-soft': c.accentSoft, '--sand': c.sand, '--on-accent': c.onAccent,
    '--focus': c.focus, '--err': c.err,
    colorScheme: theme.dark ? 'dark' : 'light',
  };


  function toggle(name) {
    setVisited((prev) => {
      const next = { ...prev };
      if (next[name]) delete next[name];
      else next[name] = true;
      return next;
    });
  }
  function setMany(names, value) {
    setVisited((prev) => {
      const next = { ...prev };
      names.forEach((n) => (value ? (next[n] = true) : delete next[n]));
      return next;
    });
  }
  function toggleDivisionOpen(divEn) {
    setOpenDivisions((prev) => {
      const next = new Set(prev);
      if (next.has(divEn)) next.delete(divEn);
      else next.add(divEn);
      return next;
    });
  }
  async function onPhotoChosen(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    try {
      const photo = await fileToAvatar(file);
      setProfile((p) => ({ ...p, photo }));
      setPhotoError(false);
    } catch {
      setPhotoError(true);
    }
  }

  function goTo(id) {
    setMenuOpen(false);
    const smooth = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const behavior = smooth ? 'smooth' : 'auto';
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior, block: 'start' });
  }

  async function handleExport(format) {
    if (exporting) return;
    setExporting(format);
    setExportError(false);
    try {
      const canvas = await renderCardCanvas({
        labels: {
          eyebrow: t.eyebrow,
          title: cleanName ? t.titleNamed(cleanName) : t.titleDefault,
          count: formatNum(count, lang),
          total: formatNum(total, lang),
          pct: t.pct(formatNum(percent, lang)),
          stats: t.stats(formatNum(count, lang), formatNum(divisionsTouched, lang), formatNum(DIVISIONS.length, lang)),
        },
        percent,
        visited,
        photo: profile.photo,
        data: districtsData,
        colors: { bg: c.bg, panel: c.panel, ink: c.ink, soft: c.soft, sand: c.sand, accent: c.accent },
        names: nameItems,
      });
      let blob;
      if (format === 'png') {
        blob = await canvasToBlob(canvas, 'image/png');
      } else {
        const jpg = await canvasToBlob(canvas, 'image/jpeg', 0.92);
        if (format === 'jpg') blob = jpg;
        else blob = buildPdf(new Uint8Array(await jpg.arrayBuffer()), canvas.width, canvas.height);
      }
      const base = (cleanName.replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '') || 'my') + '-bangladesh-map';
      await saveFile(blob, `${base}.${format}`);
    } catch (e) {
      if (!(e && e.code === 'declined')) setExportError(true);
    } finally {
      setExporting('');
    }
  }

  const q = query.trim().toLowerCase();
  let anyMatch = false;

  const divisionBlocks = DIVISIONS.map(([divEn, divBn]) => {
    const list = byDivision[divEn] || [];
    const visibleList = q
      ? list.filter((d) => (d.name_bn + ' ' + d.name_en).toLowerCase().includes(q))
      : list;
    if (!list.length || (q && !visibleList.length)) return null;
    anyMatch = true;
    const isOpen = q ? true : openDivisions.has(divEn);
    const doneInDiv = list.filter((d) => visited[d.name_en]).length;
    const divLabel = lang === 'bn' ? divBn : `${divEn} Division`;

    return (
      <details key={divEn} className="bdmap-division" open={isOpen}>
        <summary
          onClick={(e) => {
            if (e.target.closest('.bdmap-div-link')) return;
            e.preventDefault();
            if (!q) toggleDivisionOpen(divEn);
          }}
        >
          <span>
            {divLabel}{' '}
            <span className="bdmap-div-count">
              {formatNum(doneInDiv, lang)}/{formatNum(list.length, lang)}
            </span>
          </span>
          <span
            className="bdmap-div-link"
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              const allOn = list.every((d) => visited[d.name_en]);
              setMany(list.map((d) => d.name_en), !allOn);
            }}
          >
            {t.divAll}
          </span>
          <span className="bdmap-arrow">▸</span>
        </summary>
        <div className="bdmap-chip-grid">
          {visibleList.map((d) => (
            <button
              key={d.name_en}
              type="button"
              className={`bdmap-chip ${visited[d.name_en] ? 'visited' : ''}`}
              onClick={() => toggle(d.name_en)}
            >
              {nameOf(d)}
            </button>
          ))}
        </div>
      </details>
    );
  });

  return (
    <div className="bdmap-wrap" id="bdmap-top">
      <nav className="bdmap-nav" aria-label="Main">
        <a className="bdmap-brand" href="#bdmap-top" onClick={(e) => { e.preventDefault(); goTo('top'); }}>
          <span className="bdmap-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
          </span>
          <span className="bdmap-brand-name">{t.appTitle}</span>
        </a>

        <ul className={`bdmap-nav-links ${menuOpen ? 'open' : ''}`} id="bdmap-nav-links">
          {[['top', t.navHome], ['bdmap-map', t.navMap], ['bdmap-districts', t.navList]].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); goTo(id); }}>{label}</a>
            </li>
          ))}
        </ul>

        <div className="bdmap-nav-right">
          <div className="bdmap-lang" role="group" aria-label="Language">
            <button type="button" className={lang === 'bn' ? 'active' : ''} onClick={() => setLang('bn')}>বাংলা</button>
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
          </div>
          <button
            type="button"
            className="bdmap-menu-btn"
            aria-label={t.menu}
            aria-expanded={menuOpen}
            aria-controls="bdmap-nav-links"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <section className="bdmap-banner" aria-labelledby="bdmap-banner-title">
        <svg className="bdmap-banner-map" viewBox={`0 0 ${districtsData.width} ${districtsData.height}`} aria-hidden="true">
          {districtsData.districts.map((d) => (
            <path key={d.name_en} d={d.d} className={visited[d.name_en] ? 'on' : ''} />
          ))}
        </svg>
        <div className="bdmap-banner-body">
          <p className="bdmap-banner-eyebrow">{t.eyebrowBanner}</p>
          <h1 id="bdmap-banner-title" className="bdmap-banner-title">{t.appTitle}</h1>
          <p className="bdmap-banner-text">{t.bannerText}</p>
          <div className="bdmap-banner-actions">
            <button type="button" className="bdmap-cta" onClick={() => goTo('bdmap-map')}>{t.cta}</button>
            <span className="bdmap-banner-stat">{t.visitedStat(formatNum(count, lang), formatNum(total, lang))}</span>
          </div>
        </div>
      </section>

      <div className="bdmap-layout">
        <div id="bdmap-districts" className="bdmap-panel bdmap-sidebar" style={chipStyle}>
          <section className="bdmap-profile">
            <input
              type="text"
              maxLength={40}
              placeholder={t.namePh}
              aria-label={t.namePh}
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            />
            <div className="bdmap-photo-actions">
              <label className="bdmap-btn">
                {profile.photo ? t.change : t.upload}
                <input type="file" accept="image/*" hidden onChange={onPhotoChosen} />
              </label>
              {profile.photo && (
                <button type="button" className="bdmap-btn ghost" onClick={() => setProfile((p) => ({ ...p, photo: '' }))}>
                  {t.remove}
                </button>
              )}
            </div>
            {photoError && <p className="bdmap-error">{t.photoErr}</p>}
          </section>

          <div className="bdmap-search-row">
            <input
              type="text"
              placeholder={t.search}
              aria-label={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="bdmap-bulk-row">
            <button type="button" onClick={() => setMany(districtsData.districts.map((d) => d.name_en), true)}>
              {t.selectAll}
            </button>
            <button type="button" onClick={() => setVisited({})}>{t.clearAll}</button>
          </div>
          {divisionBlocks}
          {q && !anyMatch && <p className="bdmap-empty">{t.empty}</p>}
        </div>

        <div className="bdmap-stage">
        <div id="bdmap-map" className="bdmap-panel bdmap-map-panel" data-theme={theme.id} style={themeStyle}>
          <div className="bdmap-card-head">
            <div className="bdmap-avatar">
              {profile.photo ? <img src={profile.photo} alt={cleanName} /> : <PersonIcon />}
            </div>
            <div className="bdmap-head-text">
              <p className="bdmap-eyebrow">{t.eyebrow}</p>
              <h2 className="bdmap-title">{cleanName ? t.titleNamed(cleanName) : t.titleDefault}</h2>
            </div>
            <div className="bdmap-count">
              {formatNum(count, lang)}
              <span>/{formatNum(total, lang)}</span>
            </div>
          </div>

          <div className="bdmap-map-scroll">
            <svg
              viewBox={`0 0 ${districtsData.width} ${districtsData.height}`}
              role="img"
              aria-label={t.mapLabel}
              className="bdmap-svg"
            >
              {districtsData.districts.map((d) => (
                <path
                  key={d.name_en}
                  d={d.d}
                  tabIndex={0}
                  role="button"
                  aria-label={nameOf(d)}
                  className={visited[d.name_en] ? 'visited' : ''}
                  onClick={() => toggle(d.name_en)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggle(d.name_en);
                    }
                  }}
                >
                  <title>{nameOf(d)}</title>
                </path>
              ))}
              {screenLabels.length > 0 && (
                <g className="bdmap-labels" aria-hidden="true">
                  {screenLabels.map((l) => (
                    <g key={l.key}>
                      <circle cx={l.dotX} cy={l.dotY} r="2.4" className="bdmap-dot" />
                      <text x={l.x} y={l.y} textAnchor={l.anchor}>{l.text}</text>
                    </g>
                  ))}
                </g>
              )}
            </svg>
          </div>

          <div className="bdmap-card-foot">
            <div
              className="bdmap-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <div className="bdmap-progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <div className="bdmap-foot-row">
              <strong>{t.pct(formatNum(percent, lang))}</strong>
              <span>{t.stats(formatNum(count, lang), formatNum(divisionsTouched, lang), formatNum(DIVISIONS.length, lang))}</span>
            </div>
          </div>
        </div>

        {/* controls sit under the card (not part of the downloaded picture) */}
        <div className="bdmap-panel bdmap-controls">
          <label className="bdmap-switch">
            <input type="checkbox" role="switch" checked={showNames} onChange={(e) => setShowNames(e.target.checked)} />
            <span className="bdmap-switch-track" aria-hidden="true" />
            <span>{t.showNames}</span>
            <span className="bdmap-switch-state">{showNames ? t.on : t.off}</span>
          </label>

          <div className="bdmap-actions">
            <div className="bdmap-downloads">
              <span className="bdmap-dl-label">{t.download}:</span>
              {['jpg', 'png', 'pdf'].map((f) => (
                <button
                  key={f}
                  type="button"
                  className="bdmap-btn small"
                  disabled={!!exporting}
                  aria-busy={exporting === f}
                  onClick={() => handleExport(f)}
                >
                  {exporting === f ? '…' : f.toUpperCase()}
                </button>
              ))}
              {exportError && <span className="bdmap-error">{t.exportErr}</span>}
            </div>
            <div className="bdmap-themes" role="group" aria-label={t.theme}>
              <span className="bdmap-dl-label">{t.theme}:</span>
              {THEMES.map((th) => {
                const label = lang === 'bn' ? th.name_bn : th.name_en;
                return (
                  <button
                    key={th.id}
                    type="button"
                    className={`bdmap-swatch ${th.id === themeId ? 'active' : ''}`}
                    style={{ background: `linear-gradient(135deg, ${th.colors.accent} 50%, ${th.colors.sand} 50%)` }}
                    title={label}
                    aria-label={label}
                    aria-pressed={th.id === themeId}
                    onClick={() => setThemeId(th.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
        </div>
      </div>

      <footer className="bdmap-note">{t.note}</footer>
    </div>
  );
}
