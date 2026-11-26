"use client";

import { Plus } from "lucide-react";
import { FONT_LABELS } from "@/app/lib/fonts";
import { resolveTheme } from "@/app/lib/wedding-utils";
import type {
  ColorControl,
  FontControl,
  SectionSpec,
  TemplateDefinition,
  ThemeOverrides,
  ThemeValues,
  ValidationErrors,
  WeddingContent,
} from "@/app/types/wedding.types";
import {
  Accordion,
  Field,
  ImageSlot,
  inputClass,
  SubHeading,
  TextInput,
  Toggle,
} from "./fields";

export interface EditorSectionsProps {
  template: TemplateDefinition;
  content: Partial<WeddingContent>;
  overrides: ThemeOverrides | null;
  errors: ValidationErrors;
  openSections: string[];
  onToggleSection: (id: string) => void;
  onContent: (patch: Partial<WeddingContent>) => void;
  onOverrides: (patch: ThemeOverrides) => void;
  onResetOverrides: () => void;
}

const pathHasError = (errors: ValidationErrors, prefix: string) =>
  Object.keys(errors).some((key) => key === prefix || key.startsWith(`${prefix}.`));

function ColorPicker({
  control,
  value,
  onChange,
}: {
  control: ColorControl;
  value: string;
  onChange: (color: string) => void;
}) {
  const isCustom = !control.swatches.some((s) => s.toLowerCase() === value.toLowerCase());
  return (
    <div>
      <SubHeading>{control.label}</SubHeading>
      <div className="mt-2 flex items-center gap-2" role="group" aria-label={control.label}>
        {control.swatches.map((swatch) => {
          const selected = swatch.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={swatch}
              type="button"
              onClick={() => onChange(swatch)}
              aria-label={`${control.label} ${swatch}`}
              aria-pressed={selected}
              className={`h-7 w-7 rounded-full border border-black/10 transition-transform hover:scale-105 ${
                selected ? "ring-2 ring-[#11151D] ring-offset-2" : ""
              }`}
              style={{ background: swatch }}
            />
          );
        })}
        {control.allowCustom && (
          <label
            className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white transition-transform hover:scale-105 ${
              isCustom ? "ring-2 ring-[#11151D] ring-offset-2" : ""
            }`}
            style={{
              background: isCustom
                ? value
                : "conic-gradient(from 0deg, #f43f5e, #f59e0b, #22c55e, #3b82f6, #a855f7, #f43f5e)",
            }}
          >
            <Plus className="h-3.5 w-3.5 drop-shadow" />
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
              onChange={(e) => onChange(e.target.value)}
              aria-label={`Custom ${control.label.toLowerCase()}`}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        )}
      </div>
    </div>
  );
}

function FontSelect({
  control,
  value,
  onChange,
}: {
  control: FontControl;
  value: string;
  onChange: (font: string) => void;
}) {
  return (
    <Field label={control.label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} h-10 border-[#E5E7EB]`}
      >
        {control.options.map((option) => (
          <option key={option} value={option}>
            {FONT_LABELS[option]}
          </option>
        ))}
      </select>
    </Field>
  );
}

function StylingSection({
  template,
  spec,
  content,
  theme,
  overrides,
  onContent,
  onOverrides,
  onResetOverrides,
}: {
  template: TemplateDefinition;
  spec: Extract<SectionSpec, { kind: "styling" }>;
  content: Partial<WeddingContent>;
  theme: ThemeValues;
  overrides: ThemeOverrides | null;
  onContent: EditorSectionsProps["onContent"];
  onOverrides: EditorSectionsProps["onOverrides"];
  onResetOverrides: () => void;
}) {
  const schema = template.customizationSchema;
  return (
    <>
      {spec.logo && (
        <div>
          <SubHeading>
            Upload logo <span className="font-normal text-[#9CA3AF]">(png format)</span>
          </SubHeading>
          <div className="mt-2">
            <ImageSlot
              size="wide"
              label="logo"
              accept="image/png"
              value={content.logo}
              onChange={(value) => onContent({ logo: value ?? undefined })}
            />
          </div>
        </div>
      )}

      {schema.colors.map((control) => (
        <ColorPicker
          key={control.key}
          control={control}
          value={theme[control.key]}
          onChange={(color) => onOverrides({ [control.key]: color })}
        />
      ))}

      {schema.fonts.map((control) => (
        <FontSelect
          key={control.key}
          control={control}
          value={theme[control.key]}
          onChange={(font) => onOverrides({ [control.key]: font })}
        />
      ))}

      {overrides && Object.keys(overrides).length > 0 && (
        <button
          type="button"
          onClick={onResetOverrides}
          className="self-start text-[12px] text-[#C99532] underline-offset-2 hover:underline"
        >
          Reset to template defaults
        </button>
      )}
    </>
  );
}

function setAt<T>(list: T[] | undefined, index: number, length: number, empty: T, value: T): T[] {
  const next = Array.from({ length }, (_, i) => list?.[i] ?? empty);
  next[index] = value;
  return next;
}

export default function EditorSections({
  template,
  content,
  overrides,
  errors,
  openSections,
  onToggleSection,
  onContent,
  onOverrides,
  onResetOverrides,
}: EditorSectionsProps) {
  const theme = resolveTheme(template, overrides);
  const mock = template.mock;

  return (
    <div>
      {template.sections.map((spec) => {
        const open = openSections.includes(spec.id);
        const toggle = () => onToggleSection(spec.id);
        let body: React.ReactNode = null;
        let hasError = false;

        switch (spec.kind) {
          case "fields":
            hasError = spec.fields.some((f) => !!errors[f.key]);
            body = spec.fields.map((field) => (
              <TextInput
                key={field.key}
                label={field.label}
                type={field.type === "textarea" ? "text" : field.type}
                multiline={field.type === "textarea"}
                required={field.required}
                placeholder={field.placeholder ?? (mock[field.key] as string | undefined)}
                value={(content[field.key] as string | undefined) ?? ""}
                error={errors[field.key]}
                onChange={(value) => onContent({ [field.key]: value })}
              />
            ));
            break;

          case "styling":
            body = (
              <StylingSection
                template={template}
                spec={spec}
                content={content}
                theme={theme}
                overrides={overrides}
                onContent={onContent}
                onOverrides={onOverrides}
                onResetOverrides={onResetOverrides}
              />
            );
            break;

          case "story":
            body = spec.blocks.map((block) => (
              <TextInput
                key={block.key}
                label={block.label}
                multiline
                placeholder={mock.story?.[block.key]}
                value={content.story?.[block.key] ?? ""}
                onChange={(value) =>
                  onContent({ story: { ...content.story, [block.key]: value } })
                }
              />
            ));
            break;

          case "contacts":
            hasError = pathHasError(errors, "contacts");
            body = Array.from({ length: spec.count }, (_, i) => {
              const contact = content.contacts?.[i] ?? { name: "", phone: "" };
              const update = (patch: Partial<typeof contact>) =>
                onContent({
                  contacts: setAt(content.contacts, i, spec.count, { name: "", phone: "" }, {
                    ...contact,
                    ...patch,
                  }),
                });
              return (
                <div key={i} className="flex flex-col gap-3">
                  <TextInput
                    label="Name"
                    placeholder={mock.contacts?.[i]?.name}
                    value={contact.name}
                    error={errors[`contacts.${i}.name`]}
                    onChange={(name) => update({ name })}
                  />
                  <TextInput
                    label="Phone number"
                    placeholder={mock.contacts?.[i]?.phone}
                    value={contact.phone}
                    error={errors[`contacts.${i}.phone`]}
                    onChange={(phone) => update({ phone })}
                  />
                </div>
              );
            });
            break;

          case "gifts":
            hasError = pathHasError(errors, "gifts");
            body = Array.from({ length: spec.count }, (_, i) => {
              const gift = content.gifts?.[i] ?? { label: "", value: "", note: "" };
              const update = (patch: Partial<typeof gift>) =>
                onContent({
                  gifts: setAt(content.gifts, i, spec.count, { label: "", value: "" }, {
                    ...gift,
                    ...patch,
                  }),
                });
              return (
                <div key={i} className="flex flex-col gap-3">
                  <TextInput
                    label="Bank or service"
                    placeholder={mock.gifts?.[i]?.label}
                    value={gift.label}
                    error={errors[`gifts.${i}.label`]}
                    onChange={(label) => update({ label })}
                  />
                  <TextInput
                    label="Account number or email"
                    placeholder={mock.gifts?.[i]?.value}
                    value={gift.value}
                    error={errors[`gifts.${i}.value`]}
                    onChange={(value) => update({ value })}
                  />
                  <TextInput
                    label="Account name (optional)"
                    placeholder={mock.gifts?.[i]?.note}
                    value={gift.note ?? ""}
                    onChange={(note) => update({ note })}
                  />
                </div>
              );
            });
            break;

          case "gallery":
            body = (
              <>
                {spec.heroBanner && template.customizationSchema.heroBanner && (
                  <div>
                    <SubHeading>Hero image</SubHeading>
                    <div className="mt-2">
                      <ImageSlot
                        size="wide"
                        label="hero image"
                        value={overrides?.heroBanner}
                        placeholder={template.customizationSchema.defaults.heroBanner ?? undefined}
                        onChange={(value) => onOverrides({ heroBanner: value })}
                      />
                    </div>
                  </div>
                )}
                {spec.loveStory > 0 && (
                  <div>
                    <SubHeading>Our love story</SubHeading>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {Array.from({ length: spec.loveStory }, (_, i) => (
                        <ImageSlot
                          key={i}
                          label={`love story photo ${i + 1}`}
                          value={content.gallery?.loveStory?.[i]}
                          onChange={(value) =>
                            onContent({
                              gallery: {
                                ...content.gallery,
                                loveStory: setAt(content.gallery?.loveStory, i, spec.loveStory, "", value ?? ""),
                              },
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
                {spec.lens > 0 && (
                  <div>
                    <SubHeading>Through our lens</SubHeading>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {Array.from({ length: spec.lens }, (_, i) => (
                        <ImageSlot
                          key={i}
                          label={`gallery photo ${i + 1}`}
                          value={content.gallery?.lens?.[i]}
                          onChange={(value) =>
                            onContent({
                              gallery: {
                                ...content.gallery,
                                lens: setAt(content.gallery?.lens, i, spec.lens, "", value ?? ""),
                              },
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
            break;

          case "addons":
            body = spec.options.map((option) => (
              <Toggle
                key={option.key}
                label={option.label}
                checked={content.addons?.[option.key] ?? mock.addons?.[option.key] ?? false}
                onChange={(checked) =>
                  onContent({
                    addons: {
                      ...Object.fromEntries(
                        spec.options.map((o) => [
                          o.key,
                          content.addons?.[o.key] ?? mock.addons?.[o.key] ?? false,
                        ])
                      ),
                      [option.key]: checked,
                    },
                  })
                }
              />
            ));
            break;
        }

        return (
          <Accordion key={spec.id} id={spec.id} label={spec.label} open={open} hasError={hasError} onToggle={toggle}>
            {body}
          </Accordion>
        );
      })}
    </div>
  );
}
