import WishlistDetail from "@/app/component/dashboard/wishlist/WishlistDetail";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <WishlistDetail id={decodeURIComponent(params.id)} />
    </RoleGate>
  );
}
