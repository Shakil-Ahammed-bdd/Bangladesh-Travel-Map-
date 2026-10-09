// The 8 divisions of Bangladesh and which districts belong to each.
import districtsData from './districtsData';

// [name used inside districtsData, Bangla label] — the order here is the order shown in the list
export const DIVISIONS = [
  ['Dhaka', 'ঢাকা বিভাগ'],
  ['Chattogram', 'চট্টগ্রাম বিভাগ'],
  ['Rajshahi', 'রাজশাহী বিভাগ'],
  ['Khulna', 'খুলনা বিভাগ'],
  ['Barishal', 'বরিশাল বিভাগ'],
  ['Sylhet', 'সিলেট বিভাগ'],
  ['Rangpur', 'রংপুর বিভাগ'],
  ['Mymensingh', 'ময়মনসিংহ বিভাগ'],
];

// { Dhaka: [district, district, ...], Chattogram: [...], ... } (each list sorted by English name)
export const districtsByDivision = (() => {
  const map = {};
  districtsData.districts.forEach((d) => {
    if (!map[d.division_en]) map[d.division_en] = [];
    map[d.division_en].push(d);
  });
  Object.values(map).forEach((list) => list.sort((a, b) => a.name_en.localeCompare(b.name_en)));
  return map;
})();

/** How many divisions have at least one visited district. */
export function countDivisionsTouched(visited) {
  return DIVISIONS.filter(([divEn]) => (districtsByDivision[divEn] || []).some((d) => visited[d.name_en])).length;
}
