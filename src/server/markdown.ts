import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/i18n";

export type Inline =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "link"; text: string; href: string };

export type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; inlines: Inline[] }
  | { type: "list"; items: Inline[][] };

export type Document = {
  title: string;
  description: string;
  updated: string;
  blocks: Block[];
};

const CONTENT_DIR = join(process.cwd(), "src", "content");

function parseFrontmatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta: Record<string, string> = {};
  if (!match) return { meta, body: source };
  for (const line of match[1].split(/\r?\n/)) {
    const index = line.indexOf(":");
    if (index > 0)
      meta[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return { meta, body: source.slice(match[0].length) };
}

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

export function parseInlines(text: string): Inline[] {
  const inlines: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last)
      inlines.push({ type: "text", text: text.slice(last, index) });
    if (match[3] !== undefined)
      inlines.push({ type: "strong", text: match[3] });
    else inlines.push({ type: "link", text: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < text.length)
    inlines.push({ type: "text", text: text.slice(last) });
  return inlines;
}

export function parseMarkdown(body: string): Block[] {
  const blocks: Block[] = [];
  const chunks = body.replace(/\r\n/g, "\n").split(/\n{2,}/);
  for (const chunk of chunks) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;
    const heading = lines[0].match(/^(#{1,6})\s+(.*)$/);
    if (heading && lines.length === 1) {
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text: heading[2],
      });
    } else if (lines.every((line) => /^[-*]\s+/.test(line))) {
      blocks.push({
        type: "list",
        items: lines.map((line) => parseInlines(line.replace(/^[-*]\s+/, ""))),
      });
    } else {
      blocks.push({
        type: "paragraph",
        inlines: parseInlines(lines.join(" ")),
      });
    }
  }
  return blocks;
}

export function loadDocument(
  folder: string,
  name: string,
  locale: Locale,
  vars: Record<string, string> = {},
): Document {
  const raw = readFileSync(
    join(CONTENT_DIR, folder, `${name}.${locale}.md`),
    "utf8",
  );
  const source = raw.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
    key in vars ? vars[key] : match,
  );
  const { meta, body } = parseFrontmatter(source);
  return {
    title: meta.title ?? name,
    description: meta.description ?? "",
    updated: meta.updated ?? "",
    blocks: parseMarkdown(body),
  };
}
