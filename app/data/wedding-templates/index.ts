import type { TemplateDefinition } from "@/app/types/wedding.types";
import { adebisiOlumuyiwa } from "./adebisi-olumuyiwa";
import { burgundyNavy } from "./burgundy-navy";
import { goldBlack } from "./gold-black";
import { ivoryGreen } from "./ivory-green";

/** The Library, in the order the dashboard shows it */
export const weddingTemplates: TemplateDefinition[] = [
  goldBlack,
  ivoryGreen,
  adebisiOlumuyiwa,
  burgundyNavy,
];

export const getTemplateById = (id: string) =>
  weddingTemplates.find((template) => template.id === id);

export const getTemplateBySlug = (slug: string) =>
  weddingTemplates.find((template) => template.slug === slug);

export { BURGUNDY_MAP_IMAGE } from "./burgundy-navy";
