import { getRuntimeConfig } from "./runtime-config";

export const siteOriginEnvironmentKey = "NEXT_PUBLIC_SITE_URL" as const;

export function getSiteOrigin() {
  return getRuntimeConfig().siteOrigin;
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteOrigin()}/`).toString();
}
