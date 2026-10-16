"use client";
import {
  UsersRound,
  ListChecks,
  CalendarDays,
  Heart,
  Store,
  Cake,
  Wallpaper
} from "lucide-react";

const audiences = [
  {
    label: "Guests",
    icon: UsersRound,
    color: "border-[#25286B] bg-[#EEF0FF] text-[#171A55]",
  },
  {
    label: "Couples",
    icon: Heart,
    color: "border-[#76522B] bg-[#FFF6E8] text-[#68451F]",
  },
  {
    label: "Event Planners",
    icon: CalendarDays,
    color: "border-[#28651F] bg-[#EDFFEA] text-[#245D1D]",
  },
  {
    label: "To-do list",
    icon: ListChecks,
    color: "border-[#762727] bg-[#FFF0EF] text-[#6E2424]",
  },
  {
    label: "Wedding website templates",
    icon: Wallpaper,
    color: "border-[#00484A] bg-[#dcf5fe] text-[#00484A]",
  },
  {
    label: "Vendors",
    icon: Store,
    color: "border-[#713080] bg-[#FAEBFF] text-[#61266E]",
  },
  {
    label: "Events",
    icon: Cake,
    color: "border-[#795529] bg-[#FFF5E7] text-[#67461F]",
  },
];

export default function AudienceMarquee() {
  const items = [...audiences, ...audiences,...audiences];

  return (
    <section
      aria-label="Discover what you can do with Canto"
      className="relative w-full overflow-hidden bg-white py-8 sm:py-12"
    >
      {/* Left and right fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-14" />

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-14" />

      {/* Continuous marquee */}
      <div className="audience-marquee-track flex w-max items-center gap-5 px-3 sm:gap-7">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.label}-${index}`}
              aria-hidden={index >= audiences.length}
              className={`
                flex shrink-0 items-center gap-2.5
                rounded-full border-2
                px-4 py-2.5
                text-xs font-semibold
                shadow-[0_2px_0_rgba(0,0,0,0.12)]
                transition-transform duration-300
                hover:-translate-y-0.5
                sm:gap-3 sm:px-5 sm:py-3 sm:text-sm
                ${item.color}
              `}
            >
              <Icon
                size={18}
                strokeWidth={2.2}
                aria-hidden="true"
                className="shrink-0 sm:h-5 sm:w-5"
              />

              <span className="whitespace-nowrap">{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}