import { createHash } from "node:crypto";
import { productionEstateRecord } from "../content/governance/decisions";
import { isApprovalCurrent } from "./governance/schemas";

export type DeploymentTarget = "development" | "preview" | "production";
export type LeadProfile = "disabled" | "development" | "sandbox" | "production";
export type AnalyticsProfile = "disabled" | "test" | "production";
export type CrawlPolicy = "blocked" | "allowed";
export type ReviewAccess = "disabled" | "protected";

export type RuntimeEnvironment = Partial<Record<
  | "DEPLOYMENT_ENV"
  | "VERCEL_ENV"
  | "NEXT_PUBLIC_SITE_URL"
  | "LEAD_PROFILE"
  | "ANALYTICS_PROFILE"
  | "CRAWL_POLICY"
  | "REVIEW_ACCESS",
  string
>>;

export type RuntimeDecisions = {
  productionEstateApproved: boolean;
  productionOrigin?: string;
};

export type RuntimeConfig = {
  target: DeploymentTarget;
  siteOrigin: string;
  leadProfile: LeadProfile;
  analyticsProfile: AnalyticsProfile;
  crawlPolicy: CrawlPolicy;
  reviewAccess: ReviewAccess;
  fingerprint: string;
};

const LOCAL_ORIGIN = "http://localhost:3000";

function fail(code: string, key?: keyof RuntimeEnvironment): never {
  throw new Error(key ? `${code}: ${key}` : code);
}

function parseTarget(environment: RuntimeEnvironment): DeploymentTarget {
  const target = environment.DEPLOYMENT_ENV || environment.VERCEL_ENV || "development";
  if (!(["development", "preview", "production"] as string[]).includes(target)) {
    return fail("CFG_TARGET_INVALID", "DEPLOYMENT_ENV");
  }
  if (environment.VERCEL_ENV && environment.VERCEL_ENV !== target) {
    return fail("CFG_TARGET_MISMATCH", "VERCEL_ENV");
  }
  return target as DeploymentTarget;
}

function parseOrigin(value: string | undefined, target: DeploymentTarget) {
  if (!value && target === "development") return LOCAL_ORIGIN;
  if (!value) return fail("CFG_ORIGIN_REQUIRED", "NEXT_PUBLIC_SITE_URL");

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return fail("CFG_ORIGIN_INVALID", "NEXT_PUBLIC_SITE_URL");
  }
  if (url.username || url.password || url.search || url.hash || (url.pathname && url.pathname !== "/")) {
    return fail("CFG_ORIGIN_INVALID", "NEXT_PUBLIC_SITE_URL");
  }

  const isLocal = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname);
  if (target === "development") {
    if (!isLocal || (url.protocol !== "http:" && url.protocol !== "https:")) {
      return fail("CFG_ORIGIN_TARGET_MISMATCH", "NEXT_PUBLIC_SITE_URL");
    }
  } else if (url.protocol !== "https:" || isLocal) {
    return fail("CFG_ORIGIN_TARGET_MISMATCH", "NEXT_PUBLIC_SITE_URL");
  }
  return url.origin;
}

function readProfile<T extends string>(
  value: string | undefined,
  key: keyof RuntimeEnvironment,
  allowed: readonly T[],
): T {
  if (!value || !allowed.includes(value as T)) return fail("CFG_PROFILE_MISMATCH", key);
  return value as T;
}

function repositoryRuntimeDecisions(now = new Date()): RuntimeDecisions {
  const productionDomain = productionEstateRecord.decisions.find(({ key }) => key === "production-domain")?.value;
  const productionOrigin = productionDomain?.status === "approved" && typeof productionDomain.value === "string"
    ? productionDomain.value
    : undefined;
  return {
    productionEstateApproved: isApprovalCurrent(
      productionEstateRecord.approval,
      "technical-release",
      now,
    ) && productionEstateRecord.decisions.every(({ value }) => value.status === "approved"),
    productionOrigin,
  };
}

export function parseRuntimeConfig(
  environment: RuntimeEnvironment,
  decisions = repositoryRuntimeDecisions(),
): RuntimeConfig {
  const target = parseTarget(environment);
  const siteOrigin = parseOrigin(environment.NEXT_PUBLIC_SITE_URL?.trim(), target);

  const defaults = target === "development" ? {
    lead: "development",
    analytics: "disabled",
    crawl: "blocked",
    review: "protected",
  } : {};
  const leadProfile = readProfile(
    environment.LEAD_PROFILE || defaults.lead,
    "LEAD_PROFILE",
    target === "development" ? ["disabled", "development"] : target === "preview" ? ["disabled", "sandbox"] : ["disabled", "production"],
  );
  const analyticsProfile = readProfile(
    environment.ANALYTICS_PROFILE || defaults.analytics,
    "ANALYTICS_PROFILE",
    target === "production" ? ["disabled", "production"] : ["disabled", "test"],
  );
  const crawlPolicy = readProfile(
    environment.CRAWL_POLICY || defaults.crawl,
    "CRAWL_POLICY",
    target === "production" ? ["blocked", "allowed"] : ["blocked"],
  );
  const reviewAccess = readProfile(
    environment.REVIEW_ACCESS || defaults.review,
    "REVIEW_ACCESS",
    target === "production" ? ["disabled"] : ["disabled", "protected"],
  );

  if (target === "preview" && decisions.productionOrigin === siteOrigin) {
    return fail("CFG_ORIGIN_TARGET_MISMATCH", "NEXT_PUBLIC_SITE_URL");
  }
  if (target === "production") {
    if (!decisions.productionEstateApproved || !decisions.productionOrigin) {
      return fail("CFG_PRODUCTION_ESTATE_UNAPPROVED");
    }
    if (siteOrigin !== decisions.productionOrigin) {
      return fail("CFG_ORIGIN_APPROVAL_MISMATCH", "NEXT_PUBLIC_SITE_URL");
    }
  }

  const classifications = { target, leadProfile, analyticsProfile, crawlPolicy, reviewAccess };
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(classifications))
    .digest("hex")
    .slice(0, 16);
  return { ...classifications, siteOrigin, fingerprint };
}

export function getRuntimeConfig(): RuntimeConfig {
  const environment: RuntimeEnvironment = {
    DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    LEAD_PROFILE: process.env.LEAD_PROFILE,
    ANALYTICS_PROFILE: process.env.ANALYTICS_PROFILE,
    CRAWL_POLICY: process.env.CRAWL_POLICY,
    REVIEW_ACCESS: process.env.REVIEW_ACCESS,
  };
  return parseRuntimeConfig(environment);
}

export function getDeploymentTarget(): DeploymentTarget {
  const environment: RuntimeEnvironment = {
    DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };
  if (environment.DEPLOYMENT_ENV === "production" || environment.VERCEL_ENV === "production") {
    return "production";
  }
  return parseTarget(environment);
}
