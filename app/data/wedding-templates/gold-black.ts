import type { TemplateDefinition } from "@/app/types/wedding.types";
import {
  colorControl,
  essentialsSection,
  fontControl,
  PREMIUM_FEATURES,
  SANS_FONTS,
  SCRIPT_FONTS,
  SERIF_FONTS,
  VENUE_ADDRESS_FIELD,
} from "./shared";

/** Navy + rings invitation. Premium: logo, gifts, RSVP contacts, love pictures. */
export const goldBlack: TemplateDefinition = {
  id: "tpl_gold_black",
  slug: "gold-black",
  name: "Gold & Black",
  description: "Premium wedding template, personalize it with your details.",
  tier: "Premium",
  rating: 5,
  layout: "invite",
  thumbnail: "/template1.png",
  desktopBanner: "/templates/itunu-stephen/hero.jpg",
  mobileBanner: "/templates/itunu-stephen/hero.jpg",
  features: [],
  exclusiveFeatures: PREMIUM_FEATURES,
  sections: [
    essentialsSection([VENUE_ADDRESS_FIELD]),
    {
      kind: "fields",
      id: "invitation",
      label: "Invitation",
      fields: [
        { key: "tagline", label: "Hero message", type: "textarea", required: false },
        { key: "hostsA", label: "Hosting family (first)", type: "textarea", required: false },
        { key: "hostsB", label: "Hosting family (second)", type: "textarea", required: false },
      ],
    },
    { kind: "styling", id: "styling", label: "Styling", logo: true },
    { kind: "contacts", id: "contacts", label: "R.S.V.P contacts", count: 2, required: false },
    { kind: "gifts", id: "gifts", label: "Send gifts", count: 2 },
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
      colorControl("primary", "Primary color", ["#121A47", "#B3243D", "#2DAA3C"]),
      colorControl("heroTint", "Hero color", ["#000000", "#0D1B3E", "#3C1016"]),
    ],
    fonts: [
      fontControl("scriptFont", "Names font", SCRIPT_FONTS),
      fontControl("headingFont", "Details font", SERIF_FONTS),
      fontControl("bodyFont", "Body font", SANS_FONTS),
    ],
    heroBanner: true,
    defaults: {
      primary: "#121A47",
      secondary: "#6BB52F",
      background: "#FFFFFF",
      text: "#121A47",
      heroTint: "#000000",
      heroText: "#FFFFFF",
      headingFont: "cinzel",
      scriptFont: "montez",
      bodyFont: "dmSans",
      heroBanner: "/templates/itunu-stephen/hero.jpg",
    },
  },
  mock: {
    partner1: "Itunu",
    partner2: "Stephen",
    weddingDate: "2027-03-11",
    ceremonyTime: "12:30",
    venue: "22 Igbobi College Road",
    venueAddress: "Along WAEC road Fadeyi Lagos.",
    tagline: "We are doing forever together.",
    hostsA: "Mr and Mrs Adewale Olufemi Ojosipe and Anuoluwapo Latifat Ojosipe",
    hostsB: "Late Mr Olahipekun Oworeye Smith, Late Deaconess Christiana Folashade Omoniyi",
    contacts: [
      { name: "Mrs. Adeniyi", phone: "+234 708 153 3518", avatar: "/templates/itunu-stephen/avatar-mrs.png" },
      { name: "Mr. Seun", phone: "+234 704 744 9565", avatar: "/templates/itunu-stephen/avatar-mr.png" },
    ],
    gifts: [
      { label: "Kuda Bank", value: "2006115821", note: "Ojosipe Itunu H", logo: "/templates/itunu-stephen/kuda.png" },
      { label: "Zelle (international transfer)", value: "Stephentemi226@gmail.com", logo: "/templates/itunu-stephen/zelle.png" },
    ],
    gallery: {
      loveStory: [
        "/templates/itunu-stephen/couple-1.jpg",
        "/templates/itunu-stephen/couple-2.jpg",
        "/templates/itunu-stephen/couple-3.jpg",
      ],
    },
  },
};
