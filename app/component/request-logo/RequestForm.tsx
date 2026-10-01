"use client";

import { FormEvent, useState } from "react";

const styles = [
  "Classic",
  "Minimalistic",
  "Floral",
  "Luxury",
  "Afrocentric",
];

interface FormData {
  coupleName: string;
  email: string;
  logoName: string;
  hashtag: string;
  style: string;
  brief: string;
}

interface FormErrors {
  coupleName?: string;
  email?: string;
  logoName?: string;
  style?: string;
  brief?: string;
}

const initialForm: FormData = {
  coupleName: "",
  email: "",
  logoName: "",
  hashtag: "",
  style: "",
  brief: "",
};

export default function RequestForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear the error as the user fixes the field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!form.coupleName.trim()) {
      newErrors.coupleName = "Couple name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.logoName.trim()) {
      newErrors.logoName = "Logo name is required.";
    }

    if (!form.style) {
      newErrors.style = "Please select a style.";
    }

    if (!form.brief.trim()) {
      newErrors.brief = "Tell us a little about your vision.";
    } else if (form.brief.trim().length < 15) {
      newErrors.brief = "Please provide a little more detail.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Replace this with your API request later.
      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log("Logo request:", form);

      setSubmitted(true);
      setForm(initialForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="px-[5%] py-16 md:py-24">
        <div className="mx-auto max-w-[780px]">
          <div className="rounded-xl border border-white/10 bg-[#070D17] px-6 py-14 text-center shadow-[0_25px_80px_rgba(0,0,0,0.18)] md:px-12">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#FABB18]/30 bg-[#FABB18]/10">
              <span className="text-lg text-[#FABB18]">✓</span>
            </div>

            <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.18em] text-[#FABB18]">
              Request received
            </p>

            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">
              Your logo request is on its way.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-white/50">
              We've received your details. We'll review your brief and get
              back to you with the next steps.
            </p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-7 rounded-md border border-white/15 px-5 py-2.5 text-[10px] font-medium text-white transition-colors hover:bg-white/5"
            >
              Submit another request
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-[5%] py-16 md:py-24">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#FABB18]/[0.035] blur-[120px]" />

      <div className="relative mx-auto max-w-[1022px]">
       

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="
            relative
            overflow-hidden
            rounded-[8px]
            border
            border-[#1B2634]
            bg-[#070D17]
            p-4
            shadow-[0_25px_70px_rgba(0,0,0,0.16)]
            md:p-6
          "
        >
          {/* Top subtle glow */}
          {/* <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FABB18]/60 to-transparent" /> */}

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {/* Couple name */}
            <Field
              label="Couple name"
              required
              placeholder="Enter names"
              value={form.coupleName}
              error={errors.coupleName}
              onChange={(value) => updateField("coupleName", value)}
            />

            {/* Email */}
            <Field
              label="Email"
              required
              type="email"
              placeholder="Enter your email"
              value={form.email}
              error={errors.email}
              onChange={(value) => updateField("email", value)}
            />

            {/* Logo name */}
            <Field
              label="Logo name"
              required
              placeholder="Enter logo name"
              value={form.logoName}
              error={errors.logoName}
              onChange={(value) => updateField("logoName", value)}
            />

            {/* Hashtag */}
            <Field
              label="Hashtag"
              optional
              placeholder="Enter hashtag"
              value={form.hashtag}
              onChange={(value) => updateField("hashtag", value)}
            />
          </div>

          {/* Style */}
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <label className="text-[14px] font-medium text-white">
                Style preference
              </label>

              <span className="text-[14px] text-[#FABB18]">
                *
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {styles.map((style) => {
                const active = form.style === style;

                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => updateField("style", style)}
                    className={`
                      rounded-[3px]
                      border
                      px-2.5
                      py-1.5
                      text-[8px]
                      transition-all
                      duration-200
                      ${
                        active
                          ? "border-[#FABB18] bg-[#FABB18] text-[#11151D]"
                          : "border-[#253142] bg-[#0A111D] text-white/55 hover:border-[#455263] hover:text-white"
                      }
                    `}
                  >
                    {style}
                  </button>
                );
              })}
            </div>

            {errors.style && (
              <p className="mt-1.5 text-[8px] text-red-400">
                {errors.style}
              </p>
            )}
          </div>

          {/* Brief */}
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="brief"
                className="text-[14px] font-medium text-white"
              >
                Brief / notes
              </label>

              <span className="text-[12px] text-[#FABB18]">
                *
              </span>
            </div>

            <textarea
              id="brief"
              value={form.brief}
              onChange={(event) =>
                updateField("brief", event.target.value)
              }
              placeholder="Tell us about your vision..."
              rows={4}
              className={`
                w-full
                resize-none
                rounded-[3px]
                border
                bg-[#080F1A]
                px-3
                py-2.5
                text-[9px]
                text-white
                outline-none
                transition-all
                placeholder:text-white/25
                focus:border-[#FABB18]/60
                focus:ring-1
                focus:ring-[#FABB18]/10
                ${
                  errors.brief
                    ? "border-red-400/60"
                    : "border-[#202D3C]"
                }
              `}
            />

            <div className="mt-1.5 flex items-center justify-between">
              {errors.brief ? (
                <p className="text-[8px] text-red-400">
                  {errors.brief}
                </p>
              ) : (
                <span className="text-[7px] text-white/25">
                  Minimum 15 characters
                </span>
              )}

              <span className="text-[7px] text-white/25">
                {form.brief.length}/500
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              mt-5
              flex
              h-9
              w-full
              items-center
              justify-center
              rounded-[3px]
              bg-white
              text-[9px]
              font-medium
              text-[#11151D]
              transition-all
              duration-200
              hover:bg-[#FABB18]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border border-[#11151D]/20 border-t-[#11151D]" />
                Sending request...
              </span>
            ) : (
              "Send request"
            )}
          </button>

      
        </form>
      </div>
    </section>
  );
}

/* =========================================================
   REUSABLE FIELD
========================================================= */

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  type?: string;
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  optional,
  type = "text",
}: FieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <label
          htmlFor={id}
          className="text-[14px] font-medium text-white"
        >
          {label}
        </label>

        {required && (
          <span className="text-[12px] text-[#FABB18]">
            *
          </span>
        )}

        {optional && (
          <span className="text-[7px] text-white/25">
            Optional
          </span>
        )}
      </div>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`
          h-8
          w-full
          border-b
          bg-[#080F1A]
          px-3
          text-[10px]
          text-white
          outline-none
          transition-all
          placeholder:text-white/25
          focus:border-[#FABB18]/60
          focus:ring-1
          focus:ring-[#FABB18]/10
          ${
            error
              ? "border-red-400/60"
              : "border-[#202D3C]"
          }
        `}
      />

      {error && (
        <p className="mt-1 text-[10px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}