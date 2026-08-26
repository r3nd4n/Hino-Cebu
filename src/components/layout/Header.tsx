"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { PublicContact } from "@/content/site";
import { primaryNavigation } from "@/content/navigation";
import { Phone } from "lucide-react";

import { MobileMenu } from "./MobileMenu";
import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";

export function Header({ phone }: { phone: PublicContact["phone"] }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!isHomepage) return;

    const updateHeader = () => setHasScrolled(window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, [isHomepage]);

  return (
    <header className={["site-header", isHomepage ? "site-header--hero" : "", hasScrolled ? "site-header--scrolled" : ""].filter(Boolean).join(" ")}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Container className="site-header__inner">
        <Link aria-label="Hino Cebu home" className="site-identity" href="/">
          <span className="site-identity__brand">
            <Image alt="" aria-hidden="true" className="site-identity__mark" height={48} priority src="/images/official/hino-mark.png" width={72} />
            <span className="site-identity__wordmark">HINO</span>
          </span>
          <span aria-hidden="true" className="site-identity__divider" />
          <span className="site-identity__cebu">CEBU</span>
        </Link>

        <nav aria-label="Primary navigation" className="site-header__nav">
          {primaryNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        {phone.status === "approved" ? (
          <a className="site-header__phone" href={phone.href}>
            <Icon icon={Phone} size={18} />
            <span>{phone.display}</span>
          </a>
        ) : (
          <Link className="site-header__phone" href="/contact#inquiry">
            Contact / Inquire
          </Link>
        )}
        <MobileMenu navigation={primaryNavigation} phone={phone} />
      </Container>
    </header>
  );
}
