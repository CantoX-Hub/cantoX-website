import React from 'react'
import Image from "next/image";

const HappyCouple = () => {
  return (
     <section className="overflow-hidden bg-white py-20 md:py-24">
       {/* =====================================================
            HAPPY COUPLES
        ====================================================== */}
        <div className="w-full flex flex-col items-center">

          {/* Header */}
          <div className="relative z-10 text-center">
            <h2 className="text-[24px] text-center sm:text-[32px] leading-tight md:text-[48px]">
              Happy couples use Canto
            </h2>

            <p className="mt-2 text-center leading-relaxed text-[#060D18] text-[14px] sm:text-base">
              Ready in minutes, not days...designed for couples not designers.
            </p>
          </div>

          {/* Image + Stroke wrapper — stroke is scoped to this box now */}
          <div className="relative mt-8 w-full flex flex-col items-center ">
            {/* Gold Decorative Stroke — sits BEHIND the image, peeking out at the edges */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-0
                top-20
                -m-6
                sm:-m-10
                md:-m-14
                rotate-[-7deg]
                w-full
              "
            >
              <Image
                src="/stroke.svg"
                alt="stroke"
                fill
                priority
                className="w-full"
                sizes="100vw"
              />
            </div>
            
          <div className=" mt-8 w-full max-w-[1022px]">

            {/* Couple Image — sits ABOVE the stroke */}
            <div
              className="
                relative
                z-10
                w-full
                overflow-hidden
                rounded-[8px]
                bg-cover
                bg-center
                bg-no-repeat
                shadow-sm
                min-h-[240px]
                md:min-h-[440px]
                max-h-[579px]
              "
            >
              <Image
                src="/couple-banner.png"
                alt="Custom wedding logo"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 780px"
              />
            </div>

          </div>
          </div>
        </div>
    </section>
  )
}

export default HappyCouple