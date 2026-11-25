import {
  Cinzel,
  Cormorant_Garamond,
  DM_Sans,
  Great_Vibes,
  Inter,
  Lato,
  League_Spartan,
  Montez,
  Pinyon_Script,
  Playfair_Display,
  Source_Serif_4,
} from "next/font/google";
import type { FontKey } from "@/app/types/wedding.types";

// Each loader must be a top-level const. Nothing preloads: a font only downloads
// when a template actually uses it.
const montez = Montez({ weight: "400", subsets: ["latin"], variable: "--ff-montez", preload: false });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--ff-great-vibes", preload: false });
const pinyon = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--ff-pinyon", preload: false });
const cinzel = Cinzel({ weight: ["400", "700"], subsets: ["latin"], variable: "--ff-cinzel", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--ff-playfair", preload: false });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--ff-source-serif", preload: false });
const cormorant = Cormorant_Garamond({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--ff-cormorant", preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--ff-inter", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--ff-dm-sans", preload: false });
const lato = Lato({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--ff-lato", preload: false });
const leagueSpartan = League_Spartan({ subsets: ["latin"], variable: "--ff-league-spartan", preload: false });

/** Put on a wrapper so every option's CSS variable is defined inside it */
export const FONT_VARIABLE_CLASSES = [
  montez,
  greatVibes,
  pinyon,
  cinzel,
  playfair,
  sourceSerif,
  cormorant,
  inter,
  dmSans,
  lato,
  leagueSpartan,
]
  .map((font) => font.variable)
  .join(" ");

export const FONT_STACKS: Record<FontKey, string> = {
  montez: 'var(--ff-montez), "Brush Script MT", cursive',
  greatVibes: 'var(--ff-great-vibes), "Brush Script MT", cursive',
  pinyon: 'var(--ff-pinyon), "Brush Script MT", cursive',
  cinzel: "var(--ff-cinzel), Georgia, serif",
  playfair: "var(--ff-playfair), Georgia, serif",
  sourceSerif: "var(--ff-source-serif), Georgia, serif",
  cormorant: "var(--ff-cormorant), Georgia, serif",
  inter: "var(--ff-inter), system-ui, sans-serif",
  dmSans: "var(--ff-dm-sans), system-ui, sans-serif",
  lato: "var(--ff-lato), system-ui, sans-serif",
  leagueSpartan: "var(--ff-league-spartan), system-ui, sans-serif",
};

export const FONT_LABELS: Record<FontKey, string> = {
  montez: "Montez",
  greatVibes: "Great Vibes",
  pinyon: "Pinyon Script",
  cinzel: "Cinzel",
  playfair: "Playfair Display",
  sourceSerif: "Source Serif",
  cormorant: "Cormorant Garamond",
  inter: "Inter",
  dmSans: "DM Sans",
  lato: "Lato",
  leagueSpartan: "League Spartan",
};
