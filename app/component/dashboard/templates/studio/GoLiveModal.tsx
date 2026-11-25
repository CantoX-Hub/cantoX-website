"use client";

import { useEffect, useState } from "react";
import { Check, Link2, X } from "lucide-react";

/** Shown after "Go live": the link to share */
export default function GoLiveModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the link is selectable below
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#171A20]/70 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="live-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-lg bg-white p-5 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-[#6B7280] hover:text-[#11151D]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex gap-3 pr-6">
          <span className="text-[28px]" aria-hidden="true">
            🎉
          </span>
          <p className="text-[15px] leading-6 text-[#11151D]">
            <strong id="live-title" className="font-semibold">
              Congratulations! Your website is live.
            </strong>{" "}
            Copy link below to share with friends and family.
          </p>
        </div>

        <input
          readOnly
          value={url}
          aria-label="Your website link"
          onFocus={(e) => e.currentTarget.select()}
          className="mt-4 h-10 w-full rounded-[4px] border border-[#E5E7EB] bg-[#F8F9FB] px-3 text-[13px] text-[#11151D] outline-none"
        />

        <div className="mt-3 flex justify-end gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center rounded-[4px] px-4 text-[14px] font-medium text-[#11151D] hover:bg-[#F1F5F9]"
          >
            View site
          </a>
          <button
            type="button"
            onClick={copy}
            className="flex h-10 items-center gap-2 rounded-[4px] bg-[#F1F5F9] px-4 text-[14px] font-medium text-[#11151D] hover:bg-[#E7EBEF]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}
