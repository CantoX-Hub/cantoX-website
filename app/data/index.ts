import { Template, TemplateCategory, Testimonial } from "../types/index.types";

export const templates: Template[] = [
  {
    id: 1,
    name: "Gold & Black",
    style: "Premium",
    description:
      "Premium wedding template, personalize it with your pictures, logo, info and gift inventory.",
    image: "/template1.png",
    category: "Premium",
    rating: 5,
  },
  {
    id: 2,
    name: "Ivory Green",
    style: "Essential",
    description:
      "Premium wedding template, personalize it with your pictures, logo, info and gift inventory.",
    image: "/template2.png",
    category: "Free",
    rating: 5,
  },
  {
    id: 3,
    name: "Gold & Black",
    style: "Premium",
    description:
      "Premium wedding template, personalize it with your pictures, logo, info and gift inventory.",
    image: "/template3.png",
    category: "Premium",
    rating: 5,
  },
  {
    id: 4,
    name: "Ivory Green",
    style: "Essential",
    description:
      "Premium wedding template, personalize it with your pictures, logo, info and gift inventory.",
    image: "/template4.png",
    category: "Free",
    rating: 5,
  },
  {
    id: 5,
    name: "Gold & Black",
    style: "Premium",
    description:
      "Premium wedding template, personalize it with your pictures, logo, info and gift inventory.",
    image: "/template5.png",
    category: "Premium",
    rating: 5,
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
      "Create a personalized wish list—choose from curated gifts or cash contributions, and make it easy for guests to give.",
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
    avatar: "/avatars/avatar-1.jpg",
  },
  {
    id: 2,
    text: "The custom logo was worth every kobo. They delivered three concepts the same evening I placed the order. The final design is an absolute stationery now.",
    name: "Marcus Schnider",
    location: "Ottawa, Canada",
    avatar: "/avatars/avatar-2.jpg",
  },
  {
    id: 3,
    text: "I showed my mum the template and she couldn't believe I made it myself. The drag-and-drop is super intuitive and the fonts are so elegant. Highly recommend!",
    name: "Zainab Mustapha",
    location: "Nairobi, Kenya",
    avatar: "/avatars/avatar-3.jpg",
  },
  {
    id: 4,
    text: "Creating our wedding invitation was surprisingly simple. Everything looked polished and professional without needing a designer.",
    name: "Chiamaka Eze",
    location: "Abuja, Nigeria",
    avatar: "/avatars/avatar-4.jpg",
  },
  {
    id: 5,
    text: "I loved how quickly I could personalize everything. The colors, photos and details all came together beautifully.",
    name: "David Williams",
    location: "London, UK",
    avatar: "/avatars/avatar-5.jpg",
  },
  {
    id: 6,
    text: "The template collection gave us so many beautiful options. We found exactly the style we wanted for our wedding.",
    name: "Amara Johnson",
    location: "Accra, Ghana",
    avatar: "/avatars/avatar-6.jpg",
  },
];