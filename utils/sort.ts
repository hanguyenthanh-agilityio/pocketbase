/* eslint-disable @typescript-eslint/no-explicit-any */
export const normalize = (arr: any[]) =>
  arr
    .map((v) => (v === null || v === undefined ? "" : String(v).trim().toLowerCase()))
    .filter(Boolean);

export const hasDifferentValues = (arr: string[]) => new Set(arr).size > 1;

export const isSortedAsc = (arr: string[]) => {
  const filtered = arr.filter(Boolean);
  return filtered.every((v, i) => i === 0 || filtered[i - 1] <= v);
};

export const isSortedDesc = (arr: string[]) => {
  const filtered = arr.filter(Boolean);
  return filtered.every((v, i) => i === 0 || filtered[i - 1] >= v);
};

// Boolean mapping 1/0
export const isBooleanAsc = (arr: string[]) => arr.join(",") === [...arr].sort().join(",");
export const isBooleanDesc = (arr: string[]) =>
  arr.join(",") === [...arr].sort().reverse().join(",");

// normalize boolean: true -> "1", false -> "0"
export const normalizeBoolean = (arr: any[]) => arr.map((v) => (v ? "1" : "0"));
