"use client";

import { features } from "@/app/data";
import { FeatureCard } from "./FeatureCard";

// Each card's colour comes from its `tone` in the features data.
export default function MoreWithCanto() {
  return (
    <section className="overflow-hidden bg-white py-12 sm:py-16 md:py-20">
      {/* Marquee Track */}
      <div className="relative w-full overflow-hidden">
        <div className="marquee-track flex w-max">
          {/* First Set */}
          <div className="flex shrink-0 gap-5 pr-5 md:gap-6 md:pr-6">
            {features.map((feature, index) => (
              <FeatureCard key={`first-${index}`} feature={feature} index={index} />
            ))}
          </div>

          {/* Duplicate Set for Infinite Scroll (must match the first set exactly) */}
          <div className="flex shrink-0 gap-5 pr-5 md:gap-6 md:pr-6" aria-hidden="true">
            {features.map((feature, index) => (
              <FeatureCard key={`second-${index}`} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}