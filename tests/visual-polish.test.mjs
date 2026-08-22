import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import {
  buildMarketingTagBootstrap,
  deniedMarketingConsent,
  parseMarketingConsent,
} from "../src/lib/marketing-consent.ts";

function readSource(path) {
  return readFileSync(path, "utf8");
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(?:js|mjs|ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

const publicLayoutPath = "src/app/(public)/layout.tsx";
const manualPath = ".planning/phases/01.1-public-website-visual-polish-and-engagement/01.1-MANUAL-VERIFICATION.md";

test("P01-T02: manual evidence template covers the complete supporting verification contract", () => {
  assert.equal(existsSync(manualPath), true);
  const manual = readSource(manualPath);
  for (const viewport of ["320px", "720px", "1059px", "1060px", "1440px"]) assert.match(manual, new RegExp(`\\| ${viewport.replace("px", "px")} \\|`));
  for (const evidence of [
    "72px header", "safe-area", "hero crop", "keyboard", "Escape", "focus return", "aria-current",
    "44px", "3px focus", "white", "charcoal", "Hino red", "4.5:1", "3:1", "screen reader",
    "reduced motion on", "reduced motion off", "non-interactive social", "GTM", "GA4", "Meta",
    "absent consent", "denied consent", "Truck Finder", "campaign attribution", "QUAL-03", "QUAL-04",
    "Phase 3", "BLOCKED — downstream requirement",
  ]) assert.match(manual, new RegExp(evidence, "i"), evidence);
  const resultCells = manual.split("\n").filter((line) => /^\|\s*20\d\d-/.test(line));
  assert.ok(resultCells.length >= 5);
  assert.ok(resultCells.every((line) => /\| PENDING \|/.test(line)));
  assert.doesNotMatch(manual, /WCAG (?:2\.2 )?AA certified/i);
});

test("P02-T01: social records validate closed states and expose href only for verified profiles", () => {
  const site = readSource("src/content/site.ts");
  assert.match(site, /"unverified"\s*\|\s*"verified"\s*\|\s*"withheld"/);
  assert.match(site, /getEligibleSocial/);
  assert.match(site, /facebook\.com|instagram\.com|youtube\.com/);
  assert.match(site, /status\s*===\s*["']verified["'][\s\S]{0,500}href/);
  assert.doesNotMatch(site, /unverified[\s\S]{0,180}href:/);
});

test("P02-T02: server layout derives canonical eligible task-first navigation without literal shell destinations", () => {
  const layout = readSource(publicLayoutPath);
  const labels = ["Trucks", "Find Your Truck", "Parts", "Service", "Hino Cebu", "Get a Quote"];
  let cursor = -1;
  for (const label of labels) {
    const next = layout.indexOf(`"${label}"`);
    assert.ok(next > cursor, `${label} must appear in canonical order`);
    cursor = next;
  }
  assert.match(layout, /getEligibleRoutes/);
  assert.doesNotMatch(layout, /navigation\s*=\s*\[[\s\S]*href:\s*["']\/(?:trucks|parts|service|quote)/);
});

test("P03-T01: root typography loads Barlow with only 400 and 700 public weights", () => {
  const root = readSource("src/app/layout.tsx");
  const css = readSource("src/app/globals.css");
  assert.match(root, /Barlow/);
  assert.match(root, /weight:\s*\[["']400["'],\s*["']700["']\]/);
  assert.match(root, /display:\s*["']swap["']/);
  assert.match(css, /font-family:[^;]*(?:Barlow|--font-barlow)[^;]*Arial[^;]*sans-serif/);
  assert.doesNotMatch(root, /["'](?:100|200|300|500|600|800|900)["']/);
});

test("P03-T02: public tokens enforce focus separation, exact restrained motion, targets, and safe area", () => {
  const css = readSource("src/app/globals.css");
  assert.match(css, /--header:\s*72px/);
  assert.match(css, /--motion[^:]*:\s*200ms/);
  assert.match(css, /ease-out/);
  assert.match(css, /:focus-visible[\s\S]{0,180}outline:\s*3px/);
  assert.match(css, /(?:box-shadow|outline)[^;]*(?:white|#fff)/i);
  assert.match(css, /min-(?:height|width):\s*44px/);
  assert.match(css, /66px[^\n]*env\(safe-area-inset-bottom\)|env\(safe-area-inset-bottom\)[^\n]*66px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*transition:\s*none\s*!important[\s\S]*animation:\s*none\s*!important/);
});

test("P03-T03: shared hero and cards provide optional stable responsive media without fake interaction", () => {
  const shared = readSource("src/components/ui/Shared.tsx");
  const card = readSource("src/components/trucks/TruckCard.tsx");
  assert.match(shared, /PageHero[\s\S]{0,700}(?:media|image)/i);
  assert.match(shared, /(?:dark|light)/);
  assert.match(shared, /<h1>/);
  assert.match(card, /<Image[\s\S]{0,250}\bfill\b[\s\S]{0,250}\bsizes=/);
  assert.match(card, /alt=\{`\$\{truck\.name\}/);
  assert.doesNotMatch(card, /<article[^>]*(?:onClick|role=["']link)|cursor-pointer/);
});

test("P04-T01: public server shell wires only governed navigation, social, legal, branch, and action DTOs", () => {
  const layout = readSource(publicLayoutPath);
  assert.doesNotMatch(layout, /["']use client["']|usePathname/);
  for (const selector of ["getEligibleRoutes", "getEligibleBranch", "getEligibleContactActions", "getEligibleSocial"]) assert.match(layout, new RegExp(selector));
  assert.match(layout, /<Header[^>]*navigation=\{navigation\}/s);
  assert.match(layout, /<Footer[^>]*social/s);
  assert.doesNotMatch(layout, /expired|pending|provisional|diagnostic|withheld wording/i);
});

test("P04-T02: header disclosure removes utility strip and preserves exact mobile order and keyboard lifecycle", () => {
  const header = readSource("src/components/layout/Header.tsx");
  assert.doesNotMatch(header, /utility-bar|utility-inner/);
  assert.match(header, /aria-expanded=\{open\}/);
  assert.match(header, /Escape/);
  assert.match(header, /\.focus\(\)/);
  assert.match(header, /pathname\s*===\s*item\.href[\s\S]{0,120}pathname\.startsWith\(item\.href\s*\+\s*["']\/["']\)/);
  assert.match(header, /width=\{124\}[\s\S]{0,80}height=\{30\}/);
  assert.match(header, />Cebu</);
  const order = ["Trucks", "Find Your Truck", "Parts", "Service", "Hino Cebu", "Call Hino Cebu", "Get a Quote"];
  let cursor = -1;
  for (const label of order) { const next = header.indexOf(label); assert.ok(next > cursor, label); cursor = next; }
});

test("P04-T03: footer social safety and responsive eligible actions preserve honest semantics", () => {
  const footer = readSource("src/components/layout/Footer.tsx");
  const mobile = readSource("src/components/layout/StickyMobileActions.tsx");
  assert.match(footer, /hino-logo\.png/);
  assert.match(footer, /Official Hino Cebu social profiles are being verified\./);
  assert.match(footer, /target=["']_blank["'][\s\S]{0,120}rel=["']noopener noreferrer["']/);
  assert.match(footer, /opens in a new tab/);
  assert.doesNotMatch(footer, /status\s*===\s*["']unverified["'][\s\S]{0,250}<a/);
  for (const label of ["Call Hino Cebu", "Get a Quote", "Get Directions"]) assert.match(mobile, new RegExp(label));
  assert.match(mobile, /slice\(0,\s*3\)/);
  assert.match(mobile, /mobile_bar/);
});

test("P05-T01: homepage owns the sole truthful preloaded responsive hero image", () => {
  const sources = sourceFiles("src").map(readSource).join("\n");
  const home = readSource("src/app/(public)/page.tsx");
  assert.equal((sources.match(/\bpreload(?:=\{true\})?/g) ?? []).length, 1);
  assert.match(home, /hino-300\.jpg/);
  assert.match(home, /\bpreload\b/);
  assert.match(home, /sizes=["'][^"']*719px[^"']*1059px[^"']*58vw/);
  assert.doesNotMatch(home, /available in Cebu|Cebu inventory|in stock/i);
});

test("P05-T02: truck card and detail media retain fixed geometry, contextual alt, sizes, and national caveat", () => {
  const card = readSource("src/components/trucks/TruckCard.tsx");
  const detail = readSource("src/app/(public)/trucks/[slug]/page.tsx");
  for (const source of [card, detail]) {
    assert.match(source, /<Image/);
    assert.match(source, /\bfill\b/);
    assert.match(source, /\bsizes=/);
    assert.doesNotMatch(source, /\bpriority\b|\bpreload\b/);
  }
  assert.match(detail, /official|national|Philippines/i);
  assert.match(detail, /availability/i);
});

test("P06-T01: support media is a typed eligible DTO consumed by thin inquiry routes", () => {
  const services = readSource("src/content/services.ts");
  for (const asset of ["genuine-parts.png", "quality-service.jpg", "financial-services.jpg"]) assert.match(services, new RegExp(asset.replace(".", "\\.")));
  assert.match(services, /(?:image|media).*(?:alt|source)/s);
  for (const route of ["parts", "service", "financing"]) {
    const source = readSource(`src/app/(public)/${route}/page.tsx`);
    assert.match(source, /getEligible/);
    assert.match(source, /<InquiryPage/);
    assert.doesNotMatch(source, /images\/official|pending|approval|withheld/i);
  }
});

test("P06-T02: inquiry composition renders optional responsive media while branch remains image-free", () => {
  const inquiry = readSource("src/components/marketing/InquiryPage.tsx");
  const branch = readSource("src/app/(public)/hino-cebu/page.tsx");
  assert.match(inquiry, /image\?/);
  assert.match(inquiry, /<Image[\s\S]{0,300}\bfill\b[\s\S]{0,300}\bsizes=/);
  assert.doesNotMatch(branch, /PlaceholderVisual|quality-service\.jpg|financial-services\.jpg|genuine-parts\.png/);
});

test("P07-T01: strict versioned consent parsing grants analytics and advertising separately and fails closed", () => {
  const denied = { analytics: false, advertising: false };
  assert.deepEqual(deniedMarketingConsent, denied);
  for (const preference of [
    null,
    "malformed",
    "{}",
    JSON.stringify({ version: 0, analytics: "granted", advertising: "granted" }),
    JSON.stringify({ version: 1, analytics: true, advertising: false }),
    JSON.stringify({ version: 1, analytics: "unknown", advertising: "denied" }),
    JSON.stringify({ version: 1, analytics: "denied", advertising: "denied", extra: true }),
  ]) assert.deepEqual(parseMarketingConsent(preference), denied);

  assert.deepEqual(
    parseMarketingConsent(JSON.stringify({ version: 1, analytics: "granted", advertising: "denied" })),
    { analytics: true, advertising: false },
  );
  assert.deepEqual(
    parseMarketingConsent(JSON.stringify({ version: 1, analytics: "denied", advertising: "granted" })),
    { analytics: false, advertising: true },
  );

  const runBootstrap = (preference, identifiers = {
    gtmId: "GTM-ABC123",
    ga4Id: "G-ABC123",
    metaPixelId: "1234567890",
  }) => {
    const inserted = [];
    const context = {
      localStorage: { getItem: () => preference },
      document: {
        createElement: () => ({}),
        head: { appendChild: (element) => inserted.push(element.src) },
      },
    };
    context.window = context;
    vm.runInNewContext(buildMarketingTagBootstrap(identifiers), context);
    return { context, inserted };
  };

  for (const preference of [
    null,
    "malformed",
    JSON.stringify({ version: 0, analytics: "granted", advertising: "granted" }),
    JSON.stringify({ version: 1, analytics: "denied", advertising: "denied" }),
  ]) {
    const { context, inserted } = runBootstrap(preference);
    assert.deepEqual(inserted, []);
    assert.equal(context.dataLayer, undefined);
    assert.equal(context.gtag, undefined);
    assert.equal(context.fbq, undefined);
  }

  const analyticsOnly = runBootstrap(JSON.stringify({ version: 1, analytics: "granted", advertising: "denied" }));
  assert.deepEqual(analyticsOnly.inserted, ["https://www.googletagmanager.com/gtag/js?id=G-ABC123"]);
  assert.equal(typeof analyticsOnly.context.gtag, "function");
  assert.equal(analyticsOnly.context.fbq, undefined);

  const advertisingOnly = runBootstrap(JSON.stringify({ version: 1, analytics: "denied", advertising: "granted" }));
  assert.deepEqual(advertisingOnly.inserted, ["https://connect.facebook.net/en_US/fbevents.js"]);
  assert.equal(advertisingOnly.context.gtag, undefined);
  assert.equal(typeof advertisingOnly.context.fbq, "function");

  const both = runBootstrap(JSON.stringify({ version: 1, analytics: "granted", advertising: "granted" }));
  assert.ok(both.inserted.includes("https://www.googletagmanager.com/gtm.js?id=GTM-ABC123"));
  assert.ok(both.inserted.includes("https://www.googletagmanager.com/gtag/js?id=G-ABC123"));
  assert.ok(both.inserted.includes("https://connect.facebook.net/en_US/fbevents.js"));

  const malformedIds = runBootstrap(
    JSON.stringify({ version: 1, analytics: "granted", advertising: "granted" }),
    { gtmId: "GTM-</script>", ga4Id: "UA-bad", metaPixelId: "1;alert(1)" },
  );
  assert.deepEqual(malformedIds.inserted, []);

  const marketing = readSource("src/components/marketing/MarketingTags.tsx");
  assert.match(marketing, /buildMarketingTagBootstrap/);
  assert.doesNotMatch(marketing, /<Script[^>]+src=/);
});

test("P07-T02: public layout and analytics wire optional providers through one fail-closed boundary", () => {
  const consentPath = "src/lib/marketing-consent.ts";
  const providerPattern = /googletagmanager\.com|google-analytics\.com|connect\.facebook\.net/;
  for (const path of sourceFiles("src")) {
    if (path.replaceAll("\\", "/") === consentPath) continue;
    assert.doesNotMatch(readSource(path), providerPattern, path);
  }

  const analyticsSource = readSource("src/lib/analytics.ts");
  const compiledAnalytics = ts.transpileModule(analyticsSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const runTrack = (consent) => {
    const calls = { dataLayer: [], gtag: [], fbq: [] };
    const context = {
      module: { exports: {} },
      exports: {},
      require: (specifier) => {
        assert.match(specifier, /marketing-consent/);
        return { getStoredMarketingConsent: () => consent };
      },
      process: { env: { NEXT_PUBLIC_GA4_ID: "G-ABC123", NEXT_PUBLIC_META_PIXEL_ID: "1234567890" } },
      window: {
        dataLayer: { push: (payload) => calls.dataLayer.push(payload) },
        gtag: (...args) => calls.gtag.push(args),
        fbq: (...args) => calls.fbq.push(args),
      },
    };
    context.exports = context.module.exports;
    vm.runInNewContext(compiledAnalytics, context);
    context.module.exports.track("phone_click", { location: "footer", omitted: undefined });
    return calls;
  };

  assert.deepEqual(runTrack({ analytics: false, advertising: false }), { dataLayer: [], gtag: [], fbq: [] });
  const analyticsOnly = runTrack({ analytics: true, advertising: false });
  assert.equal(analyticsOnly.dataLayer.length, 1);
  assert.equal(analyticsOnly.gtag.length, 1);
  assert.deepEqual(analyticsOnly.fbq, []);
  assert.equal(Object.hasOwn(analyticsOnly.dataLayer[0], "omitted"), false);
  const advertisingOnly = runTrack({ analytics: false, advertising: true });
  assert.deepEqual(advertisingOnly.dataLayer, []);
  assert.deepEqual(advertisingOnly.gtag, []);
  assert.equal(advertisingOnly.fbq.length, 1);

  const layout = readSource(publicLayoutPath);
  const rootLayout = readSource("src/app/layout.tsx");
  assert.equal((layout.match(/<MarketingTags/g) ?? []).length, 1);
  assert.doesNotMatch(rootLayout, /MarketingTags/);
  assert.doesNotMatch(layout, /["']use client["']/);
  assert.match(analyticsSource, /getStoredMarketingConsent/);
  assert.match(analyticsSource, /analytics[\s\S]{0,220}gtag/);
  assert.match(analyticsSource, /advertising[\s\S]{0,220}fbq/);
  assert.match(analyticsSource, /Record<string, string \| number \| boolean \| undefined>/);
});

test("P08-T01: dependency-free performance checker enforces numeric source and gzip build budgets in check", () => {
  const packageJson = JSON.parse(readSource("package.json"));
  assert.match(packageJson.scripts["performance:budget"] ?? "", /node/);
  assert.match(packageJson.scripts.check, /next build|npm run build/);
  assert.match(packageJson.scripts.check, /performance:budget/);
  const checkerPath = "scripts/check-performance-budget.mjs";
  assert.equal(existsSync(checkerPath), true);
  const checker = readSource(checkerPath);
  for (const budget of [260000, 90000, 20000, 5, 1, 1050000]) assert.match(checker, new RegExp(`\\b${budget}\\b`));
  assert.match(checker, /gzip/i);
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  assert.deepEqual(Object.keys(dependencies).sort(), [
    "@types/node", "@types/react", "@types/react-dom", "eslint", "eslint-config-next", "next", "react", "react-dom", "typescript", "zod",
  ]);
  assert.equal(sourceFiles("src").filter((path) => /^\s*["']use client["']/m.test(readSource(path))).length <= 5, true);
  assert.equal(sourceFiles("src").filter((path) => /social-feed|instagram-media|facebook-post|tiktok-embed/i.test(readSource(path))).length, 0);
  for (const path of readdirSync("public/images/official").map((name) => join("public/images/official", name))) {
    if (/\.(?:png|jpe?g|webp)$/i.test(path)) assert.ok(statSync(path).size <= 1050000, path);
  }
});
