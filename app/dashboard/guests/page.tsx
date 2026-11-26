import GuestListsPage from "@/app/component/dashboard/guests/GuestListsPage";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page() {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <GuestListsPage />
    </RoleGate>
  );
}
