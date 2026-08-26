import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("approved navigation excludes promotions", async () => {
  const navigation = await readSource("src/content/navigation.ts");

  assert.doesNotMatch(navigation, /Promotions/i);
  assert.match(navigation, /label: "Trucks"/);
  assert.match(navigation, /label: "Parts & Service"/);
  assert.match(navigation, /label: "About"/);
  assert.match(navigation, /label: "Contact"/);
});

test("site configuration supplies the approved Cebu call action", async () => {
  const site = await readSource("src/content/site.ts");

  assert.match(site, /display: "\(032\) 346 3322"/);
  assert.match(site, /href: "tel:\+63323463322"/);
  assert.match(site, /address: "8WC6\+Q46/);
});

test("the public shell exports desktop and mobile conversion actions", async () => {
  const [header, mobileMenu, mobileActionBar, footer] = await Promise.all([
    readSource("src/components/layout/Header.tsx"),
    readSource("src/components/layout/MobileMenu.tsx"),
    readSource("src/components/layout/MobileActionBar.tsx"),
    readSource("src/components/layout/Footer.tsx"),
  ]);

  assert.match(header, /export function Header/);
  assert.match(header, /siteConfig\.contact\.phone\.href/);
  assert.match(mobileMenu, /Request a Quote/);
  assert.match(mobileMenu, /event\.key === "Escape"/);
  assert.match(mobileActionBar, /Call/);
  assert.match(mobileActionBar, /Request a Quote/);
  assert.match(footer, /export function Footer/);
});
