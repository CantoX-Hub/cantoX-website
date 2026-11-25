import type { TemplateDefinition } from "@/app/types/wedding.types";
import {
  colorControl,
  essentialsSection,
  FREE_FEATURES,
  fontControl,
  SANS_FONTS,
  SCRIPT_FONTS,
  SERIF_FONTS,
} from "./shared";

/** Free tier: names, date/time/venue and three pictures. Nothing else is switched on. */
export const ivoryGreen: TemplateDefinition = {
  id: "tpl_ivory_green",
  slug: "ivory-green",
  name: "Ivory Green",
  description: "Premium wedding template, personalize it with your details.",
  tier: "Free",
  rating: 3,
  layout: null,
  thumbnail: "/template2.png",
  desktopBanner: "/template2.png",
  mobileBanner: "/template2.png",
  features: FREE_FEATURES,
  exclusiveFeatures: [],
  sections: [
    essentialsSection(),
    { kind: "styling", id: "styling", label: "Styling", logo: false },
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
      colorControl("primary", "Primary color", ["#0F3D2E", "#121A47", "#7E1D2C"]),
      colorControl("heroTint", "Hero color", ["#0B3B2E", "#0D1B3E", "#3C1016"]),
    ],
    fonts: [
      fontControl("scriptFont", "Names font", SCRIPT_FONTS),
      fontControl("headingFont", "Details font", SERIF_FONTS),
      fontControl("bodyFont", "Body font", SANS_FONTS),
    ],
    heroBanner: true,
    defaults: {
      primary: "#0F3D2E",
      secondary: "#C9933A",
      background: "#FFFFFF",
      text: "#0F3D2E",
      heroTint: "#0B3B2E",
      heroText: "#FFFFFF",
      headingFont: "cormorant",
      scriptFont: "montez",
      bodyFont: "dmSans",
      heroBanner: "/templates/ivory-green/hero.jpg",
    },
  },
  mock: {
    partner1: "Itunu",
    partner2: "Stephen",
    weddingDate: "2027-03-11",
    ceremonyTime: "12:30",
    venue: "22 Igbobi College Road, Fadeyi, Lagos",
    tagline: "We are doing forever together.",
    gallery: {
      loveStory: [
        "/templates/itunu-stephen/couple-1.jpg",
        "/templates/itunu-stephen/couple-2.jpg",
        "/templates/itunu-stephen/couple-3.jpg",
      ],
    },
  },
};
