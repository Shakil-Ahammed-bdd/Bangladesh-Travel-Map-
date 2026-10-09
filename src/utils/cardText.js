// The words printed on the map card. The same strings are used on screen AND in the downloaded picture.
import { DIVISIONS, countDivisionsTouched } from '../data/divisions';
import { formatNum } from './format';

export function buildCardLabels({ t, lang, name, count, total, percent, visited }) {
  const touched = countDivisionsTouched(visited);
  return {
    eyebrow: t.eyebrow,
    title: name ? t.titleNamed(name) : t.titleDefault,
    count: formatNum(count, lang),
    total: formatNum(total, lang),
    pct: t.pct(formatNum(percent, lang)),
    stats: t.stats(formatNum(count, lang), formatNum(touched, lang), formatNum(DIVISIONS.length, lang)),
  };
}
