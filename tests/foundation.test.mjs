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
  assert.doesNotMatch(navigation, /label: "Contact"/);
});

test("site configuration keeps candidate Cebu facts behind approval status", async () => {
  const site = await readSource("src/content/site.ts");

  assert.match(site, /display: "\(032\) 346 3322"/);
  assert.match(site, /href: "tel:\+63323463322"/);
  assert.match(site, /address:\s*\{[\s\S]*value: "8WC6\+Q46/);
  assert.equal((site.match(/status: "requires-verification"/g) ?? []).length >= 3, true);
  assert.match(site, /export const publicContact = projectPublicContact\(siteConfig\)/);
});

test("the public shell exports desktop and mobile conversion actions", async () => {
  const [header, mobileMenu, mobileActionBar, footer] = await Promise.all([
    readSource("src/components/layout/Header.tsx"),
    readSource("src/components/layout/MobileMenu.tsx"),
    readSource("src/components/layout/MobileActionBar.tsx"),
    readSource("src/components/layout/Footer.tsx"),
  ]);

  assert.match(header, /export function Header/);
  assert.match(header, /phone\.status === "approved"/);
  assert.match(header, /href="\/contact#inquiry"/);
  assert.match(footer, /href="\/contact#inquiry"/);
  assert.match(mobileMenu, /Request a Quote/);
  assert.match(mobileMenu, /event\.key === "Escape"/);
  assert.match(mobileActionBar, /Call/);
  assert.match(mobileActionBar, /Request a Quote/);
  assert.match(mobileActionBar, /phone\.status === "approved"/);
  assert.match(footer, /export function Footer/);
  assert.match(footer, /Phone: awaiting confirmation/);
});
