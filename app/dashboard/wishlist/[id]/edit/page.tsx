import WishlistEdit from "@/app/component/dashboard/wishlist/WishlistEdit";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <WishlistEdit id={decodeURIComponent(params.id)} />
    </RoleGate>
  );
}
