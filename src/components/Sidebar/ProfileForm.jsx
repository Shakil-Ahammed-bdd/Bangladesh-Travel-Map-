import { useState } from 'react';
import { fileToAvatar } from '../../utils/image';

/** Name box + photo upload. Changes go up through onChange({ name }) or onChange({ photo }). */
export default function ProfileForm({ t, profile, onChange }) {
  const [photoError, setPhotoError] = useState(false);

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // so the same file can be chosen again later
    if (!file) return;
    try {
      onChange({ photo: await fileToAvatar(file) });
      setPhotoError(false);
    } catch {
      setPhotoError(true);
    }
  }

  return (
    <section className="bdmap-profile">
      <input
        type="text"
        maxLength={40}
        placeholder={t.namePh}
        aria-label={t.namePh}
        value={profile.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <div className="bdmap-photo-actions">
        <label className="bdmap-btn">
          {profile.photo ? t.change : t.upload}
          <input type="file" accept="image/*" hidden onChange={handleFile} />
        </label>
        {profile.photo && (
          <button type="button" className="bdmap-btn ghost" onClick={() => onChange({ photo: '' })}>
            {t.remove}
          </button>
        )}
      </div>
      {photoError && <p className="bdmap-error">{t.photoErr}</p>}
    </section>
  );
}
