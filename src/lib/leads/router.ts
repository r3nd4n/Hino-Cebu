import type { LeadRouter } from "./types";

const developmentRouter: LeadRouter = {
  async submit() {
    // Deliberately does not persist personal data. Replace with an approved adapter for production.
    return { reference: crypto.randomUUID() };
  },
};

const webhookRouter: LeadRouter = {
  async submit(lead) {
    const endpoint = process.env.LEAD_ROUTING_WEBHOOK_URL;
    if (!endpoint) return developmentRouter.submit(lead);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Lead destination rejected the submission.");
    return { reference: response.headers.get("x-lead-reference") || crypto.randomUUID() };
  },
};

export const leadRouter = webhookRouter;
