import ProfileForm from './ProfileForm';
import DistrictList from './DistrictList';
import './Sidebar.css';

/** Left column: your name/photo, then the list of districts to tick off. */
export default function Sidebar({ t, lang, chipStyle, profile, onProfileChange, visited, onToggle, onSetMany, onClearAll }) {
  return (
    <div id="bdmap-districts" className="bdmap-panel bdmap-sidebar" style={chipStyle}>
      <ProfileForm t={t} profile={profile} onChange={onProfileChange} />
      <DistrictList
        t={t}
        lang={lang}
        visited={visited}
        onToggle={onToggle}
        onSetMany={onSetMany}
        onClearAll={onClearAll}
      />
    </div>
  );
}
