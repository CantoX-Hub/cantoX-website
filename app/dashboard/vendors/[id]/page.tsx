import VendorDetail from "@/app/component/dashboard/vendors/VendorDetail";

// The vendor is loaded client-side (dummy data for now), which also shows the "not found" state.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VendorDetail vendorId={decodeURIComponent(id)} />;
}
