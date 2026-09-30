import { Testimonial } from "@/app/types/index.types";
import Image from "next/image";

export function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <article
      className="
        flex
        // h-[175px]
        // w-[298px]
        shrink-0
        flex-col
        justify-between
        rounded-[3px]
        border
        border-[#B9CCDD]
        bg-white
        p-4
        md:h-[165px]
        md:w-[320px]
        md:p-5
      "
    >
      {/* Testimonial */}
      <p
        className="
          line-clamp-5
          text-[14px]
          leading-[1.45]
          text-[#30343A]
          md:text-[16px]
        "
      >
        {testimonial.text}
      </p>

      {/* User */}
      <div className="flex items-center gap-2 mt-4">
        {/* Avatar */}
        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-[#E7EAF0]">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="28px"
          />
        </div>

        {/* User information */}
        <div>
          <p className="text-[14px] font-semibold leading-tight text-[#11151D]">
            {testimonial.name}
          </p>

          <p className="mt-[2px] text-[12px] leading-tight text-[#7B8088]">
            {testimonial.location}
          </p>
        </div>
      </div>
    </article>
  );
}