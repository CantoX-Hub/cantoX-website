"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { makeStore } from "@/app/store/store";
import { hydrateOnboarding } from "@/app/store/onboardingSlice";
import { hydrateUser } from "@/app/store/authSlice";
import { loadOnboardingDraft, saveOnboardingDraft, loadUser, saveUser } from "@/app/store/persist";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  // Restore after mount so the first client render matches the server.
  useEffect(() => {
    store.dispatch(hydrateOnboarding(loadOnboardingDraft()));
    store.dispatch(hydrateUser(loadUser()));

    let lastSaved = store.getState().onboarding;
    let lastUser = store.getState().auth.user;
    return store.subscribe(() => {
      const { onboarding, auth } = store.getState();
      if (onboarding !== lastSaved) {
        lastSaved = onboarding;
        saveOnboardingDraft(onboarding);
      }
      if (auth.user !== lastUser) {
        lastUser = auth.user;
        saveUser(auth.user);
      }
    });
  }, [store]);

  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontSize: "14px", color: "#11151D" },
          success: { iconTheme: { primary: "#C99532", secondary: "#fff" } },
        }}
      />
    </Provider>
  );
}
