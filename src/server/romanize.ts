import { normalizeText } from "./textSearch";

const LETTERS: Record<string, string> = {
  א: "",
  ב: "b",
  ג: "g",
  ד: "d",
  ה: "h",
  ו: "v",
  ז: "z",
  ח: "ch",
  ט: "t",
  י: "y",
  כ: "k",
  ך: "ch",
  ל: "l",
  מ: "m",
  ם: "m",
  נ: "n",
  ן: "n",
  ס: "s",
  ע: "",
  פ: "p",
  ף: "f",
  צ: "tz",
  ץ: "tz",
  ק: "k",
  ר: "r",
  ש: "sh",
  ת: "t",
};
const GERESH: Record<string, string> = { ג: "j", ז: "zh", צ: "ch", ת: "th" };
const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const ONSETS = new Set([
  "st",
  "sp",
  "sk",
  "sm",
  "sn",
  "sl",
  "tr",
  "dr",
  "br",
  "gr",
  "kr",
  "pr",
  "fr",
  "bl",
  "gl",
  "kl",
  "pl",
  "fl",
  "shl",
  "shm",
  "shn",
  "shr",
  "shv",
  "tzr",
  "kv",
  "gv",
  "tv",
  "dv",
  "zv",
]);

function tokens(word: string): string[] {
  const chars = [...word];
  const out: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const geresh = chars[i + 1] === "'" || chars[i + 1] === "׳";
    const last = i === chars.length - 1 || (geresh && i === chars.length - 2);
    const prev = out[out.length - 1] ?? "";
    const afterVowel = prev !== "" && VOWELS.has(prev[prev.length - 1]);
    if (geresh && GERESH[ch]) {
      out.push(GERESH[ch]);
      i += 1;
    } else if (ch === "ו") out.push(i === 0 || afterVowel ? "v" : "o");
    else if (ch === "י") out.push(i === 0 || afterVowel ? "y" : "i");
    else if (ch === "ה" && last) out.push(afterVowel ? "" : "a");
    else if ((ch === "א" || ch === "ע") && i === 0) out.push("a");
    else if (ch === "ע" && last) out.push("a");
    else if (LETTERS[ch] !== undefined) out.push(LETTERS[ch]);
  }
  return out.filter(Boolean);
}

const isConsonant = (token: string) => !VOWELS.has(token[0]);

function romanizeWord(word: string): string {
  const parts = tokens(word.replace(/["״]/g, ""));
  let out = "";
  parts.forEach((token, index) => {
    const prev = parts[index - 1];
    if (prev && isConsonant(prev) && isConsonant(token)) {
      const onset = index === 1 && ONSETS.has(prev + token);
      if (!onset) out += "a";
    }
    out += token;
  });
  return out ? out[0].toUpperCase() + out.slice(1) : "";
}

export function romanize(name: string): string {
  return name.trim().split(/\s+/).map(romanizeWord).filter(Boolean).join(" ");
}

const titleCase = (word: string) =>
  word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word;

export function englishLabel(
  name: string,
  typedWords: string[],
  startWord: number,
  matchedWords: number,
): string {
  const words = name.trim().split(/\s+/);
  const out = words.map(romanizeWord);
  for (let i = 0; i < matchedWords && i < typedWords.length; i++) {
    const index = startWord + i;
    if (index < out.length && normalizeText(words[index])) {
      out[index] = titleCase(typedWords[i]);
    }
  }
  return out.filter(Boolean).join(" ");
}
