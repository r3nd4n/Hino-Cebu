import { ArrowUpRight, Phone } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { inquiryHref, type InquiryTopic } from "@/content/inquiry";
import { siteConfig } from "@/content/site";

interface LocalContactCtaProps {
  eyebrow?: string;
  title: string;
  description: string;
  topic: InquiryTopic;
  inquiryLabel?: string;
}

export function LocalContactCta({
  eyebrow = "Local Hino Cebu support",
  title,
  description,
  topic,
  inquiryLabel = "Request Information",
}: LocalContactCtaProps) {
  return (
    <section aria-label="Contact Hino Cebu" className="local-contact-cta">
      <div className="container local-contact-cta__panel">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="local-contact-cta__actions">
          <ButtonLink href={inquiryHref(topic)}>{inquiryLabel}<Icon icon={ArrowUpRight} size={17} /></ButtonLink>
          <ButtonLink href={siteConfig.contact.phone.href} variant="secondary"><Icon icon={Phone} size={17} />Call {siteConfig.contact.phone.display}</ButtonLink>
        </div>
      </div>
      <style>{`
        .local-contact-cta { background: var(--color-paper); padding-block: clamp(3rem, 6vw, 5rem); }
        .local-contact-cta__panel { align-items: center; background: var(--color-dark); color: var(--color-paper); display: flex; gap: var(--space-xl); justify-content: space-between; padding: clamp(2rem, 5vw, 4rem); }
        .local-contact-cta h2 { margin-top: var(--space-sm); max-width: 18ch; }
        .local-contact-cta__panel > div > p:last-child { color: #d6d9da; margin: var(--space-md) 0 0; max-width: 40rem; }
        .local-contact-cta__actions { display: flex; flex: 0 0 auto; flex-wrap: wrap; gap: var(--space-md); }
        .local-contact-cta__actions :global(.button) { gap: var(--space-sm); }
        .local-contact-cta__actions :global(.button--secondary) { border-color: var(--color-paper); color: var(--color-paper); }
        @media (max-width: 900px) { .local-contact-cta__panel { align-items: stretch; flex-direction: column; } }
        @media (max-width: 539px) { .local-contact-cta__actions { display: grid; } }
      `}</style>
    </section>
  );
}
