import { THEMES } from '../../data/themes';

/** Round colour buttons — pick a theme for the map card. */
export default function ThemePicker({ t, lang, themeId, onChange }) {
  return (
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
            onClick={() => onChange(th.id)}
          />
        );
      })}
    </div>
  );
}
