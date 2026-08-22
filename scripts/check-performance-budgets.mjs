import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const budgetKeys = [
  "maxTotalClientJsGzipBytes",
  "maxLargestClientJsChunkGzipBytes",
  "maxTotalClientCssGzipBytes",
  "maxClientModules",
  "exactImagePreloadCount",
  "maxOfficialRasterSourceBytes",
];

const root = resolve(process.argv[2] ?? process.cwd());

function failConfiguration(actual, limit) {
  console.error(`configuration | actual: ${actual} | limit: ${limit} | FAIL`);
  process.exit(1);
}

function readBudgets() {
  const configPath = join(root, "performance-budgets.json");
  if (!existsSync(configPath)) failConfiguration("missing", "valid performance-budgets.json");

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(configPath, "utf8"));
  } catch {
    failConfiguration("malformed JSON", "valid performance-budgets.json");
  }

  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    failConfiguration("non-object", "object with six numeric keys");
  }

  const actualKeys = Object.keys(parsed);
  const unknownKeys = actualKeys.filter((key) => !budgetKeys.includes(key));
  const missingKeys = budgetKeys.filter((key) => !Object.hasOwn(parsed, key));
  if (unknownKeys.length > 0 || missingKeys.length > 0) {
    failConfiguration(
      `missing=[${missingKeys.join(",")}] unknown=[${unknownKeys.join(",")}]`,
      `exact keys [${budgetKeys.join(",")}]`,
    );
  }

  for (const key of budgetKeys) {
    if (!Number.isSafeInteger(parsed[key]) || parsed[key] <= 0) {
      failConfiguration(`${key}=${String(parsed[key])}`, "positive safe integer");
    }
  }

  return parsed;
}

function filesBelow(directory) {
  if (!existsSync(directory) || !statSync(directory).isDirectory()) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesBelow(path);
    return entry.isFile() ? [path] : [];
  });
}

function gzipBytes(path) {
  return gzipSync(readFileSync(path)).byteLength;
}

function requireFiles(label, files) {
  if (files.length === 0) {
    console.error(`${label} | actual: missing or empty | limit: at least 1 emitted file | FAIL`);
    process.exit(1);
  }
}

const budgets = readBudgets();
const chunkFiles = filesBelow(join(root, ".next", "static", "chunks"));
const javascriptFiles = chunkFiles.filter((path) => extname(path).toLowerCase() === ".js");
const cssFiles = chunkFiles.filter((path) => extname(path).toLowerCase() === ".css");
requireFiles("production output JavaScript", javascriptFiles);
requireFiles("production output CSS", cssFiles);

const javascriptGzipSizes = javascriptFiles.map(gzipBytes);
const cssGzipSizes = cssFiles.map(gzipBytes);
const sourceFiles = filesBelow(join(root, "src"))
  .filter((path) => [".ts", ".tsx"].includes(extname(path).toLowerCase()));
requireFiles("application source", sourceFiles);

const clientModuleCount = sourceFiles.filter((path) => (
  /^\uFEFF?\s*["']use client["']\s*;/u.test(readFileSync(path, "utf8"))
)).length;
const imagePreloadCount = sourceFiles
  .filter((path) => extname(path).toLowerCase() === ".tsx")
  .reduce((count, path) => (
    count + (readFileSync(path, "utf8").match(/\bpreload(?:\s*=\s*\{\s*true\s*\})?/g) ?? []).length
  ), 0);
const rasterExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const officialRasterFiles = filesBelow(join(root, "public", "images", "official"))
  .filter((path) => rasterExtensions.has(extname(path).toLowerCase()));
requireFiles("official raster source bytes", officialRasterFiles);

const metrics = [
  {
    metric: "total client JavaScript gzip",
    actual: javascriptGzipSizes.reduce((total, size) => total + size, 0),
    limit: budgets.maxTotalClientJsGzipBytes,
    pass: (actual, limit) => actual <= limit,
  },
  {
    metric: "largest client JavaScript chunk gzip",
    actual: Math.max(...javascriptGzipSizes),
    limit: budgets.maxLargestClientJsChunkGzipBytes,
    pass: (actual, limit) => actual <= limit,
  },
  {
    metric: "total client CSS gzip",
    actual: cssGzipSizes.reduce((total, size) => total + size, 0),
    limit: budgets.maxTotalClientCssGzipBytes,
    pass: (actual, limit) => actual <= limit,
  },
  {
    metric: "client modules",
    actual: clientModuleCount,
    limit: budgets.maxClientModules,
    pass: (actual, limit) => actual <= limit,
  },
  {
    metric: "image preload",
    actual: imagePreloadCount,
    limit: budgets.exactImagePreloadCount,
    pass: (actual, limit) => actual === limit,
  },
  {
    metric: "official raster source bytes",
    actual: Math.max(...officialRasterFiles.map((path) => statSync(path).size)),
    limit: budgets.maxOfficialRasterSourceBytes,
    pass: (actual, limit) => actual <= limit,
  },
];

console.log("metric | actual | limit | status");
let failed = false;
for (const { metric, actual, limit, pass } of metrics) {
  const status = pass(actual, limit) ? "PASS" : "FAIL";
  if (status === "FAIL") failed = true;
  console.log(`${metric} | ${actual} | ${limit} | ${status}`);
}
console.log("Scope: repository/build-output proxies only; Phase 4/5 retains browser certification for per-route transfer, LCP, CLS, and INP.");

if (failed) process.exit(1);
