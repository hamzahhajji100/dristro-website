import { NextRequest, NextResponse } from "next/server";
import { sendContactMail } from "@/lib/email";
import { ContactFormData, ContactReason } from "@/types";

const validReasons: ContactReason[] = ["kunde", "lieferant", "sonstiges"];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  let body: Partial<ContactFormData>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot: Bots füllen dieses versteckte Feld häufig aus, echte Nutzer nie.
  if (body.website) {
    // Gibt bewusst ein "Erfolg" zurück, um Bots keine Rückmeldung zu geben.
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const reason: ContactReason = validReasons.includes(
    body.reason as ContactReason
  )
    ? (body.reason as ContactReason)
    : "sonstiges";

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name ist erforderlich.";
  if (!company) errors.company = "Firma ist erforderlich.";
  if (!email) {
    errors.email = "E-Mail ist erforderlich.";
  } else if (!isValidEmail(email)) {
    errors.email = "E-Mail-Adresse ist ungültig.";
  }
  if (!message) errors.message = "Nachricht ist erforderlich.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validierung fehlgeschlagen.", fields: errors }, { status: 400 });
  }

  try {
    await sendContactMail({ name, company, email, phone, message, reason });
  } catch (err) {
    console.error("[api/kontakt] Fehler beim E-Mail-Versand:", err);
    return NextResponse.json(
      { error: "E-Mail konnte nicht versendet werden." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
