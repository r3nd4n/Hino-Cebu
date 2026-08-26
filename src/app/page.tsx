import { FinalQuoteCta } from "@/components/homepage/FinalQuoteCta";
import { HomepageQuoteExperience } from "@/components/homepage/HomepageQuoteExperience";
import { HomepageSupportSections } from "@/components/homepage/HomepageSupportSections";
import { TruckRangeSection } from "@/components/homepage/TruckRangeSection";
import { publicContact, siteConfig } from "@/content/site";

export default function HomePage() {
  return (
    <main className="homepage" id="main-content" tabIndex={-1}>
      <HomepageQuoteExperience phone={publicContact.phone} primaryCta={siteConfig.primaryCta} />
      <TruckRangeSection availabilityNotice={siteConfig.availabilityNotice} />
      <HomepageSupportSections contact={publicContact} siteName={siteConfig.identity.displayName} />
      <FinalQuoteCta />
    </main>
  );
}
