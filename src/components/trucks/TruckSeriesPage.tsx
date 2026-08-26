import { BriefcaseBusiness, Route, Truck, Wrench } from "lucide-react";

import { LocalContactCta } from "@/components/shared/LocalContactCta";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { inquiryHref } from "@/content/inquiry";
import { siteConfig } from "@/content/site";
import type { PublicTruckSeries } from "@/content/trucks";

interface TruckSeriesPageProps {
  series: PublicTruckSeries;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

const applicationIcons = [Route, BriefcaseBusiness, Truck, Wrench] as const;

export function TruckSeriesPage({ series, image }: TruckSeriesPageProps) {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        actions={
          <>
            <ButtonLink href={inquiryHref(series.slug)}>Ask About This Range</ButtonLink>
            <ButtonLink href={siteConfig.contact.phone.href} variant="secondary">Call {siteConfig.contact.phone.display}</ButtonLink>
          </>
        }
        description={series.heroCopy}
        eyebrow={series.category}
        image={image}
        title={series.name}
      />

      <section aria-labelledby="applications-heading" className="series-section series-applications">
        <div className="container">
          <p className="eyebrow">Application guidance</p>
          <h2 id="applications-heading">Explore this range for</h2>
          <div className="series-applications__grid">
            {series.applications.map((application, index) => {
              const ApplicationIcon = applicationIcons[index % applicationIcons.length];
              return (
                <article className="series-application-card" key={application.title}>
                  <Icon icon={ApplicationIcon} size={28} />
                  <h3>{application.title}</h3>
                  <p>{application.description}</p>
                  <small>Talk with Hino Cebu about your body and operating requirements.</small>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {series.mode === "rich" ? (
        <section aria-labelledby="highlights-heading" className="series-section series-highlights">
          <div className="container">
            <p className="eyebrow">Curated series themes</p>
            <h2 id="highlights-heading">Points to discuss locally</h2>
            <div className="series-highlights__grid">
              {series.highlights.map((highlight) => (
                <article className="series-highlight-card" key={highlight.title}>
                  <h3>{highlight.title}</h3>
                  <p>{highlight.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section aria-labelledby="lightweight-heading" className="series-section series-lightweight">
          <div className="container series-lightweight__panel">
            <h2 id="lightweight-heading">Ask Hino Cebu about this range.</h2>
            <p>Current Cebu availability and detailed specifications require confirmation. Tell us what your operation needs, or call Hino Cebu for guidance.</p>
          </div>
        </section>
      )}

      <section aria-label="Availability confirmation" className="series-availability">
        <div className="container"><p>{series.availabilityNotice}</p></div>
      </section>

      <LocalContactCta
        description="Tell us about your routes, cargo, body, and operating requirements so the local conversation starts with useful context."
        inquiryLabel="Ask About This Range"
        title="Continue the conversation with Hino Cebu"
        topic={series.slug}
      />

      <style>{`
        .series-section { padding-block: clamp(3rem, 6vw, 5rem); }
        .series-section h2 { margin-top: var(--space-sm); }
        .series-applications__grid, .series-highlights__grid { display: grid; gap: var(--space-md); margin-top: var(--space-xl); }
        .series-applications__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .series-application-card, .series-highlight-card { border: 1px solid var(--color-border); padding: var(--space-xl); }
        .series-application-card :global(svg) { color: var(--color-red); }
        .series-application-card h3, .series-highlight-card h3 { margin-top: var(--space-lg); }
        .series-application-card p, .series-highlight-card p { color: var(--color-muted-ink); }
        .series-application-card small { display: block; font-weight: 700; margin-top: var(--space-lg); }
        .series-highlights { background: var(--color-muted-surface); }
        .series-highlights__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .series-highlight-card { background: var(--color-paper); }
        .series-lightweight { background: var(--color-muted-surface); }
        .series-lightweight__panel { max-width: 52rem; }
        .series-lightweight__panel p { color: var(--color-muted-ink); font-size: 1.1rem; margin: var(--space-lg) 0 0; }
        .series-availability { background: var(--color-paper); padding-block: var(--space-xl); }
        .series-availability p { border-left: 3px solid var(--color-red); color: var(--color-muted-ink); margin: 0; max-width: 60rem; padding-left: var(--space-lg); }
        @media (max-width: 767px) { .series-applications__grid, .series-highlights__grid { grid-template-columns: 1fr; } }
        @media (min-width: 768px) and (max-width: 1023px) { .series-applications__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      `}</style>
    </main>
  );
}
