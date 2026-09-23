export type TemplateCategory = "All" | "Free" | "Premium";

export interface Template {
  id: number;
  name: string;
  style: string;
  description: string;
  image: string;
  category: "Free" | "Premium";
  rating: number;
  featured?: boolean;
}