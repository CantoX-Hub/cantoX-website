"use client";

import { useMemo, useState } from "react";
import { Button, CircularProgress, InputAdornment, MenuItem, TextField, ToggleButton } from "@mui/material";
import { Heart, Search } from "lucide-react";
import { VENDORS, VENDOR_CATEGORIES, VENDOR_LOCATIONS } from "@/app/data/dashboard";
import type { Vendor } from "@/app/types/dashboard.types";
import { PageTitle } from "../ui";
import { useToast } from "../Toast";
import VendorCard, { useSavedVendors } from "./VendorCard";

const PAGE = 8;
type Sort = "rating" | "reviews" | "name";

export default function VendorDirectory() {
  const notify = useToast();
  const { saved, toggle } = useSavedVendors();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState<Sort>("rating");
  const [savedOnly, setSavedOnly] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [loading, setLoading] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VENDORS.filter((v) => category === "all" || v.category === category)
      .filter((v) => location === "all" || v.location === location)
      .filter((v) => !savedOnly || saved.includes(v.id))
      .filter((v) => !q || v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q))
      .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "reviews" ? b.reviewCount - a.reviewCount : b.rating - a.rating));
  }, [query, category, location, sort, savedOnly, saved]);

  const resetPaging = () => setShown(PAGE);

  const handleSave = (v: Vendor) => {
    const nowSaved = toggle(v.id);
    notify(nowSaved ? `${v.name} saved` : `${v.name} removed from saved`, {
      severity: nowSaved ? "success" : "info",
      actionLabel: "Undo",
      onAction: () => toggle(v.id),
    });
  };

  const loadMore = () => {
    setLoading(true);
    // Stand-in for fetching the next page from the API
    window.setTimeout(() => {
      setShown((n) => n + PAGE);
      setLoading(false);
    }, 600);
  };

  return (
    <>
      <PageTitle>Vendors</PageTitle>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <TextField
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            resetPaging();
          }}
          placeholder="Search vendors or services"
          size="small"
          slotProps={{
            input: { startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> },
            htmlInput: { "aria-label": "Search vendors" },
          }}
          sx={{ flex: 1, maxWidth: { lg: 340 } }}
        />
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <TextField select size="small" label="Category" value={category} onChange={(e) => { setCategory(e.target.value); resetPaging(); }} sx={{ minWidth: 190 }}>
            <MenuItem value="all">All categories</MenuItem>
            {VENDOR_CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <TextField select size="small" label="Location" value={location} onChange={(e) => { setLocation(e.target.value); resetPaging(); }} sx={{ minWidth: 170 }}>
            <MenuItem value="all">Anywhere</MenuItem>
            {VENDOR_LOCATIONS.map((l) => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </TextField>
          <TextField select size="small" label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as Sort)} sx={{ minWidth: 150 }}>
            <MenuItem value="rating">Top rated</MenuItem>
            <MenuItem value="reviews">Most reviewed</MenuItem>
            <MenuItem value="name">Name (A–Z)</MenuItem>
          </TextField>
          <ToggleButton
            value="saved"
            size="small"
            selected={savedOnly}
            onChange={() => { setSavedOnly((s) => !s); resetPaging(); }}
            sx={{ textTransform: "none", gap: 1, px: 1.5, height: 40, borderColor: "#E8E8EC", bgcolor: "#fff", "&.Mui-selected": { bgcolor: "#FBF4E6", color: "#A87A22", borderColor: "#E9D5A9" } }}
          >
            <Heart size={15} className={savedOnly ? "fill-current" : ""} />
            Saved ({saved.length})
          </ToggleButton>
        </div>
      </div>

      <p className="mb-3 text-[13px] text-[#6B7280]" aria-live="polite">
        {results.length} {results.length === 1 ? "vendor" : "vendors"}
      </p>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E8E8EC] bg-white px-5 py-14 text-center">
          <p className="text-[15px] font-semibold">{savedOnly ? "You haven't saved any vendors yet" : "No vendors match"}</p>
          <p className="mt-1 text-[13px] text-[#6B7280]">{savedOnly ? "Tap the heart on a vendor to save it here." : "Try another search, category or location."}</p>
          <Button
            sx={{ mt: 2 }}
            onClick={() => {
              setQuery("");
              setCategory("all");
              setLocation("all");
              setSavedOnly(false);
            }}
          >
            Show all vendors
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {results.slice(0, shown).map((v) => (
            <VendorCard key={v.id} vendor={v} saved={saved.includes(v.id)} onToggleSave={handleSave} />
          ))}
        </div>
      )}

      {results.length > shown && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outlined"
            color="inherit"
            onClick={loadMore}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
            sx={{ borderColor: "#E8E8EC", bgcolor: "#fff", px: 3 }}
          >
            {loading ? "Loading…" : "See more"}
          </Button>
        </div>
      )}
    </>
  );
}
