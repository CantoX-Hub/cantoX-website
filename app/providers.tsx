"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/app/store/store";
import { hydrateOnboarding } from "@/app/store/onboardingSlice";
import { loadOnboardingDraft, saveOnboardingDraft } from "@/app/store/persist";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  // Restore after mount so the first client render matches the server.
  useEffect(() => {
    store.dispatch(hydrateOnboarding(loadOnboardingDraft()));

    let lastSaved = store.getState().onboarding;
    return store.subscribe(() => {
      const next = store.getState().onboarding;
      if (next !== lastSaved) {
        lastSaved = next;
        saveOnboardingDraft(next);
      }
    });
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
