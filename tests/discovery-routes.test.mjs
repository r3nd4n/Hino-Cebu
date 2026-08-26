import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

const publicFiles = [
  "src/app/trucks/page.tsx",
  "src/app/trucks/[slug]/page.tsx",
  "src/components/shared/PageHero.tsx",
  "src/components/shared/LocalContactCta.tsx",
  "src/components/trucks/TruckCard.tsx",
  "src/components/trucks/TruckSeriesPage.tsx",
];

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
    const block = content.match(new RegExp(`slug: "${slug}"[\\s\\S]*?(?=\\n\\s*\\{\\n\\s*slug:|\\n\\s*\\]\\s+as const;)`))?.[0] ?? "";
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
