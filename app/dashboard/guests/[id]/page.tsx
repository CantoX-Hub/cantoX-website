import GuestListDetail from "@/app/component/dashboard/guests/GuestListDetail";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <GuestListDetail id={decodeURIComponent(params.id)} />
    </RoleGate>
  );
}
