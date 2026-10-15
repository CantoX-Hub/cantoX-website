"use client";

import Image from "next/image";

const HappyCouple = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white py-12 px-[5%] sm:py-20 md:py-24">
      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="mb-3 text-[24px] font-semibold leading-tight tracking-[-0.005em] sm:text-[32px] md:text-[48px]">
          Happy couples use Canto
        </h2>

        <p className="mt-2 text-[14px] leading-relaxed text-[#060D18] sm:text-base">
          Ready in minutes, not days...designed for couples not designers.
        </p>
      </div>

      {/* Image and full-width decorative stroke */}
      <div className="relative mt-8 sm:min-h-[700px] w-full">
        {/* Full viewport-width SVG */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/3
            z-0
            w-screen
            max-w-none
            -translate-x-1/2
            -translate-y-1/2
            rotate-[-7deg]
          "
          aria-hidden="true"
        >
          <Image
            src="/stroke.svg"
            alt=""
            width={1400}
            height={700}
            priority
            className="block h-[700px] w-full"
            sizes="100vw"
          />
        </div>

        {/* Couple image stays constrained */}
        <div className="relative z-10 mx-auto w-full max-w-[1022px]">
          <div className="relative min-h-[240px] w-full overflow-hidden rounded-[8px] bg-white shadow-sm sm:min-h-[320px] md:min-h-[440px] md:max-h-[579px]">
            <Image
              src="/couple-banner.png"
              alt="Happy couple celebrating their wedding"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 1022px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HappyCouple;