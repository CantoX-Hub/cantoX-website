"use client";
import { templates, tabs } from "@/app/data";
import { TemplateCategory } from "@/app/types/index.types";
import { useMemo, useState } from "react";
import { TemplateCard } from "./TemplateCard";

export default function Templates() {
  const [activeTab, setActiveTab] = useState<TemplateCategory>("All");

  const filteredTemplates = useMemo(() => {
    if (activeTab === "All") return templates;

    return templates.filter(
      (template) => template.category === activeTab
    );
  }, [activeTab]);

  return (
    <section className="bg-white px-[5%] py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 block text-[10px] font-medium uppercase tracking-[0.12em] text-[#9B958C]">
            Templates
          </span>

          <h2 className="mb-3 text-[32px] leading-tight  md:text-[48px]">
            Find your perfect design
          </h2>

          <p className="mx-auto max-w-[560px] leading-relaxed text-[#060D18] text-[14px] sm:text-base">
            From free to premium templates, personalize it to fully express
            yourself.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-7 border-b border-[#E6E6E6]">
          <div className="flex items-center gap-8 md:gap-12">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-[14px] font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-[#171A20]"
                      : "text-[#B1B1B1] hover:text-[#555]"
                  }`}
                >
                  {tab}

                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 h-[1px] w-full bg-[#171A20]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
            />
          ))}
        </div>

        {/* See More */}
        <button
          type="button"
          className="mt-7 flex h-[34px] w-full items-center justify-center rounded-[3px] bg-[#F1F5F9] text-[14px] font-medium text-[#171A20] transition-all duration-300 hover:bg-[#E7EBEF]"
        >
          See more
        </button>
      </div>
    </section>
  );
}


