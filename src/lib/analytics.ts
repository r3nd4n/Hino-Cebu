export const analyticsEvents = [
  "truck_model_view", "truck_quote_started", "truck_quote_submitted", "truck_finder_started",
  "truck_finder_completed", "service_request_started", "service_request_submitted",
  "parts_inquiry_started", "parts_inquiry_submitted", "fleet_inquiry_submitted",
  "financing_inquiry_submitted", "phone_click", "directions_click", "campaign_lead_submitted",
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];
export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window { dataLayer?: Record<string, unknown>[]; gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void; }
}

export function track(event: AnalyticsEvent, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;
  const safe = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
  window.dataLayer?.push({ event, ...safe });
  if (process.env.NEXT_PUBLIC_GA4_ID && window.gtag) window.gtag("event", event, safe);
  if (process.env.NEXT_PUBLIC_META_PIXEL_ID && window.fbq) window.fbq("trackCustom", event, safe);
}
