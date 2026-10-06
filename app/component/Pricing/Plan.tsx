"use client";
import { pricingData } from "@/app/data";
import { PricingCategory } from "@/app/types/index.types";
import React, { useState } from "react";

const tabs: { id: PricingCategory; label: string }[] = [
  { id: "couples", label: "For couples" },
  { id: "planners", label: "For Event planners" },
  { id: "vendors", label: "For Vendors" },
];

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-4 h-4 mt-0.5 shrink-0 ${className || ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function ChoosePlan() {
  
  const [activeTab, setActiveTab] = useState<PricingCategory>("couples");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("essentials");

  const handleTabChange = (tabId: PricingCategory) => {
    setActiveTab(tabId);
    setSelectedPlanId(pricingData[tabId][0].id);
  };

  return (
    <section className="bg-white py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-[1022px] mx-auto flex flex-col md:flex-row gap-10 lg:gap-16">
        {/* Left Sidebar - Tabs */}
        <div className="w-full md:w-[220px] flex flex-col gap-2 shrink-0 md:pt-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`text-left px-5 py-3 rounded-[8px] text-[15px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#D9A05B] text-white shadow-sm"
                    : "text-[#060D18] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Content - Pricing Cards */}
        <div className="flex-1 w-full max-w-[650px]">
          <div className="mb-8">
            <h2 className="text-[28px] sm:text-[32px] md:text-[48px] tracking-[-0.005em] font-semibold text-[#060D18] leading-tight mb-2">
              Choose a plan
            </h2>
            <p className="text-[14px] md:text-base text-gray-500">
              We have different packages for everyone, so please select where you belong.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {pricingData[activeTab].map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isDark = plan.theme === "dark";

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative cursor-pointer overflow-hidden rounded-[26px] p-1  transition-all duration-200 border-2 ${
                    isSelected
                      ? "border-[#D9A05B] "
                      : isDark
                      ? "border-transparent"
                      : "border-0"
                  }`}
                >
                <div className={`p-6 md:p-8 rounded-[26px] border ${
                    isDark
                      ? "bg-[#060D18] text-white"
                      : "bg-gradient-to-br from-[#F8F9FB] -2 to-[#F1F3F6] text-[#060D18]"
                  }`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                    {/* Plan Info */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {plan.name}
                        </h3>
                        <p
                          className={`text-sm mb-6 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {plan.description}
                        </p>
                      </div>
                      <div>
                        <div className="text-[32px] font-bold tracking-tight mb-1">
                          {plan.price}
                        </div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {plan.period}
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="flex flex-col justify-center">
                      <ul className="space-y-2 p-4 shadow-lg rounded-md">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckIcon
                              className={
                                isDark ? "text-[#D9A05B]" : "text-[#060D18]"
                              }
                            />
                            <span
                              className={`text-[14px] md:text-[15px] ${
                                isDark ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-6 bg-[#D9A05B] text-white rounded-[8px] py-3 font-medium hover:bg-[#c89250] transition-colors shadow-sm">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}