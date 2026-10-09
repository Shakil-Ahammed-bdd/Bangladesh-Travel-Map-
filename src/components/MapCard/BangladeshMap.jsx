import { useMemo } from 'react';
import districtsData from '../../data/districtsData';
import { layoutLabels } from '../../utils/labels';

/**
 * The clickable map. Each district is an SVG <path>; click it (or press Enter) to mark it visited.
 * nameItems = names to print on the map (already empty when "show names" is off).
 */
export default function BangladeshMap({ lang, mapLabel, visited, nameItems, onToggle }) {
  const nameOf = (d) => (lang === 'bn' ? d.name_bn : d.name_en);

  // work out where each name goes so they don't sit on top of each other
  const labels = useMemo(
    () =>
      layoutLabels(nameItems, {
        fontSize: 9.5,
        measure: (text) => text.length * 9.5 * 0.62,
        bounds: { width: districtsData.width, height: districtsData.height },
      }),
    [nameItems]
  );

  return (
    <svg
      viewBox={`0 0 ${districtsData.width} ${districtsData.height}`}
      role="img"
      aria-label={mapLabel}
      className="bdmap-svg"
    >
      {districtsData.districts.map((d) => (
        <path
          key={d.name_en}
          d={d.d}
          tabIndex={0}
          role="button"
          aria-label={nameOf(d)}
          className={visited[d.name_en] ? 'visited' : ''}
          onClick={() => onToggle(d.name_en)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle(d.name_en);
            }
          }}
        >
          <title>{nameOf(d)}</title>
        </path>
      ))}

      {labels.length > 0 && (
        <g className="bdmap-labels" aria-hidden="true">
          {labels.map((l) => (
            <g key={l.key}>
              <circle cx={l.dotX} cy={l.dotY} r="2.4" className="bdmap-dot" />
              <text x={l.x} y={l.y} textAnchor={l.anchor}>{l.text}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
