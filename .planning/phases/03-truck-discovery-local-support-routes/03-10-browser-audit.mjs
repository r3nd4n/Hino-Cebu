import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  evaluate,
  exists,
  isolatedPort,
  openPage,
  pressKey,
  stopProcess,
  trackProcess,
  waitFor,
} from "../../../tests/support/browser-services.mjs";

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(".");
let baseUrl = process.env.PHASE3_BASE_URL;
let debugUrl = process.env.CHROME_DEBUG_URL;
const evidenceDir = path.resolve(".planning/phases/03-truck-discovery-local-support-routes/03-10-evidence");
const routes = [
  "/trucks",
  "/trucks/200-series",
  "/trucks/300-series",
  "/trucks/500-series",
  "/trucks/bus-puv",
  "/parts-service",
  "/contact",
  "/about",
];
const widths = [390, 768, 1024, 1440];

async function startOwnedServices() {
  if (baseUrl && debugUrl) return async () => {};
  if (baseUrl || debugUrl) throw new Error("Set both PHASE3_BASE_URL and CHROME_DEBUG_URL, or neither so the audit owns both services.");
  if (!(await exists(path.join(projectRoot, ".next", "BUILD_ID")))) {
    throw new Error("Browser acceptance requires a fresh production build. Run `npm run build` first.");
  }

  const chromeCandidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
  ].filter(Boolean);
  let chromePath;
  for (const candidate of chromeCandidates) {
    if (await exists(candidate)) { chromePath = candidate; break; }
  }
  if (!chromePath) throw new Error("Chrome was not found. Set CHROME_PATH to an installed Chrome executable.");

  const [nextPort, chromePort] = await Promise.all([isolatedPort(), isolatedPort()]);
  baseUrl = `http://127.0.0.1:${nextPort}`;
  debugUrl = `http://127.0.0.1:${chromePort}`;
  const chromeProfile = await fs.mkdtemp(path.join(os.tmpdir(), "hino-phase3-audit-"));
  let serverOutput = "";
  const nextProcess = trackProcess(spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(nextPort)], {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  }));
  nextProcess.stdout.on("data", (chunk) => { serverOutput += chunk; });
  nextProcess.stderr.on("data", (chunk) => { serverOutput += chunk; });
  const chromeProcess = trackProcess(spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${chromePort}`, `--user-data-dir=${chromeProfile}`, "about:blank",
  ], { stdio: "ignore", windowsHide: true }));

  try {
    await Promise.all([
      waitFor(`${baseUrl}/trucks`, "Next production server", nextProcess, () => serverOutput),
      waitFor(`${debugUrl}/json/version`, "Chrome debugging endpoint", chromeProcess),
    ]);
  } catch (error) {
    await Promise.all([stopProcess(chromeProcess), stopProcess(nextProcess)]);
    await fs.rm(chromeProfile, { recursive: true, force: true });
    throw error;
  }

  return async () => {
    await Promise.all([stopProcess(chromeProcess), stopProcess(nextProcess)]);
    await fs.rm(chromeProfile, { recursive: true, force: true });
  };
}

export async function navigate(cdp, url) {
  await cdp.send("Page.navigate", { url });
  await new Promise((resolve) => setTimeout(resolve, 550));
  await evaluate(cdp, `new Promise(resolve => document.readyState === "complete" ? resolve() : addEventListener("load", resolve, { once: true }))`);
  await new Promise((resolve) => setTimeout(resolve, 200));
  await evaluate(cdp, `new Promise(async resolve => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } scrollTo(0, document.documentElement.scrollHeight); await new Promise(r => setTimeout(r, 250)); await Promise.race([Promise.all([...document.images].map(image => image.decode().catch(() => null))), new Promise(r => setTimeout(r, 1200))]); scrollTo(0, 0); await new Promise(r => setTimeout(r, 120)); resolve(); })`);
}

const auditExpression = `(() => {
  const parse = (value) => {
    const match = value.match(/[\\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
    return { r: match[0], g: match[1], b: match[2], a: match[3] ?? 1 };
  };
  const blend = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const opaqueBackground = (element) => {
    let current = element;
    let color = parse("rgb(255,255,255)");
    while (current) {
      const candidate = parse(getComputedStyle(current).backgroundColor);
      if (candidate.a > 0) {
        color = blend(candidate, color);
        if (candidate.a === 1) break;
      }
      current = current.parentElement;
    }
    return color;
  };
  const luminance = ({ r, g, b }) => {
    const values = [r, g, b].map(value => {
      const channel = value / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    });
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  };
  const contrast = (a, b) => {
    const one = luminance(a); const two = luminance(b);
    return (Math.max(one, two) + .05) / (Math.min(one, two) + .05);
  };
  const visible = element => {
    const style = getComputedStyle(element); const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  };
  const interactive = [...document.querySelectorAll("a, button, input, select, textarea")].filter(visible);
  const actionSelector = ".button, .truck-listing-card, .mobile-action-bar a, .site-header__phone, .mobile-menu__actions a";
  const actions = [...document.querySelectorAll(actionSelector)].filter(visible).map((element) => {
    const style = getComputedStyle(element); const bg = opaqueBackground(element);
    return {
      label: (element.innerText || element.getAttribute("aria-label") || "").trim().replace(/\\s+/g, " ").slice(0, 100),
      selector: element.className,
      foreground: style.color,
      background: style.backgroundColor,
      border: style.borderColor,
      contrast: +contrast(parse(style.color), bg).toFixed(2),
      borderContrast: style.borderStyle === "none" || parseFloat(style.borderWidth) === 0 ? null : +contrast(parse(style.borderColor), bg).toFixed(2),
      target: { width: Math.round(element.getBoundingClientRect().width), height: Math.round(element.getBoundingClientRect().height) },
    };
  });
  const darkSecondary = [...document.querySelectorAll(".button--secondary")].filter(visible).map((element) => {
    const style = getComputedStyle(element); const bg = opaqueBackground(element);
    return {
      label: element.innerText.trim(),
      foreground: style.color,
      border: style.borderColor,
      background: "rgb(" + Math.round(bg.r) + ", " + Math.round(bg.g) + ", " + Math.round(bg.b) + ")",
      foregroundContrast: +contrast(parse(style.color), bg).toFixed(2),
      borderContrast: +contrast(parse(style.borderColor), bg).toFixed(2),
    };
  });
  const overflowElements = [...document.querySelectorAll("body *")].filter(visible).filter(element => {
    const rect = element.getBoundingClientRect();
    return rect.left < -1 || rect.right > innerWidth + 1;
  }).map(element => ({ tag: element.tagName, className: element.className?.toString().slice(0, 100), rect: element.getBoundingClientRect().toJSON() })).slice(0, 10);
  const text = document.body.innerText;
  const html = document.documentElement.outerHTML;
  const candidateFacts = ["(032) 346 3322", "tel:+63323463322", "8WC6+Q46", "8:00 AM", "5:00 PM"];
  const forbiddenCopy = ["Promotions", "hino.com.ph", "we will follow up", "inquiry was sent", "inquiry was received", "couldn't send"];
  const inquiryLinks = [...document.querySelectorAll('a[href*="/contact"]')].map(a => a.getAttribute("href"));
  const mobileBar = document.querySelector(".mobile-action-bar");
  const bodyPaddingBottom = parseFloat(getComputedStyle(document.body).paddingBottom);
  const barHeight = mobileBar && visible(mobileBar) ? mobileBar.getBoundingClientRect().height : 0;
  return {
    title: document.title,
    h1Count: document.querySelectorAll("h1").length,
    viewport: { width: innerWidth, height: innerHeight, visualWidth: visualViewport?.width ?? innerWidth },
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    overflowElements,
    brokenImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
    actions,
    darkSecondary,
    smallestTarget: interactive.reduce((smallest, element) => {
      const rect = element.getBoundingClientRect();
      if (element.matches('input[type="checkbox"]')) return smallest;
      return Math.min(smallest, rect.height, rect.width);
    }, Infinity),
    mobileClearance: { bodyPaddingBottom, barHeight, passes: !barHeight || bodyPaddingBottom >= barHeight - 2 },
    inquiryLinks,
    candidateFactLeaks: candidateFacts.filter(value => text.includes(value) || html.includes(value)),
    activeOperationalLinks: [...document.querySelectorAll('a[href^="tel:"], a[href*="google.com/maps"], a[href*="maps.app"]')].map(a => a.href),
    forbiddenCopy: forbiddenCopy.filter(value => text.toLowerCase().includes(value.toLowerCase()) || html.toLowerCase().includes(value.toLowerCase())),
    awaitingStates: [...document.querySelectorAll("p")].map(p => p.innerText.trim()).filter(value => /awaiting confirmation/i.test(value)),
    motion: {
      rootScrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      maxTransitionMs: Math.max(...[...document.querySelectorAll("*")].map(element => parseFloat(getComputedStyle(element).transitionDuration) * 1000 || 0)),
      cardTransform: document.querySelector(".truck-listing-card") ? getComputedStyle(document.querySelector(".truck-listing-card")).transform : null,
    },
  };
})()`;

async function screenshot(cdp, file) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true });
  await fs.writeFile(file, Buffer.from(data, "base64"));
}

async function runAudit() {
  await fs.mkdir(evidenceDir, { recursive: true });
  const { cdp, socket, target } = await openPage(debugUrl);
  const matrix = [];
  try {
    for (const width of widths) {
      await cdp.send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
      await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
      for (const route of routes) {
        await navigate(cdp, `${baseUrl}${route}`);
        const audit = await evaluate(cdp, auditExpression);
        const slug = route.slice(1).replaceAll("/", "-");
        await screenshot(cdp, path.join(evidenceDir, `${String(width)}-${slug}.png`));
        const failures = [];
        if (audit.viewport.width !== width) failures.push(`viewport is ${audit.viewport.width}, expected ${width}`);
        if (audit.scrollWidth > width) failures.push(`horizontal overflow ${audit.scrollWidth - width}px`);
        if (audit.overflowElements.length) failures.push(`${audit.overflowElements.length} elements cross viewport bounds`);
        if (audit.brokenImages.length) failures.push(`${audit.brokenImages.length} broken images`);
        if (audit.h1Count !== 1) failures.push(`${audit.h1Count} H1 elements`);
        if (!audit.inquiryLinks.some(link => link?.includes("/contact"))) failures.push("no inquiry path");
        if (audit.candidateFactLeaks.length) failures.push(`candidate facts leaked: ${audit.candidateFactLeaks.join(", ")}`);
        if (audit.activeOperationalLinks.length) failures.push(`operational links leaked: ${audit.activeOperationalLinks.join(", ")}`);
        if (audit.forbiddenCopy.length) failures.push(`forbidden copy: ${audit.forbiddenCopy.join(", ")}`);
        if (!audit.mobileClearance.passes) failures.push("mobile action bar lacks body clearance");
        for (const action of audit.actions) if (action.contrast < 4.5) failures.push(`action contrast ${action.contrast}: ${action.label}`);
        for (const action of audit.darkSecondary) {
          if (action.foregroundContrast < 4.5 || action.borderContrast < 3) failures.push(`dark secondary contrast: ${action.label}`);
        }
        if (audit.motion.rootScrollBehavior !== "auto" || audit.motion.maxTransitionMs > 1) failures.push("reduced-motion override is ineffective");
        matrix.push({ route, width, result: failures.length ? "FAIL" : "PASS", failures, audit });
      }
    }

    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    await navigate(cdp, `${baseUrl}/trucks`);
    await pressKey(cdp, "Tab", "Tab");
    await new Promise(r => setTimeout(r, 50));
    const skipFocus = await evaluate(cdp, `({ focused: document.activeElement === document.querySelector('.skip-link'), top: getComputedStyle(document.querySelector('.skip-link')).top, outline: getComputedStyle(document.querySelector('.skip-link')).outlineStyle, boxShadow: getComputedStyle(document.querySelector('.skip-link')).boxShadow })`);
    await pressKey(cdp, "Enter", "Enter");
    const skipTarget = await evaluate(cdp, `document.activeElement?.id`);
    await evaluate(cdp, `document.querySelector('.mobile-menu__trigger').focus()`);
    await pressKey(cdp, "Enter", "Enter");
    await new Promise(r => setTimeout(r, 50));
    const menuOpen = await evaluate(cdp, `(() => {
      const panel=document.querySelector('.mobile-menu__panel');
      return {
        expanded: document.querySelector('.mobile-menu__trigger').getAttribute('aria-expanded') === 'true',
        firstFocused: document.activeElement === panel?.querySelector('a'),
        activeInside: panel?.contains(document.activeElement) ?? false,
        backgroundInert: [document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('.mobile-action-bar')].every(element => element?.inert),
        identityInert: document.querySelector('.site-identity')?.inert === true,
        skipLinkInert: document.querySelector('.skip-link')?.inert === true,
        overflow: document.body.style.overflow,
      };
    })()`);
    await evaluate(cdp, `(() => { const items=[...document.querySelectorAll('.mobile-menu__panel a')]; items.at(-1).focus(); })()`);
    await pressKey(cdp, "Tab", "Tab");
    const forwardWrapped = await evaluate(cdp, `document.activeElement === document.querySelector('.mobile-menu__panel a')`);
    await pressKey(cdp, "Tab", "Tab", { shift: true });
    const backwardWrapped = await evaluate(cdp, `document.activeElement === [...document.querySelectorAll('.mobile-menu__panel a')].at(-1)`);
    await pressKey(cdp, "Escape", "Escape");
    await new Promise(r => setTimeout(r, 50));
    const menuClosed = await evaluate(cdp, `({
      closed: document.querySelector('.mobile-menu__trigger').getAttribute('aria-expanded') === 'false',
      focusRestored: document.activeElement === document.querySelector('.mobile-menu__trigger'),
      inertCleared: [document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('.mobile-action-bar')].every(element => !element?.inert),
      identityRestored: document.querySelector('.site-identity')?.inert === false,
      skipLinkRestored: document.querySelector('.skip-link')?.inert === false,
      overflowRestored: document.body.style.overflow === '',
    })`);
    const keyboard = { skipFocus, skipTarget, menuOpen, forwardWrapped, backwardWrapped, ...menuClosed };

    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 195, height: 450, deviceScaleFactor: 2, mobile: true });
    await navigate(cdp, `${baseUrl}/trucks`);
    const zoom = await evaluate(cdp, `(() => {
      scrollTo(0, document.documentElement.scrollHeight);
      const bar = document.querySelector('.mobile-action-bar')?.getBoundingClientRect();
      const last = [...document.querySelectorAll('main a, main button, main input, main select, main textarea')].filter(e => { const r=e.getBoundingClientRect(); return r.width && r.height; }).at(-1)?.getBoundingClientRect();
      return { effectiveCssWidth: innerWidth, deviceScaleFactor: devicePixelRatio, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, bodyPaddingBottom: parseFloat(getComputedStyle(document.body).paddingBottom), barHeight: bar?.height ?? 0, lastControlClear: !bar || !last || last.bottom <= bar.top + 1 };
    })()`);

    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });

    await navigate(cdp, `${baseUrl}/contact?topic=arbitrary#inquiry`);
    const fallbackTopic = await evaluate(cdp, `document.querySelector('[name="inquiryTopic"]').value`);
    await navigate(cdp, `${baseUrl}/contact?topic=parts#inquiry`);
    const form = await evaluate(cdp, `(async () => {
      const set = (selector, value) => { const e=document.querySelector(selector); const descriptor=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e), 'value'); descriptor.set.call(e,value); e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); };
      const select = document.querySelector('[name="inquiryTopic"]');
      const allowedPrefill = select.value;
      set('[name="inquiryTopic"]', 'service');
      const editedTopic = select.value;
      document.querySelector('form button[type="submit"]').click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const invalid = {
        focus: document.activeElement?.getAttribute('name'),
        errors: [...document.querySelectorAll('[aria-invalid="true"]')].map(e => e.name),
        described: [...document.querySelectorAll('[aria-invalid="true"]')].every(e => e.getAttribute('aria-describedby') && document.getElementById(e.getAttribute('aria-describedby'))),
      };
      set('[name="name"]', 'Test User'); set('[name="mobile"]', '09171234567');
      const consent=document.querySelector('[name="consent"]'); consent.click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const submit=document.querySelector('form button[type="submit"]'); submit.click();
      await new Promise(r => requestAnimationFrame(r));
      const loading = { disabled: submit.disabled, label: submit.textContent.trim(), live: document.querySelector('.form-message').textContent.trim() };
      submit.click();
      const duplicate = { disabled: submit.disabled, label: submit.textContent.trim(), live: document.querySelector('.form-message').textContent.trim() };
      await new Promise(r => setTimeout(r, 400));
      const heading=document.querySelector('.inquiry-confirmation h2');
      const success = { heading: heading?.textContent.trim(), focused: document.activeElement === heading, liveRegion: document.querySelector('.inquiry-confirmation')?.getAttribute('aria-live'), text: document.querySelector('.inquiry-confirmation')?.innerText };
      document.querySelector('.inquiry-confirmation button').click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      return {
        allowedPrefill, editedTopic, invalid, loading, duplicate, success,
        reset: {
          topic: document.querySelector('[name="inquiryTopic"]').value,
          fields: ['name','mobile','email','company','message'].map(name => document.querySelector('[name="' + name + '"]').value),
          consent: document.querySelector('[name="consent"]').checked,
          errors: document.querySelectorAll('.field-error').length,
          focused: document.activeElement?.getAttribute('name'),
        },
      };
    })()`);
    await navigate(cdp, `${baseUrl}/`);
    const homepageConsent = await evaluate(cdp, `(async () => {
      document.querySelector('.homepage-quote button[type="submit"]').click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const consent=document.querySelector('#quote-consent'); const error=document.getElementById(consent.getAttribute('aria-describedby'));
      return { invalid: consent.getAttribute('aria-invalid'), described: Boolean(error?.innerText), firstFocus: document.activeElement?.id };
    })()`);
    const interactions = { keyboard, zoom, homepageConsent, topics: { fallbackTopic, ...form } };
    const report = { generatedAt: new Date().toISOString(), baseUrl, matrix, interactions };
    await fs.writeFile(path.join(evidenceDir, "browser-audit.json"), JSON.stringify(report, null, 2));
    const failed = matrix.filter(cell => cell.result === "FAIL");
    const interactionFailures = [];
    if (!menuOpen.expanded || !menuOpen.firstFocused || !menuOpen.activeInside || !menuOpen.backgroundInert || !menuOpen.identityInert || !menuOpen.skipLinkInert || menuOpen.overflow !== "hidden") interactionFailures.push("mobile menu open/focus/inert state");
    if (!forwardWrapped || !backwardWrapped || !menuClosed.closed || !menuClosed.focusRestored || !menuClosed.inertCleared || !menuClosed.identityRestored || !menuClosed.skipLinkRestored || !menuClosed.overflowRestored) interactionFailures.push("mobile menu containment/cleanup state");
    if (homepageConsent.invalid !== "true" || !homepageConsent.described || homepageConsent.firstFocus !== "quote-name") interactionFailures.push("homepage consent invalid state");
    if (fallbackTopic !== "general" || form.allowedPrefill !== "parts" || form.editedTopic !== "service" || form.invalid.focus !== "name" || !form.invalid.described) interactionFailures.push("Contact topic/invalid state");
    if (!form.loading.disabled || JSON.stringify(form.duplicate) !== JSON.stringify(form.loading) || !form.success.focused || form.success.liveRegion !== "polite") interactionFailures.push("Contact loading/success state");
    if (form.reset.topic !== "parts" || form.reset.fields.some(Boolean) || form.reset.consent || form.reset.errors || form.reset.focused !== "inquiryTopic") interactionFailures.push("Contact reset state");
    console.log(JSON.stringify({ cells: matrix.length, passed: matrix.length - failed.length, failed: failed.map(({ route, width, failures }) => ({ route, width, failures })), interactionFailures, interactions }, null, 2));
    if (failed.length || interactionFailures.length) process.exitCode = 1;
  } finally {
    socket.close();
    await fetch(`${debugUrl}/json/close/${target.id}`).catch(() => {});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const stopServices = await startOwnedServices();
  try {
    await runAudit();
  } finally {
    await stopServices();
  }
}
