import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const executeFile = promisify(execFile);
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

async function validate(draft) {
  const script = `
    const { validateQuoteDraft } = await import('./src/lib/quote-demo.ts');
    process.stdout.write(JSON.stringify(validateQuoteDraft(${JSON.stringify(draft)})));
  `;
  const { stdout } = await executeFile(process.execPath, ["--experimental-strip-types", "--input-type=module", "--eval", script], { cwd: projectRoot });
  return JSON.parse(stdout);
}

const validDraft = {
  name: "Aileen Santos",
  mobile: "09171234567",
  email: "aileen@example.com",
  company: "Cebu Logistics",
  vehicleInterest: "Not sure — recommend a Hino for me",
  businessUse: "Logistics / Fleet",
  estimatedUnits: "2–5",
  consent: true,
};

test("quote drafts return field-specific errors in the agreed order", async () => {
  const result = await validate({});
  assert.equal(result.ok, false);
  assert.deepEqual(Object.keys(result.errors), ["name", "mobile", "email", "company", "vehicleInterest", "businessUse", "estimatedUnits", "consent"]);
});

test("valid drafts produce a truthful local-only confirmation", async () => {
  const result = await validate(validDraft);
  assert.deepEqual(result, {
    ok: true,
    message: "Your interest has been noted on this device. Please call Hino Cebu to continue your quote conversation.",
  });
});
