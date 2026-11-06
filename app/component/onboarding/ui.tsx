import { Lock } from "lucide-react";

export const GOLD = "#C99532";

export function StepHeading({
  title,
  description,
  size = "section",
}: {
  title: string;
  description?: string;
  /** "page" = big screen title (Choose a profile), "section" = title inside a step */
  size?: "page" | "section";
}) {
  return (
    <div>
      <h2
        className={`leading-tight tracking-[-0.01em] text-[#060D18] ${
          size === "page" ? "text-[26px] sm:text-[32px]" : "text-[18px] sm:text-[20px]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-[#64748B] ${
            size === "page" ? "mt-3 text-sm sm:text-[15px]" : "mt-2 text-[13px] sm:text-sm"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function PrimaryButton({
  loading,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`flex h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-[#C99532] text-sm font-semibold text-white transition-all hover:bg-[#B78628] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${className}`}
      {...props}
    >
      {loading && <Spinner className="border-white/30 border-t-white" />}
      {children}
    </button>
  );
}

export function SecondaryButton({ className = "", children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`flex h-11 w-full items-center justify-center rounded-[6px] bg-[#F1F4F8] text-sm font-semibold text-[#11151D] transition-all hover:bg-[#E5EAF1] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Small dark button used on the plan cards */
export function DarkButton({ className = "", children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-10 items-center justify-center rounded-[6px] bg-[#07111F] px-5 text-sm font-semibold text-white transition-all hover:bg-[#1A2638] active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Spinner({ className = "border-[#C99532]/20 border-t-[#C99532]" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 ${className}`}
    />
  );
}

export function SecureNote() {
  return (
    <p className="mt-10 flex items-start justify-center gap-1.5 text-center text-xs leading-5 text-[#64748B] sm:mt-14">
      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      Your information is encrypted and used only for verification. We never
      share your documents with other users.
    </p>
  );
}

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-[6px] border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
    >
      {children}
    </div>
  );
}
