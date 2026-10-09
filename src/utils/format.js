// Small text helpers.

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** 12 -> "১২" when the language is Bangla, "12" otherwise. */
export function formatNum(n, lang) {
  if (lang !== 'bn') return String(n);
  return String(n).replace(/\d/g, (c) => BN_DIGITS[+c]);
}

/** "MD. Shakil Ahammed" -> "MD-Shakil-Ahammed-bangladesh-map" (used as the download file name). */
export function fileBaseName(name) {
  const safe = name.replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '');
  return (safe || 'my') + '-bangladesh-map';
}
