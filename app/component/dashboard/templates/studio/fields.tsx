"use client";

import { useId, useRef, useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { fileToDataUrl } from "@/app/lib/wedding-utils";

export const inputClass =
  "w-full rounded-[4px] border bg-[#F8F9FB] px-3 text-[13px] text-[#11151D] outline-none transition-colors placeholder:text-[#A7ACB4] focus:border-[#C99532] focus:bg-white";

export function Field({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[12px] font-medium text-[#252A33]">
        {label}
        {required && (
          <span className="ml-0.5 text-[#E5484D]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-[12px] text-[#E5484D]">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  error,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "time";
  placeholder?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
}) {
  const id = useId();
  const common = {
    id,
    value,
    placeholder,
    "aria-invalid": !!error,
    className: `${inputClass} ${error ? "border-[#E5484D]" : "border-[#E5E7EB]"}`,
  };
  return (
    <Field label={label} required={required} error={error} htmlFor={id}>
      {multiline ? (
        <textarea
          {...common}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          className={`${common.className} resize-y py-2.5 leading-5`}
        />
      ) : (
        <input
          {...common}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          className={`${common.className} h-10`}
        />
      )}
    </Field>
  );
}

export function Accordion({
  id,
  label,
  open,
  hasError,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  open: boolean;
  hasError?: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section id={`section-${id}`} className="border-b border-[#1A1F2B]/80">
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`panel-${id}`}
          className="flex h-[46px] w-full items-center justify-between px-4 text-left text-[14px] font-medium text-[#11151D] hover:bg-[#F8F9FB]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <span className="flex items-center gap-2">
            {label}
            {hasError && <span className="h-1.5 w-1.5 rounded-full bg-[#E5484D]" aria-label="Needs attention" />}
          </span>
          <ChevronDown className={`h-4 w-4 text-[#6B7280] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      {open && (
        <div id={`panel-${id}`} className="flex flex-col gap-4 px-4 pb-5 pt-1">
          {children}
        </div>
      )}
    </section>
  );
}

/** One image slot: click to choose, X to clear. Stores a downsized data URL. */
export function ImageSlot({
  value,
  onChange,
  label,
  accept = "image/*",
  size = "square",
  placeholder,
}: {
  value: string | undefined | null;
  onChange: (value: string | null) => void;
  label: string;
  accept?: string;
  size?: "square" | "wide";
  /** Shown faintly when the slot is empty (the template's sample) */
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      onChange(await fileToDataUrl(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not use that image");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const shown = value || null;

  return (
    <div>
      <div
        className={`relative overflow-hidden rounded-[4px] border border-dashed border-[#D5D9E0] bg-[#EEF2F8] ${
          size === "wide" ? "h-24 w-full" : "aspect-square w-full"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          aria-label={label}
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          aria-label={shown ? `Replace ${label}` : `Upload ${label}`}
          className="absolute inset-0 flex items-center justify-center text-[#6B7280] hover:bg-black/5 disabled:cursor-wait"
        >
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="h-full w-full object-cover" />
          ) : placeholder ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={placeholder} alt="" className="h-full w-full object-cover opacity-30" />
              <Plus className="absolute h-5 w-5" />
            </>
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
        {shown && (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${label}`}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-1 text-[12px] text-[#E5484D]">
          {error}
        </p>
      )}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] text-[#11151D]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#C99532]" : "bg-[#D5D9E0]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-medium text-[#252A33]">{children}</p>;
}
