/**
 * Dummy wedding website templates, served through the getTemplates /
 * getTemplate endpoints in services/api.ts until the backend has them.
 * Each template uses a different mix of sections on purpose.
 */
import type { TemplateSummary, WeddingTemplate } from "@/app/types/template.types";

const IS = "/templates/itunu-stephen";

const PHOTOS = {
  isHero: `${IS}/hero.jpg`,
  is1: `${IS}/couple-1.jpg`,
  is2: `${IS}/couple-2.jpg`,
  is3: `${IS}/couple-3.jpg`,
  gs1: "/get-started-couple.jpg",
  gs2: "/get-started-couple-2.png",
  gs3: "/get-started-couple-3.png",
  gs4: "/get-started-couple-4.png",
  about: "/about-couple.png",
  banner1: "/couple-banner.png",
  banner2: "/couple-banner-2.png",
  banner3: "/couple-banner-3.png",
  banner4: "/couple-banner-4.png",
  muyiwa: "/muyiwa-x-adebisi.png",
  nofisat: "/nofisat-x-taofeck.png",
};

const LOREM_STORY = [
  "We met at a friend's birthday dinner in Lekki. One shared plate of suya and three hours of conversation later, we both knew this was the start of something.",
  "Two years of road trips, Sunday jollof debates and late-night calls across time zones taught us that home is wherever we are together.",
  "On a quiet evening by the lagoon, with our families hiding behind the palms, the question was asked, and the answer was an easy yes.",
];

const WISHLIST = [
  { name: "Air fryer", price: 85_000 },
  { name: "Standing mixer", price: 120_000 },
  { name: "Dinner set (24 pcs)", price: 65_000 },
  { name: "Smart TV 55\"", price: 450_000 },
  { name: "Bedding set", price: 48_000 },
  { name: "Blender", price: 38_000 },
  { name: "Microwave", price: 95_000 },
  { name: "Honeymoon fund", price: 250_000 },
];

const GOOGLE = {
  greatVibes: "Great+Vibes",
  cormorant: "Cormorant+Garamond:wght@400;500;600",
  cinzel: "Cinzel:wght@400;600",
  montez: "Montez",
  playfair: "Playfair+Display:wght@400;600",
  parisienne: "Parisienne",
  lora: "Lora:wght@400;500",
};

type TemplateInput = Omit<WeddingTemplate, "includes">;

/** `includes` is worked out from the sections so it can't drift */
function define(t: TemplateInput): WeddingTemplate {
  const includes = Array.from(new Set(t.sections.map((s) => s.type))).filter((type) => type !== "hero" && type !== "footer");
  return { ...t, includes };
}

export const TEMPLATES: WeddingTemplate[] = [
  /* 1. Everything in: the "full" premium template */
  define({
    id: "gold-and-black",
    name: "Gold & Black",
    description: "Premium wedding template, personalise it with your pictures, story, info and gift inventory.",
    tier: "premium",
    rating: 5,
    thumbnail: "/template1.png",
    couple: { partnerOne: "Itunu", partnerTwo: "Stephen", date: "2027-04-17", city: "Lagos", hashtag: "#StephenFoundHisTunu" },
    theme: {
      colors: { background: "#0B0B0C", surface: "#16161A", text: "#F5EEDC", muted: "#B8AE98", primary: "#C99532", onPrimary: "#0B0B0C", accent: "#E7C77A" },
      fonts: { script: '"Great Vibes", cursive', heading: '"Cinzel", serif', body: '"Cormorant Garamond", serif' },
      googleFonts: [GOOGLE.greatVibes, GOOGLE.cinzel, GOOGLE.cormorant],
    },
    sections: [
      { type: "hero", id: "home", image: PHOTOS.isHero, tagline: "Together with their families, invite you to celebrate their wedding", ctaLabel: "RSVP now" },
      { type: "countdown", id: "countdown", heading: "Counting down", image: PHOTOS.is2 },
      {
        type: "story",
        id: "story",
        heading: "Our love story",
        subheading: "How it all began",
        chapters: [
          { title: "How we met", body: LOREM_STORY[0], image: PHOTOS.is1 },
          { title: "The proposal", body: LOREM_STORY[2], image: PHOTOS.is3 },
        ],
      },
      {
        type: "events",
        id: "details",
        heading: "Wedding details",
        events: [
          { name: "Traditional ceremony", date: "2027-04-16", time: "11:00 AM", venue: "The Civic Centre", address: "Ozumba Mbadiwe Ave, Victoria Island", dressCode: "Aso-oke", colours: ["#C99532", "#0B0B0C", "#F5EEDC"] },
          { name: "White wedding", time: "10:00 AM", venue: "Christ Church Cathedral", address: "Marina, Lagos Island", dressCode: "Black tie" },
          { name: "Reception", time: "2:00 PM", venue: "Eko Hotel Grand Ballroom", address: "Adetokunbo Ademola St, Victoria Island" },
        ],
      },
      {
        type: "location",
        id: "getting-there",
        heading: "Getting there",
        venue: "Eko Hotel Grand Ballroom",
        address: "Plot 1415 Adetokunbo Ademola Street, Victoria Island, Lagos",
        mapQuery: "Eko Hotel and Suites, Victoria Island, Lagos",
        notes: ["Parking is available at the main gate.", "Kindly arrive 30 minutes early for seating."],
      },
      { type: "gallery", id: "gallery", heading: "Through the lens", images: [PHOTOS.is1, PHOTOS.is2, PHOTOS.is3, PHOTOS.isHero, PHOTOS.gs1, PHOTOS.gs2, PHOTOS.gs3, PHOTOS.gs4] },
      {
        type: "gifts",
        id: "gifts",
        heading: "Gifts",
        subheading: "Your presence is our present, but if you'd like to bless us",
        accounts: [
          { provider: "Kuda Bank", value: "2006115821", accountName: "Ojosipe Itunu H" },
          { provider: "Zelle", value: "stephen@example.com", note: "International transfer" },
        ],
      },
      { type: "rsvp", id: "rsvp", heading: "RSVP", deadline: "2027-03-31", contacts: [{ name: "Mrs. Adeniyi", phone: "+234 708 153 3518" }, { name: "Mr. Seun", phone: "+234 704 744 9565" }] },
      { type: "footer", id: "footer", message: "We can't wait to celebrate with you." },
    ],
  }),

  /* 2. Minimal free template: no story, gallery or gifts */
  define({
    id: "ivory-green",
    name: "Ivory Green",
    description: "A clean, simple page with your date, venue and RSVP. Perfect for small weddings.",
    tier: "free",
    rating: 3,
    thumbnail: "/template2.png",
    couple: { partnerOne: "Amaka", partnerTwo: "Tobi", date: "2027-06-05", city: "Abuja" },
    theme: {
      colors: { background: "#FBF8F1", surface: "#F0EEE3", text: "#1F2A20", muted: "#6A7364", primary: "#3E5B3F", onPrimary: "#FBF8F1" },
      fonts: { script: '"Parisienne", cursive', heading: '"Lora", serif', body: '"Lora", serif' },
      googleFonts: [GOOGLE.parisienne, GOOGLE.lora],
    },
    sections: [
      { type: "hero", id: "home", image: PHOTOS.gs2, tagline: "are getting married", showNav: false },
      {
        type: "events",
        id: "details",
        heading: "The day",
        events: [{ name: "Ceremony & reception", time: "12:00 PM", venue: "Transcorp Hilton Gardens", address: "1 Aguiyi Ironsi St, Maitama, Abuja", dressCode: "Garden formal" }],
      },
      { type: "location", id: "getting-there", heading: "Getting there", venue: "Transcorp Hilton", address: "1 Aguiyi Ironsi Street, Maitama, Abuja" },
      { type: "rsvp", id: "rsvp", heading: "Will you join us?", deadline: "2027-05-15", contacts: [{ name: "Chidinma", phone: "+234 803 000 1122" }] },
      { type: "footer", id: "footer" },
    ],
  }),

  /* 3. Photo-led: story, quote, gallery, wishlist. No events or map. */
  define({
    id: "champagne-script",
    name: "Champagne Script",
    description: "Photo-led premium template with your story, a big gallery and a gift wishlist.",
    tier: "premium",
    rating: 4,
    thumbnail: "/template3.png",
    couple: { partnerOne: "Adebola", partnerTwo: "Olumayowa", date: "2027-09-11", hashtag: "#BolaMayo27" },
    theme: {
      colors: { background: "#F7F0E6", surface: "#EFE3D2", text: "#2E2418", muted: "#7A6A55", primary: "#9C7A3C", onPrimary: "#FFFFFF" },
      fonts: { script: '"Great Vibes", cursive', heading: '"Playfair Display", serif', body: '"Cormorant Garamond", serif' },
      googleFonts: [GOOGLE.greatVibes, GOOGLE.playfair, GOOGLE.cormorant],
    },
    sections: [
      { type: "hero", id: "home", image: PHOTOS.banner1, tagline: "Save the date" },
      { type: "quote", id: "quote", text: "I have found the one whom my soul loves.", attribution: "Song of Solomon 3:4", image: PHOTOS.banner2 },
      {
        type: "story",
        id: "story",
        heading: "Our story",
        chapters: [
          { title: "First hello", body: LOREM_STORY[0], image: PHOTOS.banner3 },
          { title: "Growing together", body: LOREM_STORY[1], image: PHOTOS.banner4 },
          { title: "Forever starts here", body: LOREM_STORY[2], image: PHOTOS.about },
        ],
      },
      { type: "gallery", id: "gallery", heading: "Moments", columns: 3, images: [PHOTOS.banner1, PHOTOS.banner2, PHOTOS.banner3, PHOTOS.banner4, PHOTOS.about, PHOTOS.gs1] },
      { type: "wishlist", id: "wishlist", heading: "Wishlist", subheading: "A few things to help us start our home", items: WISHLIST.slice(0, 6) },
      { type: "footer", id: "footer", message: "With love, Bola & Mayo" },
    ],
  }),

  /* 4. Free: events + gallery only */
  define({
    id: "sage-garden",
    name: "Sage Garden",
    description: "Soft greens for garden weddings. Share your schedule and favourite photos.",
    tier: "free",
    rating: 3,
    thumbnail: "/template4.png",
    couple: { partnerOne: "Zainab", partnerTwo: "Ibrahim", date: "2027-02-20", city: "Kano" },
    theme: {
      colors: { background: "#F4F6F0", surface: "#E4EADB", text: "#243022", muted: "#66725F", primary: "#7A9A6B", onPrimary: "#FFFFFF" },
      fonts: { script: '"Montez", cursive', heading: '"Lora", serif', body: '"Lora", serif' },
      googleFonts: [GOOGLE.montez, GOOGLE.lora],
    },
    sections: [
      { type: "hero", id: "home", image: PHOTOS.gs3, tagline: "Join us as we begin forever" },
      { type: "countdown", id: "countdown", heading: "Until we say I do" },
      {
        type: "events",
        id: "details",
        heading: "Programme",
        events: [
          { name: "Fatiha", date: "2027-02-19", time: "4:00 PM", venue: "Family house", address: "Nassarawa GRA, Kano" },
          { name: "Walima", time: "1:00 PM", venue: "Bristol Palace Hotel", address: "Guda Abdullahi Rd, Kano", colours: ["#7A9A6B", "#F4F6F0", "#D9B44A"] },
        ],
      },
      { type: "gallery", id: "gallery", heading: "Us", columns: 2, images: [PHOTOS.gs3, PHOTOS.gs4, PHOTOS.gs1, PHOTOS.gs2] },
      { type: "footer", id: "footer" },
    ],
  }),

  /* 5. Premium, every section, dark and moody */
  define({
    id: "noir-romance",
    name: "Noir Romance",
    description: "Dark, cinematic premium template with every section: story, map, wishlist, gifts and RSVP.",
    tier: "premium",
    rating: 5,
    thumbnail: "/template5.png",
    couple: { partnerOne: "Muyiwa", partnerTwo: "Adebisi", date: "2027-12-04", city: "Ibadan", hashtag: "#MuyiBisi" },
    theme: {
      colors: { background: "#101014", surface: "#1B1B22", text: "#EDE7DD", muted: "#A39C90", primary: "#D4AF6A", onPrimary: "#101014" },
      fonts: { script: '"Parisienne", cursive', heading: '"Cinzel", serif', body: '"Cormorant Garamond", serif' },
      googleFonts: [GOOGLE.parisienne, GOOGLE.cinzel, GOOGLE.cormorant],
    },
    sections: [
      { type: "hero", id: "home", image: PHOTOS.muyiwa, tagline: "Two hearts, one forever", ctaLabel: "Reserve your seat" },
      { type: "story", id: "story", heading: "Our love story", chapters: [{ body: LOREM_STORY[1], image: PHOTOS.nofisat }] },
      {
        type: "events",
        id: "details",
        heading: "Wedding details",
        events: [
          { name: "Engagement", date: "2027-12-03", time: "12:00 PM", venue: "Kakanfo Inn", address: "Ring Road, Ibadan", dressCode: "Traditional" },
          { name: "Wedding & reception", time: "11:00 AM", venue: "International Conference Centre", address: "University of Ibadan" },
        ],
      },
      { type: "location", id: "getting-there", heading: "Getting there", venue: "International Conference Centre", address: "University of Ibadan, Ibadan, Oyo", mapQuery: "International Conference Centre, University of Ibadan" },
      { type: "gallery", id: "gallery", heading: "Through the lens", columns: 3, images: [PHOTOS.muyiwa, PHOTOS.nofisat, PHOTOS.is1, PHOTOS.is2, PHOTOS.is3, PHOTOS.banner2] },
      { type: "wishlist", id: "wishlist", heading: "Wishlist", items: WISHLIST },
      { type: "gifts", id: "gifts", heading: "Cash gifts", accounts: [{ provider: "GTBank", value: "0123456789", accountName: "Muyiwa Adebisi" }] },
      { type: "rsvp", id: "rsvp", heading: "RSVP", deadline: "2027-11-15", contacts: [{ name: "Tola", phone: "+234 812 345 6789" }] },
      { type: "footer", id: "footer", image: PHOTOS.nofisat, message: "Thank you for being part of our story." },
    ],
  }),

  /* 6. Matches the burgundy editor design: nav bar + countdown in the hero */
  define({
    id: "burgundy-blush",
    name: "Burgundy & Blush",
    description: "Rich burgundy and soft blush, with your story, schedule, map, gallery, registry and cash gifts.",
    tier: "free",
    rating: 4,
    thumbnail: "/template6.png",
    couple: { partnerOne: "Joan", partnerTwo: "Jamiu", date: "2027-05-21", city: "Lagos", hashtag: "#jjstory27" },
    theme: {
      colors: { background: "#F8EEEE", surface: "#FFFFFF", text: "#3B1620", muted: "#8A6A70", primary: "#5C1A2B", onPrimary: "#F8EEEE", accent: "#C98A96" },
      fonts: { script: '"Great Vibes", cursive', heading: '"Playfair Display", serif', body: '"Lora", serif' },
      googleFonts: [GOOGLE.greatVibes, GOOGLE.playfair, GOOGLE.lora],
      swatches: { primary: ["#5C1A2B", "#C62F3B", "#3150D3", "#2FA84F"], secondary: ["#F8EEEE", "#E8EEF8", "#EAF5EA"] },
    },
    sections: [
      {
        type: "hero",
        id: "home",
        image: PHOTOS.isHero,
        navStyle: "bar",
        showNames: false,
        showCountdown: true,
        actions: [
          { label: "Our story", target: "story" },
          { label: "Contact", target: "rsvp" },
        ],
      },
      {
        type: "story",
        id: "story",
        navLabel: "Story",
        eyebrow: "Our journey",
        heading: "Our Love Story",
        intro: "Two families, two hearts, and one beautiful beginning. We found something steady in each other, the kind of joy that makes ordinary days feel like celebrations. We cannot wait to gather everyone we love in one room.",
        chapters: [
          { title: "Where it began", body: LOREM_STORY[0], image: PHOTOS.about },
          { title: "First date", body: LOREM_STORY[1], image: PHOTOS.gs2 },
          { title: "The proposal", body: LOREM_STORY[2], image: PHOTOS.gs1 },
        ],
      },
      {
        type: "events",
        id: "details",
        navLabel: "Details",
        eyebrow: "Save the date",
        heading: "Wedding details",
        events: [
          { name: "Ceremony", time: "1:00 PM", venue: "Premier Banqueting Suite", address: "Ikeja GRA, Lagos", dressCode: "Formal", colours: ["#5C1A2B", "#F8EEEE", "#C98A96"] },
          { name: "Reception", time: "4:00 PM", venue: "Premier Banqueting Suite", address: "Ikeja GRA, Lagos" },
        ],
      },
      { type: "location", id: "getting-there", eyebrow: "Find us", heading: "Getting there", venue: "Premier Banqueting Suite", address: "Ikeja GRA, Lagos", mapQuery: "Ikeja GRA, Lagos", rides: ["uber", "bolt", "indrive"] },
      { type: "gallery", id: "gallery", navLabel: "Gallery", eyebrow: "Moments", heading: "Through our lens", images: [PHOTOS.isHero, PHOTOS.about, PHOTOS.gs1, PHOTOS.gs2, PHOTOS.gs3, PHOTOS.gs4, PHOTOS.banner1, PHOTOS.banner3] },
      { type: "wishlist", id: "wishlist", navLabel: "Registry", heading: "Wishlist", items: WISHLIST.slice(0, 8) },
      { type: "gifts", id: "gifts", navLabel: "Cash Gift", heading: "Cash gifts", accounts: [{ provider: "Access Bank", value: "0690000031", accountName: "Joan & Jamiu" }] },
      { type: "quote", id: "promise", navLabel: "Our Promise", text: "Whatever comes, we choose each other, every single day.", attribution: "Joan & Jamiu" },
      { type: "rsvp", id: "rsvp", heading: "Contact", contacts: [{ name: "Aunty Bisi", phone: "+234 803 111 2233" }, { name: "Tunde", phone: "+234 809 444 5566" }] },
      { type: "footer", id: "footer", image: PHOTOS.gs4 },
    ],
  }),
];

/** Card data only, as the list endpoint will return it */
export const TEMPLATE_SUMMARIES: TemplateSummary[] = TEMPLATES.map(({ id, name, description, tier, rating, thumbnail, includes }) => ({
  id,
  name,
  description,
  tier,
  rating,
  thumbnail,
  includes,
}));
