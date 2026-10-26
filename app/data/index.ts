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

export const features = [
  {
    title: "Manage guests",
    description:
      "Effortlessly organize your guest list—group attendees, track RSVPs, and manage seating with ease.",
    image: "/guest-banner.png",
  },
  {
    title: "Wishlist",
    description:
      "Create a personalized wish list or cash contributions, and make it easy for guests to give.",
    image: "/wishlist-banner.png",
  },
  {
    title: "Access vendors",
    description:
      "Discover trusted vendors to bring your wedding vision to life.",
    image: "/vendor-banner.png",
  },
  {
    title: "To-do list",
    description:
      "Stay on track—visualize key milestones and tasks, ensuring every detail is planned and executed seamlessly.",
    image: "/to-do-banner.png",
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
    avatar: "/client3.svg",
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
            "Unlimited free templates",
            "Add cash gifts",
            "Add limited pictures",
            "One-time use",
          ],
        },
      ],
    },
    {
      name: "Premium",
      price: "₦15,000",
      billing: "One-time payment",
      description: "Best for couples with high taste.",
      ctaText: "Get started",
      isPopular: true,
      features: [
        {
          category: "Premium templates",
          items: ["Unlimited free templates", "Add cash gifts", "Add limited pictures", "One-time use"],
        },
        {
          category: "Guest management",
          items: ["Unlimited free templates", "Add cash gifts", "Add limited pictures", "One-time use"],
        },
        {
          category: "Wishlist",
          items: ["Unlimited free templates", "Add cash gifts", "Add limited pictures", "One-time use"],
        },
        {
          category: "Verified vendors",
          items: ["Unlimited free templates", "Add cash gifts", "Add limited pictures", "One-time use"],
        },
      ],
    },
  ],
  "Event planners": [
    {
      name: "Starter",
      price: "₦0",
      billing: "Per month",
      description: "Best for independent planners starting out.",
      ctaText: "Get started",
      features: [
        {
          items: ["Up to 5 active events", "Client collaboration portal", "Standard templates", "Email support"],
        },
      ],
    },
    {
      name: "Pro Agency",
      price: "₦25,000",
      billing: "Per month",
      description: "For growing event planning teams.",
      ctaText: "Get started",
      isPopular: true,
      features: [
        {
          category: "Agency features",
          items: ["Unlimited active events", "Custom branding", "Priority vendor matching", "Advanced guest analytics"],
        },
      ],
    },
  ],
  Vendors: [
    {
      name: "Standard Listing",
      price: "₦0",
      billing: "Monthly subscription",
      description: "Get discovered by couples planning events.",
      ctaText: "Get Started",
      features: [
        {
          items: ["Profile showcase", "Direct client inquiries", "Portfolio gallery (up to 12 items)", "Standard support"],
        },
      ],
    },
    {
      name: "Verified Pro",
      price: "₦15,000",
      billing: "Monthly subscription",
      description: "For top-tier vendors wanting maximum visibility.",
      ctaText: "Get Started",
      isPopular: true,
      features: [
        {
          category: "Featured perks",
          items: ["Verified badge", "Top placement in search results", "Unlimited portfolio gallery", "Direct WhatsApp integration"],
        },
      ],
    },
  ],
};
