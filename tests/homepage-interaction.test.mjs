import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const quoteExperience = readFileSync(
  new URL("../src/components/homepage/HomepageQuoteExperience.tsx", import.meta.url),
  "utf8",
);
const mobileActionBar = readFileSync(
  new URL("../src/components/layout/MobileActionBar.tsx", import.meta.url),
  "utf8",
);

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

test("quote experience uses truthful local confirmation and a safe failure state", () => {
  assert.match(quoteExperience, /Thank you for your interest in Hino Cebu\./);
  assert.match(quoteExperience, /For immediate assistance, call \(032\) 346 3322\./);
  assert.match(
    quoteExperience,
    /We couldn't send your inquiry right now\. Please try again or call Hino Cebu at \(032\) 346 3322\./,
  );
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
  assert.match(mobileActionBar, /siteConfig\.contact\.phone\.href/);
  assert.match(mobileActionBar, /\/#request-a-quote/);
  assert.match(mobileActionBar, /aria-label="Quick actions"/);
});
