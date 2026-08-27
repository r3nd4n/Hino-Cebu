import Image from "next/image";
import Link from "next/link";

import type { PublicTruckSeries } from "@/content/trucks";

interface TruckCardProps {
  series: PublicTruckSeries;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export function TruckCard({ series, image }: TruckCardProps) {
  return (
    <Link aria-label={`Explore ${series.name}`} className="truck-listing-card" href={series.href}>
      <div className="truck-listing-card__media">
        <Image alt={image.alt} height={image.height} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" src={image.src} width={image.width} />
      </div>
      <div className="truck-listing-card__body">
        <p className="eyebrow">{series.category}</p>
        <h2>{series.name}</h2>
        <p>{series.description}</p>
        <div className="truck-listing-card__applications">
          <strong>Explore this range for</strong>
          <span>{series.applications.map((application) => application.title).join(" · ")}</span>
        </div>
        <span className="truck-listing-card__cue">Explore the range →</span>
      </div>
      <style>{`
        .truck-listing-card { background: var(--color-paper); border: 1px solid var(--color-border); border-radius: var(--radius-card); box-shadow: var(--shadow-card); color: inherit; display: flex; flex-direction: column; min-width: 0; overflow: hidden; text-decoration: none; transition: box-shadow 180ms ease, transform 180ms ease; }
        .truck-listing-card:hover, .truck-listing-card:focus-visible { box-shadow: var(--shadow-elevated); transform: translateY(-3px); }
        .truck-listing-card__media { align-items: center; aspect-ratio: 4 / 5; background: #f7f7f5; display: flex; justify-content: center; overflow: hidden; }
        .truck-listing-card__body { display: flex; flex: 1; flex-direction: column; padding: var(--space-lg); }
        .truck-listing-card h2 { font-size: clamp(1.5rem, 2vw, 2rem); margin-top: var(--space-sm); }
        .truck-listing-card__body > p:not(.eyebrow) { color: var(--color-muted-ink); font-size: .925rem; margin: var(--space-md) 0 0; }
        .truck-listing-card__applications { border-top: 1px solid var(--color-border); display: grid; gap: var(--space-xs); margin-top: var(--space-lg); padding-top: var(--space-md); }
        .truck-listing-card__applications strong, .truck-listing-card__cue { font-size: .75rem; text-transform: uppercase; }
        .truck-listing-card__applications span { color: var(--color-muted-ink); font-size: .875rem; }
        .truck-listing-card__cue { color: var(--color-red); font-weight: 800; margin-top: auto; padding-top: var(--space-lg); }
        @media (prefers-reduced-motion: reduce) { .truck-listing-card { transition: none; } .truck-listing-card:hover, .truck-listing-card:focus-visible { transform: none; } }
      `}</style>
    </Link>
  );
}
