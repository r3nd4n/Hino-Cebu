import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin, Phone } from "lucide-react";

import { partsServiceWorkshop } from "@/content/assets";
import { homepageContent } from "@/content/homepage";
import { serviceOfferings } from "@/content/services";
import { siteConfig } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

const mapSearchUrl = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.contact.address)}&output=embed`;
const directionsUrl = siteConfig.contact.directionsUrl.value ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.contact.address)}`;

export function HomepageSupportSections() {
  const { service, valuePoints, visit } = homepageContent;

  return (
    <>
      <section aria-labelledby="why-hino-heading" className="why-hino">
        <div className="container">
          <p className="eyebrow">Why Hino Cebu</p>
          <h2 id="why-hino-heading">A practical local partner</h2>
          <div className="why-hino__rule" />
          <ul className="why-hino__points">
            {valuePoints.map((point) => (
              <li key={point}><Icon icon={Check} size={23} />{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="service-heading" className="support-service" id="parts-service">
        <div className="container support-service__grid">
          <div className="support-service__media">
            <Image alt={partsServiceWorkshop.alt} fill sizes="(min-width: 768px) 50vw, 100vw" src={partsServiceWorkshop.src} />
          </div>
          <div className="support-service__content">
            <p className="eyebrow">{service.eyebrow}</p>
            <h2 id="service-heading">{service.title}</h2>
            <p>{service.description}</p>
            <ul>
              {serviceOfferings.map((offering) => <li key={offering.name}>{offering.name}</li>)}
            </ul>
            <Link className="button button--primary" href="/parts-service">
              {service.action}<Icon icon={ArrowUpRight} size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="visit-heading" className="visit-section" id="visit-hino-cebu">
        <div className="container visit-section__grid">
          <div className="visit-section__content">
            <p className="eyebrow">{visit.eyebrow}</p>
            <h2 id="visit-heading">{visit.title}</h2>
            <address>
              <Icon icon={MapPin} size={22} />
              <span>{siteConfig.contact.address}</span>
            </address>
            <a className="visit-section__phone" href={siteConfig.contact.phone.href}>
              <Icon icon={Phone} size={20} />{siteConfig.contact.phone.display}
            </a>
            <dl>
              {siteConfig.hours.map((entry) => <div key={entry.days}><dt>{entry.days}</dt><dd>{entry.hours}</dd></div>)}
            </dl>
            <a className="button button--primary" href={directionsUrl} rel="noreferrer" target="_blank">
              {visit.directionsAction}<Icon icon={ArrowUpRight} size={17} />
            </a>
          </div>
          <div className="visit-section__map">
            <iframe allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={mapSearchUrl} title={`Map search for ${siteConfig.identity.displayName}`} />
          </div>
        </div>
      </section>

      <style jsx>{`
        .why-hino { background: var(--color-charcoal); color: var(--color-paper); padding-block: clamp(3.5rem, 8vw, 6rem); text-align: center; }
        .why-hino h2 { margin-top: var(--space-sm); }
        .why-hino__rule { background: var(--color-red); height: 3px; margin: var(--space-lg) auto var(--space-2xl); width: 3rem; }
        .why-hino__points { display: grid; gap: var(--space-lg); grid-template-columns: repeat(4, minmax(0, 1fr)); list-style: none; margin: 0; padding: 0; text-align: left; }
        .why-hino__points li { align-items: flex-start; color: #e8e9e9; display: flex; font-weight: 700; gap: var(--space-sm); }
        .why-hino__points :global(svg) { color: var(--color-red); flex: 0 0 auto; }
        .support-service, .visit-section { padding-block: clamp(3.5rem, 8vw, 6rem); }
        .support-service { background: var(--color-paper); }
        .support-service__grid, .visit-section__grid { align-items: stretch; display: grid; gap: clamp(2rem, 6vw, 5rem); grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
        .support-service__media { aspect-ratio: 16 / 10; background: var(--color-muted-surface); min-height: 18rem; overflow: hidden; position: relative; }
        .support-service__media :global(img) { object-fit: cover; }
        .support-service__content { align-self: center; }
        .support-service h2, .visit-section h2 { margin-top: var(--space-sm); }
        .support-service__content > p:not(.eyebrow) { color: var(--color-muted-ink); max-width: 34rem; }
        .support-service ul { display: grid; gap: var(--space-sm); list-style: none; margin: var(--space-lg) 0; padding: 0; }
        .support-service li { align-items: center; display: flex; font-size: 0.9rem; font-weight: 700; gap: var(--space-sm); }
        .support-service li::before { background: var(--color-red); content: ""; height: 0.45rem; width: 0.45rem; }
        .support-service :global(.button), .visit-section :global(.button) { gap: var(--space-sm); }
        .visit-section { background: var(--color-muted-surface); }
        .visit-section__content { align-self: center; }
        .visit-section address { align-items: flex-start; display: flex; font-style: normal; gap: var(--space-sm); margin-top: var(--space-xl); max-width: 33rem; }
        .visit-section address :global(svg), .visit-section__phone :global(svg) { color: var(--color-red); flex: 0 0 auto; }
        .visit-section__phone { align-items: center; color: var(--color-ink); display: inline-flex; font-weight: 700; gap: var(--space-sm); margin-top: var(--space-md); text-underline-offset: 0.25rem; }
        .visit-section dl { margin: var(--space-lg) 0; max-width: 24rem; }
        .visit-section dl div { border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; padding-block: var(--space-sm); }
        .visit-section dt { font-weight: 700; }
        .visit-section dd { color: var(--color-muted-ink); margin: 0; }
        .visit-section__map { box-shadow: var(--shadow-card); min-height: 22rem; }
        .visit-section iframe { border: 0; height: 100%; min-height: 22rem; width: 100%; }
        @media (max-width: 767px) { .why-hino__points { grid-template-columns: 1fr; } .support-service__grid, .visit-section__grid { grid-template-columns: 1fr; } .support-service__media { min-height: 15rem; } .visit-section__map { grid-row: 1; } }
      `}</style>
    </>
  );
}
