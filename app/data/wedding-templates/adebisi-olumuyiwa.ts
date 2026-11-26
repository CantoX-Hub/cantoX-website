import type { TemplateDefinition } from "@/app/types/wedding.types";
import {
  colorControl,
  essentialsSection,
  fontControl,
  HASHTAG_FIELD,
  PREMIUM_FEATURES,
  SANS_FONTS,
  SCRIPT_FONTS,
  SERIF_FONTS,
} from "./shared";

/** Cream monogram invitation. The hashtag is part of its identity, so it is required here. */
export const adebisiOlumuyiwa: TemplateDefinition = {
  id: "tpl_adebisi_olumuyiwa",
  slug: "gold-black-cream",
  name: "Gold & Black",
  description: "Premium wedding template, personalize it with your details.",
  tier: "Premium",
  rating: 3,
  layout: null,
  thumbnail: "/template3.png",
  desktopBanner: "/template3.png",
  mobileBanner: "/template3.png",
  features: [],
  exclusiveFeatures: PREMIUM_FEATURES,
  sections: [
    essentialsSection([{ ...HASHTAG_FIELD, required: true }]),
    { kind: "styling", id: "styling", label: "Styling", logo: true },
    { kind: "contacts", id: "contacts", label: "R.S.V.P contacts", count: 2, required: false },
    { kind: "gifts", id: "gifts", label: "Send gifts", count: 1 },
    {
      kind: "gallery",
      id: "gallery",
      label: "Gallery",
      heroBanner: true,
      loveStory: 3,
      lens: 0,
    },
  ],
  customizationSchema: {
    colors: [
      colorControl("primary", "Primary color", ["#C0531F", "#121A47", "#7E1D2C"]),
      colorControl("heroTint", "Hero color", ["#E8DCC6", "#F4E7E9", "#E4F3E4"]),
    ],
    fonts: [
      fontControl("scriptFont", "Names font", SCRIPT_FONTS),
      fontControl("headingFont", "Details font", SERIF_FONTS),
      fontControl("bodyFont", "Body font", SANS_FONTS),
    ],
    heroBanner: true,
    defaults: {
      primary: "#C0531F",
      secondary: "#8A5A2B",
      background: "#FFFBF4",
      text: "#3B2A1E",
      heroTint: "#E8DCC6",
      heroText: "#3B2A1E",
      headingFont: "cormorant",
      scriptFont: "pinyon",
      bodyFont: "dmSans",
      heroBanner: null,
    },
  },
  mock: {
    partner1: "Adebisi",
    partner2: "Olumuyiwa",
    weddingDate: "2027-04-10",
    ceremonyTime: "11:00",
    venue: "Eko Hotels & Suites, Lagos",
    hashtag: "#aMADEstory",
    tagline: "Join us as we say I do.",
    contacts: [
      { name: "Mrs. Adeyemi", phone: "+234 802 000 1111" },
      { name: "Mr. Tunde", phone: "+234 803 000 2222" },
    ],
    gifts: [{ label: "GTBank", value: "0123456789", note: "Adebisi Olumuyiwa" }],
    gallery: {
      loveStory: [
        "/templates/itunu-stephen/couple-1.jpg",
        "/templates/itunu-stephen/couple-2.jpg",
        "/templates/itunu-stephen/couple-3.jpg",
      ],
    },
  },
};
