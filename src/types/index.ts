export interface Product {
  slug: string;
  brand: string;
  name: string;
  origin: string;
  description: string;
  formats: string[];
  image: string;
  comingSoon?: boolean;
}

export type ContactReason = "kunde" | "lieferant" | "sonstiges";

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone?: string;
  reason: ContactReason;
  message: string;
  // Honeypot-Feld gegen einfache Formular-Bots. Muss leer bleiben.
  website?: string;
}

export interface ContactFormErrors {
  name?: string;
  company?: string;
  email?: string;
  reason?: string;
  message?: string;
  form?: string;
}
