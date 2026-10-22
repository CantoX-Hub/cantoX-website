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

///LOGO REQUEST

export const styles = [
  "Classic",
  "Minimalistic",
  "Floral",
  "Luxury",
  "Afrocentric",
] as const;

export type LogoStyle =
  | "Classic"
  | "Minimalistic"
  | "Floral"
  | "Luxury"
  | "Afrocentric";

export interface LogoRequestFormData {
  coupleName: string;
  email: string;
  logoName: string;
  hashtag: string;
  style: LogoStyle | "";
  brief: string;
}

export interface FormErrors {
  coupleName?: string;
  email?: string;
  logoName?: string;
  hashtag?: string;
  style?: string;
  brief?: string;
}

export const initialForm: LogoRequestFormData = {
  coupleName: "",
  email: "",
  logoName: "",
  hashtag: "",
  style: "Classic",
  brief: "",
};

export interface PricingPlan {
  name: string;
  price: string;
  billing: string;
  description: string;
  ctaText: string;
  isPopular?: boolean;
  features: {
    category?: string;
    items: string[];
  }[];
}