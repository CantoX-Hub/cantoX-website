import TemplatesPage from "@/app/component/dashboard/templates/TemplatesPage";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page() {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <TemplatesPage />
    </RoleGate>
  );
}
