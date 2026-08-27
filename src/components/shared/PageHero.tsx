import Image from "next/image";
import type { ReactNode } from "react";

interface PageHeroImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  image?: PageHeroImage;
}

export function PageHero({ eyebrow, title, description, actions, image }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className={`container page-hero__grid${image ? " page-hero__grid--media" : ""}`}>
        <div className="page-hero__content">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
          {actions ? <div className="page-hero__actions">{actions}</div> : null}
        </div>
        {image ? (
          <div className="page-hero__media">
            <Image alt={image.alt} height={image.height} priority sizes="(min-width: 1024px) 42vw, 100vw" src={image.src} width={image.width} />
          </div>
        ) : null}
      </div>
      <style>{`
        .page-hero { background: var(--color-dark); color: var(--color-paper); padding-block: clamp(3.5rem, 7vw, 6rem); }
        .page-hero__grid { align-items: center; display: grid; gap: clamp(2rem, 5vw, 5rem); }
        .page-hero__grid--media { grid-template-columns: minmax(0, 1fr) minmax(18rem, .8fr); }
        .page-hero__content > p:not(.eyebrow) { color: #d6d9da; font-size: clamp(1rem, 1.4vw, 1.15rem); margin: var(--space-lg) 0 0; max-width: 42rem; }
        .page-hero h1 { margin-top: var(--space-sm); max-width: 12ch; }
        .page-hero__actions { display: flex; flex-wrap: wrap; gap: var(--space-md); margin-top: var(--space-xl); }
        .page-hero__media { align-items: center; aspect-ratio: 4 / 3; background: #f7f7f5; display: flex; justify-content: center; overflow: hidden; }
        @media (max-width: 767px) { .page-hero__grid--media { grid-template-columns: 1fr; } .page-hero__media { grid-row: 1; } .page-hero__actions { display: grid; } }
      `}</style>
    </section>
  );
}
