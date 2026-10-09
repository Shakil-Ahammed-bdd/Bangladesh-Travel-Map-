import districtsData from '../../data/districtsData';
import { formatNum } from '../../utils/format';
import './Banner.css';

/**
 * Green hero section at the top: title, short text, "start" button and a progress chip.
 * The faint map on the right fills in as the visitor marks districts.
 */
export default function Banner({ t, lang, visited, count, total, onStart }) {
  return (
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
          <button type="button" className="bdmap-cta" onClick={onStart}>{t.cta}</button>
          <span className="bdmap-banner-stat">{t.visitedStat(formatNum(count, lang), formatNum(total, lang))}</span>
        </div>
      </div>
    </section>
  );
}
