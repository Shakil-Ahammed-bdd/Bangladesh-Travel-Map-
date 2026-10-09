import CardHeader from './CardHeader';
import BangladeshMap from './BangladeshMap';
import CardFooter from './CardFooter';
import './MapCard.css';

/**
 * The shareable card (this is what gets downloaded as JPG / PNG / PDF).
 * themeStyle sets the card's colours; labels holds the texts (see utils/cardText.js).
 */
export default function MapCard({ lang, mapLabel, themeId, themeStyle, labels, profile, visited, nameItems, percent, onToggle }) {
  return (
    <div id="bdmap-map" className="bdmap-panel bdmap-map-panel" data-theme={themeId} style={themeStyle}>
      <CardHeader labels={labels} name={profile.name.trim()} photo={profile.photo} />

      <div className="bdmap-map-scroll">
        <BangladeshMap lang={lang} mapLabel={mapLabel} visited={visited} nameItems={nameItems} onToggle={onToggle} />
      </div>

      <CardFooter labels={labels} percent={percent} />
    </div>
  );
}
