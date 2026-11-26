import BulkUpload from "@/app/component/dashboard/guests/BulkUpload";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <BulkUpload id={decodeURIComponent(params.id)} />
    </RoleGate>
  );
}
