import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/app/services/api";
import authReducer from "./authSlice";
import onboardingReducer from "./onboardingSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth: authReducer,
      onboarding: onboardingReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Upload mutations keep the File in their args
        serializableCheck: { ignoredPaths: [`${api.reducerPath}.mutations`] },
      }).concat(api.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
