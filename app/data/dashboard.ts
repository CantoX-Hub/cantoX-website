/**
 * Mock dashboard data. Every list here has the shape the API is expected to
 * return (see app/types/dashboard.types.ts), so swapping a constant for an
 * RTK Query hook is a one-line change in the component that reads it.
 */
import type {
  DashboardNotification,
  DashboardProfile,
  PlannerEvent,
  Role,
  Vendor,
} from "@/app/types/dashboard.types";

/* ---------- Demo profiles (used until GET /auth/me exists) ---------- */

export const DEMO_PROFILES: Record<Role, DashboardProfile> = {
  couple: {
    role: "couple",
    fullName: "Damilola Odusanya",
    partnerName: "Tobi Adeyemi",
    email: "damilola@example.com",
    planId: "couple-premium",
  },
  planner: {
    role: "planner",
    fullName: "Precious Adebayo",
    businessName: "Pinnacle Events",
    email: "precious@pinnacle.events",
    planId: "planner-pro",
    verified: true,
  },
  vendor: {
    role: "vendor",
    fullName: "Eniola Martins",
    businessName: "Enymeals",
    email: "hello@enymeals.ng",
    planId: "vendor-premium",
    verified: true,
  },
};

/** The vendor record that belongs to the signed-in vendor (demo) */
export const OWN_VENDOR_ID = "enymeals";

/* ---------- Planner events ---------- */

export const EVENTS: PlannerEvent[] = [
  { id: "ev-1", name: "Ngozi & Moyo", type: "Wedding website", status: "upcoming", date: "2027-04-12", location: "Eko Hotel, Lagos", guests: 350, couple: "Ngozi Eze & Moyo Bello" },
  { id: "ev-2", name: "Lara Glory Ville", type: "Wedding website", status: "upcoming", date: "2027-05-03", location: "Glory Ville, Ibadan", guests: 220, couple: "Lara Ojo & Femi Glory" },
  { id: "ev-3", name: "Eko events", type: "Guest", status: "ongoing", date: "2026-11-14", location: "Landmark Centre, Lagos", guests: 500 },
  { id: "ev-4", name: "Jane and John", type: "Wishlist", status: "done", date: "2026-08-22", location: "Transcorp Hilton, Abuja", guests: 180, couple: "Jane Okafor & John Musa" },
  { id: "ev-5", name: "Chioma & Kunle", type: "Guest", status: "upcoming", date: "2027-01-18", location: "Harbour Point, Lagos", guests: 300, couple: "Chioma Nwosu & Kunle Ade" },
  { id: "ev-6", name: "Halima's traditional", type: "Wishlist", status: "ongoing", date: "2026-11-21", location: "Kano Club, Kano", guests: 260 },
  { id: "ev-7", name: "Bisi & Dare", type: "Wedding website", status: "done", date: "2026-06-07", location: "Oriental Hotel, Lagos", guests: 410, couple: "Bisi Coker & Dare Ola" },
  { id: "ev-8", name: "Amaka & Seyi", type: "Wedding website", status: "upcoming", date: "2027-02-27", location: "The Monarch, Lagos", guests: 280 },
  { id: "ev-9", name: "Tari's white wedding", type: "Guest", status: "done", date: "2026-03-14", location: "Hotel Presidential, Port Harcourt", guests: 150 },
  { id: "ev-10", name: "Kemi & Tunde", type: "Wishlist", status: "upcoming", date: "2027-06-19", location: "Lagos Continental", guests: 330 },
  { id: "ev-11", name: "Ife & Yemi", type: "Wedding website", status: "done", date: "2026-09-05", location: "Delborough, Lagos", guests: 200 },
  { id: "ev-12", name: "Zainab & Ahmed", type: "Guest", status: "upcoming", date: "2027-03-08", location: "Sheraton, Abuja", guests: 450 },
];

/* ---------- Vendors ---------- */

const review = (id: string, author: string, rating: number, body: string, date: string) => ({ id, author, rating, body, date });

export const VENDORS: Vendor[] = [
  {
    id: "enymeals",
    name: "Enymeals",
    category: "Food & catering services",
    rating: 4.8,
    reviewCount: 126,
    location: "Lagos, Nigeria",
    verified: true,
    about: "Your source of freshness and vitality. Juices, zobo and smoothies pressed the morning of your event, bottled and labelled with your names.",
    gallery: Array(6).fill(undefined),
    moq: "50 bottles",
    products: [
      { name: "Fruit punch (50cl)", price: 2000 },
      { name: "Zobo (50cl)", price: 1500 },
      { name: "Chapman (50cl)", price: 2000 },
      { name: "Tigernut drink (35cl)", price: 1800 },
    ],
    whatsapp: "2348012345678",
    email: "hello@enymeals.ng",
    instagram: "enymeals",
    website: "enymeals.ng",
    reviews: [
      review("r1", "Tife Adeola", 5, "Absolutely refreshing! The bottles looked so clean and the fruit punch was gone in an hour. Guests kept asking where we got them.", "2026-09-14"),
      review("r2", "Habib Balogun", 5, "I wasn't expecting it to taste this fresh. Delivered early and the labels had our names on them.", "2026-08-02"),
      review("r3", "Morenike Ali", 4, "Great zobo, a little sweet for my taste but everyone else loved it.", "2026-07-19"),
    ],
  },
  {
    id: "dj-turnup",
    name: "DJ Turnup",
    category: "Entertainment",
    rating: 4.9,
    reviewCount: 88,
    location: "Lagos, Nigeria",
    verified: true,
    about: "Creating the soundtrack to your forever. Afrobeats, highlife, amapiano and the old-school classics your parents will dance to.",
    gallery: Array(6).fill(undefined),
    services: ["Engagements", "Corporate events", "Nightlife & club events", "Traditional weddings", "Sound & production", "Equipment rental", "Lighting design"],
    whatsapp: "2348023456789",
    email: "bookings@djturnup.com",
    instagram: "djturnup",
    website: "djturnup.com",
    reviews: [
      review("r1", "Chioma Eze", 5, "Our DJ understood the assignment perfectly! Every song matched the moment and the dance floor never emptied.", "2026-10-01"),
      review("r2", "Ahmed Tunde", 5, "From the entrance to the last song, he read the room. We'd book him again in a heartbeat.", "2026-09-11"),
    ],
  },
  {
    id: "sweet-taste",
    name: "Sweet Taste Kitchen",
    category: "Food & catering services",
    rating: 4.6,
    reviewCount: 203,
    location: "Abuja, Nigeria",
    verified: true,
    about: "Jollof, fried rice, asun and small chops for 50 to 2,000 guests. Tasting sessions every Saturday.",
    gallery: Array(6).fill(undefined),
    moq: "50 plates",
    products: [
      { name: "Party jollof (per plate)", price: 3500 },
      { name: "Small chops pack", price: 2500 },
      { name: "Asun (per plate)", price: 4000 },
    ],
    whatsapp: "2348034567890",
    email: "orders@sweettaste.ng",
    instagram: "sweettastekitchen",
    reviews: [review("r1", "Kemi Ade", 5, "Best jollof at any wedding I've been to. Portions were generous.", "2026-08-30")],
  },
  {
    id: "royal-bowls",
    name: "Royal Bowls",
    category: "Food & catering services",
    rating: 4.4,
    reviewCount: 57,
    location: "Ibadan, Nigeria",
    about: "Native soups and swallow served in branded bowls. Amala, ewedu, gbegiri and ofada stews.",
    gallery: Array(6).fill(undefined),
    moq: "30 bowls",
    products: [
      { name: "Amala & gbegiri bowl", price: 3000 },
      { name: "Ofada rice bowl", price: 3500 },
    ],
    whatsapp: "2348045678901",
    email: "royalbowls@gmail.com",
    reviews: [],
  },
  {
    id: "lens-light",
    name: "Lens & Light Studio",
    category: "Photography",
    rating: 4.9,
    reviewCount: 142,
    location: "Lagos, Nigeria",
    verified: true,
    about: "Documentary wedding photography and short films. We stay out of the way and catch the moments you'll miss.",
    gallery: Array(6).fill(undefined),
    services: ["Pre-wedding shoots", "Full-day coverage", "Drone coverage", "Same-day edits", "Wedding films", "Photo albums"],
    whatsapp: "2348056789012",
    email: "studio@lensandlight.ng",
    instagram: "lensandlight",
    website: "lensandlight.ng",
    reviews: [review("r1", "Bisi Coker", 5, "The photos made me cry. Every single one.", "2026-06-20")],
  },
  {
    id: "petal-house",
    name: "Petal House",
    category: "Florist & decor",
    rating: 4.7,
    reviewCount: 74,
    location: "Lagos, Nigeria",
    about: "Fresh and silk florals, centrepieces and stage backdrops in your colours.",
    gallery: Array(6).fill(undefined),
    services: ["Bridal bouquets", "Centrepieces", "Stage backdrops", "Car decor", "Ceiling drapes"],
    whatsapp: "2348067890123",
    email: "hello@petalhouse.ng",
    instagram: "petalhouse.ng",
    reviews: [],
  },
  {
    id: "glam-ife",
    name: "Glam by Ife",
    category: "Makeup & beauty",
    rating: 4.8,
    reviewCount: 96,
    location: "Abuja, Nigeria",
    verified: true,
    about: "Soft glam and gele for brides, bridesmaids and mothers of the couple. Home service available.",
    gallery: Array(6).fill(undefined),
    services: ["Bridal makeup", "Gele tying", "Bridal party makeup", "Trial session"],
    whatsapp: "2348078901234",
    email: "book@glambyife.com",
    instagram: "glambyife",
    reviews: [review("r1", "Halima Bello", 5, "Makeup stayed on through eight hours of dancing.", "2026-10-12")],
  },
  {
    id: "aso-tolu",
    name: "Aso Oke by Tolu",
    category: "Fashion & fabrics",
    rating: 4.5,
    reviewCount: 61,
    location: "Ogun, Nigeria",
    about: "Hand-woven aso oke for the couple and family, dyed to match your colours.",
    gallery: Array(6).fill(undefined),
    moq: "10 sets",
    products: [
      { name: "Aso oke set (gele, ipele, iro)", price: 45000 },
      { name: "Fila & agbada fabric", price: 60000 },
    ],
    whatsapp: "2348089012345",
    email: "tolu@asooke.ng",
    reviews: [],
  },
  {
    id: "bliss-cakes",
    name: "Bliss Cakes",
    category: "Cakes & desserts",
    rating: 4.7,
    reviewCount: 118,
    location: "Port Harcourt, Nigeria",
    verified: true,
    about: "Tiered wedding cakes, dessert tables and cake toppers, baked fresh in Port Harcourt.",
    gallery: Array(6).fill(undefined),
    moq: "1 cake",
    products: [
      { name: "3-tier fondant cake", price: 180000 },
      { name: "Cupcakes (dozen)", price: 12000 },
    ],
    whatsapp: "2348090123456",
    email: "orders@blisscakes.ng",
    instagram: "blisscakesph",
    reviews: [],
  },
  {
    id: "eko-rentals",
    name: "Eko Rentals",
    category: "Event rentals",
    rating: 4.3,
    reviewCount: 39,
    location: "Lagos, Nigeria",
    about: "Chairs, tables, tents, chiavari seats and generators delivered and set up.",
    gallery: Array(6).fill(undefined),
    services: ["Chiavari chairs", "Banquet tables", "Marquee tents", "Generators", "Cutlery & plates"],
    whatsapp: "2348101234567",
    email: "rent@ekorentals.ng",
    reviews: [],
  },
];

export const VENDOR_CATEGORIES = Array.from(new Set(VENDORS.map((v) => v.category))).sort();
export const VENDOR_LOCATIONS = Array.from(new Set(VENDORS.map((v) => v.location))).sort();

/* ---------- Template spotlight ---------- */

export const SPOTLIGHT_TEMPLATE = {
  name: "Gold & Black",
  description: "Premium wedding template, personalise it with your pictures, logo, info and your theme.",
  rating: 5,
  previewNames: ["Adebola", "Olumayowa"],
};

/* ---------- Notifications ---------- */

export const NOTIFICATIONS: DashboardNotification[] = [
  { id: "n1", title: "Welcome to canto", body: "Your account is ready. Start with a template or invite your partner.", time: "Just now", read: false },
  { id: "n2", title: "New template", body: "Gold & Black is now available on all plans.", time: "2h ago", read: false, href: "/dashboard/templates" },
  { id: "n3", title: "Profile verified", body: "Your ID check is complete.", time: "Yesterday", read: true },
];

/* ---------- Vendor-role overview (no design yet; inferred) ---------- */

export const VENDOR_STATS = {
  profileViews: 1284,
  profileViewsChange: 12,
  enquiries: 37,
  enquiriesChange: 5,
};
