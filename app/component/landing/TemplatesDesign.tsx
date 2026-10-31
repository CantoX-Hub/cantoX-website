"use client";
import { templates, tabs } from "@/app/data";
import { TemplateCategory } from "@/app/types/index.types";
import { useEffect, useMemo, useRef, useState } from "react";
import { TemplateCard } from "./TemplateCard";

/** Cards shown on first load, and added on each "See more" click */
const PAGE_SIZE = 8;
/** How long the loader shows before the next batch appears (ms) */
const LOAD_DELAY = 600;

export default function Templates() {
  const [activeTab, setActiveTab] = useState<TemplateCategory>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending load if the component unmounts mid-load
  useEffect(() => {
    return () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
    };
  }, []);

  const filteredTemplates = useMemo(() => {
    if (activeTab === "All") return templates;
    return templates.filter((template) => template.category === activeTab);
  }, [activeTab]);

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);
  const remaining = filteredTemplates.length - visibleCount;
  const hasMore = remaining > 0;
  // Only show as many skeletons as cards that are actually coming
  const skeletonCount = Math.min(PAGE_SIZE, Math.max(remaining, 0));

  const handleTabChange = (tab: TemplateCategory) => {
    if (loadTimer.current) clearTimeout(loadTimer.current);
    setIsLoadingMore(false);
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE); // every tab starts back at 8
  };

  const handleSeeMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    loadTimer.current = setTimeout(() => {
      setVisibleCount((count) => count + PAGE_SIZE);
      setIsLoadingMore(false);
    }, LOAD_DELAY);
  };

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="px-5 sm:px-[5%] w-full maxContainer">
        {/* Header */}
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-5 block text-[14px] font-medium uppercase tracking-[0.12em] text-[#16324A]">
            TEMPLATES
          </span>

          <h2 className="mb-3 text-[24px] sm:text-[32px] leading-tight tracking-[-0.005em]">
            Find your perfect design
          </h2>

          <p className="text-center leading-relaxed text-[#060D18] sm:text-base font-medium">
            From free to premium templates, personalize it to fully express
            yourself.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b-2 border-[#E6E6E6]">
          <div className="flex items-center gap-8 md:gap-12">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  aria-pressed={isActive}
                  className={`relative pb-3 text-[14px] font-medium transition-colors duration-300 min-w-16 sm:min-w-28 ${
                    isActive
                      ? "text-[#171A20]"
                      : "text-[#B1B1B1] hover:text-[#555]"
                  }`}
                >
                  {tab}

                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#060D18]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Template Grid */}
        <div
          aria-busy={isLoadingMore}
          className="grid grid-cols-1 mt-12 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4"
        >
          {visibleTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}

          {/* Lazy loader: skeleton cards while the next batch "loads" */}
          {isLoadingMore &&
            Array.from({ length: skeletonCount }).map((_, i) => (
              <TemplateCardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>

        {/* Empty state for a category with no templates */}
        {filteredTemplates.length === 0 && (
          <p className="mt-12 text-center text-sm text-[#6B7280]">
            No templates in this category yet.
          </p>
        )}

        {/* See More: only when there are cards left to show */}
        {hasMore && (
          <button
            type="button"
            onClick={handleSeeMore}
            disabled={isLoadingMore}
            className="mt-7 flex h-[42px] w-full items-center justify-center gap-2 rounded-[3px] bg-[#F1F5F9] text-[14px] font-semibold text-[#171A20] transition-all duration-300 hover:bg-[#E7EBEF] disabled:cursor-wait disabled:opacity-80"
          >
            {isLoadingMore ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#171A20]/20 border-t-[#171A20]"
                />
                Loading…
              </>
            ) : (
              "See more"
            )}
          </button>
        )}

        {/* Announces the new cards to screen readers */}
        <p className="sr-only" aria-live="polite">
          {isLoadingMore
            ? "Loading more templates"
            : `Showing ${visibleTemplates.length} of ${filteredTemplates.length} templates`}
        </p>
      </div>
    </section>
  );
}

function TemplateCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="aspect-[3/4] w-full rounded-[4px] bg-[#F1F5F9]" />
      <div className="mt-3 h-3.5 w-3/4 rounded bg-[#F1F5F9]" />
      <div className="mt-2 h-3 w-1/2 rounded bg-[#F1F5F9]" />
    </div>
  );
}