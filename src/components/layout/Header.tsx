"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type ShellNavigationItem = Readonly<{
  navigationId: string;
  label: string;
  href: string;
  kind: "link" | "primary";
}>;

export type ShellContactAction = Readonly<{
  actionId: string;
  kind: "phone" | "directions";
  label: string;
  href: string;
}>;

type HeaderProps = Readonly<{
  navigation: readonly ShellNavigationItem[];
  contactActions: readonly ShellContactAction[];
  branch: Readonly<{ identity?: string }>;
}>;

type MobileNavigationItem = ShellNavigationItem | Readonly<{
  navigationId: string;
  label: string;
  href: string;
  kind: "phone";
}>;

const mobileNavigationOrder = [
  "Trucks",
  "Find Your Truck",
  "Parts",
  "Service",
  "Hino Cebu",
  "Call Hino Cebu",
  "Get a Quote",
] as const;

function isCurrentPath(pathname: string, item: ShellNavigationItem) {
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function Header({ navigation, contactActions, branch }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const phoneAction = contactActions.find(({ kind }) => kind === "phone");
  const mobileNavigation = mobileNavigationOrder.reduce<MobileNavigationItem[]>((items, label) => {
    if (label === "Call Hino Cebu") {
      if (phoneAction) items.push({ ...phoneAction, navigationId: phoneAction.actionId, kind: "phone" });
      return items;
    }
    const item = navigation.find((candidate) => candidate.label === label);
    if (item) items.push(item);
    return items;
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <header className="site-header">
    <div className="container nav-row">
      <div className="brand"><Image src="/images/official/hino-logo.png" alt="Hino" width={124} height={30} />{branch.identity ? <span className="brand-branch">Cebu</span> : null}</div>
      <button ref={triggerRef} className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-primary-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((current) => !current)}><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /></button>
      <nav className="desktop-primary-nav" aria-label="Primary navigation">
        {navigation.map((item) => <Link className={item.kind === "primary" ? "button header-quote" : undefined} key={item.navigationId} href={item.href} aria-current={isCurrentPath(pathname, item) ? "page" : undefined}>{item.label}</Link>)}
      </nav>
      <nav id="mobile-primary-navigation" className={open ? "mobile-primary-nav is-open" : "mobile-primary-nav"} aria-label="Mobile primary navigation" aria-hidden={!open}>
        {mobileNavigation.map((item) => item.kind === "phone"
          ? <a href={item.href} key={item.navigationId} tabIndex={open ? undefined : -1} onClick={() => setOpen(false)}>{item.label}</a>
          : <Link className={item.kind === "primary" ? "mobile-primary-action" : undefined} key={item.navigationId} href={item.href} tabIndex={open ? undefined : -1} onClick={() => setOpen(false)} aria-current={isCurrentPath(pathname, item) ? "page" : undefined}>{item.label}</Link>)}
      </nav>
    </div>
  </header>;
}
