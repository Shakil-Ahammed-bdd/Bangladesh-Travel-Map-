// The whole page. This file only holds the data (state) and hands it to the small components.
//
//   Navbar      top bar                      Banner     green hero section
//   Sidebar     name/photo + district list   MapCard    the shareable card with the map
//   Controls    names switch, download, theme  Footer   footer + "Made by" button
//   AboutModal  the pop-up card about the creator

import { useEffect, useMemo, useState } from 'react';

import '../styles/base.css'; // colours, fonts, shared buttons — keep this first

import Navbar from './Navbar/Navbar';
import Banner from './Banner/Banner';
import Sidebar from './Sidebar/Sidebar';
import MapCard from './MapCard/MapCard';
import Controls from './Controls/Controls';
import Footer from './Footer/Footer';
import AboutModal from './AboutModal/AboutModal';

import districtsData from '../data/districtsData';
import { DEFAULT_THEME_ID, THEMES, cardThemeStyle, chipThemeStyle, getTheme } from '../data/themes';
import { TEXT } from '../data/texts';
import { usePersistentState } from '../hooks/usePersistentState';
import { useCardExport } from '../hooks/useCardExport';
import { downloadBlob } from '../utils/exportCard';
import { buildCardLabels } from '../utils/cardText';
import { fileBaseName } from '../utils/format';
import { scrollToSection } from '../utils/scroll';

import '../styles/layout.css'; // where each part sits on the page — keep this last

/**
 * Props (all optional):
 *   defaultLang  'bn' | 'en'                                   (default 'bn')
 *   saveFile     (blob, filename) => Promise — custom saver    (default: normal browser download)
 */
export default function DistrictMap({ defaultLang = 'bn', saveFile = downloadBlob }) {
  // ---- things we remember between visits (saved in the browser) ----
  const [lang, setLang] = usePersistentState('bd-lang', defaultLang, (v) => v === 'bn' || v === 'en');
  const [visited, setVisited] = usePersistentState('bd-visited-districts', {}); // { Dhaka: true, ... }
  const [profile, setProfile] = usePersistentState('bd-profile', { name: '', photo: '' });
  const [themeId, setThemeId] = usePersistentState('bd-theme', DEFAULT_THEME_ID, (v) => THEMES.some((th) => th.id === v));
  const [showNames, setShowNames] = usePersistentState('bd-show-names', true, (v) => typeof v === 'boolean');

  // ---- things that only matter right now ----
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const t = TEXT[lang];
  const { exporting, exportError, exportCard } = useCardExport(saveFile);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // ---- numbers worked out from the visited districts ----
  const total = districtsData.districts.length;
  const count = Object.values(visited).filter(Boolean).length;
  const percent = Math.round((count / total) * 100);
  const cleanName = profile.name.trim();

  const theme = getTheme(themeId);
  const cardLabels = buildCardLabels({ t, lang, name: cleanName, count, total, percent, visited });

  // names to print on the map: only visited districts, and only when the switch is on
  const nameItems = useMemo(
    () =>
      showNames
        ? districtsData.districts
            .filter((d) => visited[d.name_en])
            .map((d) => ({ key: d.name_en, text: lang === 'bn' ? d.name_bn : d.name_en, cx: d.cx, cy: d.cy }))
        : [],
    [showNames, visited, lang]
  );

  // ---- actions ----
  function toggleDistrict(name) {
    setVisited((prev) => {
      const next = { ...prev };
      if (next[name]) delete next[name];
      else next[name] = true;
      return next;
    });
  }

  function setManyDistricts(names, value) {
    setVisited((prev) => {
      const next = { ...prev };
      names.forEach((n) => (value ? (next[n] = true) : delete next[n]));
      return next;
    });
  }

  function goTo(id) {
    setMenuOpen(false);
    scrollToSection(id);
  }

  function handleExport(format) {
    const c = theme.colors;
    exportCard(format, {
      fileBase: fileBaseName(cleanName),
      render: {
        labels: cardLabels,
        percent,
        visited,
        photo: profile.photo,
        data: districtsData,
        colors: { bg: c.bg, panel: c.panel, ink: c.ink, soft: c.soft, sand: c.sand, accent: c.accent },
        names: nameItems,
      },
    });
  }

  return (
    <div className="bdmap-wrap" id="bdmap-top">
      <Navbar
        t={t}
        lang={lang}
        onLangChange={setLang}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        onNavigate={goTo}
      />

      <Banner t={t} lang={lang} visited={visited} count={count} total={total} onStart={() => goTo('bdmap-map')} />

      <div className="bdmap-layout">
        <Sidebar
          t={t}
          lang={lang}
          chipStyle={chipThemeStyle(theme)}
          profile={profile}
          onProfileChange={(patch) => setProfile((p) => ({ ...p, ...patch }))}
          visited={visited}
          onToggle={toggleDistrict}
          onSetMany={setManyDistricts}
          onClearAll={() => setVisited({})}
        />

        <div className="bdmap-stage">
          <MapCard
            lang={lang}
            mapLabel={t.mapLabel}
            themeId={theme.id}
            themeStyle={cardThemeStyle(theme)}
            labels={cardLabels}
            profile={profile}
            visited={visited}
            nameItems={nameItems}
            percent={percent}
            onToggle={toggleDistrict}
          />
          <Controls
            t={t}
            lang={lang}
            showNames={showNames}
            onShowNamesChange={setShowNames}
            exporting={exporting}
            exportError={exportError}
            onExport={handleExport}
            themeId={themeId}
            onThemeChange={setThemeId}
          />
        </div>
      </div>

      <p className="bdmap-note">{t.note}</p>

      <Footer t={t} onOpenAbout={() => setAboutOpen(true)} />

      {aboutOpen && <AboutModal t={t} onClose={() => setAboutOpen(false)} />}
    </div>
  );
}
