import type { Metadata } from "next";
import GoogleCallback from "../../component/auth/GoogleCallback";

export const metadata: Metadata = {
  title: "Signing in | CantoX",
};

// The backend redirects here after Google sign-in: {FRONTEND_URL}/auth/callback
export default function AuthCallbackPage() {
  return (
    <main>
      <GoogleCallback />
    </main>
  );
}
