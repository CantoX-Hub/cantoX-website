
"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type TemplateToastProps = {
  message: string;
  tone?: "ok" | "error";
  onClose: () => void;
};

export default function TemplateToast({
  message,
  tone = "ok",
  onClose,
}: TemplateToastProps) {
  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isError = tone === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`fixed bottom-6 right-6 z-[100] flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-xl ${
        isError ? "border-red-200" : "border-green-200"
      }`}
    >
      {isError ? (
        <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
      ) : (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
      )}

      <p className="text-sm text-[#111827]">{message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="ml-2 text-gray-400 hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}
