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

export type Testimonial = {
  id: number;
  text: string;
  name: string;
  location: string;
  avatar: string;
};

export type PricingCategory = "couples" | "planners" | "vendors";

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  theme: "light" | "dark";
}

export type PricingData = Record<PricingCategory, Plan[]>;

