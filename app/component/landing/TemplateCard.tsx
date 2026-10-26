import Image from "next/image";
import { Star } from "lucide-react";
import { Template } from "@/app/types/index.types";
import { RiExpandDiagonalLine } from "react-icons/ri";
export function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border-2 max-h-[479px] h-full min-h-[409px] border-[#E2E8F0] bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)]">
      {/* Image */}
      <div className="relative aspect-[1.65/1] rounded-lg max-h-[238px] h-full w-full overflow-hidden bg-[#F4F1EC]">
        <Image
          src={template.image}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025] h-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

      </div>
        {/* Hover arrow */}
        <div className="absolute right-4 bottom-5 flex h-7 w-7 translate-y-1 items-center justify-center  opacity-0  transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <RiExpandDiagonalLine className="h-8 w-8 text-[#11151D]" />
        </div>

      {/* Content */}
      <div className="py-3">
        {/* Title row */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className=" text-[#171A20]">
            {template.name}
          </h3>

          {/* {template.category === "Premium" && (
            <Gem className="h-3 w-3 fill-[#C9933A] text-[#C9933A]" />
          )}

          {template.category === "Free" && (
            <span className="text-[12px] text-[#999]">
              Essential
            </span>
          )} */}
        </div>

        {/* Description */}
        <p className="mb-2.5 text-[12px] sm:text-[14px] font-medium text-[#857E75]">
          {template.description}
        </p>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-[2px]">
          {Array.from({ length: template.rating }).map((_, index) => (
            <Star
              key={index}
              className="h-[10px] w-[10px] fill-[#FFB800] text-[#FFB800]"
            />
          ))}
        </div>

        {/* Badge */}
        <div>
          <p
            className={`inline-flex rounded-[2px] px-1.5 py-[2px] text-[12px] font-semibold ${
              template.category === "Premium"
                ? "bg-[#C9933A] text-white"
                : "border border-[#DDE1E4] bg-[#EAF0F5] text-[#62676D]"
            }`}
          >
            {template.category === "Premium"
              ? "Premium"
              : "Essential"}
          </p>
        </div>
      </div>
    </div>
  );
}