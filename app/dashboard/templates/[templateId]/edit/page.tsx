"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { useToast } from "@/app/component/dashboard/Toast";
import EditorSections from "@/app/component/dashboard/templates/studio/EditorSections";
import GoLiveModal from "@/app/component/dashboard/templates/studio/GoLiveModal";
import StudioPreview, { type PreviewMode } from "@/app/component/dashboard/templates/studio/StudioPreview";
import { getTemplateById } from "@/app/data/wedding-templates";
import { useMediaQuery } from "@/app/lib/use-media-query";
import {
  ensureWedding,
  getWeddingForTemplate,
  saveWedding,
  useStore,
} from "@/app/lib/wedding-store";
import { sectionForError, timeAgo, validateWedding } from "@/app/lib/wedding-utils";
import type {
  TemplateDefinition,
  ThemeOverrides,
  ValidationErrors,
  WeddingContent,
} from "@/app/types/wedding.types";

export default function StudioPage({ params }: { params: { templateId: string } }) {
  const template = getTemplateById(params.templateId);
  if (!template) notFound();
  return <Studio template={template} />;
}

function Studio({ template }: { template: TemplateDefinition }) {
  const router = useRouter();
  const state = useStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const wedding = getWeddingForTemplate(state, template.id);

  // Working copy. null until the stored wedding has been read once.
  const [content, setContent] = useState<WeddingContent | null>(null);
  const [overrides, setOverrides] = useState<ThemeOverrides | null>(null);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [openSections, setOpenSections] = useState<string[]>(["essentials"]);
  const [mode, setMode] = useState<PreviewMode>("web");
  const [pane, setPane] = useState<"editor" | "preview">("editor");
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const notify = useToast();

  const showToast = (text: string, tone: "ok" | "error" = "ok") =>
    notify(text, { severity: tone === "error" ? "error" : "success" });

  // First visit creates the wedding record
  useEffect(() => {
    if (!state.ready || wedding) return;
    try {
      ensureWedding(template.id);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not open this template", "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ready, wedding, template.id]);

  useEffect(() => {
    if (wedding && content === null) {
      setContent(wedding.content);
      setOverrides(wedding.customizations);
    }
  }, [wedding, content]);

  // Keep "Edited 3min ago" fresh
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // Warn before closing the tab with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const activeMode: PreviewMode = isDesktop ? mode : "mobile";
  const isLive = wedding?.status === "live";

  const label = useMemo(() => {
    if (dirty) return "Unsaved changes";
    return wedding ? `Edited ${timeAgo(wedding.updatedAt, now)}` : "";
  }, [dirty, wedding, now]);

  if (!wedding || content === null) {
    return (
      <div className="fixed inset-y-0 right-0 left-0 z-40 flex items-center justify-center bg-white text-[14px] text-[#6B7280] lg:left-[var(--sidebar)]" aria-busy="true">
        Opening editor…
      </div>
    );
  }

  const updateContent = (patch: Partial<WeddingContent>) => {
    const next = { ...content, ...patch };
    setContent(next);
    setDirty(true);
    // Once the user has seen errors, keep them in step with what they type
    if (Object.keys(errors).length) setErrors(validateWedding(template, next));
  };

  const updateOverrides = (patch: ThemeOverrides) => {
    const next: ThemeOverrides = { ...overrides, ...patch };
    for (const key of Object.keys(next) as (keyof ThemeOverrides)[]) {
      if (next[key] === null || next[key] === undefined) delete next[key];
    }
    setOverrides(Object.keys(next).length ? next : null);
    setDirty(true);
  };

  const toggleSection = (id: string) =>
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const save = (goLive: boolean) => {
    if (goLive && !template.layout) {
      showToast("Publishing isn't available for this template yet", "error");
      return;
    }
    if (goLive) {
      const found = validateWedding(template, content);
      setErrors(found);
      const first = Object.keys(found)[0];
      if (first) {
        const sectionId = sectionForError(template, first);
        if (sectionId) {
          setOpenSections((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
          setPane("editor");
          // Wait for the section to open before scrolling to it
          setTimeout(
            () =>
              document
                .getElementById(`section-${sectionId}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" }),
            50
          );
        }
        showToast("Fill in the highlighted fields to go live", "error");
        return;
      }
    }

    try {
      const saved = saveWedding(wedding.id, { content, customizations: overrides, goLive });
      setDirty(false);
      if (goLive) {
        setLiveUrl(`${window.location.origin}/wedding/${saved.slug}`);
      } else {
        showToast("Draft saved");
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not save", "error");
    }
  };

  const leave = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    router.push("/dashboard/templates");
  };

  const actions = (
    <div className="flex items-center gap-2 sm:gap-3">
      {label && <span className="hidden text-[13px] text-[#4B5563] md:block">{label}</span>}
      {isLive && wedding && (
        <Link
          href={`/wedding/${wedding.slug}`}
          target="_blank"
          aria-label="View live site"
          className="flex h-10 w-10 items-center justify-center rounded-[4px] text-[#11151D] hover:bg-[#F1F5F9]"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}
      <button
        type="button"
        onClick={() => save(false)}
        className="h-10 rounded-[4px] bg-[#F1F5F9] px-3 text-[13px] font-semibold text-[#11151D] hover:bg-[#E7EBEF] sm:px-4 sm:text-[14px]"
      >
        Save as draft
      </button>
      <button
        type="button"
        onClick={() => save(true)}
        className="h-10 rounded-[4px] bg-[#C9933A] px-3 text-[13px] font-semibold text-white hover:bg-[#B78628] sm:px-4 sm:text-[14px]"
      >
        {isLive ? "Update site" : "Go live"}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-40 flex flex-col bg-white lg:left-[var(--sidebar)]">
      {/* Below lg the editor and preview are tabs, with the actions always in reach */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#E6E9EF] px-3 py-2 lg:hidden">
        <div role="tablist" aria-label="Studio view" className="flex rounded-full bg-[#EEF2F8] p-0.5">
          {(["editor", "preview"] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={pane === id}
              onClick={() => setPane(id)}
              className={`rounded-full px-3 py-1.5 text-[13px] font-medium capitalize ${
                pane === id ? "bg-white text-[#11151D] shadow-sm" : "text-[#6B7280]"
              }`}
            >
              {id}
            </button>
          ))}
        </div>
        {actions}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Editor */}
        <aside
          className={`min-h-0 w-full shrink-0 flex-col overflow-y-auto border-r border-[#E6E9EF] bg-white lg:flex lg:w-[320px] ${
            pane === "editor" ? "flex" : "hidden"
          }`}
        >
          <div className="sticky top-0 z-10 flex h-[68px] shrink-0 items-center gap-3 border-b border-[#1A1F2B]/80 bg-white px-4">
            <button
              type="button"
              onClick={leave}
              aria-label="Back to templates"
              className="text-[#11151D] hover:opacity-60"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-[14px] font-semibold text-[#11151D]">Editor</h1>
          </div>
          <EditorSections
            template={template}
            content={content}
            overrides={overrides}
            errors={errors}
            openSections={openSections}
            onToggleSection={toggleSection}
            onContent={updateContent}
            onOverrides={updateOverrides}
            onResetOverrides={() => {
              setOverrides(null);
              setDirty(true);
            }}
          />
        </aside>

        {/* Preview */}
        <section
          className={`min-w-0 flex-1 flex-col lg:flex ${pane === "preview" ? "flex" : "hidden"}`}
        >
          <div className="hidden h-[68px] shrink-0 items-center justify-between gap-3 border-b border-[#E6E9EF] px-5 lg:flex">
            <div className="flex items-center gap-2">
              {(
                [
                  ["mobile", "Mobile", Smartphone],
                  ["web", "Web", Monitor],
                ] as const
              ).map(([id, text, Icon]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  aria-pressed={mode === id}
                  aria-label={`${text} preview`}
                  className={`flex items-center gap-2 rounded-full p-0.5 transition-colors ${
                    mode === id ? "bg-[#EEF2F8] pr-3" : "hover:bg-[#F4F6FA]"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1C2A5A] text-[#11151D]">
                    <Icon className="h-5 w-5" />
                  </span>
                  {mode === id && <span className="text-[15px] font-medium text-[#171A20]">{text}</span>}
                </button>
              ))}
            </div>
            {actions}
          </div>

          <div className="min-h-0 flex-1">
            {/* Remount when the pane is shown so the iframe measures a real size */}
            {(isDesktop || pane === "preview") && (
              <StudioPreview
                slug={template.slug}
                mode={activeMode}
                content={content}
                overrides={overrides}
              />
            )}
          </div>
        </section>
      </div>

      {liveUrl && <GoLiveModal url={liveUrl} onClose={() => setLiveUrl(null)} />}
    </div>
  );
}
