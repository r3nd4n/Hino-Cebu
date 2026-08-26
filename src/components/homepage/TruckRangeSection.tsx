import Image from "next/image";
import Link from "next/link";

import { officialAssets } from "@/content/assets";
import { homepageContent } from "@/content/homepage";
import { siteConfig } from "@/content/site";
import { truckRanges, type TruckSeriesSlug } from "@/content/trucks";

const rangeAssets: Record<TruckSeriesSlug, (typeof officialAssets)[keyof typeof officialAssets]> = {
  "200-series": officialAssets.truck200,
  "300-series": officialAssets.truck300,
  "500-series": officialAssets.truck500,
  "bus-puv": officialAssets.truckBusPuv,
};

export function TruckRangeSection() {
  const { truckRange } = homepageContent;

  return (
    <section aria-labelledby="truck-range-heading" className="truck-range" id="trucks">
      <div className="container">
        <div className="truck-range__heading">
          <div>
            <p className="eyebrow">{truckRange.eyebrow}</p>
            <h2 id="truck-range-heading">{truckRange.title}</h2>
          </div>
          <Link className="button button--secondary truck-range__action" href="/trucks">
            {truckRange.action}
          </Link>
        </div>
        <p className="truck-range__availability">{siteConfig.availabilityNotice}</p>

        <div className="truck-range__grid">
          {truckRanges.map((truck) => {
            const asset = rangeAssets[truck.slug];

            return (
              <Link aria-label={`Explore ${truck.name}`} className="truck-card" href={truck.href} key={truck.slug}>
                <div className="truck-card__media">
                  <Image
                    alt={asset.alt}
                    height={asset.height}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    src={asset.src}
                    width={asset.width}
                  />
                </div>
                <div className="truck-card__body">
                  <p>{truck.category}</p>
                  <h3>{truck.name}</h3>
                  <span>{truck.description}</span>
                  <strong>Ask about current availability</strong>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .truck-range { background: var(--color-muted-surface); padding-block: clamp(2.75rem, 5vw, 4.5rem); }
        .truck-range__heading { align-items: end; display: flex; gap: var(--space-xl); justify-content: space-between; }
        .truck-range h2 { margin-top: var(--space-sm); max-width: 15ch; }
        .truck-range__action { flex: 0 0 auto; }
        .truck-range__availability { color: var(--color-muted-ink); margin: var(--space-lg) 0 var(--space-xl); max-width: 44rem; }
        .truck-range__grid { display: grid; gap: var(--space-md); grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .truck-card { background: var(--color-paper); border: 1px solid var(--color-border); border-radius: var(--radius-card); box-shadow: var(--shadow-card); color: inherit; display: flex; flex-direction: column; min-width: 0; overflow: hidden; text-decoration: none; transition: box-shadow 180ms ease, transform 180ms ease; }
        .truck-card:hover { box-shadow: var(--shadow-elevated); transform: translateY(-3px); }
        .truck-card__media { align-items: center; aspect-ratio: 5 / 4; background: #f7f7f5; display: flex; justify-content: center; overflow: hidden; padding: 0; }
        .truck-card__media :global(img) { height: 100%; object-fit: cover; object-position: center 42%; width: 100%; }
        .truck-card__body { display: flex; flex: 1; flex-direction: column; padding: var(--space-lg); }
        .truck-card__body p { color: var(--color-red); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.07em; margin: 0 0 var(--space-sm); text-transform: uppercase; }
        .truck-card__body h3 { font-size: clamp(1.35rem, 2vw, 1.7rem); }
        .truck-card__body span { color: var(--color-muted-ink); font-size: 0.9rem; margin-top: var(--space-md); }
        .truck-card__body strong { color: var(--color-ink); font-size: 0.78rem; margin-top: auto; padding-top: var(--space-lg); text-transform: uppercase; }
        @media (max-width: 1023px) { .truck-range__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 639px) { .truck-range__heading { align-items: flex-start; flex-direction: column; gap: var(--space-lg); } .truck-range__action { width: 100%; } .truck-range__grid { grid-template-columns: 1fr; } .truck-card { min-height: 0; } }
        @media (prefers-reduced-motion: reduce) { .truck-card { transition: none; } .truck-card:hover { transform: none; } }
      `}</style>
    </section>
  );
}
