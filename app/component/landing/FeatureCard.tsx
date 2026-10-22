import Image from "next/image";

export type FeatureTone = "gold" | "teal" | "plum" | "navy";

export interface Feature {
  title: string;
  description: string;
  image: string;
  tone?: FeatureTone;
}

// tint = colour washed over the photo, base = solid colour behind the text
const TONES: Record<FeatureTone, { tint: string; base: string }> = {
  gold: { tint: "#c994326c", base: "#7A4E14" },
  teal: { tint: "#2e8c8a64", base: "#0A2C4E" },
  plum: { tint: "#9b5c8f62", base: "#45193F" },
  navy: { tint: "#3d6fa86a", base: "#060D18" },
};

const TONE_CYCLE: FeatureTone[] = ["gold", "teal", "plum", "navy"];

export function FeatureCard({
  feature,
  index = 0,
}: {
  feature: Feature;
  index?: number;
}) {
  const tone = TONES[feature.tone ?? TONE_CYCLE[index % TONE_CYCLE.length]];

  return (
    <article
      className="relative isolate flex aspect-[1.08/1] w-full max-w-[329px] sm:max-w-[400px] shrink-0 flex-col justify-end overflow-hidden rounded-[8px] p-5 "
      style={{ backgroundColor: tone.base }}
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
        style={{ backgroundColor: tone.tint }}
      />

      {/* Top-to-bottom fade into the solid base colour */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, transparent 30%, ${tone.base}B3 70%, ${tone.base} 100%)`,
        }}
      />

      <h3 className="text-[22px] leading-tight text-white md:text-[24px]">
        {feature.title}
      </h3>
      <p className="mt-2 text-[14px] leading-[1.45] text-white/90">
        {feature.description}
      </p>
    </article>
  );
}