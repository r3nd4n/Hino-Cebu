import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

const assets = [
  ["hino-300-series-hero.jpg", "hero-commercial-truck", "PerProduct/300/Img/300SeriesFrontBanner.jpg"],
  ["hino-200-series-card.jpg", "truck-range-200", "Range/200%20(with%20background.jpg"],
  ["hino-300-series-card.jpg", "truck-range-300", "Range/300withbackground.jpg"],
  ["hino-500-series-card.jpg", "truck-range-500", "Range/500withbackground.jpg"],
  ["hino-bus-puv-card.jpg", "truck-range-bus-puv", "Range/BUS%20(with%20background)1.jpg"],
];

test("homepage imagery is local, documented, and ready for approved Cebu replacements", async () => {
  const manifest = await readSource("src/content/assets.ts");

  for (const [file, role, source] of assets) {
    await access(new URL(`../public/images/official/${file}`, import.meta.url));
    assert.match(manifest, new RegExp(`/images/official/${file.replaceAll(".", "\\.")}`));
    assert.match(manifest, new RegExp(`assetRole: "${role}"`));
    assert.ok(manifest.includes(`sourceUrl: "https://www.hino.com.ph/assets/images/${source}"`));
  }

  assert.match(manifest, /sourceSite: "Hino Philippines"/);
  assert.match(manifest, /authorizedUse: true/);
  assert.match(manifest, /replaceWithCebuPhoto: true/);
  assert.match(manifest, /sourceType: "generated-placeholder"/);
  assert.match(manifest, /authorizedUse: false/);
});

test("homepage copy is configured and contains no promotions surface", async () => {
  const homepage = await readSource("src/content/homepage.ts");

  assert.match(homepage, /homepageContent/);
  assert.match(homepage, /valuePoints/);
  assert.match(homepage, /businessUses/);
  assert.doesNotMatch(homepage, /promotions?/i);
});

test("the home route composes the approved conversion journey from local contracts", async () => {
  const [page, quote, trucks, support, finalCta, manifest] = await Promise.all([
    readSource("src/app/page.tsx"),
    readSource("src/components/homepage/HomepageQuoteExperience.tsx"),
    readSource("src/components/homepage/TruckRangeSection.tsx"),
    readSource("src/components/homepage/HomepageSupportSections.tsx"),
    readSource("src/components/homepage/FinalQuoteCta.tsx"),
    readSource("src/content/assets.ts"),
  ]);

  for (const component of ["HomepageQuoteExperience", "TruckRangeSection", "HomepageSupportSections", "FinalQuoteCta"]) {
    assert.match(page, new RegExp(`<${component}`));
  }
  assert.match(page, /id="main-content"/);
  assert.match(quote, /id="homepage-hero"/);
  assert.match(quote, /id="request-a-quote"/);
  assert.match(quote, /href="#trucks"/);
  assert.match(trucks, /truckRanges\.map/);
  assert.equal((trucks.match(/officialAssets\.truck(?:200|300|500|BusPuv)/g) ?? []).length, 4);
  assert.match(support, /encodeURIComponent\(siteConfig\.contact\.address\)/);
  assert.match(support, /title=\{`Map search for/);
  assert.match(finalCta, /href="#request-a-quote"/);
  assert.match(manifest, /src: "\/images\/official\/hino-300-series-hero\.jpg"/);
});

test("public home and shell sources do not expose promotions or private asset provenance", async () => {
  const files = [
    "src/app/page.tsx",
    "src/components/homepage/HomepageQuoteExperience.tsx",
    "src/components/homepage/TruckRangeSection.tsx",
    "src/components/homepage/HomepageSupportSections.tsx",
    "src/components/homepage/FinalQuoteCta.tsx",
    "src/components/layout/Header.tsx",
    "src/components/layout/Footer.tsx",
    "src/content/navigation.ts",
  ];
  const publicSource = (await Promise.all(files.map(readSource))).join("\n");

  assert.doesNotMatch(publicSource, /promotions?/i);
  assert.doesNotMatch(publicSource, /sourceUrl|authorizedUse|replacementNote|replaceWithCebuPhoto|sourceSite/);
});
