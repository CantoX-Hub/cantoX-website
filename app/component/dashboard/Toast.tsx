"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Alert, Button, Snackbar } from "@mui/material";

interface ToastOptions {
  severity?: "success" | "info" | "warning" | "error";
  actionLabel?: string;
  onAction?: () => void;
}

type Notify = (message: string, options?: ToastOptions) => void;

const ToastContext = createContext<Notify>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<({ message: string; key: number } & ToastOptions) | null>(null);

  const notify = useCallback<Notify>((message, options) => {
    setToast({ message, key: Date.now(), ...options });
  }, []);

  const close = () => setToast(null);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <Snackbar
        key={toast?.key}
        open={!!toast}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== "clickaway" && close()}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast?.severity ?? "success"}
          variant="filled"
          onClose={close}
          sx={{ alignItems: "center", bgcolor: "secondary.main", color: "#fff", "& .MuiAlert-icon": { color: "primary.main" } }}
          action={
            toast?.actionLabel ? (
              <Button
                size="small"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  toast.onAction?.();
                  close();
                }}
              >
                {toast.actionLabel}
              </Button>
            ) : undefined
          }
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
