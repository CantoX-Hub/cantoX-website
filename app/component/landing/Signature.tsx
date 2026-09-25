"use client";
import Image from "next/image";

export default function SignatureSection() {
  return (
    <section className="overflow-hidden bg-white px-[5%] py-20 md:py-24">
      <div className="w-full">
        <div className="maxContainer flex flex-col items-center  ">
          {/* Eyebrow */}
          <span className="mb-2 block text-[14px] uppercase font-dm-sans text-[#C9933A] ">
            REQUEST LOGO
          </span>

          {/* Heading */}
          <h2 className="text-[24px] text-center sm:text-[32px] leading-tight  md:text-[48px]">
            Your wedding deserves a signature
          </h2>

          {/* Description */}
          <p className="mt-2 text-center leading-relaxed text-[#060D18] text-[14px] sm:text-base">
            Delivered in 48 hours, expected formats are PNG, JPEG and PDF
            format.
          </p>

          {/* Banner */}
          <div
            className="
              relative
              mt-8
              max-w-[1022px]
              w-full
              overflow-hidden
              rounded-[8px]
              bg-[#080D16]
              bg-cover
              bg-center
              bg-no-repeat
              text-left
              shadow-sm
              md:min-h-[270px]
            "
          >
            {/* Background Image */}
            <Image
              src="/request-logo-banner.png"
              alt="Custom wedding logo"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768pmax) 90vw, 780px"
            />

            {/* Dark overlay on text side */}
            <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-[#080D16] via-[#080D16]/95 to-transparent" />

            {/* Text */}
            <div className="relative z-10 flex h-full w-[58%] flex-col justify-center gap-4 p-5 md:p-8">
              <h3 className="max-w-[190px] sm:max-w-[425px] md:text-[32px] leading-[1.25] text-white text-[20px] sm:text-[24px]">
                Do you need custom Logo
                <br />
                crest for your Wedding?
              </h3>

              <p className="mt-1 text-white text-[14px] md:text-[18px]">
                Cost starts from $50
              </p>

              <button
                type="button"
                className="
                  w-fit
                  border-b
                  border-white/60
                  pb-1
                  
                  text-white/80
                  transition-opacity
                  hover:opacity-70
                  text-[14px] 
                "
              >
                Request logo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
