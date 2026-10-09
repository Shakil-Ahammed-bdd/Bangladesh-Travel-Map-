/** On/off switch: "জেলার নাম দেখতে চাই". */
export default function NamesSwitch({ t, checked, onChange }) {
  return (
    <label className="bdmap-switch">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="bdmap-switch-track" aria-hidden="true" />
      <span>{t.showNames}</span>
      <span className="bdmap-switch-state">{checked ? t.on : t.off}</span>
    </label>
  );
}
