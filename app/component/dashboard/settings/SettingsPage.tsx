"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { AlertTriangle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDeleteAccountMutation } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import { clearAllLocalData } from "@/app/store/persist";
import { ROUTES } from "@/app/lib/routes";
import { useDashboard } from "../DashboardContext";
import { useToast } from "../Toast";
import { PageTitle, Panel } from "../ui";
import { leaving } from "../shell/leaving";

const ROLE_LABEL = { couple: "Couple", planner: "Event planner", vendor: "Vendor" } as const;
const CONFIRM_WORD = "DELETE";

export default function SettingsPage() {
  const { profile } = useDashboard();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const details = [
    { label: profile.role === "vendor" ? "Business name" : "Full name", value: profile.role === "vendor" ? profile.businessName : profile.fullName },
    { label: "Email", value: profile.email },
    { label: "Account type", value: ROLE_LABEL[profile.role] },
  ];

  return (
    <div className="max-w-[760px]">
      <PageTitle>Settings</PageTitle>

      <Panel className="p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold text-[#0F0F0F]">Account</h2>
        <dl className="mt-4 divide-y divide-[#F0F0F3]">
          {details.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-[13px] text-[#6B7280]">{label}</dt>
              <dd className="break-all text-[14px] font-medium text-[#0F0F0F] sm:text-right">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel className="mt-5 border-red-200 p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold text-red-700">Delete account</h2>
        <p className="mt-2 max-w-[560px] text-[13px] leading-6 text-[#6B7280]">
          Permanently delete your CantoX account and remove your personal details. You&apos;ll be signed out and this
          can&apos;t be undone.
        </p>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Trash2 size={16} />}
          onClick={() => setConfirmOpen(true)}
          sx={{ mt: 2.5, textTransform: "none", fontWeight: 600 }}
        >
          Delete my account
        </Button>
      </Panel>

      <DeleteAccountDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} email={profile.email} />
    </div>
  );
}

function DeleteAccountDialog({ open, onClose, email }: { open: boolean; onClose: () => void; email?: string }) {
  const router = useRouter();
  const notify = useToast();
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const [typed, setTyped] = useState("");
  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const close = () => {
    if (isLoading) return;
    setTyped("");
    onClose();
  };

  const finish = () => {
    clearAllLocalData();
    router.replace(ROUTES.home);
    toast.success("Your account has been deleted.");
  };

  const handleDelete = async () => {
    if (!confirmed || isLoading) return;
    // Success marks the user as a guest at once; this stops the dashboard's
    // auth guard sending them to /get-started before we redirect home.
    leaving.current = true;
    try {
      await deleteAccount().unwrap();
      finish();
    } catch (error) {
      // 404: already gone on the backend, so finish signing out locally
      if (hasStatus(error, 404)) {
        finish();
        return;
      }
      leaving.current = false;
      // 401 after a failed refresh: the base query signs the user out
      if (hasStatus(error, 401)) return;
      notify(getErrorMessage(error, "We couldn't delete your account. Please try again."), { severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="xs" fullWidth aria-labelledby="delete-account-title">
      <DialogTitle id="delete-account-title" sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={18} aria-hidden="true" />
        </span>
        Delete your account?
      </DialogTitle>
      <DialogContent>
        <p className="text-[14px] leading-6 text-[#4B5563]">
          This permanently deletes {email ? <strong className="break-all">{email}</strong> : "your account"} and removes
          your personal details. You&apos;ll lose access to your dashboard straight away.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleDelete();
          }}
        >
          <TextField
            autoFocus
            fullWidth
            size="small"
            margin="normal"
            label={`Type ${CONFIRM_WORD} to confirm`}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            disabled={isLoading}
            autoComplete="off"
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={close} disabled={isLoading} sx={{ textTransform: "none", color: "text.secondary" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          disableElevation
          onClick={handleDelete}
          disabled={!confirmed || isLoading}
          startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : undefined}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {isLoading ? "Deleting…" : "Delete account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
