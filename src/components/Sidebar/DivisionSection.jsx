import { formatNum } from '../../utils/format';

/** One division (e.g. "ঢাকা বিভাগ") with its district buttons. Click the title to open/close it. */
export default function DivisionSection({
  t, lang, divEn, divBn, list, visibleList, isOpen, searching, visited, onToggleOpen, onToggle, onSetMany,
}) {
  const doneInDiv = list.filter((d) => visited[d.name_en]).length;
  const label = lang === 'bn' ? divBn : `${divEn} Division`;

  return (
    <details className="bdmap-division" open={isOpen}>
      <summary
        onClick={(e) => {
          if (e.target.closest('.bdmap-div-link')) return; // the "select all" link has its own click
          e.preventDefault();
          if (!searching) onToggleOpen();
        }}
      >
        <span>
          {label}{' '}
          <span className="bdmap-div-count">
            {formatNum(doneInDiv, lang)}/{formatNum(list.length, lang)}
          </span>
        </span>
        <span
          className="bdmap-div-link"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            const allOn = list.every((d) => visited[d.name_en]);
            onSetMany(list.map((d) => d.name_en), !allOn); // select all, or clear all if everything is already on
          }}
        >
          {t.divAll}
        </span>
        <span className="bdmap-arrow">▸</span>
      </summary>

      <div className="bdmap-chip-grid">
        {visibleList.map((d) => (
          <button
            key={d.name_en}
            type="button"
            className={`bdmap-chip ${visited[d.name_en] ? 'visited' : ''}`}
            onClick={() => onToggle(d.name_en)}
          >
            {lang === 'bn' ? d.name_bn : d.name_en}
          </button>
        ))}
      </div>
    </details>
  );
}
