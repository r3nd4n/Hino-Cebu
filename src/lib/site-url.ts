const LOCAL_ORIGIN = "http://localhost:3000";

export function getSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return LOCAL_ORIGIN;
  try {
    return new URL(configured).origin;
  } catch {
    return LOCAL_ORIGIN;
  }
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteOrigin()}/`).toString();
}
