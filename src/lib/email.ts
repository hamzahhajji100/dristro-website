import { Resend } from "resend";
import { ContactFormData } from "@/types";

const reasonLabels: Record<ContactFormData["reason"], string> = {
  kunde: "Möchte Kunde werden",
  lieferant: "Möchte Lieferant werden",
  sonstiges: "Sonstiges",
};

// Platzhalter-Integration: nutzt Resend (https://resend.com) für den E-Mail-Versand.
// API-Key kommt aus der Umgebungsvariable RESEND_API_KEY (siehe .env.example).
// Kann bei Bedarf durch einen anderen Anbieter (z.B. Postmark, SendGrid) ersetzt werden.
export async function sendContactMail(data: ContactFormData) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || "kontakt@dristro.com";
  const to = process.env.CONTACT_TO_EMAIL || "info@dristro.com";

  if (!apiKey) {
    // Ohne konfigurierten API-Key wird der Versand übersprungen, damit die
    // lokale Entwicklung ohne Resend-Account möglich ist.
    console.warn(
      "[email] RESEND_API_KEY ist nicht gesetzt – E-Mail wurde nicht versendet.",
      data
    );
    return { skipped: true };
  }

  const resend = new Resend(apiKey);

  return resend.emails.send({
    from: `dristro Website <${from}>`,
    to,
    replyTo: data.email,
    subject: `Neue Kontaktanfrage von ${data.company} (${reasonLabels[data.reason]})`,
    text: [
      `Name: ${data.name}`,
      `Firma: ${data.company}`,
      `E-Mail: ${data.email}`,
      `Telefon: ${data.phone || "-"}`,
      `Anliegen: ${reasonLabels[data.reason]}`,
      "",
      "Nachricht:",
      data.message,
    ].join("\n"),
  });
}
