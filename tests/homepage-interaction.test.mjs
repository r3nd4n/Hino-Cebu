import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const quoteExperience = readFileSync(
  new URL("../src/components/homepage/HomepageQuoteExperience.tsx", import.meta.url),
  "utf8",
);
const supportSections = readFileSync(
  new URL("../src/components/homepage/HomepageSupportSections.tsx", import.meta.url),
  "utf8",
);
const homePage = readFileSync(
  new URL("../src/app/page.tsx", import.meta.url),
  "utf8",
);
const mobileActionBar = readFileSync(
  new URL("../src/components/layout/MobileActionBar.tsx", import.meta.url),
  "utf8",
);

const configuredFact = (value, status = "requires-verification") => ({
  value,
  status,
});

const contactFixture = ({
  phoneStatus = "requires-verification",
  addressStatus = "requires-verification",
  directionsStatus = "requires-verification",
  hoursStatus = "requires-verification",
} = {}) => ({
  contact: {
    phone: configuredFact(
      { display: "Candidate phone", href: "tel:+63000000000" },
      phoneStatus,
    ),
    address: configuredFact("Candidate address", addressStatus),
    directionsUrl: configuredFact("https://maps.example.test/candidate", directionsStatus),
  },
  hours: configuredFact(
    [{ days: "Candidate days", hours: "Candidate hours" }],
    hoursStatus,
  ),
});

test("quote experience keeps validation and one anchored quote form in its client boundary", () => {
  assert.match(quoteExperience, /"use client"/);
  assert.match(quoteExperience, /validateQuoteDraft/);
  assert.match(quoteExperience, /id="request-a-quote"/);
  assert.match(quoteExperience, /Full name/);
  assert.match(quoteExperience, /Mobile number/);
  assert.match(quoteExperience, /Email address/);
  assert.match(quoteExperience, /Company or business/);
  assert.match(quoteExperience, /Vehicle interest/);
  assert.match(quoteExperience, /Business use/);
  assert.match(quoteExperience, /Estimated units/);
  assert.match(quoteExperience, /I agree to be contacted by Hino Cebu/);
});

test("quote experience uses a truthful local confirmation without a fictitious failure", () => {
  assert.match(quoteExperience, /Thank you for your interest in Hino Cebu\./);
  assert.match(quoteExperience, /phone\.status === "approved"/);
  assert.match(quoteExperience, /Local phone details are awaiting confirmation\./);
  assert.match(quoteExperience, /href="\/contact#inquiry"/);
  assert.doesNotMatch(quoteExperience, /failure|catch\s*\{|couldn.t send|\bsend\b|\bsent\b|\breceived\b|follow up/i);
});

test("homepage receives only the central public contact projection", async () => {
  const { projectPublicContact } = await import("../src/content/site.ts");

  const unresolved = projectPublicContact(contactFixture());
  assert.deepEqual(unresolved, {
    phone: { status: "awaiting-confirmation" },
    address: { status: "awaiting-confirmation" },
    directions: { status: "awaiting-confirmation" },
    hours: { status: "awaiting-confirmation" },
  });
  assert.doesNotMatch(
    JSON.stringify(unresolved),
    /Candidate phone|Candidate address|Candidate days|Candidate hours|maps\.example\.test/,
  );

  const phoneOnly = projectPublicContact(contactFixture({ phoneStatus: "approved" }));
  assert.equal(phoneOnly.phone.status, "approved");
  assert.equal(phoneOnly.address.status, "awaiting-confirmation");
  assert.equal(phoneOnly.hours.status, "awaiting-confirmation");
  assert.equal(phoneOnly.directions.status, "awaiting-confirmation");

  const addressOnly = projectPublicContact(contactFixture({ addressStatus: "approved" }));
  assert.equal(addressOnly.phone.status, "awaiting-confirmation");
  assert.equal(addressOnly.address.status, "approved");
  assert.equal(addressOnly.hours.status, "awaiting-confirmation");
  assert.equal(addressOnly.directions.status, "awaiting-confirmation");

  const hoursOnly = projectPublicContact(contactFixture({ hoursStatus: "approved" }));
  assert.equal(hoursOnly.phone.status, "awaiting-confirmation");
  assert.equal(hoursOnly.address.status, "awaiting-confirmation");
  assert.equal(hoursOnly.hours.status, "approved");
  assert.equal(hoursOnly.directions.status, "awaiting-confirmation");

  const directions = projectPublicContact(contactFixture({
    addressStatus: "approved",
    directionsStatus: "approved",
  }));
  assert.equal(directions.address.status, "approved");
  assert.equal(directions.directions.status, "approved");
  assert.equal(directions.phone.status, "awaiting-confirmation");
  assert.equal(directions.hours.status, "awaiting-confirmation");

  assert.match(homePage, /HomepageQuoteExperience phone=\{publicContact\.phone\}/);
  assert.match(homePage, /HomepageSupportSections contact=\{publicContact\}/);
});

test("homepage support keeps unresolved facts truthful and inquiry paths usable", () => {
  assert.match(supportSections, /contact\.phone\.status === "approved"/);
  assert.match(supportSections, /contact\.address\.status === "approved"/);
  assert.match(supportSections, /contact\.hours\.status === "approved"/);
  assert.match(supportSections, /contact\.directions\.status === "approved"/);
  assert.match(supportSections, /Phone: awaiting confirmation/);
  assert.match(supportSections, /Address: awaiting confirmation/);
  assert.match(supportSections, /Hours: awaiting confirmation/);
  assert.match(supportSections, /href="\/contact#inquiry"/);
  assert.match(supportSections, /href="\/parts-service"/);
  assert.doesNotMatch(supportSections, /Visit Hino Cebu|visit\.eyebrow|<iframe|encodeURIComponent\(|maps\.google/i);
  assert.doesNotMatch(supportSections, /siteConfig\.contact|\(032\) 346 3322|Saint John Paul II Avenue|Monday|8:00 AM/);
});

test("business-need cards prefill only Business Use and hand focus to the form", () => {
  assert.match(quoteExperience, /Find my Hino/);
  assert.match(quoteExperience, /setDraft\(\(current\) => \(\{ \.\.\.current, businessUse: businessUse \}\)\)/);
  assert.doesNotMatch(quoteExperience, /vehicleInterest:\s*businessUse/);
  assert.match(quoteExperience, /businessUseSelectRef\.current\?\.focus\(\)/);
  assert.match(quoteExperience, /Business use set to/);
});

test("mobile actions observe the hero before showing the call and quote targets", () => {
  assert.match(mobileActionBar, /"use client"/);
  assert.match(mobileActionBar, /IntersectionObserver/);
  assert.match(mobileActionBar, /homepage-hero/);
  assert.match(mobileActionBar, /phone\.status === "approved"/);
  assert.match(mobileActionBar, /\/#request-a-quote/);
  assert.match(mobileActionBar, /aria-label="Quick actions"/);
});
