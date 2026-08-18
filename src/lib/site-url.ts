import { getRuntimeConfig } from "./runtime-config";

export function getSiteOrigin() {
  return getRuntimeConfig().siteOrigin;
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteOrigin()}/`).toString();
}
