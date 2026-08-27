export type VerificationStatus = "approved" | "unresolved" | "requires-verification";

export interface ConfiguredValue<T> {
  value: T;
  status: VerificationStatus;
  launchNote?: string;
}

export interface PhoneValue {
  display: string;
  href: `tel:${string}`;
}

export interface HoursRow {
  days: string;
  hours: string;
}

type AwaitingConfirmation = {
  status: "awaiting-confirmation";
};

type ApprovedPhone = PhoneValue & {
  status: "approved";
};

type ApprovedAddress = {
  status: "approved";
  display: string;
};

export type ApprovedEmail = {
  status: "approved";
  display: string;
  href: `mailto:${string}`;
};

type ApprovedDirections = {
  status: "approved";
  href: string;
};

type ApprovedHours = {
  status: "approved";
  rows: readonly HoursRow[];
};

export interface PublicContact {
  phone: ApprovedPhone | AwaitingConfirmation;
  address: ApprovedAddress | AwaitingConfirmation;
  email: ApprovedEmail | AwaitingConfirmation;
  directions: ApprovedDirections | AwaitingConfirmation;
  hours: ApprovedHours | AwaitingConfirmation;
}

interface LocalFactConfiguration {
  contact: {
    phone: ConfiguredValue<PhoneValue>;
    address: ConfiguredValue<string>;
    email: ConfiguredValue<string | null>;
    directionsUrl: ConfiguredValue<string | null>;
  };
  hours: ConfiguredValue<readonly HoursRow[]>;
}

const awaitingConfirmation = (): AwaitingConfirmation => ({
  status: "awaiting-confirmation",
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const unsafeEmailCharacters = /[\u0000-\u001f\u007f\s?#]/;

export function projectPublicContact(config: LocalFactConfiguration): PublicContact {
  const addressApproved = config.contact.address.status === "approved";
  const email = config.contact.email.value?.trim() ?? "";
  const emailApproved =
    config.contact.email.status === "approved" &&
    emailPattern.test(email) &&
    !unsafeEmailCharacters.test(email);

  return {
    phone:
      config.contact.phone.status === "approved"
        ? { status: "approved", ...config.contact.phone.value }
        : awaitingConfirmation(),
    address: addressApproved
      ? { status: "approved", display: config.contact.address.value }
      : awaitingConfirmation(),
    email: emailApproved
      ? { status: "approved", display: email, href: `mailto:${email}` }
      : awaitingConfirmation(),
    directions:
      addressApproved &&
      config.contact.directionsUrl.status === "approved" &&
      config.contact.directionsUrl.value
        ? { status: "approved", href: config.contact.directionsUrl.value }
        : awaitingConfirmation(),
    hours:
      config.hours.status === "approved"
        ? { status: "approved", rows: config.hours.value }
        : awaitingConfirmation(),
  };
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
    phone: {
      value: {
        display: "(032) 346 3322",
        href: "tel:+63323463322",
      },
      status: "requires-verification",
      launchNote: "Confirm the Cebu dealer phone number before enabling public call actions.",
    } satisfies ConfiguredValue<PhoneValue>,
    address: {
      value: "8WC6+Q46, Saint John Paul II Avenue, Brgy, Cebu City, Philippines",
      status: "requires-verification",
      launchNote: "Confirm the complete Cebu dealer address before publishing location details.",
    } satisfies ConfiguredValue<string>,
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
  hours: {
    value: [
      { days: "Monday–Saturday", hours: "8:00 AM–5:00 PM" },
      { days: "Sunday", hours: "Closed" },
    ],
    status: "requires-verification",
    launchNote: "Confirm Cebu sales, parts, and service hours before publishing them.",
  } satisfies ConfiguredValue<readonly HoursRow[]>,
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

export const publicContact = projectPublicContact(siteConfig);

export type SiteConfig = typeof siteConfig;
