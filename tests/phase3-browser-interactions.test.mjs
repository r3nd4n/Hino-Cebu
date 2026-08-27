import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";

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

async function exists(location) {
  try {
    await stat(location);
    return true;
  } catch {
    return false;
  }
}

async function isolatedPort() {
  return new Promise((resolve, reject) => {
    const socket = createServer();
    socket.unref();
    socket.once("error", reject);
    socket.listen(0, "127.0.0.1", () => {
      const address = socket.address();
      socket.close(() => resolve(address.port));
    });
  });
}

async function waitFor(url, label, processHandle) {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    if (processHandle?.exitCode !== null) throw new Error(`${label} exited before readiness.\n${serverOutput}`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
      if (response.ok) return response;
      lastError = new Error(`${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`${label} did not become ready: ${lastError?.message ?? "unknown error"}`);
}

async function stop(processHandle) {
  if (!processHandle || processHandle.exitCode !== null) return;
  processHandle.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => processHandle.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);
  if (processHandle.exitCode === null) processHandle.kill("SIGKILL");
}

class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      const waiter = this.pending.get(message.id);
      if (!waiter) return;
      this.pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message));
      else waiter.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
}

async function openBrowserPage() {
  const response = await fetch(`${debugUrl}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  assert.equal(response.status, 200, "Chrome must create an isolated CDP page");
  const target = await response.json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  const cdp = new Cdp(socket);
  await Promise.all([cdp.send("Page.enable"), cdp.send("Runtime.enable")]);
  return { cdp, socket, target };
}

async function evaluate(expression) {
  const result = await browser.cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}

async function navigate(route) {
  await browser.cdp.send("Page.navigate", { url: `${baseUrl}${route}` });
  await new Promise((resolve) => setTimeout(resolve, 500));
  await evaluate(`new Promise(resolve => document.readyState === "complete" ? resolve() : addEventListener("load", resolve, { once: true }))`);
  await new Promise((resolve) => setTimeout(resolve, 150));
}

async function key(key, { shift = false } = {}) {
  const code = key === "Tab" ? "Tab" : key === "Escape" ? "Escape" : key;
  const virtualKeyCode = key === "Tab" ? 9 : key === "Escape" ? 27 : 0;
  const modifiers = shift ? 8 : 0;
  await browser.cdp.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key, code, modifiers, windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
  await browser.cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, code, modifiers, windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
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

  nextProcess = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(nextPort)], {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  nextProcess.stdout.on("data", (chunk) => { serverOutput += chunk; });
  nextProcess.stderr.on("data", (chunk) => { serverOutput += chunk; });

  chromeProcess = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${chromeProfile}`,
    "about:blank",
  ], { stdio: "ignore", windowsHide: true });

  await Promise.all([
    waitFor(`${baseUrl}/trucks`, "Next production server", nextProcess),
    waitFor(`${debugUrl}/json/version`, "Chrome debugging endpoint", chromeProcess),
  ]);
  browser = await openBrowserPage();
  await browser.cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
});

after(async () => {
  if (browser) {
    browser.socket.close();
    await fetch(`${debugUrl}/json/close/${browser.target.id}`).catch(() => {});
  }
  await Promise.all([stop(chromeProcess), stop(nextProcess)]);
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
      overflow: document.body.style.overflow,
    };
  })()`);
  assert.deepEqual(opened, { firstFocused: true, activeInside: true, inert: true, overflow: "hidden" });

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
    overflow: document.body.style.overflow,
  })`), { closed: true, restored: true, inertCleared: true, overflow: "" });
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
