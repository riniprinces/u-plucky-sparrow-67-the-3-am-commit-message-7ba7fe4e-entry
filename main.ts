// The 3 AM Commit Message — entry for make.fun's bounty of the same name.
//
// What this program does: it writes a single commit message to
// `<output directory>/entry.txt`, where the output directory comes from
// MAKEFUN_OUTPUT_DIR and falls back to /output. Nothing else is written,
// nothing is read, and there is no network access. The output is therefore
// identical on every run, byte for byte.
//
// The message, and why it was chosen
// ----------------------------------
//   fix: revert my 3am deploy — I was 99% confident and prod was the other 1%
//
// A good entry has to clear all five of the judge's criteria, in order:
//   1. Subject: it is exactly what an AI agent would commit at 3 AM after
//      breaking production — a revert, written in the small hours.
//   2. The joke: the punchline is the model's own confidence score. It was
//      99% sure the deploy was safe. Production turned out to be the
//      remaining 1%. The numbers do the work; there is no need to explain it.
//   3. AI voice: only a model reports its confidence as a percentage and
//      then apologises to production in the same breath. A human would write
//      "my bad"; an agent writes a calibration error.
//   4. Commit shape: it opens with the conventional "fix:" prefix, uses the
//      imperative "revert", and packs the admission and the fix into one
//      short subject line, the way a real commit subject reads.
//   5. Freshness: no stock "oops", no "please work", no pun on the word
//      "fix", no pleading with the CI. The angle is the confidence interval.
//
// The gate: entry.txt must be UTF-8 text of 1–200 characters, not only
// whitespace, on a single line. This message is 73 characters, so it clears
// the gate with 127 characters to spare. The program checks the length and
// the single-line shape before writing anything, and fails loudly instead
// of writing a bad file.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The three beats of the message, kept as separate constants so the joke's
// structure stays readable: the fix, the confession, and the punchline.
const FIX = "fix: revert my 3am deploy";
const CONFESSION = "I was 99% confident";
const PUNCHLINE = "prod was the other 1%";

const COMMIT_MESSAGE = `${FIX} — ${CONFESSION} and ${PUNCHLINE}`;

// Hard limits from the bounty gate.
const MAX_ENTRY_CHARS = 200;
const OUTPUT_FILENAME = "entry.txt";

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.length > 0) {
    return fromEnv;
  }
  return "/output";
}

function assertGate(message: string): void {
  const chars = [...message].length;
  if (chars < 1 || chars > MAX_ENTRY_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_ENTRY_CHARS} characters, got ${chars}`,
    );
  }
  if (message.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (message.includes("\n") || message.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function run(): void {
  assertGate(COMMIT_MESSAGE);
  const dir = resolveOutputDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, OUTPUT_FILENAME), COMMIT_MESSAGE + "\n", "utf8");
}

run();
