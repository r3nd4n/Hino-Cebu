import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const readSource = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

const srcRoot = new URL("../src/", import.meta.url);

async function listSourceFiles(directory = srcRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const location = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
    if (entry.isDirectory()) return listSourceFiles(location);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [location] : [];
  }));
  return files.flat();
}

function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function classifyGlobalSelectors(file, source) {
  const occurrences = [];
  const styleBlock = /<style(?<attributes>\s+[^>]*)?>\s*\{?`(?<css>[\s\S]*?)`\}?\s*<\/style>/g;

  for (const block of source.matchAll(styleBlock)) {
    const kind = /\bjsx\b/.test(block.groups.attributes ?? "") ? "styled-jsx" : "plain";
    const css = stripCssComments(block.groups.css);
    for (const match of css.matchAll(/:global\((?<target>[^)]+)\)/g)) {
      const offset = (block.index ?? 0) + match.index;
      const line = source.slice(0, offset).split("\n").length;
      const selector = css.slice(css.lastIndexOf("}", match.index) + 1, css.indexOf("{", match.index)).trim();
      occurrences.push({ file, kind, line, selector, target: match.groups.target });
    }
  }

  return occurrences;
}

async function auditGlobalSelectors() {
  const files = await listSourceFiles();
  return (await Promise.all(files.map(async (url) => {
    const file = `src/${path.relative(srcRoot.pathname, url.pathname).replaceAll("\\", "/")}`;
    return classifyGlobalSelectors(file, await readFile(url, "utf8"));
  }))).flat();
}

function formatOccurrences(occurrences) {
  return occurrences.map(({ file, kind, line, selector }) => `${file}:${line} [${kind}] ${selector}`).join("\n");
}

const publicFiles = [
  "src/app/trucks/page.tsx",
  "src/app/trucks/[slug]/page.tsx",
  "src/components/shared/PageHero.tsx",
  "src/components/shared/LocalContactCta.tsx",
  "src/components/trucks/TruckCard.tsx",
  "src/components/trucks/TruckSeriesPage.tsx",
];

test("global selector audit distinguishes styled-jsx from invalid plain-style syntax", async () => {
  const occurrences = await auditGlobalSelectors();
  const plain = occurrences.filter(({ kind }) => kind === "plain");
  const styledJsx = occurrences.filter(({ kind }) => kind === "styled-jsx");

  assert.ok(styledJsx.length > 0, "the repository fixture must exercise valid styled-jsx :global() selectors");
  assert.ok(styledJsx.every(({ file }) => file.includes("/homepage/")), formatOccurrences(styledJsx));
  assert.equal(plain.length, 0, `invalid :global() in ordinary <style> blocks:\n${formatOccurrences(plain)}`);
});

test("shared discovery selector contract uses browser-valid dark actions, media, and icons", async () => {
  const globals = stripCssComments(await readSource("src/app/globals.css"));

  assert.match(globals, /\.page-hero__actions\s+\.button--secondary\s*\{[^}]*border-color:\s*var\(--color-paper\)[^}]*color:\s*var\(--color-paper\)/s);
  assert.match(globals, /\.local-contact-cta__actions\s+\.button--secondary\s*\{[^}]*border-color:\s*var\(--color-paper\)[^}]*color:\s*var\(--color-paper\)/s);
  assert.match(globals, /\.page-hero__media\s+img[^}]*\{[^}]*height:\s*100%[^}]*object-fit:\s*contain[^}]*width:\s*100%/s);
  assert.match(globals, /\.truck-listing-card__media\s+img[^}]*\{[^}]*height:\s*100%[^}]*object-fit:\s*contain[^}]*width:\s*100%/s);
  assert.match(globals, /\.series-application-card\s+svg\s*\{[^}]*color:\s*var\(--color-red\)/s);
});

test("discovery routes retain the shared shell, navigation, and fixed conversion paths", async () => {
  const [layout, navigation, listing, detail, template, mobileAction, site] = await Promise.all([
    readSource("src/app/layout.tsx"),
    readSource("src/content/navigation.ts"),
    readSource("src/app/trucks/page.tsx"),
    readSource("src/app/trucks/[slug]/page.tsx"),
    readSource("src/components/trucks/TruckSeriesPage.tsx"),
    readSource("src/components/layout/MobileActionBar.tsx"),
    readSource("src/content/site.ts"),
  ]);

  assert.match(layout, /<Header phone=\{publicContact\.phone\}\s*\/>[\s\S]*\{children\}[\s\S]*<Footer\s*\/>[\s\S]*<MobileActionBar phone=\{publicContact\.phone\}\s*\/>/);
  assert.equal((listing.match(/<main\b/g) ?? []).length, 1);
  assert.match(listing, /<main[^>]+id="main-content"/);
  assert.equal((detail.match(/<main\b/g) ?? []).length, 0, "finite detail route delegates its landmark to the template");
  assert.equal((template.match(/<main\b/g) ?? []).length, 1);
  assert.match(template, /<main[^>]+id="main-content"/);

  for (const route of ["/trucks", "/trucks/200-series", "/trucks/300-series", "/trucks/500-series", "/trucks/bus-puv"])
    assert.ok(navigation.includes(`href: "${route}"`), `${route} must be reachable from configured navigation`);

  assert.match(listing, /inquiryHref\("general"\)/);
  assert.match(template, /inquiryHref\(series\.slug\)/);
  assert.match(template, /publicContact\.phone\.status === "approved"/);
  assert.match(mobileAction, /usePathname\(\)/);
  assert.match(mobileAction, /pathname\s*===\s*"\/"/);
  assert.match(mobileAction, /isHomepage\s*\?\s*"\/#request-a-quote"\s*:\s*"\/contact#inquiry"/);
  assert.doesNotMatch(mobileAction, /searchParams|topic=|pathname\.(?:split|slice)|new URLSearchParams/);
  assert.match(site, /href: "tel:\+63323463322"/);

  const publicSource = [layout, navigation, listing, detail, template, mobileAction].join("\n");
  assert.doesNotMatch(publicSource, /promotions?/i);
  assert.doesNotMatch(publicSource, /https:\/\/(?:www\.)?hino\.com\.ph/i);
});

test("truck discovery exposes four configured, single-link application cards", async () => {
  const [listing, card, content, cta] = await Promise.all([
    readSource("src/app/trucks/page.tsx"),
    readSource("src/components/trucks/TruckCard.tsx"),
    readSource("src/content/trucks.ts"),
    readSource("src/components/shared/LocalContactCta.tsx"),
  ]);

  const expectedRoutes = [
    ["200-series", "/trucks/200-series"],
    ["300-series", "/trucks/300-series"],
    ["500-series", "/trucks/500-series"],
    ["bus-puv", "/trucks/bus-puv"],
  ];
  for (const [slug, href] of expectedRoutes) {
    assert.ok(content.includes(`slug: "${slug}"`));
    assert.ok(content.includes(`href: "${href}"`));
  }

  assert.match(listing, /publicTruckSeries\.map/);
  assert.match(listing, /Examples are general guidance only\. Confirm body, operating, specification, and current Cebu availability requirements with Hino Cebu\./);
  assert.match(listing, /Tell Us What Your Business Needs/);
  assert.equal((card.match(/<Link/g) ?? []).length, 1);
  assert.match(card, /Explore this range for/);
  assert.match(card, /applications\.map/);
  assert.match(cta, /inquiryHref\(topic\)/);
  assert.match(cta, /publicContact\.phone\.status === "approved"/);
});

test("detail routes are finite, guarded, and use the shared application-first template", async () => {
  const [route, template] = await Promise.all([
    readSource("src/app/trucks/[slug]/page.tsx"),
    readSource("src/components/trucks/TruckSeriesPage.tsx"),
  ]);

  assert.match(route, /generateStaticParams/);
  assert.match(route, /dynamicParams\s*=\s*false/);
  assert.match(route, /notFound\(\)/);
  assert.match(route, /getPublicTruckSeries/);
  assert.match(route, /<TruckSeriesPage/);
  assert.ok(template.indexOf("Explore this range for") < template.indexOf("highlights"));
  assert.match(template, /series\.mode === "rich"/);
  assert.match(template, /Ask Hino Cebu about this range\./);
  assert.match(template, /Current Cebu availability and detailed specifications require confirmation\. Tell us what your operation needs, or call Hino Cebu for guidance\./);
  assert.match(template, /LocalContactCta/);
});

test("rich series have exactly three qualified highlights while lightweight series have none", async () => {
  const content = await readSource("src/content/trucks.ts");

  const richBlocks = [...content.matchAll(/slug: "(300-series|500-series)"[\s\S]*?highlights: \[([\s\S]*?)\n\s*\],/g)];
  assert.equal(richBlocks.length, 2);
  for (const [, , highlights] of richBlocks) {
    assert.equal((highlights.match(/title:/g) ?? []).length, 3);
    assert.match(highlights, /select models|varies by model/i);
  }

  for (const slug of ["200-series", "bus-puv"]) {
    const block = content.match(new RegExp(`slug: "${slug}"[\\s\\S]*?(?=\\r?\\n\\s*\\{\\r?\\n\\s*slug:|\\r?\\n\\s*\\]\\s+as const;)`))?.[0] ?? "";
    assert.match(block, /mode: "lightweight"/);
    assert.doesNotMatch(block, /highlights:/);
  }
});

test("provenance stays private and public discovery remains claim-safe", async () => {
  const [content, publicSource] = await Promise.all([
    readSource("src/content/trucks.ts"),
    Promise.all(publicFiles.map(readSource)).then((sources) => sources.join("\n")),
  ]);

  assert.match(content, /interface ContentSource/);
  assert.match(content, /publisher:/);
  assert.match(content, /reviewedOn:/);
  assert.match(content, /supports:/);
  assert.match(content, /https:\/\/(?:www\.)?hino\.com\.ph\/(?:300-series|500-series)/);
  assert.match(content, /getPublicTruckSeries/);
  assert.doesNotMatch(publicSource, /sourceUrl|source\.url|publisher|reviewedOn|supports/);
  assert.doesNotMatch(publicSource, /https:\/\/(?:www\.)?hino\.com\.ph/i);
  assert.doesNotMatch(publicSource, /promotions?/i);
  assert.doesNotMatch(publicSource, /price|financing|specification table|brochure|model-name|filter|comparison|recommendation engine/i);
  assert.doesNotMatch(publicSource, /\b(best|ideal|perfect|recommended|fits)\b/i);
});
