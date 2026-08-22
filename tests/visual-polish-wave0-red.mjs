import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

export const EXPECTED_RED_TEST_NAMES = [
  "P01-T02: manual evidence template covers the complete supporting verification contract",
  "P02-T01: social records validate closed states and expose href only for verified profiles",
  "P02-T02: server layout derives canonical eligible task-first navigation without literal shell destinations",
  "P03-T01: root typography loads Barlow with only 400 and 700 public weights",
  "P03-T02: public tokens enforce focus separation, exact restrained motion, targets, and safe area",
  "P03-T03: shared hero and cards provide optional stable responsive media without fake interaction",
  "P04-T01: public server shell wires only governed navigation, social, legal, branch, and action DTOs",
  "P04-T02: header disclosure removes utility strip and preserves exact mobile order and keyboard lifecycle",
  "P04-T03: footer social safety and responsive eligible actions preserve honest semantics",
  "P05-T01: homepage owns the sole truthful preloaded responsive hero image",
  "P05-T02: truck card and detail media retain fixed geometry, contextual alt, sizes, and national caveat",
  "P06-T01: support media is a typed eligible DTO consumed by thin inquiry routes",
  "P06-T02: inquiry composition renders optional responsive media while branch remains image-free",
  "P07-T01: strict versioned consent parsing grants analytics and advertising separately and fails closed",
  "P07-T02: public layout and analytics wire optional providers through one fail-closed boundary",
  "P08-T01: dependency-free performance checker enforces numeric source and gzip build budgets in check",
];

const child = spawnSync(
  process.execPath,
  ["--test", "--test-reporter=tap", "tests/visual-polish.test.mjs"],
  { cwd: process.cwd(), encoding: "utf8" },
);

if (child.error) throw child.error;
const output = `${child.stdout ?? ""}\n${child.stderr ?? ""}`;
assert.notEqual(child.status, 0, "Wave 0 suite must be RED while expected failures are recorded");

const actualFailures = [...output.matchAll(/^not ok \d+ - (P\d{2}-T\d{2}: .+)$/gm)]
  .map((match) => match[1].trim())
  .sort();
const expectedFailures = [...EXPECTED_RED_TEST_NAMES].sort();

assert.ok(actualFailures.length > 0, `Suite failed without named contract failures; possible syntax/module-load error:\n${output}`);
assert.deepEqual(actualFailures, expectedFailures, `Wave 0 RED inventory changed:\n${output}`);

process.stdout.write(`Wave 0 RED inventory verified: ${actualFailures.length} expected named failures.\n`);
