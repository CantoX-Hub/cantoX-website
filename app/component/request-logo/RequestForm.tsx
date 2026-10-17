
"use client";

import { useState, type FormEvent } from "react";

import LogoPreview from "../logo-request/LogoPreview";
import RequestFormField from "../logo-request/RequestFormField";
import RequestSuccess from "../logo-request/RequestSuccess";
import StylePreference from "../logo-request/StylePreference";

import {
  initialForm,
  LogoStyle,
  type FormErrors,
  type LogoRequestFormData,
} from "@/app/types/index.types";

export default function RequestForm() {
  const [form, setForm] =
    useState<LogoRequestFormData>(initialForm);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof LogoRequestFormData>(
    field: K,
    value: LogoRequestFormData[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    // Couple name
    if (!form.coupleName.trim()) {
      nextErrors.coupleName = "Couple name is required.";
    }

    // Email
    const email = form.email.trim();

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    // Logo name
    if (!form.logoName.trim()) {
      nextErrors.logoName = "Logo name is required.";
    }

    // Style
    if (!form.style) {
      nextErrors.style = "Please select a style.";
    }

    // Brief
    const brief = form.brief.trim();

    if (!brief) {
      nextErrors.brief = "Tell us a little about your vision.";
    } else if (brief.length < 15) {
      nextErrors.brief = "Please provide at least 15 characters.";
    } else if (brief.length > 500) {
      nextErrors.brief = "Keep your brief under 500 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);

    try {
      // TODO: Replace with your actual API request.
      console.log("Logo request:", {
        ...form,
        coupleName: form.coupleName.trim(),
        email: form.email.trim(),
        logoName: form.logoName.trim(),
        hashtag: form.hashtag.trim(),
        brief: form.brief.trim(),
      });

      setSubmitted(true);
      setForm(initialForm);
      setErrors({});
    } catch {
      setErrors((previous) => ({
        ...previous,
        brief: "Unable to submit your request. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <RequestSuccess
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    <section className="bg-white px-[5%] py-12 sm:py-16 md:py-20">
      <div className="grid w-full maxContainer grid-cols-1 items-start gap-12 md:grid-cols-[1fr_0.9fr] lg:gap-20">
        {/* Left: Request form */}
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <RequestFormField
              label="Couple name"
              name="coupleName"
              placeholder="Enter name"
              value={form.coupleName}
              onChange={(value) =>
                updateField("coupleName", value)
              }
              error={errors.coupleName}
              autoComplete="name"
              required
            />

            <RequestFormField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter@email.com"
              value={form.email}
              onChange={(value) =>
                updateField("email", value)
              }
              error={errors.email}
              autoComplete="email"
              required
            />

            <RequestFormField
              label="Logo name"
              name="logoName"
              placeholder="Enter logo name"
              value={form.logoName}
              onChange={(value) =>
                updateField("logoName", value)
              }
              error={errors.logoName}
              required
            />

            <RequestFormField
              label="Hashtag"
              name="hashtag"
              placeholder="Enter hashtag (if any)"
              value={form.hashtag}
              onChange={(value) =>
                updateField("hashtag", value)
              }
              optional
            />

            <StylePreference
              value={form.style as LogoStyle}
              onChange={(value) =>
                updateField("style", value)
              }
              error={errors.style}
            />

            {/* Brief / notes */}
            <div>
              <label
                htmlFor="brief"
                className="mb-2 block text-sm font-semibold text-[#11151D]"
              >
                Brief / notes
                <span className="ml-1 text-[#C99532]">*</span>
              </label>

              <textarea
                id="brief"
                name="brief"
                value={form.brief}
                onChange={(event) =>
                  updateField("brief", event.target.value)
                }
                placeholder="Write a brief"
                rows={4}
                maxLength={500}
                required
                aria-invalid={Boolean(errors.brief)}
                aria-describedby={
                  errors.brief
                    ? "brief-error"
                    : "brief-count"
                }
                className={`w-full resize-y rounded-md border bg-white px-3 py-2.5 text-sm text-[#11151D] outline-none transition placeholder:text-[#A0A5AD] focus:border-[#C99532] focus:ring-2 focus:ring-[#C99532]/10 ${
                  errors.brief
                    ? "border-red-400"
                    : "border-[#DFE5ED]"
                }`}
              />

              <div className="mt-1 flex items-center justify-between gap-3">
                {errors.brief ? (
                  <p
                    id="brief-error"
                    role="alert"
                    className="text-xs text-red-600"
                  >
                    {errors.brief}
                  </p>
                ) : (
                  <p
                    id="brief-count"
                    className="text-xs text-[#9299A4]"
                  >
                    Minimum 15 characters
                  </p>
                )}

                <span className="shrink-0 text-xs text-[#9299A4]">
                  {form.brief.length}/500
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center rounded-md bg-[#07101F] px-4 text-sm font-medium text-white transition hover:bg-[#C99532] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending...
                </span>
              ) : (
                "Send"
              )}
            </button>

          </form>
        </div>

        {/* Right: Live logo preview */}
        <LogoPreview />
      </div>
    </section>
  );
}
