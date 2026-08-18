import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const routes = [
  "src/app/page.tsx", "src/app/trucks/page.tsx", "src/app/trucks/[slug]/page.tsx",
  "src/app/find-your-truck/page.tsx", "src/app/parts/page.tsx", "src/app/service/page.tsx",
  "src/app/(public)/fleet/page.tsx", "src/app/(public)/financing/page.tsx", "src/app/(public)/promotions/page.tsx",
  "src/app/(public)/hino-cebu/page.tsx", "src/app/hino-cebu/customer-deliveries/page.tsx",
  "src/app/(public)/guides/page.tsx", "src/app/(public)/contact/page.tsx", "src/app/(public)/quote/page.tsx",
  "src/app/privacy/page.tsx", "src/app/terms/page.tsx", "src/app/not-found.tsx", "src/app/sitemap.ts", "src/app/robots.ts",
];

test("required route foundation exists", () => {
  for (const route of routes) assert.ok(existsSync(route), `${route} should exist`);
});

test("site origin is environment driven", () => {
  const source = readFileSync("src/lib/site-url.ts", "utf8");
  assert.match(source, /NEXT_PUBLIC_SITE_URL/);
  assert.doesNotMatch(source, /hinocebu\.(com|ph)/i);
});

test("unverified promotions and deliveries start empty", () => {
  assert.match(readFileSync("src/content/promotions.ts", "utf8"), /promotionCatalog: readonly Promotion\[\] = \[\]/);
  assert.match(readFileSync("src/content/deliveries.ts", "utf8"), /deliveries: DeliveryStory\[\] = \[\]/);
});

test("uploads are presented as disabled", () => {
  assert.match(readFileSync("src/components/forms/LeadForm.tsx", "utf8"), /Photo attachments are currently unavailable/);
});

test("official product assets and source register exist", () => {
  for (const asset of ["hino-logo.png", "hino-200.jpg", "hino-300.jpg", "hino-500.jpg", "genuine-parts.png", "quality-service.jpg", "financial-services.jpg"]) {
    assert.ok(existsSync(`public/images/official/${asset}`), `${asset} should exist`);
  }
  assert.ok(existsSync("SOURCE_REGISTER.md"));
});
