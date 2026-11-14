import { notFound } from "next/navigation";
import VendorDetail from "@/app/component/dashboard/vendors/VendorDetail";
import { VENDORS } from "@/app/data/dashboard";

// TODO(backend): fetch the vendor by id instead of reading mock data.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = VENDORS.find((v) => v.id === id);
  if (!vendor) notFound();
  return <VendorDetail vendorId={vendor.id} />;
}
