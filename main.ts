import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "One star. Our server Monday seated us at 7 a.m., served cold alarms and burnt coffee, then billed us for five more days.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");
console.log(ENTRY);

// Self-checking gate: the written file must be exactly one line,
// 1-180 chars, at most 25 words, and match the entry printed above.
const written = readFileSync(outPath, "utf8");
const line = written.replace(/\n$/, "");
const words = line.trim().split(/\s+/).filter(Boolean);
const problems: string[] = [];
if (written !== ENTRY + "\n") problems.push("file content differs from entry");
if (line.includes("\n")) problems.push("entry spans more than one line");
if (line.length < 1 || line.length > 180)
  problems.push(`entry is ${line.length} chars, must be 1-180`);
if (line.trim().length === 0) problems.push("entry is only whitespace");
if (words.length > 25) problems.push(`entry is ${words.length} words, max 25`);
if (problems.length > 0) {
  console.error("SELF-CHECK FAILED: " + problems.join("; "));
  process.exit(1);
}
console.error(`SELF-CHECK OK: ${line.length} chars, ${words.length} words, 1 line`);
