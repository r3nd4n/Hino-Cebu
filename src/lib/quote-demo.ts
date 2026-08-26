export interface QuoteDraft {
  name: string;
  mobile: string;
  email: string;
  company: string;
  vehicleInterest: string;
  businessUse: string;
  estimatedUnits: string;
  consent: boolean;
}

export type QuoteField = keyof QuoteDraft;

export type QuoteValidationResult =
  | { ok: false; errors: Partial<Record<QuoteField, string>> }
  | { ok: true; message: string };

const localConfirmation =
  "Your interest has been noted on this device. Please call Hino Cebu to continue your quote conversation.";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^(?:\+63|0)9\d{9}$/;

export function validateQuoteDraft(draft: Partial<QuoteDraft>): QuoteValidationResult {
  const errors: Partial<Record<QuoteField, string>> = {};

  if (!draft.name?.trim()) errors.name = "Enter your name.";
  if (!draft.mobile?.trim()) errors.mobile = "Enter your mobile number.";
  else if (!mobilePattern.test(draft.mobile.replace(/[\s()-]/g, ""))) errors.mobile = "Enter a valid Philippine mobile number.";
  if (!draft.email?.trim()) errors.email = "Enter your email address.";
  else if (!emailPattern.test(draft.email.trim())) errors.email = "Enter a valid email address.";
  if (!draft.company?.trim()) errors.company = "Enter your company or business name.";
  if (!draft.vehicleInterest?.trim()) errors.vehicleInterest = "Choose a vehicle interest.";
  if (!draft.businessUse?.trim()) errors.businessUse = "Choose how your business will use the vehicle.";
  if (!draft.estimatedUnits?.trim()) errors.estimatedUnits = "Choose an estimated number of units.";
  if (!draft.consent) errors.consent = "Please confirm that Hino Cebu may contact you.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, message: localConfirmation };
}
