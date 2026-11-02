import { Feature } from "../component/landing/FeatureCard";
import { Template,PricingPlan, TemplateCategory, Testimonial } from "../types/index.types";

export const templates: Template[] = [
  {
    id: 1,
    name: "Gold & Black",
    style: "Premium",
    description:
      "Premium wedding template, personalize it with your details.",
    image: "/template1.png",
    category: "Premium",
    rating: 5,
  },
  {
    id: 2,
    name: "Ivory Green",
    style: "Essential",
    description:
      "Premium wedding template, personalize it with your details.",
    image: "/template2.png",
    category: "Free",
    rating: 3,
  },
  {
    id: 3,
    name: "Gold & Black",
    style: "Premium",
    description:
      "Premium wedding template, personalize it with your details.",
    image: "/template3.png",
    category: "Premium",
    rating: 4,
  },
  {
    id: 4,
    name: "Ivory Green",
    style: "Essential",
    description:
      "Premium wedding template, personalize it with your details.",
    image: "/template4.png",
    category: "Free",
    rating: 3,
  },
  {
    id: 5,
    name: "Gold & Black",
    style: "Premium",
    description:
      "Premium wedding template, personalize it with your details.",
    image: "/template5.png",
    category: "Premium",
    rating: 5,
  },
  {
    id: 6,
    name: "Burgundy & Navy blue",
    style: "premium",
    description:
      "Premium wedding template, personalize it with your details.",
    image: "/template6.png",
    category: "Free",
    rating: 3,
  },

];

export const tabs: TemplateCategory[] = ["All", "Free", "Premium"];


export const features: Feature[] = [
  {
    title: "Manage guests",
    description:
      "Effortlessly organize your guest list, track RSVPs, and manage seating with ease.",
    image: "/guest-banner.png",
    tone: "gold",
  },
  {
    title: "Access vendors",
    description:
      "Discover trusted vendors to bring your wedding vision to life.",
    image: "/vendor-banner.png",
    tone: "teal",
  },
  {
    title: "Wishlist",
    description:
      "Create a personalized wish list or cash contributions, and make it easy for guests to give.",
    image: "/wishlist-banner.png",
    tone: "plum",
  },
  {
    title: "To-do list",
    description:
      "Stay on track—visualize key milestones and tasks, ensuring every detail is planned seamlessly.",
    image: "/to-do-banner.png",
    tone: "navy",
   
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "I was dreading the whole invitation process. WeddingCraft made it so easy — I had my design ready in under 20 minutes. The Emerald Evening template is absolutely stunning.",
    name: "Adeze Okonkwo",
    location: "Lagos, Nigeria",
    avatar: "/client1.svg",
  },
  {
    id: 2,
    text: "The custom logo was worth every kobo. They delivered three concepts the same evening I placed the order. The final design is an absolute stationery now.",
    name: "Marcus Schnider",
    location: "Ottawa, Canada",
    avatar: "/client2.svg",
  },
  {
    id: 3,
    text: "I showed my mum the template and she couldn't believe I made it myself. The drag-and-drop is super intuitive and the fonts are so elegant. Highly recommend!",
    name: "Zainab Mustapha",
    location: "Nairobi, Kenya",
    avatar: "/avatar3.svg",
  },
  {
    id: 4,
    text: "Creating our wedding invitation was surprisingly simple. Everything looked polished and professional without needing a designer.",
    name: "Chiamaka Eze",
    location: "Abuja, Nigeria",
    avatar: "/client1.svg",
  },
  {
    id: 5,
    text: "I loved how quickly I could personalize everything. The colors, photos and details all came together beautifully.",
    name: "David Williams",
    location: "London, UK",
    avatar: "/client2.svg",
  },
  {
    id: 6,
    text: "The template collection gave us so many beautiful options. We found exactly the style we wanted for our wedding.",
    name: "Amara Johnson",
    location: "Accra, Ghana",
    avatar: "/client1.svg",
  },
];



export const pricingData: Record<string, PricingPlan[]> = {
  Couples: [
    {
      name: "Free",
      price: "₦0",
      billing: "One-time payment",
      description: "Best for couples with quick edits.",
      ctaText: "Get started",
      features: [
        {
          items: [
            "One wedding website from the free templates",
            "Names, date, venue, schedule and story",
            "Limited photos",
            "Basic RSVP and limited guest list",
          ],
        },
      ],
    },
    {
      name: "Premium",
      price: "₦100,000",
      billing: "One-time payment",
      description: "Best for couples with high taste.",
      ctaText: "Get started",
      isPopular: true,
      features: [
        {
          category: "Premium templates",
          items: [
            "Every template, previewed before you pay",
            "More photos and richer personalisation",
          ],
        },
        {
          category: "Guest management",
          items: [
            "Guest cap of 300",
            "Table and seat assignment",
            "Personalised invites",
          ],
        },
        {
          category: "Wishlist",
          items: [
            "Gifts with photo and retailer link",
            "Attach to your site or share on its own",
          ],
        },
        {
          category: "Verified vendors",
          items: ["Browse and contact CAC-verified vendors"],
        },
        {
          category: "Calendar",
          items: ["Wedding dates synced to Google Calendar"],
        },
        {
          category: "To-do list",
          items: ["Planning checklist with due dates"],
        },
      ],
    },
  ],
  "Event planners": [
    {
      name: "Starter",
      price: "₦10,000",
      billing: "Monthly payment",
      description: "Best for planners with quick plans.",
      ctaText: "Get started",
      features: [
        {
          items: [
            "Up to 5 active weddings website templates",
            "Free templates",
            "Separate dashboard for each client",
            "Guest list and RSVP tracking per wedding",
          ],
        },
      ],
    },
    {
      name: "Pro",
      price: "₦25,000",
      billing: "Monthly payment",
      description: "Designed for planners with high taste and complex planning.",
      ctaText: "Get started",
      isPopular: true,
      features: [
        {
          category: "Client projects",
          items: ["Up to 15 active weddings", "Each client kept separate"],
        },
        {
          category: "Premium templates",
          items: [
            "Every wedding website templates",
            "Reuse designs across clients",
          ],
        },
        {
          category: "Guest management",
          items: ["Tables and personalised invites", "RSVP tracking per client"],
        },
        {
          category: "Verified vendors",
          items: ["Shortlist vendors and share with clients"],
        },
      ],
    },
  ],
  Vendors: [
    {
      name: "Basic",
      price: "₦0",
      billing: "Monthly payment",
      description: "Basic vendor setup",
      ctaText: "Get started",
      features: [
        {
          items: [
            "Business profile and location",
            "Show products and services",
            "Minimum order (MOQ)",
            "Basic photo gallery",
            "Receive enquiries",
            "Apply for verification",
          ],
        },
      ],
    },
    {
      name: "Premium",
      price: "₦10,000",
      billing: "Monthly payment",
      description: "Vendors who want to be seen.",
      ctaText: "Get started",
      isPopular: true,
      features: [
        {
          items: ["Everything in basic"],
        },
        {
          category: "Featured placement",
          items: ["Labelled spot at the top of listings"],
        },
        {
          category: "Priority search ranking",
          items: ["Appear higher in results"],
        },
        {
          category: "Bigger portfolio",
          items: ["More photos and a fuller catalogue"],
        },
        {
          category: "Verified vendors",
          items: ["Views and enquiries"],
        },
      ],
    },
  ],
};
