"use client";

import { FeatureCard } from "../landing/FeatureCard";

 
 export const features = [
   {
     title: "Couple",
     description:
       "Your wedding site, guest list, seating and wishlist, all in one dashboard.",
     image: "/couple-platform-img.png",
   },
   {
     title: "Event Planner",
     description:
       "Run every client from one dashboard: guests, vendors, budgets and more.",
     image: "/planner-platform-img.png",
   },
   {
     title: "Vendors",
     description:
       "Verified storefront with products & services, ready to book by people.",
     image: "/vendor-platform-img.png",
   },
  
 ];
export default function OnePlatform() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-white to-[#EAF0F5] py-12 sm:py-16 md:py-20">
      {/* Header */}
      <div className="maxContainer mb-8 px-[5%] text-center md:mb-10">
        <span className="mb-2 block text-[14px] uppercase font-dm-sans text-[#C9933A] ">
                    ONE PLATFORM, THREE SIDES
                  </span>
        <h2 className="mb-3 text-[24px] sm:text-[32px] leading-tight tracking-[-0.005em] ">
          Built for everyone who makes the day happen.
        </h2>
        <p className="mx-auto max-w-[560px] leading-relaxed text-[#060D18] text-[14px] sm:text-base font-medium">
         Delivered in 48 hours, expected formats are PNG, JPEG and PDF format.
        </p>
      </div>

      <div className="relative w-full maxContainer px-[5%] overflow-hidden">
          <div className="flex justify-between flex-wrap sm:flex-nowrap gap-8 ">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
      </div>
    </section>
  );
}