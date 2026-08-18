"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type ShellNavigationItem = Readonly<{
  navigationId: string;
  label: string;
  href: string;
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

export function Header({ navigation, contactActions }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const phoneAction = contactActions.find(({ kind }) => kind === "phone");
  const homeNavigation = navigation.find(({ href }) => href === "/");
  return <header className="site-header">
    {phoneAction ? <div className="utility-bar"><div className="container utility-inner"><a href={phoneAction.href}>{phoneAction.label}</a></div></div> : null}
    <div className="container nav-row">
      {homeNavigation ? <Link className="brand" href={homeNavigation.href} aria-label={homeNavigation.label}><Image src="/images/official/hino-logo.png" alt="Hino" width={124} height={30} priority /></Link> : <div className="brand"><Image src="/images/official/hino-logo.png" alt="Hino" width={124} height={30} priority /></div>}
      <button className="menu-button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span className="sr-only">Toggle menu</span><span /><span /><span /></button>
      <nav id="primary-navigation" className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Primary navigation">
        {navigation.map((item) => <Link key={item.navigationId} href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
      </nav>
    </div>
  </header>;
}
