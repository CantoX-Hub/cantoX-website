import { Suspense } from "react";
import EventsPage from "@/app/component/dashboard/events/EventsPage";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page() {
  return (
    <RoleGate roles={["planner"]}>
      {/* useSearchParams needs a Suspense boundary in the App Router */}
      <Suspense>
        <EventsPage />
      </Suspense>
    </RoleGate>
  );
}
