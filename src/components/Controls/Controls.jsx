import NamesSwitch from './NamesSwitch';
import DownloadButtons from './DownloadButtons';
import ThemePicker from './ThemePicker';
import './Controls.css';

/** The box under the card: names switch, download buttons and theme colours. (Not part of the downloaded picture.) */
export default function Controls({ t, lang, showNames, onShowNamesChange, exporting, exportError, onExport, themeId, onThemeChange }) {
  return (
    <div className="bdmap-panel bdmap-controls">
      <NamesSwitch t={t} checked={showNames} onChange={onShowNamesChange} />
      <div className="bdmap-actions">
        <DownloadButtons t={t} exporting={exporting} exportError={exportError} onExport={onExport} />
        <ThemePicker t={t} lang={lang} themeId={themeId} onChange={onThemeChange} />
      </div>
    </div>
  );
}
