import Image from "next/image";
import { Star, Gem, ArrowUpRight } from "lucide-react";
import { Template } from "@/app/types/index.types";
export function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="group overflow-hidden rounded-[4px] border border-[#E8E8E8] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)]">
      {/* Image */}
      <div className="relative aspect-[1.65/1] w-full overflow-hidden bg-[#F4F1EC]">
        <Image
          src={template.image}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Hover arrow */}
        <div className="absolute right-3 top-3 flex h-7 w-7 translate-y-1 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-3.5 w-3.5 text-[#11151D]" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title row */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="sm:text-[24px] text-[#171A20]">
            {template.name}
          </h3>

          {template.category === "Premium" && (
            <Gem className="h-3 w-3 fill-[#D9B84C] text-[#D9B84C]" />
          )}

          {template.category === "Free" && (
            <span className="text-[7px] text-[#999]">
              Essential
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mb-2.5 max-w-[95%] text-[14px] text-[#857E75]">
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
          <span
            className={`inline-flex rounded-[2px] px-1.5 py-[2px] text-[7px] font-medium ${
              template.category === "Premium"
                ? "bg-[#E9B63A] text-white"
                : "border border-[#DDE1E4] bg-[#F8F9FA] text-[#62676D]"
            }`}
          >
            {template.category === "Premium"
              ? "Premium"
              : "Essential"}
          </span>
        </div>
      </div>
    </div>
  );
}