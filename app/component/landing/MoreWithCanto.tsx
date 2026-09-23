"use client";
import { features } from "@/app/data";
import { FeatureCard } from "./FeatureCard";


export default function MoreWithCanto() {
  return (
    <section className="overflow-hidden bg-[#F4F8FC] py-16 md:py-20">
      {/* Header */}
      <div className="mx-auto mb-8 max-w-[1200px] px-[5%] text-center md:mb-10">
        <h2 className="mb-3 text-[32px] leading-tight  md:text-[48px]">
          Do more with Canto
        </h2>

        <p className="mx-auto max-w-[560px] leading-relaxed text-[#060D18] text-[14px] sm:text-base">
          Enjoy more perks and experiences as an event planner
        </p>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden">
        <div className="marquee-track flex w-max">
          {/* First set */}
          <div className="flex shrink-0 gap-5 pr-5 md:gap-8 md:pr-6">
            {features.map((feature, index) => (
              <FeatureCard key={`first-${index}`} feature={feature} />
            ))}
          </div>

          {/* Duplicate set */}
          <div
            className="flex shrink-0 gap-5 pr-5 md:gap-6 md:pr-6"
            aria-hidden="true"
          >
            {features.map((feature, index) => (
              <FeatureCard key={`second-${index}`} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

