"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LibraryCard from "@/app/component/dashboard/templates/LibraryCard";
import { useToast } from "@/app/component/dashboard/Toast";
import { TemplatePreviewPanel } from "@/app/component/templates/TemplatePreviewPanel";
import { weddingTemplates } from "@/app/data/wedding-templates";
import {
  acquireTemplate,
  getWeddingForTemplate,
  hasTemplate,
  useStore,
} from "@/app/lib/wedding-store";
import type { TemplateDefinition, TemplateTier } from "@/app/types/wedding.types";

type MainTab = "my" | "library";
type TierFilter = "All" | TemplateTier;

const TIER_FILTERS: TierFilter[] = ["All", "Free", "Premium"];

export default function DashboardTemplatesPage() {
  const router = useRouter();
  const state = useStore();
  const [tab, setTab] = useState<MainTab>("my");
  const [tier, setTier] = useState<TierFilter>("All");
  const [selected, setSelected] = useState<TemplateDefinition | null>(null);
  const [open, setOpen] = useState(false);
  const notify = useToast();

  const myTemplates = useMemo(
    () =>
      state.userTemplates
        .map((owned) => weddingTemplates.find((t) => t.id === owned.templateId))
        .filter((t): t is TemplateDefinition => !!t),
    [state.userTemplates]
  );

  const library = useMemo(
    () => weddingTemplates.filter((t) => tier === "All" || t.tier === tier),
    [tier]
  );

  const openPanel = (template: TemplateDefinition) => {
    setSelected(template);
    setOpen(true);
  };

  const owned = selected ? hasTemplate(state, selected.id) : false;

  const handleAction = () => {
    if (!selected) return;
    const template = selected;
    setOpen(false);

    // Edit: free templates and anything already in My templates go straight to the studio
    if (owned || template.tier === "Free") {
      acquireTemplate(template.id);
      router.push(`/dashboard/templates/${template.id}/edit`);
      return;
    }

    // Get access: add the premium template to My templates and show it there
    acquireTemplate(template.id);
    setTab("my");
    notify(`${template.name} was added to My templates`);
  };

  const action = selected
    ? owned || selected.tier === "Free"
      ? { label: "Edit template", onClick: handleAction }
      : { label: "Get access", onClick: handleAction }
    : { label: "Edit template" };

  return (
    <div>
      <h1 className="text-[24px] text-[#060D18] sm:text-[28px]">Wedding websites</h1>

      {/* Main tabs */}
      <div role="tablist" aria-label="Templates" className="mt-8 grid grid-cols-2 border-b border-[#D5D9E0] sm:mt-10">
        {(
          [
            ["my", "My templates"],
            ["library", "Library"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`relative pb-3 text-left text-[15px] transition-colors ${
              tab === id ? "font-semibold text-[#060D18]" : "text-[#9CA3AF] hover:text-[#555]"
            }`}
          >
            {label}
            {tab === id && <span className="absolute -bottom-px left-0 h-[2px] w-full bg-[#060D18]" />}
          </button>
        ))}
      </div>

      {tab === "library" && (
        <div className="mt-5 flex border-b border-[#D5D9E0]">
          {TIER_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              aria-pressed={tier === filter}
              onClick={() => setTier(filter)}
              className={`relative min-w-[84px] pb-3 pt-2 text-[15px] transition-colors sm:min-w-[126px] ${
                tier === filter ? "font-semibold text-[#060D18]" : "text-[#B1B1B1] hover:text-[#555]"
              }`}
            >
              {filter}
              {tier === filter && (
                <span className="absolute -bottom-px left-0 h-[2px] w-full bg-[#060D18]" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* My templates */}
      {tab === "my" &&
        (myTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Image src="/dashboard/empty.png" alt="" width={106} height={112} />
            <h2 className="mt-5 text-[16px] text-[#060D18]">It&apos;s empty here</h2>
            <p className="mt-2 text-[12px] text-[#4B5563]">
              You don&apos;t have any recent template, go to{" "}
              <button
                type="button"
                onClick={() => setTab("library")}
                className="text-[#C99532] underline-offset-2 hover:underline"
              >
                &ldquo;Templates&rdquo;
              </button>{" "}
              to get started
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myTemplates.map((template) => (
              <LibraryCard
                key={template.id}
                template={template}
                status={getWeddingForTemplate(state, template.id)?.status ?? "draft"}
                onOpen={() => openPanel(template)}
              />
            ))}
          </div>
        ))}

      {/* Library */}
      {tab === "library" && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {library.map((template) => (
            <LibraryCard
              key={template.id}
              template={template}
              onOpen={() => openPanel(template)}
            />
          ))}
          {library.length === 0 && (
            <p className="col-span-full py-12 text-center text-[14px] text-[#6B7280]">
              No templates in this category yet.
            </p>
          )}
        </div>
      )}

      {selected && (
        <TemplatePreviewPanel
          open={open}
          onClose={() => setOpen(false)}
          name={selected.name}
          tier={selected.tier}
          rating={selected.rating}
          previewUrl={`/preview/${selected.slug}`}
          features={selected.features}
          exclusiveFeatures={selected.exclusiveFeatures}
          action={action}
        />
      )}

    </div>
  );
}
