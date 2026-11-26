// Plans shown on the pricing page AND in onboarding (plan step).
// Keys must match PLAN_TABS labels in app/data/onboarding.ts.
import type { PricingPlan } from "@/app/types/index.types";

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
      price: "₦15,000",
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
