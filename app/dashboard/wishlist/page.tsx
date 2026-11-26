import WishlistListPage from "@/app/component/dashboard/wishlist/WishlistListPage";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page() {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <WishlistListPage />
    </RoleGate>
  );
}
