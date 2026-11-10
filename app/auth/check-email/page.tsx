import type { Metadata } from "next";
import CheckEmail from "../../component/auth/CheckEmail";

export const metadata: Metadata = {
  title: "Check your email | CantoX",
};

// Shown after Get Started sends a magic link
export default function CheckEmailPage() {
  return (
    <main>
      <CheckEmail />
    </main>
  );
}
