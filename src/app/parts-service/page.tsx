import type { Metadata } from "next";
import { ArrowUpRight, Phone } from "lucide-react";

import { LocalContactCta } from "@/components/shared/LocalContactCta";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { inquiryHref } from "@/content/inquiry";
import { serviceOfferings } from "@/content/services";
import { publicContact } from "@/content/site";

export const metadata: Metadata = {
  title: "Parts & Service | Hino Cebu",
  description: "Start a local Hino Cebu parts or service conversation and explore practical support guidance.",
};

export default function PartsServicePage() {
  const primaryOfferings = serviceOfferings.filter((offering) => offering.role === "primary");
  const supportingOfferings = serviceOfferings.filter((offering) => offering.role === "supporting");

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        actions={
          <>
            <ButtonLink href={inquiryHref("general")}>Start an Inquiry<Icon icon={ArrowUpRight} size={17} /></ButtonLink>
            {publicContact.phone.status === "approved" ? (
              <ButtonLink href={publicContact.phone.href} variant="secondary"><Icon icon={Phone} size={17} />Call {publicContact.phone.display}</ButtonLink>
            ) : null}
          </>
        }
        description="Choose the local support path that best matches your question, then share your vehicle and operating context with the Cebu team."
        eyebrow="Local aftersales paths"
        title="Parts & Service"
      />

      <section aria-labelledby="primary-support-heading" className="support-primary">
        <div className="container">
          <p className="eyebrow">Start here</p>
          <h2 id="primary-support-heading">Choose your support path</h2>
          <div className="support-primary__grid">
            {primaryOfferings.map((offering) => (
              <article className="support-path card" id={offering.sectionId} key={offering.sectionId}>
                <div>
                  <p className="eyebrow">Local inquiry</p>
                  <h3>{offering.name}</h3>
                  <p>{offering.description}</p>
                  <ul>
                    {offering.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                </div>
                <ButtonLink href={inquiryHref(offering.topic)}>{offering.ctaLabel}<Icon icon={ArrowUpRight} size={17} /></ButtonLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="support-guidance-heading" className="support-guidance">
        <div className="container">
          <p className="eyebrow">Supporting guidance</p>
          <h2 id="support-guidance-heading">Plan the conversation</h2>
          <div className="support-guidance__grid">
            {supportingOfferings.map((offering) => (
              <article id={offering.sectionId} key={offering.sectionId}>
                <h3>{offering.name}</h3>
                <p>{offering.description}</p>
                <ul>
                  {offering.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LocalContactCta
        description="Tell us what you operate and what support you are looking for so the local team can continue the conversation."
        inquiryLabel="Request Information"
        title="Not sure which support path to choose?"
        topic="general"
      />

      <style>{`
        .support-primary, .support-guidance { padding-block: clamp(3rem, 6vw, 5rem); }
        .support-primary { background: var(--color-paper); }
        .support-primary h2, .support-guidance h2 { margin-top: var(--space-sm); max-width: 17ch; }
        .support-primary__grid { display: grid; gap: var(--space-lg); grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: var(--space-2xl); }
        .support-path { display: flex; flex-direction: column; min-height: 25rem; padding: clamp(1.5rem, 3vw, 2.5rem); }
        .support-path h3, .support-guidance h3 { margin-top: var(--space-sm); }
        .support-path p:not(.eyebrow), .support-guidance article > p { color: var(--color-muted-ink); }
        .support-path ul, .support-guidance ul { display: grid; gap: var(--space-sm); margin: var(--space-lg) 0; padding-left: 1.25rem; }
        .support-path li::marker, .support-guidance li::marker { color: var(--color-red); }
        .support-path :global(.button) { align-self: flex-start; gap: var(--space-sm); margin-top: auto; }
        .support-guidance { background: var(--color-muted-surface); }
        .support-guidance__grid { display: grid; gap: var(--space-lg); grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: var(--space-xl); }
        .support-guidance article { border-top: 3px solid var(--color-red); background: var(--color-paper); padding: var(--space-xl); }
        @media (max-width: 767px) { .support-primary__grid, .support-guidance__grid { grid-template-columns: 1fr; } .support-path { min-height: 0; } }
      `}</style>
    </main>
  );
}
