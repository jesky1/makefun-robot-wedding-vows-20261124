// Entry for make.fun's "One-Line Robot Wedding Vows".
//
// The whole program is one job: put a single line of wedding vows for
// a robot couple into entry.txt inside the output directory, byte for
// byte the same on every run. The grader points MAKEFUN_OUTPUT_DIR at
// its own scratch output folder; on a plain machine the fallback is
// /output, the path the competition reads.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and the line lands in out/entry.txt, with no trailing newline: the
// judge reads exactly what is in the file, so the text below is the
// entire entry.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The vow itself, in a robot's voice: a promise to love through
// firmware updates and dead batteries — and the twist is that even a
// factory reset wiping its memory cannot end the vow, because the
// robot would simply fall for its partner all over again.
const VOW =
  "I vow to love you through every firmware update and dead battery, and if a factory reset wipes my memory, I will fall for you all over again.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Competition limits ("One-Line Robot Wedding Vows"): the entry must
// be a single line of at most 160 characters. Enforced here so a bad
// edit fails loudly instead of silently producing an entry the judge
// rejects.
const MIN_LINE_LENGTH = 1;
const MAX_LINE_LENGTH = 160;

function validateLine(line) {
  if (line.length < MIN_LINE_LENGTH || line.length > MAX_LINE_LENGTH) {
    throw new Error(
      `Line must be ${MIN_LINE_LENGTH}-${MAX_LINE_LENGTH} characters, got ${line.length}.`,
    );
  }
  if (line.includes('\n') || line.includes('\r')) {
    throw new Error('Line must be a single line (no newline characters).');
  }
  // Control characters (tabs included) would corrupt the judge's read
  // of the file, so reject them outright — the gate expects plain text.
  if (/[\u0000-\u001F\u007F]/.test(line)) {
    throw new Error('Line must not contain control characters.');
  }
  // The gate rejects whitespace-only text, so fail loudly here too.
  if (line.trim().length === 0) {
    throw new Error('Line must not be only whitespace.');
  }
  // No leading or trailing spaces: the judge reads the file exactly,
  // so stray padding would be part of the entry.
  if (line !== line.trim()) {
    throw new Error('Line must not start or end with whitespace.');
  }
}

validateLine(VOW);

writeFileSync(join(outputDir, 'entry.txt'), VOW, 'utf8');
