"use server";

import { z } from "zod";
import { leadOperatingContracts, isLeadContractApproved } from "@/content/governance/leads";
import { attributionKeys } from "@/lib/attribution";
import { leadFields } from "@/lib/leads/fields";
import { leadRouter } from "@/lib/leads/router";
import type { LeadType } from "@/lib/leads/types";
import { getRuntimeConfig } from "@/lib/runtime-config";

export type LeadFormState = { status: "idle" | "success" | "error"; message: string; errors?: Record<string, string> };
export const initialLeadState: LeadFormState = { status: "idle", message: "" };

const leadTypes: LeadType[] = ["sales", "parts", "service", "fleet", "financing"];
const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLead(_: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const type = String(formData.get("leadType") || "") as LeadType;
  if (!leadTypes.includes(type)) return { status: "error", message: "This inquiry type is not supported." };
  if (String(formData.get("website") || "")) return { status: "success", message: "Thank you. Your request was received." };

  const fields = leadFields[type];
  const shape: Record<string, z.ZodType> = {};
  for (const field of fields) {
    let validator = z.string().trim().max(field.type === "textarea" ? 2000 : 250, "Please shorten this field.");
    if (field.required) validator = validator.min(1, `${field.label} is required.`);
    if (field.type === "email") validator = validator.refine((value) => !value || simpleEmail.test(value), "Enter a valid email address.");
    shape[field.name] = validator;
  }
  shape.consent = z.literal("on", { error: "Consent is required." });
  const values = Object.fromEntries([...Object.keys(shape), "sourcePage", "sourceCta", "attribution"].map((key) => [key, String(formData.get(key) || "")]));
  const result = z.object(shape).safeParse(values);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "Please review the highlighted fields.", errors };
  }

  const runtimeConfig = getRuntimeConfig();
  const leadContract = leadOperatingContracts.find((contract) => contract.leadType === type);
  if (runtimeConfig.target === "production" && (
    !leadContract || !isLeadContractApproved(leadContract)
  )) {
    return { status: "error", message: "We could not send your request right now. Please call Hino Cebu instead." };
  }

  let attribution: Record<string, string> = {};
  try {
    const parsed = JSON.parse(values.attribution || "{}");
    attribution = Object.fromEntries(attributionKeys.flatMap((key) => typeof parsed[key] === "string" ? [[key, parsed[key].slice(0, 250)]] : []));
  } catch { attribution = {}; }

  const payload: Record<string, string | boolean> = Object.fromEntries(fields.map((field) => [field.name, String(result.data[field.name] ?? "")]));
  payload.consent = true;
  try {
    await leadRouter.submit({ type, sourcePage: values.sourcePage || "/", sourceCta: values.sourceCta || undefined, payload, attribution, submittedAt: new Date().toISOString() });
    return { status: "success", message: "Thank you. Your request was validated and received for follow-up." };
  } catch {
    return { status: "error", message: "We could not send your request right now. Please call Hino Cebu instead." };
  }
}
