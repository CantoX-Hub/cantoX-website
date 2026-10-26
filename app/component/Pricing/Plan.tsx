"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { pricingData } from "@/app/data";
import Button from "../common/Button";


export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<string>("Couples");

  return (
    <section className="bg-white py-16 sm:py-20 md:py-28">
      <div className=" w-full maxContainer px-5 sm:px-[5%]">
        
        {/* Tabs Header */}
        <div className="relative border-b border-[#E2E8F0]">
          <div className="flex space-x-8 sm:space-x-12">
            {Object.keys(pricingData).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm transition-colors sm:text-base relative ${
                    isActive ? "text-[#11151D] font-bold" : " text-[#94A3B8] hover:text-[#64748B]"
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#11151D]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {pricingData[activeTab].map((plan, index) => (
            <div key={index} className="flex flex-col">
              
              {/* Plan Header */}
              <div className="min-h-[140px]">
                <h3 className="text-md sm:text-xl text-[#11151D] md:text-2xl">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl sm:text-3xl font-medium tracking-tight text-[#8D8D8D]">{plan.price}</span>
                </div>
                <p className="mt-1 text-sm text-[#060D18] sm:text-base font-medium ">{plan.billing}</p>
              </div>

              <p className="mt-4 text-sm text-[#060D18] sm:text-base font-medium ">{plan.description}</p>

              {/* CTA Button */}
              <Button href="/get-started" className="mt-6 w-full max-w-max rounded-lg bg-[#07111F] py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#07111fc1] sm:w-auto px-8">
                {plan.ctaText}
              </Button>

              {/* Divider */}
              <div className="my-8 border-b border-dashed border-[#E2E8F0]" />

              {/* Features Section */}
              <div className="space-y-6 text-sm text-[#8D8D8D]">
                <p className="font-medium text-[#2A2A2A] text-base">What you get:</p>

                {plan.features.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-3">
                    {group.category && (
                      <p className="font-medium text-[#2a2a2a] pt-2 text-base">{group.category}</p>
                    )}
                    <ul className="space-y-3">
                      {group.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3">
                          <Check className="h-4 w-4 shrink-0 text-[#11151D] mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}