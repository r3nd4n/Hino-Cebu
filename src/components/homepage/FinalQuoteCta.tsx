"use client";

import { ArrowDown } from "lucide-react";

import { homepageContent } from "@/content/homepage";
import { Icon } from "@/components/ui/Icon";

export function FinalQuoteCta() {
  return (
    <section aria-labelledby="final-quote-heading" className="final-quote">
      <div className="container final-quote__panel">
        <div>
          <p className="eyebrow">Hino Cebu</p>
          <h2 id="final-quote-heading">{homepageContent.finalCta.title}</h2>
        </div>
        <a className="button button--primary" href="#request-a-quote">
          {homepageContent.finalCta.action}<Icon icon={ArrowDown} size={17} />
        </a>
      </div>
      <style jsx>{`
        .final-quote { background: var(--color-paper); padding-block: clamp(3.5rem, 7vw, 5.5rem); }
        .final-quote__panel { align-items: center; background: var(--color-dark); color: var(--color-paper); display: flex; gap: var(--space-xl); justify-content: space-between; padding: clamp(2rem, 5vw, 4rem); }
        .final-quote h2 { margin-top: var(--space-sm); max-width: 18ch; }
        .final-quote :global(.button) { flex: 0 0 auto; gap: var(--space-sm); }
        @media (max-width: 639px) { .final-quote__panel { align-items: stretch; flex-direction: column; } .final-quote :global(.button) { width: 100%; } }
      `}</style>
    </section>
  );
}
