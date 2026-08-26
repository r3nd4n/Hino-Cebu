"use client";

import { FinalQuoteCta } from "@/components/homepage/FinalQuoteCta";
import { HomepageQuoteExperience } from "@/components/homepage/HomepageQuoteExperience";
import { HomepageSupportSections } from "@/components/homepage/HomepageSupportSections";
import { TruckRangeSection } from "@/components/homepage/TruckRangeSection";

export default function HomePage() {
  return (
    <main className="homepage" id="main-content" tabIndex={-1}>
      <HomepageQuoteExperience />
      <TruckRangeSection />
      <HomepageSupportSections />
      <FinalQuoteCta />
    </main>
  );
}
