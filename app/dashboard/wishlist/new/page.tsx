import WishlistForm from "@/app/component/dashboard/wishlist/WishlistForm";
import { RoleGate } from "@/app/component/dashboard/ComingSoon";

export default function Page() {
  return (
    <RoleGate roles={["couple", "planner"]}>
      <WishlistForm />
    </RoleGate>
  );
}
