import { inquiryTopics, type InquiryTopic } from "@/content/inquiry";

export interface InquiryDraft {
  originTopic: InquiryTopic;
  inquiryTopic: InquiryTopic;
  name: string;
  mobile: string;
  email: string;
  company: string;
  message: string;
  consent: boolean;
}

export type InquiryField = Exclude<keyof InquiryDraft, "originTopic">;

export type InquiryValidationResult =
  | { ok: false; errors: Partial<Record<InquiryField, string>> }
  | { ok: true; message: string };

const localConfirmation = "Thank you for your interest in Hino Cebu.";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^(?:\+63|0)9\d{9}$/;

export function validateInquiryDraft(draft: Partial<InquiryDraft>): InquiryValidationResult {
  const errors: Partial<Record<InquiryField, string>> = {};

  if (typeof draft.inquiryTopic !== "string" || !Object.hasOwn(inquiryTopics, draft.inquiryTopic)) {
    errors.inquiryTopic = "Choose what your inquiry is about.";
  }
  if (!draft.name?.trim()) errors.name = "Enter your name.";
  if (!draft.mobile?.trim()) errors.mobile = "Enter your mobile number.";
  else if (!mobilePattern.test(draft.mobile.replace(/[\s()-]/g, ""))) {
    errors.mobile = "Enter a valid Philippine mobile number.";
  }
  if (draft.email?.trim() && !emailPattern.test(draft.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!draft.consent) errors.consent = "Please confirm that Hino Cebu may contact you.";

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, message: localConfirmation };
}
