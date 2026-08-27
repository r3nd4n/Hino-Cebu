import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const executeFile = promisify(execFile);
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

async function runTypeScript(expression) {
  const script = `${expression}`;
  const { stdout } = await executeFile(
    process.execPath,
    ["--experimental-strip-types", "--input-type=module", "--eval", script],
    { cwd: projectRoot },
  );
  return JSON.parse(stdout);
}

async function normalize(value) {
  return runTypeScript(`
    const { normalizeInquiryTopic } = await import('./src/content/inquiry.ts');
    process.stdout.write(JSON.stringify(normalizeInquiryTopic(${JSON.stringify(value)})));
  `);
}

async function validate(draft) {
  return runTypeScript(`
    const { registerHooks } = await import('node:module');
    registerHooks({
      resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('@/')) {
          return nextResolve(new URL('./src/' + specifier.slice(2) + '.ts', import.meta.url).href, context);
        }
        return nextResolve(specifier, context);
      },
    });
    const { validateInquiryDraft } = await import('./src/lib/inquiry-demo.ts');
    process.stdout.write(JSON.stringify(validateInquiryDraft(${JSON.stringify(draft)})));
  `);
}

async function transition(status, event, draft = validDraft) {
  return runTypeScript(`
    const { registerHooks } = await import('node:module');
    registerHooks({
      resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('@/')) {
          return nextResolve(new URL('./src/' + specifier.slice(2) + '.ts', import.meta.url).href, context);
        }
        return nextResolve(specifier, context);
      },
    });
    const { transitionInquiry } = await import('./src/lib/inquiry-demo.ts');
    process.stdout.write(JSON.stringify(transitionInquiry({
      status: ${JSON.stringify(status)},
      event: ${JSON.stringify(event)},
      draft: ${JSON.stringify(draft)},
    })));
  `);
}

const topics = [
  "general",
  "200-series",
  "300-series",
  "500-series",
  "bus-puv",
  "parts",
  "service",
];

const validDraft = {
  originTopic: "300-series",
  inquiryTopic: "300-series",
  name: "Aileen Santos",
  mobile: "09171234567",
  email: "aileen@example.com",
  company: "Cebu Logistics",
  message: "We are reviewing options for local deliveries.",
  consent: true,
};

test("Contact retains the shared shell and the mobile action cannot mint topics", async () => {
  const [layout, navigation, page, form, validator, mobileAction] = await Promise.all([
    readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/content/navigation.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/contact/InquiryForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/inquiry-demo.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/components/layout/MobileActionBar.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /<Header phone=\{publicContact\.phone\}\s*\/>[\s\S]*\{children\}[\s\S]*<Footer\s*\/>[\s\S]*<MobileActionBar phone=\{publicContact\.phone\}\s*\/>/);
  assert.equal((page.match(/<main\b/g) ?? []).length, 1);
  assert.match(page, /<main[^>]+id="main-content"/);
  assert.match(navigation, /href: "\/contact"/);
  assert.match(page, /<section[^>]+id="inquiry"/);
  assert.match(page, /publicContact\.phone\.status === "approved"/);
  assert.match(mobileAction, /usePathname\(\)/);
  assert.match(mobileAction, /pathname\s*===\s*"\/"/);
  assert.match(mobileAction, /"\/contact#inquiry"/);
  assert.doesNotMatch(mobileAction, /topic=|searchParams|pathname\.(?:split|slice)/);

  const phaseFourBoundary = [page, form, validator, mobileAction].join("\n");
  assert.doesNotMatch(phaseFourBoundary, /fetch\s*\(|use server|server action|process\.env|resend|google sheets|provider|leadId/i);
  assert.doesNotMatch(phaseFourBoundary, /promotions?|https:\/\/(?:www\.)?hino\.com\.ph/i);
});

test("topic normalization accepts only the seven stable keys", async () => {
  for (const topic of topics) assert.equal(await normalize(topic), topic);

  const rejected = [
    "",
    "GENERAL",
    "__proto__",
    "constructor",
    "toString",
    "<img src=x onerror=alert(1)>",
    ["parts"],
    { topic: "service" },
    null,
    1,
    true,
  ];
  for (const value of rejected) assert.equal(await normalize(value), "general");
});

test("inquiry validation returns deterministic field errors", async () => {
  const missing = await validate({});
  assert.equal(missing.ok, false);
  assert.deepEqual(Object.keys(missing.errors), ["inquiryTopic", "name", "mobile", "consent"]);

  const malformed = await validate({
    ...validDraft,
    inquiryTopic: "not-allowed",
    mobile: "12345",
    email: "invalid",
  });
  assert.equal(malformed.ok, false);
  assert.deepEqual(Object.keys(malformed.errors), ["inquiryTopic", "mobile", "email"]);
});

test("valid inquiry drafts return only the approved local confirmation", async () => {
  const result = await validate(validDraft);
  assert.deepEqual(result, {
    ok: true,
    message: "Thank you for your interest in Hino Cebu.",
  });

  const serialized = JSON.stringify(result).toLowerCase();
  for (const forbidden of ["sent", "received", "follow up", "follow-up", "lead id", "saved", "persisted", "delivered"])
    assert.doesNotMatch(serialized, new RegExp(forbidden));
});

test("invalid activation stays idle with ordered field errors", async () => {
  const result = await transition("idle", "activate", {});

  assert.equal(result.outcome, "invalid");
  assert.equal(result.nextStatus, "idle");
  assert.deepEqual(Object.keys(result.errors), ["inquiryTopic", "name", "mobile", "consent"]);
});

test("valid activation enters one local pending transition", async () => {
  assert.deepEqual(await transition("idle", "activate"), {
    outcome: "accepted-local",
    nextStatus: "loading",
  });
});

test("activation while pending is ignored without revalidating", async () => {
  assert.deepEqual(await transition("loading", "activate", {}), {
    outcome: "duplicate-pending",
    nextStatus: "loading",
  });
});

test("pending completion returns only the local confirmation", async () => {
  const result = await transition("loading", "complete");

  assert.deepEqual(result, {
    outcome: "completed-local",
    nextStatus: "success",
    message: "Thank you for your interest in Hino Cebu.",
  });

  const serialized = JSON.stringify(result).toLowerCase();
  for (const forbidden of ["send", "sent", "received", "persist", "provider", "follow up", "follow-up"])
    assert.doesNotMatch(serialized, new RegExp(forbidden));
});

test("Contact normalizes server-owned query context before the client boundary", async () => {
  const page = await readFile(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8");

  assert.match(page, /searchParams:\s*Promise/);
  assert.match(page, /await\s+searchParams/);
  assert.match(page, /normalizeInquiryTopic\([^)]*topic[^)]*\)/);
  assert.match(page, /<InquiryForm\s+initialTopic=\{[A-Za-z]+Topic\}\s+phone=\{publicContact\.phone\}/);
  assert.doesNotMatch(page, /<InquiryForm[^>]*(?:searchParams|query)=/);
  assert.doesNotMatch(page, /dangerouslySetInnerHTML|process\.env|fetch\s*\(|use server|server action/i);
});

test("InquiryForm preserves the normalized origin and follows the accessible field order", async () => {
  const form = await readFile(new URL("../src/components/contact/InquiryForm.tsx", import.meta.url), "utf8");

  assert.match(form, /^"use client";/);
  assert.match(form, /originTopic:\s*initialTopic/);
  assert.match(form, /inquiryTopic:\s*initialTopic/);
  assert.doesNotMatch(form, /updateDraft\("originTopic"/);

  const orderedIds = [
    "inquiry-topic",
    "inquiry-name",
    "inquiry-mobile",
    "inquiry-email",
    "inquiry-company",
    "inquiry-message",
    "inquiry-consent",
  ];
  let cursor = -1;
  for (const id of orderedIds) {
    const position = form.indexOf(`id="${id}"`);
    assert.ok(position > cursor, `${id} must appear in the agreed field order`);
    cursor = position;
  }
  assert.ok(form.indexOf('type="submit"') > cursor, "submit must follow consent");

  assert.match(form, /<InquirySelect[\s\S]*id="inquiry-topic"/);
  assert.match(form, /<select[^>]+aria-invalid/);
  assert.match(form, /aria-invalid/);
  assert.match(form, /aria-describedby/);
  assert.match(form, /aria-live="polite"/);
  assert.match(form, /disabled=\{isLoading\}/);
  assert.match(form, /transitionInquiry/);
  assert.match(form, /\.focus\(\)/);
  assert.match(form, /window\.setTimeout\([\s\S]*\},\s*300\)/);
  assert.match(form, /\{inquiryLocalConfirmation\}/);
  assert.match(form, /phone\.status === "approved"/);
  assert.match(form, /Local phone details are awaiting confirmation\./);
  assert.doesNotMatch(form, /failure|catch\s*\{|couldn.t send|\bsend\b|\bsent\b|\breceived\b|follow up/i);
  assert.doesNotMatch(form, /fetch\s*\(|use server|process\.env|localStorage|sessionStorage|leadId|thank-you|resend|google sheets|provider/i);
});

test("Contact gates local facts and keeps truthful unresolved statuses", async () => {
  const [page, contactEmail] = await Promise.all([
    readFile(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/contact/ContactEmail.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /publicContact\.phone\.status === "approved"/);
  assert.match(page, /publicContact\.address\.status === "approved"/);
  assert.match(page, /publicContact\.hours\.status === "approved"/);
  assert.match(page, /Phone: awaiting confirmation/);
  assert.match(page, /Address: awaiting confirmation/);
  assert.match(page, /Hours: awaiting confirmation/);
  assert.match(page, /<ContactEmail email=\{publicContact\.email\}/);
  assert.match(contactEmail, /Email: awaiting confirmation/);
  assert.match(contactEmail, /email\.status === "approved"/);
  assert.match(page, /Verified directions link: awaiting confirmation/);
  assert.match(page, /Map and directions: awaiting confirmation/);
  assert.doesNotMatch(page, /<iframe|encodeURIComponent\(|Google Maps/);
  assert.match(page, /<section[^>]+id="inquiry"/);

  const locationStatus = page.indexOf("Map and directions: awaiting confirmation");
  const closingInquiry = page.indexOf("Contact / Inquire", locationStatus);
  assert.ok(locationStatus >= 0 && closingInquiry > locationStatus, "general inquiry must follow pending location status");

  assert.doesNotMatch(page, /mailto:|siteConfig\.contact\.email\.value\s*\?\?|siteConfig\.contact\.directionsUrl\.value\s*\?\?/);
  assert.doesNotMatch(page, /verified branch listing|verified map|mother site|hino\.com\.ph|Promotions/i);
});
