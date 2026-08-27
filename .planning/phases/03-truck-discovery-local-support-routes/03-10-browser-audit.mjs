import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.PHASE3_BASE_URL ?? "http://127.0.0.1:4310";
const debugUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9222";
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

class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id) return;
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

async function openPage() {
  const response = await fetch(`${debugUrl}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (!response.ok) throw new Error(`Chrome target creation failed: ${response.status}`);
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

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "Browser evaluation failed");
  return result.result.value;
}

async function navigate(cdp, url) {
  await cdp.send("Page.navigate", { url });
  await new Promise((resolve) => setTimeout(resolve, 550));
  await evaluate(cdp, `new Promise(resolve => document.readyState === "complete" ? resolve() : addEventListener("load", resolve, { once: true }))`);
  await new Promise((resolve) => setTimeout(resolve, 200));
  await evaluate(cdp, `new Promise(async resolve => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } scrollTo(0, document.documentElement.scrollHeight); await new Promise(r => setTimeout(r, 250)); await Promise.race([Promise.all([...document.images].map(image => image.decode().catch(() => null))), new Promise(r => setTimeout(r, 1200))]); scrollTo(0, 0); await new Promise(r => setTimeout(r, 120)); resolve(); })`);
}

async function pressKey(cdp, key, code = key) {
  const virtualKeyCode = key === "Enter" ? 13 : key === "Escape" ? 27 : key === "Tab" ? 9 : 0;
  await cdp.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key, code, windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
  if (key === "Enter") await cdp.send("Input.dispatchKeyEvent", { type: "char", key, code, text: "\r", unmodifiedText: "\r", windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
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

async function run() {
  await fs.mkdir(evidenceDir, { recursive: true });
  const { cdp, socket, target } = await openPage();
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
    const menuOpen = await evaluate(cdp, `document.querySelector('.mobile-menu__trigger').getAttribute('aria-expanded') === 'true' && getComputedStyle(document.body).overflow === 'hidden'`);
    await pressKey(cdp, "Escape", "Escape");
    await new Promise(r => setTimeout(r, 50));
    const menuClosed = await evaluate(cdp, `({ closed: document.querySelector('.mobile-menu__trigger').getAttribute('aria-expanded') === 'false', focusRestored: document.activeElement === document.querySelector('.mobile-menu__trigger') })`);
    const keyboard = { skipFocus, skipTarget, menuOpen, ...menuClosed };

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
      const select = document.querySelector('[name="inquiryTopic"]');
      const allowedPrefill = select.value;
      select.value = 'service'; select.dispatchEvent(new Event('change', { bubbles: true }));
      const editedTopic = select.value;
      document.querySelector('form button[type="submit"]').click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const invalid = {
        focus: document.activeElement?.getAttribute('name'),
        errors: [...document.querySelectorAll('[aria-invalid="true"]')].map(e => e.name),
        described: [...document.querySelectorAll('[aria-invalid="true"]')].every(e => e.getAttribute('aria-describedby') && document.getElementById(e.getAttribute('aria-describedby'))),
      };
      const set = (selector, value) => { const e=document.querySelector(selector); const descriptor=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e), 'value'); descriptor.set.call(e,value); e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); };
      set('[name="name"]', 'Test User'); set('[name="mobile"]', '09171234567');
      const consent=document.querySelector('[name="consent"]'); consent.click();
      const submit=document.querySelector('form button[type="submit"]'); submit.click(); submit.click();
      await new Promise(r => setTimeout(r, 30));
      const loading = { disabled: submit.disabled, label: submit.innerText, live: document.querySelector('.form-message').innerText };
      await new Promise(r => setTimeout(r, 400));
      const heading=document.querySelector('.inquiry-confirmation h2');
      return { allowedPrefill, editedTopic, invalid, loading, success: { heading: heading?.innerText, focused: document.activeElement === heading, liveRegion: document.querySelector('.inquiry-confirmation')?.getAttribute('aria-live'), text: document.querySelector('.inquiry-confirmation')?.innerText } };
    })()`);
    const interactions = { keyboard, zoom, topics: { fallbackTopic, ...form } };
    const report = { generatedAt: new Date().toISOString(), baseUrl, matrix, interactions };
    await fs.writeFile(path.join(evidenceDir, "browser-audit.json"), JSON.stringify(report, null, 2));
    const failed = matrix.filter(cell => cell.result === "FAIL");
    console.log(JSON.stringify({ cells: matrix.length, passed: matrix.length - failed.length, failed: failed.map(({ route, width, failures }) => ({ route, width, failures })), interactions }, null, 2));
    if (failed.length) process.exitCode = 1;
  } finally {
    socket.close();
    await fetch(`${debugUrl}/json/close/${target.id}`).catch(() => {});
  }
}

await run();
