import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";

import { InquiryForm } from "@/components/contact/InquiryForm";
import { ContactEmail } from "@/components/contact/ContactEmail";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { normalizeInquiryTopic } from "@/content/inquiry";
import { publicContact } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact | Hino Cebu",
  description: "Contact Hino Cebu about trucks, parts, service, or general local support.",
};

type ContactPageProps = {
  searchParams: Promise<{ topic?: string | string[] }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const query = await searchParams;
  const initialTopic = normalizeInquiryTopic(query.topic);

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        description="Share what your business needs and use only the confirmed local contact paths shown here."
        eyebrow="Contact Hino Cebu"
        title="Start a local conversation"
      />

      <section aria-labelledby="inquiry-heading" className="contact-inquiry" id="inquiry">
        <div className="container contact-inquiry__grid">
          <div className="contact-inquiry__form">
            <p className="eyebrow">Request information</p>
            <div className="contact-inquiry__heading">
              <h2 id="inquiry-heading">Tell us what you need</h2>
              {publicContact.phone.status === "approved" ? (
                <a className="contact-inquiry__call" href={publicContact.phone.href}>
                  <Icon icon={Phone} size={18} />Call {publicContact.phone.display}
                </a>
              ) : null}
            </div>
            <InquiryForm key={initialTopic} initialTopic={initialTopic} phone={publicContact.phone} />
          </div>

          <aside aria-labelledby="contact-details-heading" className="contact-details">
            <p className="eyebrow">Local information</p>
            <h2 id="contact-details-heading">Reach Hino Cebu</h2>
            {publicContact.phone.status === "approved" ? (
              <a className="contact-details__phone" href={publicContact.phone.href}>
                <Icon icon={Phone} size={20} />{publicContact.phone.display}
              </a>
            ) : <p>Phone: awaiting confirmation</p>}
            {publicContact.address.status === "approved" ? (
              <address><Icon icon={MapPin} size={22} /><span>{publicContact.address.display}</span></address>
            ) : <p>Address: awaiting confirmation</p>}
            {publicContact.hours.status === "approved" ? (
              <dl className="contact-details__hours">
                {publicContact.hours.rows.map((entry) => (
                  <div key={entry.days}><dt>{entry.days}</dt><dd>{entry.hours}</dd></div>
                ))}
              </dl>
            ) : <p>Hours: awaiting confirmation</p>}
            <ContactEmail email={publicContact.email} />
            {publicContact.directions.status === "approved" ? (
              <a href={publicContact.directions.href} rel="noreferrer" target="_blank">Open verified directions</a>
            ) : <p>Verified directions link: awaiting confirmation</p>}
          </aside>
        </div>
      </section>

      <section aria-labelledby="contact-map-heading" className="contact-map">
        <div className="container">
          <p className="eyebrow">Location</p>
          <h2 id="contact-map-heading">Cebu location details</h2>
          {publicContact.directions.status === "approved" ? (
            <a href={publicContact.directions.href} rel="noreferrer" target="_blank">Open verified directions</a>
          ) : (
            <p>Map and directions: awaiting confirmation</p>
          )}
          <div className="contact-map__closing-call">
            <p>Continue with a general local inquiry.</p>
            {publicContact.phone.status === "approved" ? (
              <ButtonLink href={publicContact.phone.href}><Icon icon={Phone} size={17} />Call {publicContact.phone.display}</ButtonLink>
            ) : (
              <ButtonLink href="/contact#inquiry">Contact / Inquire</ButtonLink>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .contact-inquiry, .contact-map { padding-block: clamp(3rem, 6vw, 5rem); }
        .contact-inquiry { background: var(--color-paper); scroll-margin-block-start: 6rem; }
        .contact-inquiry__grid { display: grid; gap: clamp(2rem, 6vw, 5rem); grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 1fr); }
        .contact-inquiry__heading { align-items: center; display: flex; flex-wrap: wrap; gap: var(--space-md); justify-content: space-between; margin: var(--space-sm) 0 var(--space-xl); }
        .contact-inquiry__heading h2 { margin: 0; }
        .contact-inquiry__call, .contact-details__phone { align-items: center; color: var(--color-ink); display: inline-flex; font-weight: 700; gap: var(--space-sm); min-height: 44px; text-underline-offset: .25rem; }
        .contact-inquiry form { display: grid; gap: var(--space-md); }
        .contact-inquiry .quote-field { display: grid; gap: var(--space-xs); }
        .contact-inquiry .quote-field label { font-size: .875rem; font-weight: 700; }
        .contact-inquiry input:not([type="checkbox"]), .contact-inquiry select, .contact-inquiry textarea { background: #fff; border: 1px solid var(--color-border); border-radius: 4px; color: var(--color-ink); font: inherit; min-height: 50px; padding: .75rem; width: 100%; }
        .contact-inquiry textarea { min-height: 120px; resize: vertical; }
        .contact-inquiry [aria-invalid="true"] { border-color: #b42318; }
        .contact-inquiry .field-error, .contact-inquiry .form-message--error { color: #b42318; margin: 0; }
        .contact-inquiry .quote-field--consent { align-items: start; grid-template-columns: auto 1fr; }
        .contact-inquiry .quote-field--consent input { margin-top: .2rem; min-height: 20px; min-width: 20px; }
        .contact-inquiry .quote-field--consent .field-error { grid-column: 2; }
        .contact-inquiry .button { justify-self: start; }
        .contact-details { background: var(--color-muted-surface); border-top: 3px solid var(--color-red); padding: clamp(1.5rem, 3vw, 2.5rem); }
        .contact-details h2 { margin-top: var(--space-sm); }
        .contact-details__phone { margin-top: var(--space-lg); }
        .contact-details address { align-items: flex-start; display: flex; font-style: normal; gap: var(--space-sm); margin-top: var(--space-lg); }
        .contact-details address svg, .contact-details__phone svg, .contact-inquiry__call svg { color: var(--color-red); flex: 0 0 auto; }
        .contact-details__hours { margin-block: var(--space-lg); }
        .contact-details__hours div { border-bottom: 1px solid var(--color-border); display: flex; gap: var(--space-md); justify-content: space-between; padding-block: var(--space-sm); }
        .contact-details__hours dt { font-weight: 700; }
        .contact-details__hours dd { color: var(--color-muted-ink); margin: 0; text-align: right; }
        .contact-map { background: var(--color-muted-surface); }
        .contact-map h2 { margin: var(--space-sm) 0 var(--space-xl); }
        .contact-map__frame { aspect-ratio: 16 / 10; border: 1px solid var(--color-border); box-shadow: var(--shadow-card); margin-bottom: var(--space-md); }
        .contact-map iframe { border: 0; height: 100%; width: 100%; }
        .contact-map > .container > a { color: var(--color-ink); font-weight: 700; text-underline-offset: .25rem; }
        .contact-map__closing-call { align-items: center; background: var(--color-charcoal); color: var(--color-paper); display: flex; gap: var(--space-lg); justify-content: space-between; margin-top: var(--space-xl); padding: var(--space-xl); }
        .contact-map__closing-call p { margin: 0; }
        .contact-map__closing-call .button { gap: var(--space-sm); }
        .inquiry-confirmation { border-left: 4px solid #16794b; padding: var(--space-xl); }
        @media (max-width: 767px) { .contact-inquiry__grid { grid-template-columns: 1fr; } .contact-inquiry__heading { align-items: flex-start; flex-direction: column; } .contact-map__closing-call { align-items: stretch; flex-direction: column; } .contact-map__closing-call .button { width: 100%; } }
      `}</style>
    </main>
  );
}
