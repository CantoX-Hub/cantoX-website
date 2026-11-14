import VendorDirectory from "@/app/component/dashboard/vendors/VendorDirectory";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page() {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <VendorDirectory />
    </RoleGate>
  );
}
