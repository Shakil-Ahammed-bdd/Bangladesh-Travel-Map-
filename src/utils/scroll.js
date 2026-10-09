/** Smoothly scrolls to a section by its id ("top" = page top). Respects "reduce motion". */
export function scrollToSection(id) {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = reduce ? 'auto' : 'smooth';
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior, block: 'start' });
}
