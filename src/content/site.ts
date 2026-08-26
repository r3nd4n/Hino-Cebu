export type VerificationStatus = "approved" | "unresolved" | "requires-verification";

export interface ConfiguredValue<T> {
  value: T;
  status: VerificationStatus;
  launchNote?: string;
}

export const siteConfig = {
  identity: {
    displayName: "Hino Cebu",
    legalEntity: {
      value: null,
      status: "unresolved",
      launchNote: "Confirm the registered Cebu dealership legal entity before commercial launch.",
    } satisfies ConfiguredValue<string | null>,
  },
  contact: {
    address: "8WC6+Q46, Saint John Paul II Avenue, Brgy, Cebu City, Philippines",
    phone: {
      display: "(032) 346 3322",
      href: "tel:+63323463322",
    },
    email: {
      value: null,
      status: "unresolved",
      launchNote: "Add only a confirmed branch email address.",
    } satisfies ConfiguredValue<string | null>,
    directionsUrl: {
      value: null,
      status: "unresolved",
      launchNote: "Add a verified Google Business or map URL before launch.",
    } satisfies ConfiguredValue<string | null>,
  },
  hours: [
    { days: "Monday–Saturday", hours: "8:00 AM–5:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  approvedClaims: [
    "Reliable Hino trucks backed by local sales, parts, service, and support for Cebu businesses.",
    "Support beyond the initial vehicle purchase.",
    "Ask Hino Cebu about current availability.",
  ],
  availabilityNotice:
    "Vehicle availability can vary. Send an inquiry and our local team will help you find the right fit.",
  primaryCta: "Request a Quote",
  secondaryCta: "Explore Hino Trucks",
} as const;

export type SiteConfig = typeof siteConfig;
