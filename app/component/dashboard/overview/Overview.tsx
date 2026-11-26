"use client";

import { useDashboard } from "../DashboardContext";
import CalendarBanner from "./CalendarBanner";
import Greeting from "./Greeting";
import { PlannerStats } from "./StatCards";
import { PromoCard, SpotlightCard, TemplatesEmptyCard, TodoPreviewCard } from "./Cards";
import { LatestReviews, StorefrontChecklist, StorefrontPreview, VendorStats } from "./VendorOverview";

export default function Overview() {
  const { role } = useDashboard();

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Script face for the template preview; React 19 hoists this into <head> */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" precedence="default" />

      <Greeting />

      {role === "planner" && <PlannerStats />}
      {role === "vendor" && <VendorStats />}

      <CalendarBanner />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {role === "couple" && (
          <>
            <TemplatesEmptyCard />
            <TodoPreviewCard />
            <SpotlightCard initial="vendor" />
          </>
        )}
        {role === "planner" && (
          <>
            <TodoPreviewCard />
            <PromoCard />
            <SpotlightCard initial="template" />
          </>
        )}
        {role === "vendor" && (
          <>
            <StorefrontChecklist />
            <LatestReviews />
            <StorefrontPreview />
          </>
        )}
      </div>
    </div>
  );
}
