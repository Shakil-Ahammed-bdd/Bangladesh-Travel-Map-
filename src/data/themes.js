// Themes for the map card (avatar, title, count, map, progress bar). The rest of the page keeps its own look.
// bg     = card background          panel  = avatar / inner background
// ink    = main text                soft   = secondary text
// accent = visited districts, count, progress bar, avatar border
// sand   = unvisited districts      accentSoft = hover colour
export const THEMES = [
  {
    id: 'forest', name_bn: 'বন সবুজ', name_en: 'Forest',
    colors: { bg: '#F7F4ED', panel: '#EFEAE0', ink: '#22201B', soft: '#5B5748', line: '#DCD5C4', accent: '#127A58', accentSoft: '#3E8768', sand: '#DDD5C4', onAccent: '#FAF8F2', focus: '#1C6FB0', err: '#B4383A' },
  },
  {
    id: 'ocean', name_bn: 'সমুদ্র নীল', name_en: 'Ocean',
    colors: { bg: '#EAF2F8', panel: '#DDE9F2', ink: '#12202B', soft: '#4B6274', line: '#C3D4E1', accent: '#1565A8', accentSoft: '#4A8CC7', sand: '#C5D6E4', onAccent: '#FFFFFF', focus: '#B4501E', err: '#B4383A' },
  },
  {
    id: 'sunset', name_bn: 'সূর্যাস্ত', name_en: 'Sunset',
    colors: { bg: '#FCF1E6', panel: '#F6E2D0', ink: '#2B1B15', soft: '#76574A', line: '#E8D0BC', accent: '#C0501F', accentSoft: '#E07A45', sand: '#EBD3BF', onAccent: '#FFFFFF', focus: '#1C6FB0', err: '#A12B2B' },
  },
  {
    id: 'royal', name_bn: 'রাজকীয় বেগুনি', name_en: 'Royal',
    colors: { bg: '#F3F0FA', panel: '#E5DFF2', ink: '#1F1830', soft: '#5C5373', line: '#D3CAE6', accent: '#6A3FB5', accentSoft: '#8F6BD1', sand: '#D6CCEA', onAccent: '#FFFFFF', focus: '#B4501E', err: '#B4383A' },
  },
  {
    id: 'night', name_bn: 'রাত', name_en: 'Night', dark: true,
    colors: { bg: '#1B2125', panel: '#12171A', ink: '#ECE8DE', soft: '#A9B0AE', line: '#2F383C', accent: '#4CC29A', accentSoft: '#2F8A6D', sand: '#3A464C', onAccent: '#0E1F18', focus: '#6CB2E8', err: '#E07577' },
  },
];

export const DEFAULT_THEME_ID = 'forest';
