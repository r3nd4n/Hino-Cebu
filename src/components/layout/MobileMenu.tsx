"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import type { NavigationItem } from "@/content/navigation";
import type { PublicContact } from "@/content/site";

import { Icon } from "../ui/Icon";

type MobileMenuProps = {
  navigation: readonly NavigationItem[];
  phone: PublicContact["phone"];
};

export function MobileMenu({ navigation, phone }: MobileMenuProps) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <div className="mobile-menu">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="mobile-menu__trigger"
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        type="button"
      >
        <Icon icon={isOpen ? X : Menu} size={24} />
      </button>
      {isOpen ? (
        <div className="mobile-menu__panel" id="mobile-navigation">
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>)}
          </nav>
          <div className="mobile-menu__actions">
            {phone.status === "approved" ? (
              <a href={phone.href}><Icon icon={Phone} size={18} />Call {phone.display}</a>
            ) : null}
            <Link
              href={isHomepage ? "/#request-a-quote" : "/contact#inquiry"}
              onClick={() => setIsOpen(false)}
            >
              {isHomepage ? "Request a Quote" : "Contact / Inquire"}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
