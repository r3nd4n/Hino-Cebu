import type { LeadType } from "./types";

export type FieldOption = { label: string; value: string };
export type LeadField = {
  name: string; label: string; type?: "text" | "email" | "tel" | "date" | "select" | "textarea";
  required?: boolean; autocomplete?: string; placeholder?: string; options?: FieldOption[];
};

const models = ["Not sure", "Hino 200", "Hino 300", "Hino 500"].map((value) => ({ label: value, value }));
const timelines = ["Researching", "Within 3 months", "3–6 months", "6+ months"].map((value) => ({ label: value, value }));

export const leadFields: Record<LeadType, LeadField[]> = {
  sales: [
    { name: "name", label: "Full name", required: true, autocomplete: "name" },
    { name: "mobile", label: "Mobile number", type: "tel", required: true, autocomplete: "tel" },
    { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" },
    { name: "company", label: "Company / business", autocomplete: "organization" },
    { name: "modelInterest", label: "Truck interest", type: "select", required: true, options: models },
    { name: "businessUse", label: "Business use", required: true },
    { name: "timeline", label: "Purchase timeline", type: "select", required: true, options: timelines },
    { name: "financingInterest", label: "Financing interest", type: "select", options: ["Yes", "No", "Not sure"].map((value) => ({ label: value, value })) },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  parts: [
    { name: "name", label: "Full name", required: true, autocomplete: "name" },
    { name: "mobile", label: "Mobile number", type: "tel", required: true, autocomplete: "tel" },
    { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" },
    { name: "truckModel", label: "Truck model", required: true }, { name: "modelYear", label: "Model year" },
    { name: "chassisVin", label: "Chassis / VIN (if appropriate)" }, { name: "partNumber", label: "Part number (if known)" },
    { name: "partDescription", label: "Part description", type: "textarea", required: true }, { name: "notes", label: "Additional notes", type: "textarea" },
  ],
  service: [
    { name: "name", label: "Full name", required: true, autocomplete: "name" }, { name: "mobile", label: "Mobile number", type: "tel", required: true, autocomplete: "tel" },
    { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }, { name: "truckModel", label: "Truck model", required: true },
    { name: "plateNumber", label: "Plate number" }, { name: "mileage", label: "Current mileage" }, { name: "serviceType", label: "Service type", required: true },
    { name: "preferredDate", label: "Preferred date", type: "date" }, { name: "concern", label: "Concern / symptoms", type: "textarea", required: true },
  ],
  fleet: [
    { name: "company", label: "Company", required: true, autocomplete: "organization" }, { name: "name", label: "Contact person", required: true, autocomplete: "name" },
    { name: "role", label: "Role" }, { name: "mobile", label: "Mobile number", type: "tel", required: true, autocomplete: "tel" },
    { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" }, { name: "fleetSize", label: "Current fleet size", required: true },
    { name: "requirement", label: "Requirement", required: true }, { name: "timeline", label: "Timeline", type: "select", options: timelines }, { name: "notes", label: "Message", type: "textarea" },
  ],
  financing: [
    { name: "name", label: "Full name", required: true, autocomplete: "name" }, { name: "company", label: "Company", autocomplete: "organization" },
    { name: "mobile", label: "Mobile number", type: "tel", required: true, autocomplete: "tel" }, { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" },
    { name: "modelInterest", label: "Truck interest", type: "select", required: true, options: models }, { name: "financingIntent", label: "Financing intent", required: true },
    { name: "timeline", label: "Timeframe", type: "select", required: true, options: timelines }, { name: "notes", label: "Notes", type: "textarea" },
  ],
};
