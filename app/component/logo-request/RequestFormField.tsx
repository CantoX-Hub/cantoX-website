
import type { ChangeEvent } from "react";

interface RequestFormFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  error?: string;
}

export default function RequestFormField({
  label,
  name,
  value,
  placeholder,
  onChange,
  type = "text",
  required = false,
  optional = false,
  autoComplete,
  error,
}: RequestFormFieldProps) {
  const id = `request-${name}`;

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <label
          htmlFor={id}
          className="text-[18px] font-bold text-[#11151D]"
        >
          {label}
        </label>

        {required && (
          <span
            className="text-xs text-[#C99532]"
            aria-hidden="true"
          >
            *
          </span>
        )}

        {optional && (
          <span className="text-xs text-[#9299A4]">
            (Optional)
          </span>
        )}
      </div>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-9 w-full border-0 border-b bg-transparent px-2 text-sm text-[#11151D] outline-none transition placeholder:text-[#A0A5AD] focus:border-[#C99532] focus:ring-0 ${
          error ? "border-red-400" : "border-[#DFE5ED]"
        }`}
      />

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
