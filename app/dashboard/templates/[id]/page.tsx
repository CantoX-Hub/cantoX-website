import TemplateEditor from "@/app/component/dashboard/templates/editor/TemplateEditor";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <TemplateEditor id={decodeURIComponent(params.id)} />
    </RoleGate>
  );
}
