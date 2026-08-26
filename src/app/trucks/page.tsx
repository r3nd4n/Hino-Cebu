import type { Metadata } from "next";

import { LocalContactCta } from "@/components/shared/LocalContactCta";
import { PageHero } from "@/components/shared/PageHero";
import { TruckCard } from "@/components/trucks/TruckCard";
import { ButtonLink } from "@/components/ui/Button";
import { officialAssets } from "@/content/assets";
import { inquiryHref } from "@/content/inquiry";
import { publicTruckSeries, type TruckImageKey } from "@/content/trucks";

export const metadata: Metadata = {
  title: "Explore Hino trucks | Hino Cebu",
  description: "Explore configured Hino truck ranges and begin a local requirements conversation with Hino Cebu.",
};

const listingNotice = "Examples are general guidance only. Confirm body, operating, specification, and current Cebu availability requirements with Hino Cebu.";

function imageFields(imageKey: TruckImageKey) {
  const asset = officialAssets[imageKey];
  return { src: asset.src, alt: asset.alt, width: asset.width, height: asset.height };
}

export default function TrucksPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        actions={<ButtonLink href={inquiryHref("general")}>Request Information</ButtonLink>}
        description="Browse broad application cues, then ask Hino Cebu to confirm the body, operating, and availability details that matter to your business."
        eyebrow="Hino truck ranges"
        title="Explore Hino trucks"
      />

      <section aria-labelledby="truck-listing-heading" className="truck-listing">
        <div className="container">
          <h2 className="sr-only" id="truck-listing-heading">Configured truck ranges</h2>
          <p className="truck-listing__notice">{listingNotice}</p>
          <div className="truck-listing__grid">
            {publicTruckSeries.map((series) => <TruckCard image={imageFields(series.imageKey)} key={series.slug} series={series} />)}
          </div>
        </div>
      </section>

      <LocalContactCta
        description="Tell us about your routes, cargo, passenger, body, and operating requirements."
        inquiryLabel="Tell Us What Your Business Needs"
        title="Not sure where to begin?"
        topic="general"
      />

      <style>{`
        .truck-listing { background: var(--color-muted-surface); padding-block: clamp(2.5rem, 5vw, 4.5rem); }
        .truck-listing__notice { border-left: 3px solid var(--color-red); color: var(--color-muted-ink); margin: 0 0 var(--space-xl); max-width: 62rem; padding-left: var(--space-lg); }
        .truck-listing__grid { display: grid; gap: var(--space-md); grid-template-columns: repeat(4, minmax(0, 1fr)); }
        @media (max-width: 1023px) { .truck-listing__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 639px) { .truck-listing__grid { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
