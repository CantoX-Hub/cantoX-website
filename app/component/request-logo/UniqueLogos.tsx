"use client";

import Image from "next/image";

const logos = [
  {
    id: 1,
    image: "/logo1.svg",
    alt: "Wedding logo design",
  },
  {
    id: 2,
    image: "/logo2.svg",
    alt: "Wedding monogram",
  },
  {
    id: 3,
    image: "/logo3.svg",
    alt: "Elegant wedding logo",
  },
  {
    id: 4,
    image: "/logo1.svg",
    alt: "Wedding logo design",
  },
  {
    id: 5,
    image: "/logo2.svg",
    alt: "Wedding monogram",
  },
  {
    id: 6,
    image: "/logo3.svg",
    alt: "Elegant wedding logo",
  },
];

export default function UniqueLogos() {
  return (
    <section className="overflow-hidden bg-[#F8FAFC] py-20 md:py-24">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-[700px] px-[5%] text-center md:mb-14">
        <span className="mb-2 block text-[9px] font-medium uppercase tracking-[0.16em] text-[#B49455]">
          YOUR STORY, YOUR STYLE
        </span>

         <h2 className="mb-3 text-[24px] sm:text-[32px] leading-tight  md:text-[48px]">
          You deserve to be unique
        </h2>

        <p className="mx-auto max-w-[560px] leading-relaxed text-[#060D18] text-[14px] sm:text-base">
         Have a peek at few wedding identities we created
        </p>
      </div>

      {/* Logo marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-[12%] bg-gradient-to-r from-[#F8FAFC] to-transparent" />

        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-[12%] bg-gradient-to-l from-[#F8FAFC] to-transparent" />

        <div className="unique-logo-marquee flex w-max">
          {/* First set */}
          <div className="flex shrink-0 items-center gap-5 pr-5 md:gap-8 md:pr-8">
            {logos.map((logo) => (
              <LogoCard
                key={`first-${logo.id}`}
                logo={logo}
              />
            ))}
          </div>

          {/* Duplicate set */}
          <div
            className="flex shrink-0 items-center gap-5 pr-5 md:gap-8 md:pr-8"
            aria-hidden="true"
          >
            {logos.map((logo) => (
              <LogoCard
                key={`second-${logo.id}`}
                logo={logo}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoCard({
  logo,
}: {
  logo: {
    id: number;
    image: string;
    alt: string;
  };
}) {
  return (
    <div
      className="
        group
        relative
        flex
        h-[150px]
        w-[190px]
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-[4px]
        border
        border-[#E3E7EB]
        bg-white
        transition-all
        duration-300
        hover:border-[#D6B66A]
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]
        md:h-[190px]
        md:w-[250px]
      "
    >
      <Image
        src={logo.image}
        alt={logo.alt}
        fill
        className="
          object-contain
          p-8
          transition-transform
          duration-500
          group-hover:scale-105
          md:p-10
        "
        sizes="250px"
      />
    </div>
  );
}