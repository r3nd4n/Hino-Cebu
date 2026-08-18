export const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;
export type Attribution = Partial<Record<(typeof attributionKeys)[number], string>>;
export const ATTRIBUTION_STORAGE_KEY = "hino_cebu_attribution";

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "{}"); } catch { return {}; }
}

export function captureAttribution(search: string): Attribution {
  if (typeof window === "undefined") return {};
  const existing = readAttribution();
  const params = new URLSearchParams(search);
  const captured: Attribution = { ...existing };
  for (const key of attributionKeys) {
    const value = params.get(key)?.trim();
    if (value) captured[key] = value.slice(0, 250);
  }
  sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(captured));
  return captured;
}
