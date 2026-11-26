"use client";

import { useMemo, useState } from "react";
import { Button, Tab, Tabs } from "@mui/material";
import { useGetTemplatesQuery } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import { useToast } from "../Toast";
import { EmptyState, PageTitle, Panel } from "../ui";
import { TemplateCard, TemplateCardSkeleton } from "./TemplateCard";
import { timeAgo, useTemplateDrafts } from "./useTemplateDrafts";

type View = "mine" | "library";
type Filter = "all" | "free" | "premium";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "premium", label: "Premium" },
];

const INK = "#060D18";
/** Underlined tabs: grey when idle, #060D18 text and underline when selected */
const TABS_SX = {
  minHeight: 0,
  borderBottom: "1px solid #D9DDE3",
  "& .MuiTabs-indicator": { backgroundColor: INK, height: "1.5px" },
  "& .MuiTab-root": {
    textTransform: "none",
    fontSize: 14,
    minHeight: 48,
    color: "#9CA3AF",
    fontWeight: 500,
    // Text starts at the left of each tab, not centred
    alignItems: "flex-start",
    textAlign: "left",
    px: 0,
    "&:hover": { color: "#4B5563" },
  },
  "& .MuiTab-root.Mui-selected": { color: INK, fontWeight: 700 },
} as const;

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4";

export default function TemplatesPage() {
  const notify = useToast();
  const { data: templates = [], isLoading, error, refetch } = useGetTemplatesQuery();
  const { drafts, loaded, remove, restore } = useTemplateDrafts();

  const [view, setView] = useState<View>("mine");
  const [filter, setFilter] = useState<Filter>("all");

  const library = useMemo(() => (filter === "all" ? templates : templates.filter((t) => t.tier === filter)), [templates, filter]);

  const removeDraft = (id: string) => {
    const removed = remove(id);
    if (removed) notify("Removed from My templates", { actionLabel: "Undo", onAction: () => restore(removed) });
  };

  const loading = view === "mine" ? !loaded : isLoading;

  let body: React.ReactNode;
  if (view === "library" && error) {
    body = (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-[14px] text-[#6B7280]">{getErrorMessage(error, "We couldn't load templates.")}</p>
        <Button onClick={() => refetch()} variant="outlined" color="inherit" sx={{ mt: 2, borderColor: "#E8E8EC" }}>
          Try again
        </Button>
      </div>
    );
  } else if (loading) {
    body = (
      <div className={GRID} aria-busy="true" aria-label="Loading templates">
        {Array.from({ length: 4 }, (_, i) => (
          <TemplateCardSkeleton key={i} />
        ))}
      </div>
    );
  } else if (view === "mine" && drafts.length === 0) {
    body = (
      <div className="flex min-h-[380px] flex-col items-center justify-center">
        <EmptyState
          img="/empty-template.svg"
          title="It's empty here"
          body={
            <>
              You don&apos;t have any website templates yet. Go to{" "}
              <button type="button" onClick={() => setView("library")} className="text-[#C99532] underline-offset-2 hover:underline">
                Library
              </button>{" "}
              to get started.
            </>
          }
        />
      </div>
    );
  } else if (view === "mine") {
    body = (
      <div className={GRID}>
        {drafts.map((d) => (
          <TemplateCard
            key={d.template.id}
            template={d.template}
            meta={`${d.status === "live" ? "Live" : "Draft"} · edited ${timeAgo(d.updatedAt)}`}
            onRemove={() => removeDraft(d.template.id)}
          />
        ))}
      </div>
    );
  } else {
    body = (
      <div className={GRID}>
        {library.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    );
  }

  return (
    <>
      <PageTitle>Wedding websites</PageTitle>

      <div className="overflow-hidden">
        <div className="mt-8">
          <Tabs value={view} onChange={(_, v: View) => setView(v)} variant="fullWidth" aria-label="Templates" sx={TABS_SX}>
            <Tab value="mine" label="My templates" id="tab-mine" aria-controls="panel-mine" />
            <Tab value="library" label="Library" id="tab-library" aria-controls="panel-library" />
          </Tabs>
        </div>

        <div role="tabpanel" id={`panel-${view}`} aria-labelledby={`tab-${view}`} className="min-h-[420px] py-5">
          {view === "library" && (
            <Tabs
              value={filter}
              onChange={(_, v: typeof filter) => setFilter(v)}
              aria-label="Filter templates"
              variant="scrollable"
              scrollButtons={false}
              sx={{ ...TABS_SX, mb: 3, "& .MuiTab-root": { ...TABS_SX["& .MuiTab-root"], minWidth: { xs: 88, sm: 118 } } }}
            >
              {FILTERS.map((f) => (
                <Tab key={f.id} value={f.id} label={f.label} />
              ))}
            </Tabs>
          )}
          {body}
        </div>
      </div>
    </>
  );
}
