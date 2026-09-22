"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ContactFormData, ContactFormErrors, ContactReason } from "@/types";

const initialData: ContactFormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  reason: "kunde",
  message: "",
  website: "",
};

const reasonValues: ContactReason[] = ["kunde", "lieferant", "sonstiges"];

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const [data, setData] = useState<ContactFormData>(initialData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  function validate(formData: ContactFormData): ContactFormErrors {
    const validationErrors: ContactFormErrors = {};

    if (!formData.name.trim()) validationErrors.name = t("errors.name");
    if (!formData.company.trim())
      validationErrors.company = t("errors.company");
    if (!formData.email.trim()) {
      validationErrors.email = t("errors.email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = t("errors.emailInvalid");
    }
    if (!formData.message.trim())
      validationErrors.message = t("errors.message");

    return validationErrors;
  }

  function update<K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({
      ...prev,
      [key as keyof ContactFormErrors]: undefined,
      form: undefined,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setData(initialData);
    } catch {
      setStatus("idle");
      setErrors({ form: t("errors.generic") });
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-accent/40 bg-accent/10 p-6 text-primary"
      >
        <p className="font-heading text-lg font-bold">{t("successTitle")}</p>
        <p className="mt-2 text-sm text-foreground/80">{t("successText")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 font-heading text-sm font-semibold text-primary underline"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot-Feld: für Menschen unsichtbar, Bots füllen es oft trotzdem aus */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-foreground">
            {t("nameLabel")} *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1.5 w-full rounded border border-primary/20 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="text-sm font-semibold text-foreground">
            {t("companyLabel")} *
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={data.company}
            onChange={(e) => update("company", e.target.value)}
            className="mt-1.5 w-full rounded border border-primary/20 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "company-error" : undefined}
          />
          {errors.company && (
            <p id="company-error" className="mt-1 text-xs text-red-600">
              {errors.company}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-semibold text-foreground">
            {t("emailLabel")} *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1.5 w-full rounded border border-primary/20 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-semibold text-foreground">
            {t("phoneLabel")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="mt-1.5 w-full rounded border border-primary/20 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="text-sm font-semibold text-foreground">
          {t("reasonLabel")}
        </label>
        <select
          id="reason"
          name="reason"
          value={data.reason}
          onChange={(e) => update("reason", e.target.value as ContactReason)}
          className="mt-1.5 w-full rounded border border-primary/20 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          {reasonValues.map((value) => (
            <option key={value} value={value}>
              {t(`reasonOptions.${value}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-semibold text-foreground">
          {t("messageLabel")} *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={data.message}
          onChange={(e) => update("message", e.target.value)}
          className="mt-1.5 w-full rounded border border-primary/20 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-xs text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
