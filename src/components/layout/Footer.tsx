import Link from "next/link";
import { directionsHref, siteConfig } from "@/content/site";

export function Footer() {
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div><div className="footer-brand">HINO <span>CEBU</span></div><p>{siteConfig.tagline}</p><address>{siteConfig.address}<br /><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></address></div>
      <div><h2>Explore</h2><Link href="/trucks">Trucks</Link><Link href="/find-your-truck">Find Your Truck</Link><Link href="/guides">Cebu Truck Guide</Link><Link href="/promotions">Promotions</Link></div>
      <div><h2>Support</h2><Link href="/service">Service request</Link><Link href="/parts">Parts inquiry</Link><Link href="/fleet">Fleet support</Link><Link href="/financing">Financing inquiry</Link></div>
      <div><h2>Hino Cebu</h2><Link href="/hino-cebu">About</Link><Link href="/contact">Contact</Link><Link href={directionsHref}>Directions</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms & Disclaimer</Link>{siteConfig.socials.map((social) => <a href={social.href} target="_blank" rel="noreferrer" key={social.href}>{social.label}</a>)}</div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Hino Cebu. All rights reserved.</span><span>Product details and requests remain subject to verification and confirmation.</span></div>
  </footer>;
}
