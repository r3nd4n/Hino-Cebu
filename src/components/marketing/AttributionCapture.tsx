"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

export function AttributionCapture() {
  const searchParams = useSearchParams();
  useEffect(() => { captureAttribution(searchParams.toString()); }, [searchParams]);
  return null;
}
