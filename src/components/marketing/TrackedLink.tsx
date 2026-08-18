"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, type AnalyticsEvent, type AnalyticsProperties } from "@/lib/analytics";

type Props = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode; event?: AnalyticsEvent; eventProperties?: AnalyticsProperties;
};

export function TrackedLink({ event, eventProperties, onClick, ...props }: Props) {
  return <Link {...props} onClick={(e) => { if (event) track(event, eventProperties); onClick?.(e); }} />;
}
