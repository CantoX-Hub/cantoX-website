"use client";

import { useMemo, useState } from "react";
import { Button, FormControlLabel, InputAdornment, Menu, MenuItem, Popover, Radio, RadioGroup, Skeleton, Switch, TextField } from "@mui/material";
import { Check, ChevronDown, ListFilter, Search } from "lucide-react";
import { useGetVendorsQuery } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { Vendor } from "@/app/types/dashboard.types";
import { PageTitle } from "../ui";
import { useToast } from "../Toast";
import VendorCard, { useSavedVendors } from "./VendorCard";
import VendorPanel from "./VendorPanel";

const PAGE = 8;
const GRID = "grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
type Sort = "rating" | "reviews" | "name";
const SORTS: { id: Sort; label: string }[] = [
  { id: "rating", label: "Top rated" },
  { id: "reviews", label: "Most reviewed" },
  { id: "name", label: "Name (A–Z)" },
];

const outlined = { borderColor: "#D1D5DB", color: "#0F0F0F", fontWeight: 600, bgcolor: "#fff", px: 2, height: 40, "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F8F9FB" } };

/** "Location ▾" style button with a single-choice menu */
function ChoiceMenu({ label, value, options, allLabel, onChange }: { label: string; value: string; options: string[]; allLabel: string; onChange: (v: string) => void }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const pick = (v: string) => {
    onChange(v);
    setAnchor(null);
  };
  return (
    <>
      <Button
        variant="outlined"
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        endIcon={<ChevronDown size={16} />}
        sx={{ ...outlined, ...(value !== "all" ? { borderColor: "#C99532", bgcolor: "#FFFBF3" } : {}) }}
      >
        {value === "all" ? label : value}
      </Button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { minWidth: 220, mt: 0.5 } } }}>
        {["all", ...options].map((o) => (
          <MenuItem key={o} selected={o === value} onClick={() => pick(o)} sx={{ fontSize: 14, gap: 1.5 }}>
            <span className="w-4">{o === value && <Check size={15} />}</span>
            {o === "all" ? allLabel : o}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function VendorDirectory() {
  const notify = useToast();
  const { data: vendors = [], isLoading, error, refetch } = useGetVendorsQuery();
  const { saved, toggle } = useSavedVendors();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState<Sort>("rating");
  const [savedOnly, setSavedOnly] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(vendors.map((v) => v.category))).sort(), [vendors]);
  const locations = useMemo(() => Array.from(new Set(vendors.map((v) => v.location))).sort(), [vendors]);

  // TODO(backend): send search, filters and sort as query params instead of filtering here
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vendors
      .filter((v) => category === "all" || v.category === category)
      .filter((v) => location === "all" || v.location === location)
      .filter((v) => !savedOnly || saved.includes(v.id))
      .filter((v) => !q || v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q) || v.about.toLowerCase().includes(q))
      .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "reviews" ? b.reviewCount - a.reviewCount : b.rating - a.rating));
  }, [vendors, query, category, location, sort, savedOnly, saved]);

  const resetPaging = () => setShown(PAGE);
  const activeFilters = (sort !== "rating" ? 1 : 0) + (savedOnly ? 1 : 0);
  const anyFilter = !!query.trim() || category !== "all" || location !== "all" || savedOnly;

  const handleSave = (v: Vendor) => {
    const nowSaved = toggle(v.id);
    notify(nowSaved ? `${v.name} saved` : `${v.name} removed from saved`, {
      severity: nowSaved ? "success" : "info",
      actionLabel: "Undo",
      onAction: () => toggle(v.id),
    });
  };

  const clearAll = () => {
    setQuery("");
    setCategory("all");
    setLocation("all");
    setSavedOnly(false);
    resetPaging();
  };

  let body: React.ReactNode;
  if (error) {
    body = (
      <div className="flex flex-col items-center py-14 text-center">
        <p className="text-[14px] text-[#6B7280]">{getErrorMessage(error, "We couldn't load vendors.")}</p>
        <Button onClick={() => refetch()} variant="outlined" color="inherit" sx={{ mt: 2, borderColor: "#E8E8EC" }}>
          Try again
        </Button>
      </div>
    );
  } else if (isLoading) {
    body = (
      <div className={GRID} aria-busy="true" aria-label="Loading vendors">
        {Array.from({ length: PAGE }, (_, i) => (
          <div key={i} className="rounded-lg border border-[#E2E5EA] p-4">
            <Skeleton variant="rectangular" sx={{ aspectRatio: "1 / 1", height: "auto" }} />
            <Skeleton width="60%" sx={{ mt: 1.5 }} />
            <Skeleton width="45%" />
            <Skeleton variant="rounded" height={40} sx={{ mt: 1.5 }} />
          </div>
        ))}
      </div>
    );
  } else if (results.length === 0) {
    body = (
      <div className="rounded-lg border border-dashed border-[#E2E5EA] px-5 py-14 text-center">
        <p className="text-[15px] font-semibold">{savedOnly && !query && category === "all" && location === "all" ? "You haven't saved any vendors yet" : "No vendors match"}</p>
        <p className="mt-1 text-[13px] text-[#6B7280]">{savedOnly ? "Tap the heart on a vendor to save it." : "Try another search, category or location."}</p>
        <Button sx={{ mt: 2 }} onClick={clearAll}>
          Show all vendors
        </Button>
      </div>
    );
  } else {
    body = (
      <>
        <div className={GRID}>
          {results.slice(0, shown).map((v) => (
            <VendorCard key={v.id} vendor={v} saved={saved.includes(v.id)} onToggleSave={handleSave} onView={(x) => setViewing(x.id)} />
          ))}
        </div>
        {results.length > shown && (
          <Button fullWidth onClick={() => setShown((n) => n + PAGE)} endIcon={<ChevronDown size={16} />} sx={{ mt: 6, py: 1.1, fontWeight: 600, bgcolor: "#F1F4F8", color: "#0F0F0F", "&:hover": { bgcolor: "#E5EAF1" } }}>
            See more
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <PageTitle>Vendor</PageTitle>

      <div className="flex items-center gap-2">
        <TextField
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            resetPaging();
          }}
          placeholder="Search for a vendor"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            },
            htmlInput: { "aria-label": "Search vendors" },
          }}
        />
        <span aria-hidden className="hidden h-8 w-px bg-[#D1D5DB] sm:block" />
        <Button
          variant="outlined"
          onClick={(e) => setFilterAnchor(e.currentTarget)}
          aria-haspopup="dialog"
          aria-expanded={!!filterAnchor}
          startIcon={<ListFilter size={16} />}
          sx={{ ...outlined, flexShrink: 0, ...(activeFilters ? { borderColor: "#C99532", bgcolor: "#FFFBF3" } : {}) }}
        >
          Filter{activeFilters ? ` (${activeFilters})` : ""}
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 sm:ml-2">
        <ChoiceMenu
          label="Location"
          allLabel="Anywhere"
          value={location}
          options={locations}
          onChange={(v) => {
            setLocation(v);
            resetPaging();
          }}
        />
        <ChoiceMenu
          label="Category"
          allLabel="All categories"
          value={category}
          options={categories}
          onChange={(v) => {
            setCategory(v);
            resetPaging();
          }}
        />
        {anyFilter && (
          <button type="button" onClick={clearAll} className="ml-1 rounded text-[13px] font-medium text-[#C99532] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]">
            Clear
          </button>
        )}
      </div>

      <Popover
        open={!!filterAnchor}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 0.75, p: 2, width: 240, borderRadius: "8px" }, role: "dialog", "aria-label": "Filter vendors" } as object }}
      >
        <p id="vendor-sort" className="text-[13px] font-semibold text-[#0F0F0F]">
          Sort by
        </p>
        <RadioGroup aria-labelledby="vendor-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          {SORTS.map((s) => (
            <FormControlLabel key={s.id} value={s.id} control={<Radio size="small" />} label={s.label} slotProps={{ typography: { sx: { fontSize: 14 } } }} />
          ))}
        </RadioGroup>
        <div className="mt-2 border-t border-[#E8E8EC] pt-2">
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={savedOnly}
                onChange={() => {
                  setSavedOnly((v) => !v);
                  resetPaging();
                }}
              />
            }
            label={`Saved only (${saved.length})`}
            slotProps={{ typography: { sx: { fontSize: 14 } } }}
          />
        </div>
      </Popover>

      <p className="sr-only" aria-live="polite">
        {isLoading ? "" : `${results.length} ${results.length === 1 ? "vendor" : "vendors"}`}
      </p>

      <div className="mt-6">{body}</div>

      <VendorPanel vendorId={viewing} onClose={() => setViewing(null)} />
    </>
  );
}
