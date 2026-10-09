/** "বাংলা | English" switch. */
export default function LanguageToggle({ lang, onChange }) {
  return (
    <div className="bdmap-lang" role="group" aria-label="Language">
      <button type="button" className={lang === 'bn' ? 'active' : ''} onClick={() => onChange('bn')}>বাংলা</button>
      <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => onChange('en')}>English</button>
    </div>
  );
}
