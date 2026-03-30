/* eslint-disable @typescript-eslint/no-explicit-any */

// normalize text
export const normalize = (arr: unknown[]) =>
  arr
    .map((v) =>
      String(v ?? "")
        .trim()
        .toLowerCase()
    )
    .filter(Boolean);

// check data meaningful
export const hasDifferentValues = (arr: string[]) => new Set(arr).size > 1;

// compare using locale
export const isSortedAsc = (arr: string[]) => {
  const sorted = [...arr].sort();
  return arr.join() === sorted.join();
};

export const isSortedDesc = (arr: string[]) => {
  const sorted = [...arr].sort().reverse();
  return arr.join() === sorted.join();
};

export function isSortedAscSafe(arr: string[]) {
  const normalizeValue = (val: string) => (val ?? "").toString().trim().toLowerCase();

  for (let i = 1; i < arr.length; i++) {
    const prev = normalizeValue(arr[i - 1]);
    const curr = normalizeValue(arr[i]);

    if (prev.localeCompare(curr) > 0) {
      return false;
    }
  }

  return true;
}

// BOOLEAN FIX
export const normalizeBoolean = (arr: any[]) =>
  arr.map((v) => {
    const value = String(v).toLowerCase().trim();
    return value === "true" ? "1" : "0";
  });

export const isBooleanAsc = (arr: string[]) => arr.join() === [...arr].sort().join();

export const isBooleanDesc = (arr: string[]) => arr.join() === [...arr].sort().reverse().join();
