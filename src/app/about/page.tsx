import type { Metadata } from "next";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";

import { LocalContactCta } from "@/components/shared/LocalContactCta";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getPublicAboutContent } from "@/content/about";
import { inquiryHref } from "@/content/inquiry";
import { publicContact } from "@/content/site";

export const metadata: Metadata = {
  title: "About | Hino Cebu",
  description: "Learn about Hino Cebu's local customer commitment and find practical contact information.",
};

export default function AboutPage() {
  const aboutContent = getPublicAboutContent();

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        description="A concise introduction to the local customer commitment, the national company background, and the configured ways to reach Hino Cebu."
        eyebrow="About"
        title="A local point of contact for Cebu businesses"
      />

      <section aria-labelledby="local-commitment-heading" className="about-local" id="local-commitment">
        <div className="container about-local__grid">
          <div>
            <p className="eyebrow">{aboutContent.localCommitment.eyebrow}</p>
            <h2 id="local-commitment-heading">{aboutContent.localCommitment.title}</h2>
          </div>
          <div>
            <p>{aboutContent.localCommitment.description}</p>
            <ul>
              {aboutContent.localCommitment.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="national-background-heading" className="about-national" id="national-background">
        <div className="container about-national__content">
          <p className="eyebrow">National company background</p>
          <h2 id="national-background-heading">About Hino Motors Philippines</h2>
          {aboutContent.nationalBackground.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section aria-labelledby="practical-cebu-heading" className="about-practical" id="practical-cebu-information">
        <div className="container">
          <p className="eyebrow">{aboutContent.practicalSupport.eyebrow}</p>
          <h2 id="practical-cebu-heading">{aboutContent.practicalSupport.title}</h2>
          <p className="about-practical__intro">{aboutContent.practicalSupport.description}</p>
          <div className="about-practical__grid">
            <article>
              <Icon icon={MapPin} size={24} />
              <h3>Address</h3>
              {publicContact.address.status === "approved" ? (
                <address>{publicContact.address.display}</address>
              ) : (
                <p>Address: awaiting confirmation</p>
              )}
            </article>
            <article>
              <Icon icon={Phone} size={24} />
              <h3>Phone</h3>
              {publicContact.phone.status === "approved" ? (
                <a href={publicContact.phone.href}>{publicContact.phone.display}</a>
              ) : (
                <p>Phone: awaiting confirmation</p>
              )}
            </article>
            <article>
              <h3>Hours</h3>
              {publicContact.hours.status === "approved" ? (
                <dl>
                  {publicContact.hours.rows.map((entry) => <div key={entry.days}><dt>{entry.days}</dt><dd>{entry.hours}</dd></div>)}
                </dl>
              ) : (
                <p>Hours: awaiting confirmation</p>
              )}
            </article>
            <article>
              <Icon icon={MapPin} size={24} />
              <h3>Directions</h3>
              {publicContact.directions.status === "approved" ? (
                <a href={publicContact.directions.href} rel="noreferrer" target="_blank">Open verified directions</a>
              ) : (
                <p>Directions: awaiting confirmation</p>
              )}
            </article>
          </div>
          <div className="about-practical__actions">
            <ButtonLink href={inquiryHref("general")}>Start an Inquiry<Icon icon={ArrowUpRight} size={17} /></ButtonLink>
            {publicContact.phone.status === "approved" ? (
              <ButtonLink href={publicContact.phone.href} variant="secondary"><Icon icon={Phone} size={17} />Call {publicContact.phone.display}</ButtonLink>
            ) : null}
          </div>
        </div>
      </section>

      <LocalContactCta
        description="Share your truck, parts, or service question and continue the conversation with Hino Cebu."
        title="Start with what your business needs"
        topic="general"
      />

      <style>{`
        .about-local, .about-national, .about-practical { padding-block: clamp(3rem, 6vw, 5rem); }
        .about-local { background: var(--color-paper); }
        .about-local__grid { display: grid; gap: clamp(2rem, 6vw, 6rem); grid-template-columns: minmax(0, .85fr) minmax(0, 1fr); }
        .about-local h2, .about-national h2, .about-practical h2 { margin-top: var(--space-sm); }
        .about-local__grid > div:last-child > p, .about-practical__intro { color: var(--color-muted-ink); font-size: 1.05rem; margin-top: 0; max-width: 42rem; }
        .about-local ul { display: grid; gap: var(--space-md); margin: var(--space-xl) 0 0; padding-left: 1.25rem; }
        .about-local li::marker { color: var(--color-red); }
        .about-national { background: var(--color-charcoal); color: var(--color-paper); }
        .about-national__content { max-width: 54rem; }
        .about-national h2 { margin-bottom: var(--space-xl); }
        .about-national p:not(.eyebrow) { color: #d6d9da; font-size: 1.05rem; }
        .about-practical { background: var(--color-muted-surface); }
        .about-practical__intro { margin-top: var(--space-md); }
        .about-practical__grid { display: grid; gap: var(--space-md); grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: var(--space-xl); }
        .about-practical article { background: var(--color-paper); border: 1px solid var(--color-border); padding: var(--space-xl); }
        .about-practical article > :global(svg) { color: var(--color-red); }
        .about-practical h3 { margin-top: var(--space-md); }
        .about-practical address { font-style: normal; }
        .about-practical dl { margin: var(--space-md) 0 0; }
        .about-practical dl div { display: flex; gap: var(--space-md); justify-content: space-between; }
        .about-practical dt { font-weight: 700; }
        .about-practical dd { color: var(--color-muted-ink); margin: 0; text-align: right; }
        .about-practical__actions { display: flex; flex-wrap: wrap; gap: var(--space-md); margin-top: var(--space-xl); }
        .about-practical__actions :global(.button) { gap: var(--space-sm); }
        @media (max-width: 767px) { .about-local__grid, .about-practical__grid { grid-template-columns: 1fr; } .about-practical__actions { display: grid; } }
        @media (min-width: 768px) and (max-width: 1023px) { .about-practical__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      `}</style>
    </main>
  );
}
