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
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const menuRoot = trigger?.closest<HTMLElement>(".mobile-menu");
    const skipLink = menuRoot?.closest<HTMLElement>(".site-header")?.querySelector<HTMLElement>(".skip-link");
    const headerSiblings = [...(menuRoot?.parentElement?.children ?? [])].filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== menuRoot,
    );
    const obscuredElements = [
      document.querySelector<HTMLElement>("main"),
      document.querySelector<HTMLElement>(".site-footer"),
      document.querySelector<HTMLElement>(".mobile-action-bar"),
      skipLink,
      ...headerSiblings,
    ].filter((element): element is HTMLElement => element !== null);
    const previousInert = obscuredElements.map((element) => ({ element, inert: element.inert }));
    const focusableElements = () => [...(panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? [])].filter((element) => element.getClientRects().length > 0);
    const containFocus = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = focusableElements();
      const first = focusables[0];
      const last = focusables.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!panelRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    for (const element of obscuredElements) element.inert = true;
    const focusFrame = window.requestAnimationFrame(() => focusableElements()[0]?.focus());
    document.addEventListener("keydown", containFocus);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      for (const { element, inert } of previousInert) element.inert = inert;
      document.removeEventListener("keydown", containFocus);
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
        <div className="mobile-menu__panel" id="mobile-navigation" ref={panelRef}>
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
