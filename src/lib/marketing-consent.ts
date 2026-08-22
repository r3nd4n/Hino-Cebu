export const MARKETING_CONSENT_STORAGE_KEY = "hino-cebu:marketing-consent";
export const MARKETING_CONSENT_VERSION = 1;

export type MarketingConsent = Readonly<{
  analytics: boolean;
  advertising: boolean;
}>;

type MarketingProviderIdentifiers = Readonly<{
  gtmId?: string;
  ga4Id?: string;
  metaPixelId?: string;
}>;

export const deniedMarketingConsent: MarketingConsent = Object.freeze({
  analytics: false,
  advertising: false,
});

const grantStates = new Set(["granted", "denied"]);
const consentKeys = ["advertising", "analytics", "version"];
const gtmPattern = /^GTM-[A-Z0-9]{4,}$/;
const ga4Pattern = /^G-[A-Z0-9]{4,}$/;
const metaPixelPattern = /^\d{5,20}$/;

export function parseMarketingConsent(value: string | null): MarketingConsent {
  if (!value) return deniedMarketingConsent;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return deniedMarketingConsent;

    const preference = parsed as Record<string, unknown>;
    if (Object.keys(preference).sort().join(",") !== consentKeys.join(",")) return deniedMarketingConsent;
    if (preference.version !== MARKETING_CONSENT_VERSION) return deniedMarketingConsent;
    if (!grantStates.has(preference.analytics as string) || !grantStates.has(preference.advertising as string)) {
      return deniedMarketingConsent;
    }

    return Object.freeze({
      analytics: preference.analytics === "granted",
      advertising: preference.advertising === "granted",
    });
  } catch {
    return deniedMarketingConsent;
  }
}

export function getStoredMarketingConsent(): MarketingConsent {
  if (typeof window === "undefined") return deniedMarketingConsent;

  try {
    return parseMarketingConsent(window.localStorage.getItem(MARKETING_CONSENT_STORAGE_KEY));
  } catch {
    return deniedMarketingConsent;
  }
}

function validIdentifiers(identifiers: MarketingProviderIdentifiers) {
  return {
    gtmId: identifiers.gtmId && gtmPattern.test(identifiers.gtmId) ? identifiers.gtmId : null,
    ga4Id: identifiers.ga4Id && ga4Pattern.test(identifiers.ga4Id) ? identifiers.ga4Id : null,
    metaPixelId: identifiers.metaPixelId && metaPixelPattern.test(identifiers.metaPixelId)
      ? identifiers.metaPixelId
      : null,
  };
}

export function buildMarketingTagBootstrap(identifiers: MarketingProviderIdentifiers): string {
  const providers = validIdentifiers(identifiers);
  if (!providers.gtmId && !providers.ga4Id && !providers.metaPixelId) return "";

  const configuration = JSON.stringify({
    storageKey: MARKETING_CONSENT_STORAGE_KEY,
    version: MARKETING_CONSENT_VERSION,
    providers,
  });

  return `;(() => {
    const configuration = ${configuration};
    let preference;
    try {
      preference = JSON.parse(window.localStorage.getItem(configuration.storageKey));
    } catch {
      return;
    }
    if (!preference || typeof preference !== "object" || Array.isArray(preference)) return;
    if (Object.keys(preference).sort().join(",") !== "advertising,analytics,version") return;
    if (preference.version !== configuration.version) return;
    if (!["granted", "denied"].includes(preference.analytics)) return;
    if (!["granted", "denied"].includes(preference.advertising)) return;

    const analytics = preference.analytics === "granted";
    const advertising = preference.advertising === "granted";
    const appendScript = (src) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = src;
      document.head.appendChild(script);
    };

    if (analytics && advertising && configuration.providers.gtmId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      appendScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(configuration.providers.gtmId));
    }

    if (analytics && configuration.providers.ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", configuration.providers.ga4Id, { send_page_view: true });
      appendScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(configuration.providers.ga4Id));
    }

    if (advertising && configuration.providers.metaPixelId) {
      if (!window.fbq) {
        const fbq = function () { fbq.queue.push(arguments); };
        fbq.queue = [];
        fbq.loaded = true;
        fbq.version = "2.0";
        window.fbq = fbq;
        window._fbq = fbq;
      }
      window.fbq("init", configuration.providers.metaPixelId);
      window.fbq("track", "PageView");
      appendScript("https://connect.facebook.net/en_US/fbevents.js");
    }
  })();`;
}
