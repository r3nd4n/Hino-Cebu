import "server-only";

type OptionalValue = string | undefined;

function optional(name: string): OptionalValue {
  const value = process.env[name]?.trim();
  return value || undefined;
}

/** Server-only configuration. Do not import this module from a Client Component. */
export const serverEnv = {
  resendApiKey: optional("RESEND_API_KEY"),
  resendFromEmail: optional("RESEND_FROM_EMAIL"),
  leadNotificationEmail: optional("LEAD_NOTIFICATION_EMAIL"),
  googleSheetsSpreadsheetId: optional("GOOGLE_SHEETS_SPREADSHEET_ID"),
  googleSheetsClientEmail: optional("GOOGLE_SHEETS_CLIENT_EMAIL"),
  googleSheetsPrivateKey: optional("GOOGLE_SHEETS_PRIVATE_KEY"),
  googleSheetsWorksheetName: optional("GOOGLE_SHEETS_WORKSHEET_NAME"),
  turnstileSecretKey: optional("TURNSTILE_SECRET_KEY"),
} as const;

export function getLeadIntegrationReadiness() {
  const sheetsReady = Boolean(
    serverEnv.googleSheetsSpreadsheetId &&
      serverEnv.googleSheetsClientEmail &&
      serverEnv.googleSheetsPrivateKey,
  );
  const emailReady = Boolean(
    serverEnv.resendApiKey && serverEnv.resendFromEmail && serverEnv.leadNotificationEmail,
  );

  return {
    sheetsReady,
    emailReady,
    turnstileEnabled: Boolean(serverEnv.turnstileSecretKey),
    leadDeliveryReady: sheetsReady && emailReady,
  } as const;
}
