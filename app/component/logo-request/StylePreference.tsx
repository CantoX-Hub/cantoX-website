import { LogoStyle, styles } from "@/app/types/index.types";


interface StylePreferenceProps {
  value: LogoStyle;
  onChange: (value: LogoStyle) => void;
  error?: string;
}

export default function StylePreference({
  value,
  onChange,
  error,
}: StylePreferenceProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-[#11151D]">
        Style preference
        <span className="ml-1 text-[#C99532]">*</span>
      </legend>

      <div className="flex flex-wrap gap-1.5">
        {styles.map((style) => {
          const active = value === style;

          return (
            <button
              key={style}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(style)}
              className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                active
                  ? "border-[#EAF0F5] bg-[#EAF0F5] text-[#11151D]"
                  : "border-[#E0E6EE] bg-white text-[#858B95] hover:border-[#C99532] hover:text-[#11151D]"
              }`}
            >
              {style}
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
