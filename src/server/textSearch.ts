export const hasHebrew = (value: string) => /[֐-׿]/.test(value);

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[׳״'"`’]/g, "")
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const collapse = (value: string) =>
  value.replace(/ts/g, "z").replace(/(.)\1+/g, "$1");

const LATIN_RULES: [RegExp, string][] = [
  [/sch/g, "s"],
  [/sh/g, "s"],
  [/tch/g, "z"],
  [/ch/g, "h"],
  [/kh/g, "h"],
  [/th/g, "t"],
  [/ph/g, "p"],
  [/ck/g, "k"],
  [/tz|zh|dj/g, "z"],
  [/q|c/g, "k"],
  [/w|v/g, "b"],
  [/f/g, "p"],
  [/x/g, "ks"],
];

function latinSkeleton(value: string) {
  let text = value;
  for (const [pattern, replacement] of LATIN_RULES) {
    text = text.replace(pattern, replacement);
  }
  return collapse(text.replace(/[aeiouyh\s]/g, ""));
}

export function latinSkeletons(value: string, minLength = 2): string[] {
  const text = value.toLowerCase().replace(/[^a-z\s]/g, "");
  const variants = text.includes("j")
    ? [text.replace(/j/g, "z"), text.replace(/j/g, "")]
    : [text];
  return [...new Set(variants.map(latinSkeleton))].filter(
    (v) => v.length >= minLength,
  );
}

const HEBREW_BASE: Record<string, string> = {
  א: "",
  ב: "b",
  ג: "g",
  ד: "d",
  ה: "",
  ו: "",
  ז: "z",
  ח: "",
  ט: "t",
  י: "",
  כ: "k",
  ך: "k",
  ל: "l",
  מ: "m",
  ם: "m",
  נ: "n",
  ן: "n",
  ס: "s",
  ע: "",
  פ: "p",
  ף: "p",
  צ: "z",
  ץ: "z",
  ק: "k",
  ר: "r",
  ש: "s",
  ת: "t",
};
const HEBREW_ALT: Record<string, string> = { ו: "b", כ: "", ך: "" };
const MAX_VARIANTS = 4;

export function hebrewSkeletons(value: string): string[] {
  let variants = [""];
  for (const char of value) {
    const base = HEBREW_BASE[char];
    if (base === undefined) continue;
    const alt = HEBREW_ALT[char];
    if (alt !== undefined && variants.length * 2 <= MAX_VARIANTS) {
      variants = variants.flatMap((v) => [v + base, v + alt]);
    } else {
      variants = variants.map((v) => v + base);
    }
  }
  return [...new Set(variants.map(collapse))].filter(Boolean);
}

export function wordStarts(value: string): string[] {
  const words = value.split(" ");
  return words.map((_, index) => words.slice(index).join(" "));
}

export type Key = { text: string; kind: number };
export type SearchKeys = { hebrew: Key[]; latin: Key[] };

export const KIND_PRIMARY = 0;
export const KIND_WORD = 1;
export const KIND_SYNONYM = 2;

function addKey(target: Map<string, number>, text: string, kind: number) {
  const existing = target.get(text);
  if (existing === undefined || kind < existing) target.set(text, kind);
}

export function buildKeys(names: string[]): SearchKeys {
  const hebrew = new Map<string, number>();
  const latin = new Map<string, number>();
  names.forEach((name, nameIndex) => {
    const normalized = normalizeText(name);
    if (!normalized) return;
    wordStarts(normalized).forEach((start, wordIndex) => {
      const kind =
        nameIndex > 0
          ? KIND_SYNONYM
          : wordIndex === 0
            ? KIND_PRIMARY
            : KIND_WORD;
      addKey(hebrew, start, kind);
      for (const skeleton of hebrewSkeletons(start))
        addKey(latin, skeleton, kind);
    });
  });
  const toKeys = (map: Map<string, number>) =>
    [...map].map(([text, kind]) => ({ text, kind }));
  return { hebrew: toKeys(hebrew), latin: toKeys(latin) };
}

export type Query = { text: string; hebrew: boolean; skeletons: string[] };

export function parseQuery(value: string): Query | null {
  const text = normalizeText(value);
  if (!text) return null;
  const hebrew = hasHebrew(text);
  return { text, hebrew, skeletons: hebrew ? [] : latinSkeletons(text) };
}

function quality(key: string, query: string) {
  if (!key.startsWith(query)) return -1;
  if (key.length === query.length) return 0;
  return key[query.length] === " " ? 1 : 2;
}

export function rankKeys(keys: Key[], queries: string[]) {
  let best = -1;
  for (const key of keys) {
    for (const query of queries) {
      const q = quality(key.text, query);
      if (q < 0) continue;
      const rank = q * 3 + key.kind;
      if (best < 0 || rank < best) best = rank;
    }
  }
  return best;
}

export function matchRank(keys: SearchKeys, query: Query) {
  return query.hebrew
    ? rankKeys(keys.hebrew, [query.text])
    : rankKeys(keys.latin, query.skeletons);
}
