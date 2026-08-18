import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const outputDirectory = resolve("node_modules/.cache/hino-configuration-tests");
const tsc = resolve("node_modules/typescript/bin/tsc");

export function loadConfigurationModules() {
  rmSync(outputDirectory, { force: true, recursive: true });
  mkdirSync(outputDirectory, { recursive: true });
  execFileSync(process.execPath, [tsc, "-p", "tests/fixtures/configuration/tsconfig.json", "--outDir", outputDirectory], {
    stdio: "pipe",
  });

  return {
    runtimeConfig: require(resolve(outputDirectory, "src/lib/runtime-config.js")),
    siteUrl: require(resolve(outputDirectory, "src/lib/site-url.js")),
  };
}

export const approvedRuntimeDecisions = {
  productionEstateApproved: true,
  productionOrigin: "https://approved.example",
};
