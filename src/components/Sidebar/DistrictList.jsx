import { useState } from 'react';
import districtsData from '../../data/districtsData';
import { DIVISIONS, districtsByDivision } from '../../data/divisions';
import DivisionSection from './DivisionSection';

/** Search box, "select all / clear all", and the 8 division sections. */
export default function DistrictList({ t, lang, visited, onToggle, onSetMany, onClearAll }) {
  const [query, setQuery] = useState('');
  const [openDivisions, setOpenDivisions] = useState(() => new Set(['Dhaka', 'Chattogram']));

  function toggleOpen(divEn) {
    setOpenDivisions((prev) => {
      const next = new Set(prev);
      if (next.has(divEn)) next.delete(divEn);
      else next.add(divEn);
      return next;
    });
  }

  const q = query.trim().toLowerCase();
  const searching = q !== '';

  // keep only the divisions that have something to show for the current search
  const sections = DIVISIONS.map(([divEn, divBn]) => {
    const list = districtsByDivision[divEn] || [];
    const visibleList = searching
      ? list.filter((d) => (d.name_bn + ' ' + d.name_en).toLowerCase().includes(q))
      : list;
    return { divEn, divBn, list, visibleList };
  }).filter((s) => s.list.length > 0 && (!searching || s.visibleList.length > 0));

  return (
    <>
      <div className="bdmap-search-row">
        <input
          type="text"
          placeholder={t.search}
          aria-label={t.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="bdmap-bulk-row">
        <button type="button" onClick={() => onSetMany(districtsData.districts.map((d) => d.name_en), true)}>
          {t.selectAll}
        </button>
        <button type="button" onClick={onClearAll}>{t.clearAll}</button>
      </div>

      {sections.map((s) => (
        <DivisionSection
          key={s.divEn}
          t={t}
          lang={lang}
          {...s}
          isOpen={searching ? true : openDivisions.has(s.divEn)}
          searching={searching}
          visited={visited}
          onToggleOpen={() => toggleOpen(s.divEn)}
          onToggle={onToggle}
          onSetMany={onSetMany}
        />
      ))}
      {searching && sections.length === 0 && <p className="bdmap-empty">{t.empty}</p>}
    </>
  );
}
