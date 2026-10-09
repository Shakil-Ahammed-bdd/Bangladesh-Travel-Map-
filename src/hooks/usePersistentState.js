import { useEffect, useState } from 'react';

/**
 * Like useState, but the value is saved in the browser (localStorage) and restored on the next visit.
 *   const [lang, setLang] = usePersistentState('bd-lang', 'bn', (v) => v === 'bn' || v === 'en');
 * `isValid` (optional) rejects saved values that no longer make sense.
 */
export function usePersistentState(key, fallback, isValid = () => true) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const saved = JSON.parse(raw);
        if (isValid(saved)) return saved;
      }
    } catch {
      /* storage blocked or value corrupted — use the fallback */
    }
    return fallback;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore (e.g. private browsing) */
    }
  }, [key, value]);

  return [value, setValue];
}
