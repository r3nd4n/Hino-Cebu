"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="site-header">
    <div className="utility-bar"><div className="container utility-inner"><span>Serving Cebu business</span><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></div></div>
    <div className="container nav-row">
      <Link className="brand" href="/" aria-label="Hino Cebu home"><Image src="/images/official/hino-logo.png" alt="Hino" width={124} height={30} priority /><span className="brand-branch">CEBU</span></Link>
      <button className="menu-button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span className="sr-only">Toggle menu</span><span /><span /><span /></button>
      <nav id="primary-navigation" className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Primary navigation">
        {siteConfig.nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
        <Link className="button button-small" href="/quote" onClick={() => setOpen(false)}>Get a Quote</Link>
      </nav>
    </div>
  </header>;
}
