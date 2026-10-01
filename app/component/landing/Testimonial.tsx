"use client";
import { testimonials } from "@/app/data";
import { TestimonialCard } from "./TestimonialCard";




export default function Testimonials() {
  return (
    <section className="overflow-hidden bg-white py-20 md:py-24">
      {/* Header */}
      <div className="mb-10 px-[5%] text-center md:mb-12">
        <h2 className="mb-3 text-[24px] sm:text-[32px] font-semibold leading-tight tracking-[-0.005em] md:text-[48px]">
          Couples who found their design
        </h2>

         <p className="mx-auto max-w-[560px] leading-relaxed text-[#060D18] text-[14px] sm:text-base">
          Delivered in 48 hours, expected formats are PNG, JPEG and PDF format.
        </p>
      </div>

      {/* =========================
          TOP ROW — MOVES LEFT
      ========================== */}
      <div className="relative mb-4 w-full overflow-hidden">
        <div className="testimonial-marquee-left flex w-max">
          {/* First set */}
          <div className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={`top-first-${testimonial.id}`}
                testimonial={testimonial}
              />
            ))}
          </div>

          {/* Duplicate set */}
          <div
            className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4"
            aria-hidden="true"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={`top-second-${testimonial.id}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </div>

      {/* =========================
          BOTTOM ROW — MOVES RIGHT
      ========================== */}
      <div className="relative w-full overflow-hidden">
        <div className="testimonial-marquee-right flex w-max">
          {/* First set */}
          <div className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={`bottom-first-${testimonial.id}`}
                testimonial={testimonial}
              />
            ))}
          </div>

          {/* Duplicate set */}
          <div
            className="flex shrink-0 gap-3 pr-3 md:gap-4 md:pr-4"
            aria-hidden="true"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={`bottom-second-${testimonial.id}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

