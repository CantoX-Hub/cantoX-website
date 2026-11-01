import Image from "next/image";

export type FeatureTone = "gold" | "teal" | "plum" | "navy";

/** tint = colour washed over the photo, base = solid colour behind the text */
export interface ToneColors {
  tint: string;
  base: string;
}

export interface Feature {
  title: string;
  description: string;
  image: string;
  /** Optional default tone stored with the data */
  tone?: FeatureTone;
}

export const TONES: Record<FeatureTone, ToneColors> = {
  gold: { tint: "#c9943263", base: "#4A2A00" },
  teal: { tint: "#00d97741", base: "#001E4A" },
  plum: { tint: "#8200d938", base: "#23004A" },
  navy: { tint: "#002bd952", base: "#00004A" },
};

const TONE_CYCLE: FeatureTone[] = ["gold", "teal", "plum", "navy"];

interface FeatureCardProps {
  feature: Feature;
  tone?: FeatureTone | ToneColors;
  index?: number;
}

function resolveTone(
  tone: FeatureCardProps["tone"],
  feature: Feature,
  index: number
): ToneColors {
  if (tone) return typeof tone === "string" ? TONES[tone] : tone;
  if (feature.tone) return TONES[feature.tone];
  return TONES[TONE_CYCLE[index % TONE_CYCLE.length]];
}

export function FeatureCard({ feature, tone, index = 0 }: FeatureCardProps) {
  const colors = resolveTone(tone, feature, index);

  return (
    <article
      className="relative isolate flex aspect-[1.08/1] w-full max-w-[329px] sm:max-w-[400px] shrink-0 flex-col justify-end overflow-hidden rounded-[8px] p-2"
      style={{ backgroundColor: colors.base }}
    >
      {/* Photo, greyscale so the tint reads evenly */}
      <Image
        src={feature.image}
        alt=""
        fill
        sizes="(max-width: 768px) 368px, (max-width: 1024px) 400px, 368px"
        className="-z-30 object-cover grayscale"
      />

      {/* Duotone tint */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 mix-blend-multiply"
        style={{ backgroundColor: colors.tint }}
      />

      {/* Top-to-bottom fade into the solid base colour */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, transparent 30%, ${colors.base}B3 70%, ${colors.base} 100%)`,
        }}
      />

      <h3 className="text-[22px] leading-tight text-white md:text-[24px]">
        {feature.title}
      </h3>
      <p className="mt-2 text-[14px] sm:text-base text-white">
        {feature.description}
      </p>
    </article>
  );
}