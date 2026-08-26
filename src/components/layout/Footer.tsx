import Link from "next/link";

import { legalNavigation, primaryNavigation } from "@/content/navigation";
import { truckRanges } from "@/content/trucks";
import { publicContact } from "@/content/site";

import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container className="site-footer__grid">
        <section className="site-footer__intro">
          <p className="site-footer__identity">HINO <span>CEBU</span></p>
          <p>Local sales, parts, service, and support conversations for Cebu businesses.</p>
        </section>
        <section aria-labelledby="footer-links-heading">
          <h2 id="footer-links-heading">Explore</h2>
          <ul>
            {primaryNavigation.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="footer-trucks-heading">
          <h2 id="footer-trucks-heading">Truck series</h2>
          <ul>
            {truckRanges.map((truck) => (
              <li key={truck.slug}><Link href={truck.href}>{truck.name}</Link></li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="footer-contact-heading">
          <h2 id="footer-contact-heading">Contact</h2>
          {publicContact.phone.status === "approved" ? (
            <a href={publicContact.phone.href}>{publicContact.phone.display}</a>
          ) : (
            <p>Phone: awaiting confirmation</p>
          )}
          {publicContact.address.status === "approved" ? (
            <address>{publicContact.address.display}</address>
          ) : (
            <p>Address: awaiting confirmation</p>
          )}
          {publicContact.hours.status === "approved" ? (
            <p>{publicContact.hours.rows.map((item) => `${item.days}: ${item.hours}`).join(" · ")}</p>
          ) : (
            <p>Hours: awaiting confirmation</p>
          )}
          <Link href="/contact#inquiry">Contact / Inquire</Link>
        </section>
      </Container>
      <Container className="site-footer__legal">
        <p>© {new Date().getFullYear()} Hino Cebu. Launch details remain subject to verification.</p>
        <nav aria-label="Legal navigation">
          {legalNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
      </Container>
    </footer>
  );
}
