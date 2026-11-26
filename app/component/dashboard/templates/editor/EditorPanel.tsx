"use client";

/* eslint-disable @next/next/no-img-element -- previews of user uploads (data URLs) */

import { useId, useRef } from "react";
import { Accordion, AccordionDetails, AccordionSummary, IconButton, InputAdornment, Switch, TextField, Tooltip, type TextFieldProps } from "@mui/material";
import { ChevronDown, FileImage, Phone, Plus, Trash2, X } from "lucide-react";
import type { RideApp, SectionType, TemplateSection, WeddingTemplate } from "@/app/types/template.types";
import { SECTION_LABELS } from "@/app/component/templates/site/TemplateRenderer";
import { DEFAULT_SWATCHES, readImage, swatchesFor, to12h, to24h, withPrimary, withSecondary } from "./utils";

export type EditFn = (recipe: (draft: WeddingTemplate) => void) => void;

type SectionOf<T extends SectionType> = Extract<TemplateSection, { type: T }>;

/** First section of a type (works on the immer draft too) */
export function findSection<T extends SectionType>(t: WeddingTemplate, type: T): SectionOf<T> | undefined {
  return t.sections.find((s) => s.type === type) as SectionOf<T> | undefined;
}

const MAX_CONTACTS = 4;
/** The "Through our lens" grid shows at least this many slots */
const GALLERY_SLOTS = 9;

const RIDE_OPTIONS: { id: RideApp; label: string; bg: string; fg: string }[] = [
  { id: "uber", label: "Uber", bg: "#000000", fg: "#FFFFFF" },
  { id: "bolt", label: "Bolt", bg: "#34D186", fg: "#0B2A17" },
  { id: "indrive", label: "inDrive", bg: "#141414", fg: "#C1F11D" },
];

/* ---------- Small building blocks ---------- */

function Group({ title, defaultExpanded = false, children }: { title: string; defaultExpanded?: boolean; children: React.ReactNode }) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      square
      elevation={0}
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{ borderBottom: "1px solid #E8E8EC", "&::before": { display: "none" } }}
    >
      <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={{ px: 1.5, minHeight: 44, "& .MuiAccordionSummary-content": { my: 1.25 } }}>
        <span className="text-[13px] font-medium text-[#0F0F0F]">{title}</span>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1.5, pt: 0, pb: 2.5 }}>
        <div className="flex flex-col gap-4">{children}</div>
      </AccordionDetails>
    </Accordion>
  );
}

const fieldSx = { "& .MuiInputBase-root": { fontSize: 13 }, "& .MuiInputBase-input::placeholder": { color: "#9CA3AF", opacity: 1 } };

function Field({ label, hint, ...props }: { label: string; hint?: string } & TextFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-medium text-[#0F0F0F]">
        {label}
        {hint && <span className="font-normal text-[#9CA3AF]"> ({hint})</span>}
      </label>
      <TextField id={id} fullWidth size="small" sx={fieldSx} {...props} />
    </div>
  );
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <p className="mb-1.5 text-[12px] font-medium text-[#0F0F0F]">
      {children}
      {hint && <span className="font-normal text-[#9CA3AF]"> ({hint})</span>}
    </p>
  );
}

function ColourPicker({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (c: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={label}>
        {options.map((c) => {
          const selected = c.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={c}
              onClick={() => onChange(c)}
              className={`h-7 w-7 rounded-[4px] border border-black/10 transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99532] ${
                selected ? "ring-2 ring-[#0F0F0F] ring-offset-2" : ""
              }`}
              style={{ background: c }}
            />
          );
        })}
        {/* Custom colour: a native picker under a gradient tile */}
        <label
          className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] text-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#C99532]"
          style={{ background: "linear-gradient(135deg, #F43F5E, #8B5CF6 50%, #F59E0B)" }}
          title="Custom colour"
        >
          <Plus size={14} />
          <input
            type="color"
            aria-label={`Custom ${label.toLowerCase()}`}
            value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>
    </div>
  );
}

function ImagePicker({
  label,
  accept = "image/*",
  multiple = false,
  maxMb,
  onPick,
  onError,
  children,
  className = "",
}: {
  label: string;
  accept?: string;
  multiple?: boolean;
  maxMb: number;
  onPick: (urls: string[]) => void;
  onError: (message: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      onPick(await Promise.all(Array.from(files).map((f) => readImage(f, maxMb))));
    } catch (e) {
      onError(e instanceof Error ? e.message : "We couldn't add that image.");
    } finally {
      if (ref.current) ref.current.value = "";
    }
  };
  return (
    <button type="button" onClick={() => ref.current?.click()} aria-label={label} className={className}>
      {children}
      <input ref={ref} type="file" accept={accept} multiple={multiple} hidden onChange={(e) => pick(e.target.files)} />
    </button>
  );
}

const tileClass =
  "flex h-full w-full items-center justify-center overflow-hidden rounded-[4px] border border-[#E2E8F0] bg-[#EEF2F7] text-[#4B5563] transition-colors hover:bg-[#E5EBF3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]";

/** Small square photo slot: shows the photo, or an empty tile that opens the file picker */
function PhotoTile({
  src,
  label,
  multiple = false,
  maxMb = 3,
  onPick,
  onRemove,
  onError,
}: {
  src?: string;
  /** What the slot holds, e.g. "hero image" */
  label: string;
  multiple?: boolean;
  maxMb?: number;
  onPick: (urls: string[]) => void;
  onRemove?: () => void;
  onError: (message: string) => void;
}) {
  return (
    <div className="group relative aspect-square">
      <ImagePicker
        label={`${src ? "Replace" : "Add"} ${label} (max ${maxMb}MB)`}
        multiple={multiple}
        maxMb={maxMb}
        onPick={onPick}
        onError={onError}
        className={tileClass}
      >
        {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <FileImage size={16} aria-hidden />}
      </ImagePicker>
      {src && onRemove && (
        <Tooltip title="Remove">
          <button
            type="button"
            aria-label={`Remove ${label}`}
            onClick={onRemove}
            className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-opacity lg:opacity-0 lg:focus-visible:opacity-100 lg:group-hover:opacity-100"
          >
            <X size={12} />
          </button>
        </Tooltip>
      )}
    </div>
  );
}

/* ---------- Panel ---------- */

export default function EditorPanel({ template, edit, onError }: { template: WeddingTemplate; edit: EditFn; onError: (message: string) => void }) {
  const { couple, theme } = template;
  const hero = findSection(template, "hero");
  const events = findSection(template, "events");
  const story = findSection(template, "story");
  const rsvp = findSection(template, "rsvp");
  const gallery = findSection(template, "gallery");
  const location = findSection(template, "location");
  const firstEvent = events?.events[0];
  const optional = template.sections.filter((s) => s.type !== "hero" && s.type !== "footer");
  const emptySlots = gallery ? Math.max(1, GALLERY_SLOTS - gallery.images.length) : 0;

  return (
    <div>
      {/* The essentials */}
      <Group title="The essentials" defaultExpanded>
        <Field label="Partner 1" placeholder="Joan" value={couple.partnerOne} onChange={(e) => edit((d) => void (d.couple.partnerOne = e.target.value))} />
        <Field label="Partner 2" placeholder="Jamiu" value={couple.partnerTwo} onChange={(e) => edit((d) => void (d.couple.partnerTwo = e.target.value))} />
        <Field label="Wedding date" type="date" value={couple.date} onChange={(e) => e.target.value && edit((d) => void (d.couple.date = e.target.value))} />
        {firstEvent && (
          <>
            <Field
              label={/ceremony/i.test(firstEvent.name) ? "Ceremony time" : `${firstEvent.name} time`}
              type="time"
              value={to24h(firstEvent.time)}
              onChange={(e) =>
                e.target.value &&
                edit((d) => {
                  const ev = findSection(d, "events")?.events[0];
                  if (ev) ev.time = to12h(e.target.value);
                })
              }
            />
            <Field
              label="Venue"
              placeholder="Premier Banqueting Suite"
              value={firstEvent.venue}
              onChange={(e) =>
                edit((d) => {
                  const ev = findSection(d, "events")?.events[0];
                  if (ev) ev.venue = e.target.value;
                })
              }
            />
          </>
        )}
        <Field label="Hashtag" placeholder="#jjstory27" value={couple.hashtag ?? ""} onChange={(e) => edit((d) => void (d.couple.hashtag = e.target.value || undefined))} />
      </Group>

      {/* Styling */}
      <Group title="Styling">
        <div>
          <Label hint="png format">Upload logo</Label>
          {theme.logo ? (
            <div className="flex items-center gap-3 rounded-[4px] border border-[#E2E8F0] bg-[#EEF2F7] p-3">
              <img src={theme.logo} alt="Your logo" className="h-10 w-auto max-w-[120px] object-contain" />
              <IconButton size="small" onClick={() => edit((d) => void delete d.theme.logo)} aria-label="Remove logo" sx={{ ml: "auto" }}>
                <X size={16} />
              </IconButton>
            </div>
          ) : (
            <ImagePicker
              label="Upload logo (png format, max 1MB)"
              accept="image/png"
              maxMb={1}
              onPick={([url]) => edit((d) => void (d.theme.logo = url))}
              onError={onError}
              className={`${tileClass} h-[64px]`}
            >
              <FileImage size={16} aria-hidden />
            </ImagePicker>
          )}
        </div>
        <ColourPicker
          label="Primary color"
          value={theme.colors.primary}
          options={swatchesFor(theme.colors.primary, theme.swatches?.primary ?? DEFAULT_SWATCHES.primary)}
          onChange={(c) => edit((d) => void (d.theme.colors = withPrimary(d.theme.colors, c)))}
        />
        <ColourPicker
          label="Secondary color"
          value={theme.colors.background}
          options={swatchesFor(theme.colors.background, theme.swatches?.secondary ?? DEFAULT_SWATCHES.secondary)}
          onChange={(c) => edit((d) => void (d.theme.colors = withSecondary(d.theme.colors, c)))}
        />
      </Group>

      {/* Story */}
      {story && (
        <Group title="Your story">
          <Field
            label="Tell your story"
            multiline
            minRows={6}
            value={story.intro ?? ""}
            onChange={(e) =>
              edit((d) => {
                const s = findSection(d, "story");
                if (s) s.intro = e.target.value || undefined;
              })
            }
          />
          {story.chapters.map((c, i) => (
            <Field
              key={i}
              label={c.title || `Chapter ${i + 1}`}
              multiline
              minRows={6}
              value={c.body}
              onChange={(e) =>
                edit((d) => {
                  const ch = findSection(d, "story")?.chapters[i];
                  if (ch) ch.body = e.target.value;
                })
              }
            />
          ))}
        </Group>
      )}

      {/* Contacts: Name / Phone number pairs; the last one can be removed */}
      {rsvp && (
        <Group title="Contacts">
          {rsvp.contacts.map((c, i) => {
            const removable = rsvp.contacts.length > 1 && i === rsvp.contacts.length - 1;
            return (
              <div key={i} className="flex flex-col gap-4">
                <Field
                  label="Name"
                  placeholder="Joan"
                  value={c.name}
                  onChange={(e) =>
                    edit((d) => {
                      const ct = findSection(d, "rsvp")?.contacts[i];
                      if (ct) ct.name = e.target.value;
                    })
                  }
                  slotProps={{
                    htmlInput: { "aria-label": `Contact ${i + 1} name` },
                    input: removable
                      ? {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" edge="end" aria-label={`Remove contact ${i + 1}`} onClick={() => edit((d) => void findSection(d, "rsvp")?.contacts.splice(i, 1))}>
                                <Trash2 size={14} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      : undefined,
                  }}
                />
                <Field
                  label="Phone number"
                  type="tel"
                  placeholder="+234 818 829 8033"
                  value={c.phone}
                  onChange={(e) =>
                    edit((d) => {
                      const ct = findSection(d, "rsvp")?.contacts[i];
                      if (ct) ct.phone = e.target.value;
                    })
                  }
                  slotProps={{
                    htmlInput: { "aria-label": `Contact ${i + 1} phone number` },
                    input: removable
                      ? {
                          endAdornment: (
                            <InputAdornment position="end">
                              <Phone size={14} className="text-[#9CA3AF]" aria-hidden />
                            </InputAdornment>
                          ),
                        }
                      : undefined,
                  }}
                />
              </div>
            );
          })}
          {rsvp.contacts.length < MAX_CONTACTS && (
            <button
              type="button"
              onClick={() => edit((d) => void findSection(d, "rsvp")?.contacts.push({ name: "", phone: "" }))}
              className="flex items-center gap-1 self-start rounded text-[13px] font-medium text-[#C99532] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]"
            >
              <Plus size={14} /> Add contact
            </button>
          )}
        </Group>
      )}

      {/* Gallery: tiles for the hero, each story chapter and the photo gallery */}
      {(hero || story || gallery) && (
        <Group title="Gallery">
          {hero && (
            <div>
              <Label>Hero image</Label>
              <div className="grid grid-cols-3 gap-2">
                <PhotoTile
                  src={hero.image}
                  label="hero image"
                  onError={onError}
                  onPick={([url]) =>
                    edit((d) => {
                      const h = findSection(d, "hero");
                      if (h) h.image = url;
                    })
                  }
                />
              </div>
            </div>
          )}

          {story && story.chapters.length > 0 && (
            <div>
              <Label>Our love story</Label>
              <div className="grid grid-cols-3 gap-2">
                {story.chapters.map((ch, i) => (
                  <PhotoTile
                    key={i}
                    src={ch.image}
                    label={`photo for ${ch.title || `chapter ${i + 1}`}`}
                    onError={onError}
                    onPick={([url]) =>
                      edit((d) => {
                        const c = findSection(d, "story")?.chapters[i];
                        if (c) c.image = url;
                      })
                    }
                    onRemove={() =>
                      edit((d) => {
                        const c = findSection(d, "story")?.chapters[i];
                        if (c) delete c.image;
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {gallery && (
            <div>
              <Label hint={`${gallery.images.length} photos`}>Through our lens</Label>
              <div className="grid grid-cols-3 gap-2">
                {gallery.images.map((src, i) => (
                  <PhotoTile
                    key={`${src.slice(-24)}-${i}`}
                    src={src}
                    label={`gallery photo ${i + 1}`}
                    onError={onError}
                    onPick={([url]) =>
                      edit((d) => {
                        const g = findSection(d, "gallery");
                        if (g) g.images[i] = url;
                      })
                    }
                    onRemove={() => edit((d) => void findSection(d, "gallery")?.images.splice(i, 1))}
                  />
                ))}
                {Array.from({ length: emptySlots }, (_, i) => (
                  <PhotoTile key={`empty-${i}`} label="gallery photos" multiple onError={onError} onPick={(urls) => edit((d) => void findSection(d, "gallery")?.images.push(...urls))} />
                ))}
              </div>
            </div>
          )}
        </Group>
      )}

      {/* Add-on: ride buttons under the map, then which sections show */}
      {(location || optional.length > 0) && (
        <Group title="Add-on">
          {location && (
            <ul className="flex flex-col gap-2" aria-label="Ride buttons under the map">
              {RIDE_OPTIONS.map((r) => (
                <li key={r.id} className="flex items-center gap-2">
                  <span aria-hidden className="flex h-7 flex-1 items-center justify-center rounded-[3px] text-[12px] font-semibold" style={{ background: r.bg, color: r.fg }}>
                    {r.label}
                  </span>
                  <Switch
                    size="small"
                    checked={location.rides?.includes(r.id) ?? false}
                    onChange={(e) =>
                      edit((d) => {
                        const loc = findSection(d, "location");
                        if (!loc) return;
                        const others = (loc.rides ?? []).filter((x) => x !== r.id);
                        // Keep the Uber, Bolt, inDrive order
                        loc.rides = RIDE_OPTIONS.map((o) => o.id).filter((id) => (id === r.id ? e.target.checked : others.includes(id)));
                      })
                    }
                    slotProps={{ input: { "aria-label": `Show ${r.label} button under the map` } }}
                  />
                </li>
              ))}
            </ul>
          )}
          {optional.length > 0 && (
            <div className={location ? "border-t border-[#F0F0F2] pt-3" : ""}>
              <Label>Sections on your website</Label>
              <ul className="flex flex-col">
                {optional.map((s) => {
                  const name = s.navLabel || SECTION_LABELS[s.type];
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-3 py-0.5">
                      <span className="min-w-0 truncate text-[13px] text-[#0F0F0F]">{name}</span>
                      <Switch
                        size="small"
                        checked={!s.hidden}
                        onChange={(e) =>
                          edit((d) => {
                            const sec = d.sections.find((x) => x.id === s.id);
                            if (sec) sec.hidden = !e.target.checked || undefined;
                          })
                        }
                        slotProps={{ input: { "aria-label": `Show ${name}` } }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Group>
      )}
    </div>
  );
}
