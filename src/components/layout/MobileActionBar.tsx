"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { siteConfig } from "@/content/site";

import { Icon } from "../ui/Icon";

export function MobileActionBar() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHomepage) return;

    const hero = document.getElementById("homepage-hero");
    if (!hero || !("IntersectionObserver" in window)) {
      const fallbackVisibilityTimer = window.setTimeout(() => setIsVisible(true), 0);
      return () => window.clearTimeout(fallbackVisibilityTimer);
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(!entry.isIntersecting);
    });

    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHomepage]);

  if (isHomepage && !isVisible) return null;

  return (
    <nav aria-label="Quick actions" className="mobile-action-bar">
      <a href={siteConfig.contact.phone.href}><Icon icon={Phone} size={18} />Call</a>
      <Link href={isHomepage ? "/#request-a-quote" : "/contact#inquiry"}>
        {isHomepage ? "Request a Quote" : "Inquire"}
      </Link>
    </nav>
  );
}
