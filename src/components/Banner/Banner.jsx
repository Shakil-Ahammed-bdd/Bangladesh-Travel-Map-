import districtsData from '../../data/districtsData';
import { formatNum } from '../../utils/format';
import RiverLandscape from './RiverLandscape';
import RiverWater from './RiverWater';
import Sailboat from './Sailboat';
import Sun from './Sun';
import SunReflection from './SunReflection';
import SunsetBackground from './SunsetBackground';
import WaterLilyCollection from './WaterLilyCollection';
import WaterWaves from './WaterWaves';
import './Banner.css';

/**
 * Sunset river hero section; the map, copy, CTA, and visit count remain interactive.
 */
export default function Banner({ t, lang, visited, count, total, onStart }) {
  return (
    <section className="bdmap-banner" aria-labelledby="bdmap-banner-title">
      <SunsetBackground />
      <Sun />
      <RiverLandscape />
      <RiverWater />
      <SunReflection />
      <WaterWaves />
      <Sailboat />
      <WaterLilyCollection />

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
