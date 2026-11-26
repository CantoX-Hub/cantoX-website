"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createNextState as produce } from "@reduxjs/toolkit";
import { Button, CircularProgress, useMediaQuery } from "@mui/material";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { useGetTemplateQuery } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { PreviewDevice, WeddingTemplate } from "@/app/types/template.types";
import TemplateRenderer from "@/app/component/templates/site/TemplateRenderer";
import { useToast } from "../../Toast";
import { timeAgo, useTemplateDrafts } from "../useTemplateDrafts";
import EditorPanel, { type EditFn } from "./EditorPanel";

const LIST_HREF = "/dashboard/templates";

/** Re-renders every minute so "Edited 3 min ago" stays current */
function useMinuteTick() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function DeviceButton({ active, label, onClick, children }: { active: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full p-0.5 pr-3 text-[14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532] ${
        active ? "bg-[#EEF2F8] text-[#0F0F0F]" : "text-[#4B5563] hover:bg-[#F4F6FA]"
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1C2A5A]/70">{children}</span>
      {label}
    </button>
  );
}

export default function TemplateEditor({ id }: { id: string }) {
  const router = useRouter();
  const notify = useToast();
  const now = useMinuteTick();
  const isLg = useMediaQuery("(min-width:1024px)");
  const { data: base, error, isLoading } = useGetTemplateQuery(id);
  const drafts = useTemplateDrafts();
  const saved = drafts.get(id);

  const [draft, setDraft] = useState<WeddingTemplate | null>(null);
  const [dirty, setDirty] = useState(false);
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  /** Phones and tablets show one pane at a time */
  const [pane, setPane] = useState<"edit" | "preview">("edit");

  // Start from the saved draft if there is one, otherwise the library template
  useEffect(() => {
    if (draft || !drafts.loaded) return;
    const start = drafts.get(id)?.template ?? base;
    if (start) setDraft(start);
  }, [draft, drafts, id, base]);

  const edit = useCallback<EditFn>((recipe) => {
    setDraft((d) => (d ? produce(d, recipe) : d));
    setDirty(true);
  }, []);

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const persist = (status: "draft" | "live") => {
    if (!draft) return false;
    const ok = drafts.save(draft, status);
    if (ok) setDirty(false);
    else notify("We couldn't save: your browser storage is full. Try fewer or smaller photos.", { severity: "error" });
    return ok;
  };

  const saveDraft = () => {
    if (persist("draft")) notify("Saved as draft", { actionLabel: "My templates", onAction: () => router.push(LIST_HREF) });
  };

  // TODO: call the publish endpoint once the backend has one
  const goLive = () => {
    if (persist("live")) notify("Your changes are saved. Publishing goes online once the backend is connected.", { severity: "info" });
  };

  const back = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    setDirty(false);
    router.push(LIST_HREF);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [device]);

  /* ---------- Loading / error ---------- */

  if (!draft) {
    const failed = !isLoading && drafts.loaded && !base;
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        {failed ? (
          <>
            <p className="text-[15px] text-[#4B5563]">{getErrorMessage(error, "We couldn't find that template.")}</p>
            <Button component={Link} href={LIST_HREF} variant="contained">
              Back to templates
            </Button>
          </>
        ) : (
          <CircularProgress size={28} aria-label="Loading template" />
        )}
      </div>
    );
  }

  const status = dirty ? "Unsaved changes" : saved ? `Edited ${timeAgo(saved.updatedAt, now)}` : "Not saved yet";

  return (
    <div className="flex h-full min-h-0 flex-col bg-white lg:grid lg:grid-cols-[256px_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[#E8E8EC] px-4 py-3 lg:col-start-2 lg:row-start-1 lg:mx-4 lg:px-0">
        <button type="button" onClick={back} aria-label="Back to templates" className="rounded p-1 text-[#0F0F0F] hover:bg-[#F3F4F6] lg:hidden">
          <ArrowLeft size={18} />
        </button>
        <div className="hidden items-center gap-2 lg:flex" role="group" aria-label="Preview size">
          <DeviceButton active={device === "mobile"} label="Mobile" onClick={() => setDevice("mobile")}>
            <Smartphone size={18} />
          </DeviceButton>
          <DeviceButton active={device === "desktop"} label="Web" onClick={() => setDevice("desktop")}>
            <Monitor size={18} />
          </DeviceButton>
        </div>
        <span className={`ml-auto text-[13px] ${dirty ? "text-[#A87A22]" : "text-[#4B5563]"}`} aria-live="polite">
          {status}
        </span>
        <Button onClick={saveDraft} variant="contained" color="inherit" sx={{ bgcolor: "#EEF2F6", "&:hover": { bgcolor: "#E2E8F0" } }}>
          Save as draft
        </Button>
        <Button onClick={goLive} variant="contained">
          Go live
        </Button>
      </div>

      {/* Edit / Preview switch below lg */}
      <div className="flex gap-1 border-b border-[#E8E8EC] p-2 lg:hidden" role="tablist" aria-label="Editor view">
        {(["edit", "preview"] as const).map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={pane === p}
            onClick={() => setPane(p)}
            className={`flex-1 rounded-md py-2 text-[14px] capitalize ${pane === p ? "bg-[#0F0F0F] font-medium text-white" : "text-[#4B5563]"}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Editor panel */}
      <aside
        aria-label="Template settings"
        className={`min-h-0 flex-1 flex-col border-r border-[#E8E8EC] bg-white lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:flex ${pane === "edit" ? "flex" : "hidden"}`}
      >
        <div className="hidden items-center gap-2 border-b border-[#E8E8EC] px-3 py-3.5 lg:flex">
          <button type="button" onClick={back} aria-label="Back to templates" className="rounded p-1 text-[#0F0F0F] hover:bg-[#F3F4F6]">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[14px] font-medium text-[#0F0F0F]">Editor</h1>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EditorPanel template={draft} edit={edit} onError={(m) => notify(m, { severity: "error" })} />
        </div>
      </aside>

      {/* Live preview */}
      <div
        ref={scrollRef}
        className={`min-h-0 flex-1 overflow-y-auto bg-white px-4 py-4 lg:col-start-2 lg:row-start-2 lg:block ${pane === "preview" ? "block" : "hidden"}`}
      >
        {/* Below lg the screen is phone/tablet sized, so always show the phone layout there */}
        <div
          className={
            !isLg
              ? "mx-auto max-w-[480px] overflow-hidden border border-[#E8E8EC]"
              : device === "desktop"
                ? "mx-auto w-full max-w-[1280px] overflow-hidden"
                : // Mobile preview: square corners, hairline edge, pinned to the right
                  "ml-auto w-[390px] overflow-hidden border border-[#E8E8EC]"
          }
        >
          <TemplateRenderer template={draft} device={isLg ? device : "mobile"} />
        </div>
      </div>
    </div>
  );
}
