import type { TemplateDefinition } from "@/app/types/wedding.types";
import {
  colorControl,
  essentialsSection,
  fontControl,
  HASHTAG_FIELD,
  PREMIUM_FEATURES,
  SANS_FONTS,
  SERIF_FONTS,
  SOFT_SWATCHES,
  STRONG_SWATCHES,
} from "./shared";

const B = "/templates/burgundy-navy";

export const burgundyNavy: TemplateDefinition = {
  id: "tpl_burgundy_navy",
  slug: "burgundy-navy-blue",
  name: "Burgundy & Navy blue",
  description: "Premium wedding template, personalize it with your details.",
  tier: "Premium",
  rating: 3,
  layout: "website",
  thumbnail: "/template6.png",
  desktopBanner: `${B}/hero.jpg`,
  mobileBanner: `${B}/hero.jpg`,
  features: [],
  exclusiveFeatures: PREMIUM_FEATURES,
  sections: [
    essentialsSection([HASHTAG_FIELD]),
    { kind: "styling", id: "styling", label: "Styling", logo: true },
    {
      kind: "story",
      id: "story",
      label: "Your story",
      blocks: [
        { key: "intro", label: "Tell your story" },
        { key: "whereItBegan", label: "Where it began" },
        { key: "firstDate", label: "First date" },
        { key: "proposal", label: "The proposal" },
      ],
    },
    { kind: "contacts", id: "contacts", label: "Contacts", count: 3, required: false },
    {
      kind: "gallery",
      id: "gallery",
      label: "Gallery",
      heroBanner: true,
      loveStory: 3,
      lens: 12,
    },
    {
      kind: "addons",
      id: "addons",
      label: "Add-on",
      options: [
        { key: "uber", label: "Uber" },
        { key: "bolt", label: "Bolt" },
        { key: "indrive", label: "Indrive" },
      ],
    },
  ],
  customizationSchema: {
    colors: [
      colorControl("primary", "Primary color", ["#AD3A4C", ...STRONG_SWATCHES.slice(1)]),
      colorControl("secondary", "Secondary color", SOFT_SWATCHES),
    ],
    fonts: [
      fontControl("headingFont", "Heading font", SERIF_FONTS),
      fontControl("bodyFont", "Body font", SANS_FONTS),
    ],
    heroBanner: true,
    defaults: {
      primary: "#AD3A4C",
      secondary: "#F4E7E9",
      background: "#F4E7E9",
      text: "#3C1016",
      heroTint: "#1A1015",
      heroText: "#FFFFFF",
      headingFont: "sourceSerif",
      scriptFont: "pinyon",
      bodyFont: "lato",
      heroBanner: `${B}/hero.jpg`,
    },
  },
  mock: {
    partner1: "Joan",
    partner2: "Jamie",
    weddingDate: "2027-05-21",
    ceremonyTime: "13:00",
    venue: "Premier Banqueting Suites",
    venueAddress: "Victoria Island, Lagos",
    hashtag: "#jjstory27",
    story: {
      intro:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
      whereItBegan:
        "Two families, two hearts, and one beautiful beginning. We found something steady in each other, the kind of joy that makes ordinary days feel like celebrations.",
      firstDate:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. It was the first of many evenings we never wanted to end.",
      proposal:
        "Two families, two hearts, and one beautiful beginning. We cannot wait to gather everyone we love in one room.",
    },
    contacts: [
      { name: "Joan", phone: "+234 818 829 8033" },
      { name: "Jamie", phone: "+234 818 829 8033" },
      { name: "Wedding planner", phone: "+234 818 829 8033" },
    ],
    gallery: {
      loveStory: [`${B}/lens-1.webp`, `${B}/lens-6.webp`, `${B}/lens-3.webp`],
      lens: Array.from({ length: 12 }, (_, i) => `${B}/lens-${i + 1}.webp`),
    },
    addons: { uber: true, bolt: true, indrive: true },
  },
};

export const BURGUNDY_MAP_IMAGE = `${B}/map.png`;
