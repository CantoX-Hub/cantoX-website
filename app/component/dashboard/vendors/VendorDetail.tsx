"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, CircularProgress } from "@mui/material";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { useGetVendorQuery, useGetVendorsQuery } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import { useDashboard } from "../DashboardContext";
import VendorCard from "./VendorCard";
import { AboutBlock, ContactBlock, GalleryLightbox, GalleryTile, MoqBlock, OfferingsBlock, ProfileCard, ReviewsBlock, heading } from "./VendorSections";

const MORE_COUNT = 4;

export default function VendorDetail({ vendorId }: { vendorId: string }) {
  const { role } = useDashboard();
  const { data: vendor, isLoading, error, refetch } = useGetVendorQuery(vendorId);
  const { data: all = [] } = useGetVendorsQuery();
  const [photo, setPhoto] = useState<number | null>(null);

  // Same category first, then the best rated of the rest
  const more = useMemo(() => {
    if (!vendor) return [];
    const others = all.filter((v) => v.id !== vendor.id);
    const same = others.filter((v) => v.category === vendor.category);
    const rest = others.filter((v) => v.category !== vendor.category).sort((a, b) => b.rating - a.rating);
    return [...same, ...rest].slice(0, MORE_COUNT);
  }, [all, vendor]);

  const title = (
    <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#1F2937] pb-8">
      <h1 className="text-[22px] leading-tight text-[#0F0F0F] sm:text-[24px]">Vendor</h1>
      {role !== "vendor" && (
        <Link href="/dashboard/vendors" className="flex items-center gap-1 rounded text-[14px] text-[#6B7280] hover:text-[#0F0F0F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]">
          <ChevronLeft size={16} /> All vendors
        </Link>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <>
        {title}
        <div className="flex justify-center py-24">
          <CircularProgress size={28} aria-label="Loading vendor" />
        </div>
      </>
    );
  }

  if (!vendor) {
    const missing = hasStatus(error, 404);
    return (
      <>
        {title}
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-[16px] font-semibold">{missing ? "This vendor isn't on canto" : "We couldn't load this vendor"}</p>
          <p className="mt-1 text-[14px] text-[#6B7280]">{missing ? "The link may be wrong, or the vendor has left." : getErrorMessage(error)}</p>
          {missing ? (
            <Button component={Link} href="/dashboard/vendors" variant="contained" sx={{ mt: 3 }}>
              Browse vendors
            </Button>
          ) : (
            <Button onClick={() => refetch()} variant="outlined" color="inherit" sx={{ mt: 3, borderColor: "#E8E8EC" }}>
              Try again
            </Button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {title}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,432px)_minmax(0,1fr)]">
        <div>
          <ProfileCard vendor={vendor} />
          <div className="mt-2">
            <AboutBlock vendor={vendor} />
            <MoqBlock vendor={vendor} />
            <OfferingsBlock vendor={vendor} />
            <ContactBlock vendor={vendor} layout="stacked" />
          </div>
        </div>

        <div className="min-w-0">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label={`${vendor.name} photos`}>
            {vendor.gallery.map((_, i) => (
              <li key={i}>
                <GalleryTile vendor={vendor} index={i} onOpen={setPhoto} className="aspect-square" />
              </li>
            ))}
          </ul>
          <div className="mt-6 bg-[#FCFBF9] pb-3">
            <ReviewsBlock vendor={vendor} />
          </div>
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#E8E8EC] pb-4">
            <h2 className="text-[22px] tracking-[-0.02em] text-[#0F0F0F] sm:text-[24px]" style={heading}>
              More vendors
            </h2>
            <Link href="/dashboard/vendors" className="flex items-center gap-1 rounded text-[14px] font-semibold text-[#C99532] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]">
              See more <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 xl:grid-cols-4">
            {more.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </section>
      )}

      <GalleryLightbox vendor={vendor} index={photo} onChange={setPhoto} />
    </>
  );
}
