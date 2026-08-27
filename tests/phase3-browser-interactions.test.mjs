import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";

import {
  evaluate as evaluateCdp,
  exists,
  isolatedPort,
  openPage,
  pressKey,
  stopProcess,
  trackProcess,
  waitFor,
} from "./support/browser-services.mjs";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
].filter(Boolean);

let nextProcess;
let chromeProcess;
let chromeProfile;
let baseUrl;
let debugUrl;
let browser;
let serverOutput = "";

async function evaluate(expression) {
  return evaluateCdp(browser.cdp, expression);
}

async function navigate(route) {
  await browser.cdp.send("Page.navigate", { url: `${baseUrl}${route}` });
  await new Promise((resolve) => setTimeout(resolve, 500));
  await evaluate(`new Promise(resolve => document.readyState === "complete" ? resolve() : addEventListener("load", resolve, { once: true }))`);
  await new Promise((resolve) => setTimeout(resolve, 150));
}

async function key(key, { shift = false } = {}) {
  await pressKey(browser.cdp, key, key, { shift });
  await new Promise((resolve) => setTimeout(resolve, 50));
}

before(async () => {
  const buildId = path.join(projectRoot, ".next", "BUILD_ID");
  assert.ok(await exists(buildId), "Run `npm run build` immediately before this rendered browser test.");
  const chromePath = await chromeCandidates.reduce(async (foundPromise, candidate) => {
    const found = await foundPromise;
    return found ?? ((await exists(candidate)) ? candidate : undefined);
  }, Promise.resolve(undefined));
  assert.ok(chromePath, "Chrome was not found. Set CHROME_PATH to an installed Chrome executable.");

  const [nextPort, chromePort] = await Promise.all([isolatedPort(), isolatedPort()]);
  baseUrl = `http://127.0.0.1:${nextPort}`;
  debugUrl = `http://127.0.0.1:${chromePort}`;
  chromeProfile = await mkdtemp(path.join(os.tmpdir(), "hino-phase3-chrome-"));

  nextProcess = trackProcess(spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(nextPort)], {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  }));
  nextProcess.stdout.on("data", (chunk) => { serverOutput += chunk; });
  nextProcess.stderr.on("data", (chunk) => { serverOutput += chunk; });

  chromeProcess = trackProcess(spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${chromeProfile}`,
    "about:blank",
  ], { stdio: "ignore", windowsHide: true }));

  await Promise.all([
    waitFor(`${baseUrl}/trucks`, "Next production server", nextProcess, () => serverOutput),
    waitFor(`${debugUrl}/json/version`, "Chrome debugging endpoint", chromeProcess),
  ]);
  browser = await openPage(debugUrl);
  await browser.cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
});

after(async () => {
  if (browser) {
    browser.socket.close();
    await fetch(`${debugUrl}/json/close/${browser.target.id}`).catch(() => {});
  }
  await Promise.all([stopProcess(chromeProcess), stopProcess(nextProcess)]);
  if (chromeProfile) await rm(chromeProfile, { recursive: true, force: true });
});

test("mobile menu owns focus and makes covered page regions inert", async () => {
  await navigate("/trucks");
  const opened = await evaluate(`(async () => {
    const trigger = document.querySelector('.mobile-menu__trigger');
    trigger.focus(); trigger.click();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const panel = document.querySelector('.mobile-menu__panel');
    return {
      firstFocused: document.activeElement === panel.querySelector('a'),
      activeInside: panel.contains(document.activeElement),
      inert: [document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('.mobile-action-bar')].every(element => element?.inert),
      identityInert: document.querySelector('.site-identity')?.inert === true,
      overflow: document.body.style.overflow,
    };
  })()`);
  assert.deepEqual(opened, { firstFocused: true, activeInside: true, inert: true, identityInert: true, overflow: "hidden" });

  await evaluate(`(() => { const items=[...document.querySelectorAll('.mobile-menu__panel a')]; items.at(-1).focus(); })()`);
  await key("Tab");
  assert.equal(await evaluate(`document.activeElement === document.querySelector('.mobile-menu__panel a')`), true, "Tab must wrap last to first");
  await key("Tab", { shift: true });
  assert.equal(await evaluate(`document.activeElement === [...document.querySelectorAll('.mobile-menu__panel a')].at(-1)`), true, "Shift+Tab must wrap first to last");

  await key("Escape");
  assert.deepEqual(await evaluate(`({
    closed: document.querySelector('.mobile-menu__trigger').getAttribute('aria-expanded') === 'false',
    restored: document.activeElement === document.querySelector('.mobile-menu__trigger'),
    inertCleared: [document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('.mobile-action-bar')].every(element => !element?.inert),
    identityRestored: document.querySelector('.site-identity')?.inert === false,
    overflow: document.body.style.overflow,
  })`), { closed: true, restored: true, inertCleared: true, identityRestored: true, overflow: "" });
});

test("unresolved mobile inquiry action spans the available bar width", async () => {
  await navigate("/trucks");
  const layout = await evaluate(`(() => {
    const bar=document.querySelector('.mobile-action-bar'); const action=bar.querySelector('a');
    return { modifier: bar.classList.contains('mobile-action-bar--single'), bar: Math.round(bar.getBoundingClientRect().width), action: Math.round(action.getBoundingClientRect().width), href: action.getAttribute('href') };
  })()`);
  assert.equal(layout.modifier, true);
  assert.ok(layout.action >= layout.bar - 42, `single action ${layout.action}px must fill inner bar ${layout.bar}px`);
  assert.equal(layout.href, "/contact#inquiry");
});

test("homepage consent exposes and describes its invalid state", async () => {
  await navigate("/");
  const invalid = await evaluate(`(async () => {
    document.querySelector('.homepage-quote button[type="submit"]').click();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const consent=document.querySelector('#quote-consent'); const error=document.getElementById(consent.getAttribute('aria-describedby'));
    return { invalid: consent.getAttribute('aria-invalid'), described: Boolean(error?.innerText), firstFocus: document.activeElement?.id };
  })()`);
  assert.deepEqual(invalid, { invalid: "true", described: true, firstFocus: "quote-name" });
});

test("Contact renders the complete normalized local inquiry lifecycle through reset", async () => {
  await navigate("/contact?topic=arbitrary#inquiry");
  assert.equal(await evaluate(`document.querySelector('[name="inquiryTopic"]').value`), "general");

  await navigate("/contact?topic=parts#inquiry");
  const states = await evaluate(`(async () => {
    const setValue = (element, value) => {
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
      descriptor.set.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const topic = document.querySelector('[name="inquiryTopic"]');
    const allowedPrefill = topic.value;
    setValue(topic, 'service');
    const editedTopic = topic.value;
    const submit = document.querySelector('form button[type="submit"]');
    submit.click();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const invalidElements = [...document.querySelectorAll('[aria-invalid="true"]')];
    const invalid = {
      focus: document.activeElement?.getAttribute('name'),
      fields: invalidElements.map(element => element.getAttribute('name')),
      described: invalidElements.every(element => {
        const errorId = element.getAttribute('aria-describedby');
        return errorId && Boolean(document.getElementById(errorId)?.innerText);
      }),
    };

    setValue(document.querySelector('[name="name"]'), 'Test User');
    setValue(document.querySelector('[name="mobile"]'), '09171234567');
    document.querySelector('[name="consent"]').click();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const beforeLoading = {
      topic: document.querySelector('[name="inquiryTopic"]').value,
      name: document.querySelector('[name="name"]').value,
      mobile: document.querySelector('[name="mobile"]').value,
      consent: document.querySelector('[name="consent"]').checked,
    };
    const loadingSubmit = document.querySelector('form button[type="submit"]');
    loadingSubmit.click();
    await new Promise(resolve => requestAnimationFrame(resolve));
    const firstLoading = { disabled: loadingSubmit.disabled, label: loadingSubmit.textContent.trim(), live: document.querySelector('.form-message').textContent.trim() };
    loadingSubmit.click();
    const duplicateLoading = { disabled: loadingSubmit.disabled, label: loadingSubmit.textContent.trim(), live: document.querySelector('.form-message').textContent.trim() };
    await new Promise(resolve => setTimeout(resolve, 400));
    const heading = document.querySelector('.inquiry-confirmation h2');
    const success = {
      heading: heading?.textContent.trim(),
      focused: document.activeElement === heading,
      live: document.querySelector('.inquiry-confirmation')?.getAttribute('aria-live'),
      restartType: document.querySelector('.inquiry-confirmation button')?.type,
    };
    document.querySelector('.inquiry-confirmation button').click();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const resetFields = ['name', 'mobile', 'email', 'company', 'message'].map(name => document.querySelector('[name="' + name + '"]').value);
    return {
      allowedPrefill,
      editedTopic,
      invalid,
      beforeLoading,
      firstLoading,
      duplicateLoading,
      success,
      reset: {
        topic: document.querySelector('[name="inquiryTopic"]').value,
        fields: resetFields,
        consent: document.querySelector('[name="consent"]').checked,
        errors: document.querySelectorAll('.field-error').length,
        focused: document.activeElement?.getAttribute('name'),
      },
    };
  })()`);

  assert.equal(states.allowedPrefill, "parts");
  assert.equal(states.editedTopic, "service");
  assert.deepEqual(states.invalid, { focus: "name", fields: ["name", "mobile", "consent"], described: true });
  assert.deepEqual(states.beforeLoading, { topic: "service", name: "Test User", mobile: "09171234567", consent: true });
  assert.deepEqual(states.firstLoading, { disabled: true, label: "Preparing your next step…", live: "Checking your details…" });
  assert.deepEqual(states.duplicateLoading, states.firstLoading);
  assert.deepEqual(states.success, {
    heading: "Thank you for your interest in Hino Cebu.",
    focused: true,
    live: "polite",
    restartType: "button",
  });
  assert.deepEqual(states.reset, { topic: "parts", fields: ["", "", "", "", ""], consent: false, errors: 0, focused: "inquiryTopic" });
});
