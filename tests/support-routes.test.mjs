import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

const prohibitedPublicClaims =
  /authorized dealer|legal entity|our history|Cebu history|in stock|inventory|guaranteed|guarantee|turnaround|uptime|service plan|dealer count|customer volume|territory|award/i;

const loadSiteModule = () => import("../src/content/site.ts");

const configuredFact = (value, status = "requires-verification") => ({
  value,
  status,
  launchNote: "Fixture value requires authorized confirmation.",
});

const contactFixture = ({
  phoneStatus = "requires-verification",
  addressStatus = "requires-verification",
  directionsStatus = "requires-verification",
  hoursStatus = "requires-verification",
} = {}) => ({
  contact: {
    phone: configuredFact(
      { display: "(032) 346 3322", href: "tel:+63323463322" },
      phoneStatus,
    ),
    address: configuredFact("Candidate Cebu address", addressStatus),
    email: configuredFact(null, "unresolved"),
    directionsUrl: configuredFact("https://maps.example.test/candidate", directionsStatus),
  },
  hours: configuredFact(
    [{ days: "Candidate weekdays", hours: "Candidate hours" }],
    hoursStatus,
  ),
});

test("default local facts project awaiting-confirmation without candidate values", async () => {
  const { publicContact } = await loadSiteModule();

  assert.deepEqual(publicContact.phone, { status: "awaiting-confirmation" });
  assert.deepEqual(publicContact.address, { status: "awaiting-confirmation" });
  assert.deepEqual(publicContact.hours, { status: "awaiting-confirmation" });
  assert.deepEqual(publicContact.directions, { status: "awaiting-confirmation" });

  const serialized = JSON.stringify(publicContact);
  assert.doesNotMatch(serialized, /\(032\) 346 3322|tel:\+63323463322/);
  assert.doesNotMatch(serialized, /8WC6\+Q46|Saint John Paul II Avenue/);
  assert.doesNotMatch(serialized, /Monday|8:00 AM|5:00 PM/);
});

test("approved local facts become public independently", async () => {
  const { projectPublicContact } = await loadSiteModule();
  const projected = projectPublicContact(contactFixture({ phoneStatus: "approved" }));

  assert.deepEqual(projected.phone, {
    status: "approved",
    display: "(032) 346 3322",
    href: "tel:+63323463322",
  });
  assert.deepEqual(projected.address, { status: "awaiting-confirmation" });
  assert.deepEqual(projected.hours, { status: "awaiting-confirmation" });
  assert.deepEqual(projected.directions, { status: "awaiting-confirmation" });
});

test("directions remain unavailable until both address and directions are approved", async () => {
  const { projectPublicContact } = await loadSiteModule();

  const unresolvedAddress = projectPublicContact(
    contactFixture({ directionsStatus: "approved" }),
  );
  assert.deepEqual(unresolvedAddress.directions, { status: "awaiting-confirmation" });
  assert.doesNotMatch(JSON.stringify(unresolvedAddress), /maps\.example\.test/);

  const approved = projectPublicContact(
    contactFixture({ addressStatus: "approved", directionsStatus: "approved" }),
  );
  assert.deepEqual(approved.address, {
    status: "approved",
    display: "Candidate Cebu address",
  });
  assert.deepEqual(approved.directions, {
    status: "approved",
    href: "https://maps.example.test/candidate",
  });
});

test("shared shell consumes only approval-aware contact facts and keeps inquiry reachable", async () => {
  const [header, mobileMenu, mobileAction, footer] = await Promise.all([
    readSource("src/components/layout/Header.tsx"),
    readSource("src/components/layout/MobileMenu.tsx"),
    readSource("src/components/layout/MobileActionBar.tsx"),
    readSource("src/components/layout/Footer.tsx"),
  ]);

  for (const [name, source] of [
    ["Header", header],
    ["MobileMenu", mobileMenu],
    ["MobileActionBar", mobileAction],
    ["Footer", footer],
  ]) {
    assert.doesNotMatch(
      source,
      /siteConfig\.contact\.(?:phone|address)|siteConfig\.hours/,
      `${name} must not read configured candidates directly`,
    );
  }

  assert.match(header, /publicContact\.phone/);
  assert.match(header, /<MobileMenu[\s\S]*phone=\{publicContact\.phone\}/);
  assert.match(mobileMenu, /phone\.status === "approved"/);
  assert.match(mobileMenu, /href="\/contact#inquiry"/);
  assert.match(mobileAction, /publicContact\.phone/);
  assert.match(mobileAction, /"\/contact#inquiry"/);
  assert.match(footer, /Phone: awaiting confirmation/);
  assert.match(footer, /Address: awaiting confirmation/);
  assert.match(footer, /Hours: awaiting confirmation/);

  const shellSource = [header, mobileMenu, mobileAction, footer].join("\n");
  assert.doesNotMatch(shellSource, /tel:\+63323463322/);
  assert.doesNotMatch(shellSource, /8WC6\+Q46|Saint John Paul II Avenue/);
  assert.doesNotMatch(shellSource, /Monday|8:00 AM|5:00 PM/);
});

test("local-support routes retain one landmark, shared-shell reachability, and safe actions", async () => {
  const [layout, navigation, partsService, about, localCta, mobileAction] = await Promise.all([
    readSource("src/app/layout.tsx"),
    readSource("src/content/navigation.ts"),
    readSource("src/app/parts-service/page.tsx"),
    readSource("src/app/about/page.tsx"),
    readSource("src/components/shared/LocalContactCta.tsx"),
    readSource("src/components/layout/MobileActionBar.tsx"),
  ]);

  assert.match(layout, /<Header\s*\/>[\s\S]*\{children\}[\s\S]*<Footer\s*\/>[\s\S]*<MobileActionBar\s*\/>/);
  for (const [route, source] of [["/parts-service", partsService], ["/about", about]]) {
    assert.equal((source.match(/<main\b/g) ?? []).length, 1, `${route} must own exactly one main`);
    assert.match(source, /<main[^>]+id="main-content"/);
    assert.ok(navigation.includes(`href: "${route}"`), `${route} must be reachable from configured navigation`);
    assert.match(source, /siteConfig\.contact\.phone\.href/);
  }
  assert.match(partsService, /inquiryHref\("general"\)/);
  assert.match(about, /inquiryHref\("general"\)/);
  assert.match(localCta, /inquiryHref\(topic\)/);
  assert.match(mobileAction, /"\/contact#inquiry"/);

  const publicSource = [layout, navigation, partsService, about, localCta, mobileAction].join("\n");
  assert.doesNotMatch(publicSource, /promotions?/i);
  assert.doesNotMatch(publicSource, /https:\/\/(?:www\.)?hino\.com\.ph/i);
});

test("support content defines two primary paths before two supporting topics", async () => {
  const services = await readSource("src/content/services.ts");

  assert.match(services, /role: "primary" \| "supporting"/);
  assert.match(services, /bullets: readonly string\[\]/);
  assert.match(services, /topic: InquiryTopic/);
  assert.match(services, /ctaLabel: string/);
  assert.match(services, /sectionId: string/);
  assert.equal((services.match(/role: "primary",/g) ?? []).length, 2);
  assert.equal((services.match(/role: "supporting",/g) ?? []).length, 2);

  const partsIndex = services.indexOf('sectionId: "parts-inquiry"');
  const serviceIndex = services.indexOf('sectionId: "service-inquiry"');
  const fleetIndex = services.indexOf('sectionId: "fleet-support"');
  const maintenanceIndex = services.indexOf('sectionId: "maintenance-guidance"');
  assert.ok(partsIndex >= 0 && partsIndex < serviceIndex, "Parts must precede Service");
  assert.ok(serviceIndex < fleetIndex && fleetIndex < maintenanceIndex, "supporting topics must follow primary paths");
  assert.match(services, /topic: "parts"/);
  assert.match(services, /topic: "service"/);
  assert.doesNotMatch(services, prohibitedPublicClaims);
});

test("Parts & Service route preserves path hierarchy and contextual contact actions", async () => {
  const page = await readSource("src/app/parts-service/page.tsx");

  assert.equal((page.match(/<main\b/g) ?? []).length, 1);
  assert.match(page, /<main[^>]+id="main-content"/);
  assert.match(page, /<PageHero/);
  assert.match(page, /<LocalContactCta/);
  assert.match(page, /serviceOfferings\.filter\(\(offering\) => offering\.role === "primary"\)/);
  assert.match(page, /serviceOfferings\.filter\(\(offering\) => offering\.role === "supporting"\)/);
  assert.match(page, /inquiryHref\(offering\.topic\)/);
  assert.match(page, /siteConfig\.contact\.phone\.href/);
  assert.doesNotMatch(page, /partsServiceWorkshop|Cebu facility|our workshop/i);
  assert.doesNotMatch(page, /promotions?/i);
  assert.doesNotMatch(page, /sourceUrl|publisher|reviewedOn|supports:/);
  assert.doesNotMatch(page, /hino\.com\.ph/i);
  assert.doesNotMatch(page, prohibitedPublicClaims);
});

test("About content projects reviewed national background without provenance", async () => {
  const about = await readSource("src/content/about.ts");

  assert.match(about, /aboutContent/);
  assert.match(about, /getPublicAboutContent/);
  assert.match(about, /Hino Motors Philippines Corporation was established in March 1975/);
  assert.match(about, /https:\/\/www\.hino\.com\.ph\/corporate-information/);
  assert.match(about, /publisher: "Hino Motors Philippines"/);
  assert.match(about, /reviewedOn:/);
  assert.match(about, /supports:/);
  assert.match(about, /return \{[\s\S]*localCommitment:[\s\S]*nationalBackground:[\s\S]*practicalSupport:/);
  assert.doesNotMatch(about, /authorized dealer|legal entity|our history|Cebu history|inventory|dealer count|territory|award/i);
});

test("About route separates local and national subjects before practical Cebu facts", async () => {
  const page = await readSource("src/app/about/page.tsx");

  assert.equal((page.match(/<main\b/g) ?? []).length, 1);
  assert.match(page, /<main[^>]+id="main-content"/);
  assert.match(page, /<PageHero/);
  assert.match(page, /<LocalContactCta/);
  assert.match(page, /getPublicAboutContent\(\)/);
  assert.match(page, /About Hino Motors Philippines/);
  assert.match(page, /siteConfig\.contact\.address/);
  assert.match(page, /siteConfig\.hours\.map/);
  assert.match(page, /siteConfig\.contact\.phone\.href/);

  const localIndex = page.indexOf('id="local-commitment"');
  const nationalIndex = page.indexOf('id="national-background"');
  const practicalIndex = page.indexOf('id="practical-cebu-information"');
  const ctaIndex = page.indexOf("<LocalContactCta");
  assert.ok(localIndex >= 0 && localIndex < nationalIndex, "local commitment must lead national background");
  assert.ok(nationalIndex < practicalIndex && practicalIndex < ctaIndex, "practical facts must precede conversion");

  assert.doesNotMatch(page, /sourceUrl|publisher|reviewedOn|supports:|corporate-information/);
  assert.doesNotMatch(page, /href=\{siteConfig\.contact\.(?:email|directionsUrl)/);
  assert.doesNotMatch(page, /promotions?/i);
  assert.doesNotMatch(page, prohibitedPublicClaims);
});
