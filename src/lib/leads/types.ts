import type { Attribution } from "@/lib/attribution";

export type LeadType = "sales" | "parts" | "service" | "fleet" | "financing";
export type LeadSubmission = {
  type: LeadType;
  sourcePage: string;
  sourceCta?: string;
  payload: Record<string, string | boolean>;
  attribution: Attribution;
  submittedAt: string;
};

export type LeadRouter = { submit(lead: LeadSubmission): Promise<{ reference: string }> };
