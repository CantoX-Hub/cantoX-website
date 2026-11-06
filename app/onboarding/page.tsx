import type { Metadata } from "next";
import OnboardingFlow from "../component/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Set up your account | CantoX",
};

export default function OnboardingPage() {
  return (
    <main>
      <OnboardingFlow />
    </main>
  );
}
