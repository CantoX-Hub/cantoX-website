"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, ImagePlus, Loader, RotateCcw, Trash2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import { uploadWithProgress, type UploadProgressHandle } from "@/app/services/upload";
import { sessionExpired } from "@/app/store/authActions";
import { useAppDispatch } from "@/app/store/hooks";
import { Spinner } from "../ui";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

interface UploadFieldProps {
  id: string;
  value: string;
  accept?: string;
  folder?: string;
  /** Shown inside the drop zone, e.g. "PDF, JPG or PNG · max 5MB" */
  hint?: string;
  describedBy?: string;
  invalid?: boolean;
  onChange: (url: string) => void;
}

type UploadState = {
  file: File;
  loaded: number;
  status: "uploading" | "done" | "error";
  error?: string;
};

const TYPE_NAMES: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/webp": "WebP",
};

function acceptedNames(accept?: string) {
  const names = (accept ?? "").split(",").map((t) => TYPE_NAMES[t.trim()] ?? t.trim());
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} or ${names.at(-1)}` : names[0];
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(",").some((type) => {
    const t = type.trim();
    return t.endsWith("/*") ? file.type.startsWith(t.slice(0, -1)) : file.type === t;
  });
}

/** Name and size of files uploaded this session, so the card survives moving between steps */
const uploadedFiles = new Map<string, File>();

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(0, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(file?: File) {
  if (!file) return "FILE";
  return TYPE_NAMES[file.type] ?? file.name.split(".").pop()?.toUpperCase().slice(0, 4) ?? "FILE";
}

/** Uploads to POST /upload with progress and stores the returned URL. Supports drag and drop. */
export default function UploadField({
  id,
  value,
  accept,
  folder,
  hint,
  describedBy,
  invalid,
  onChange,
}: UploadFieldProps) {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useRef<UploadProgressHandle | null>(null);
  const [upload, setUpload] = useState<UploadState | null>(null);
  const [dragging, setDragging] = useState(false);

  const imageOnly = !!accept && accept.split(",").every((t) => t.trim().startsWith("image/"));
  const uploading = upload?.status === "uploading";

  // Local preview for the logo while it uploads; revoked when no longer needed
  const localFile = imageOnly ? upload?.file : undefined;
  const localPreview = useMemo(() => (localFile ? URL.createObjectURL(localFile) : ""), [localFile]);
  useEffect(() => () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  // Cancel an in-flight upload if the field unmounts (e.g. user changes step)
  useEffect(() => () => handleRef.current?.abort(), []);

  const start = (file: File) => {
    handleRef.current?.abort();
    if (value) onChange(""); // replacing: the old file no longer counts
    setUpload({ file, loaded: 0, status: "uploading" });

    const handle = uploadWithProgress(file, {
      folder,
      onProgress: (loaded) =>
        setUpload((current) => (current?.file === file ? { ...current, loaded } : current)),
    });
    handleRef.current = handle;

    handle.promise
      .then(({ url }) => {
        uploadedFiles.set(url, file);
        setUpload((current) =>
          current?.file === file ? { ...current, loaded: file.size, status: "done" } : current
        );
        onChange(url);
        toast.success(`${file.name} uploaded.`);
      })
      .catch((error) => {
        if ((error as { status?: unknown } | null)?.status === "ABORTED") return;
        if (hasStatus(error, 401)) dispatch(sessionExpired());
        const message = getErrorMessage(error, "Upload failed. Please try again.");
        toast.error(message);
        setUpload((current) =>
          current?.file === file ? { ...current, status: "error", error: message } : current
        );
      })
      .finally(() => {
        if (handleRef.current === handle) handleRef.current = null;
      });
  };

  const handleFile = (file: File | undefined) => {
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    if (!matchesAccept(file, accept)) {
      toast.error(`That file type isn't supported. Upload a ${acceptedNames(accept)}.`);
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("That file is over 5MB. Choose a smaller one.");
      return;
    }
    start(file);
  };

  const cancel = () => {
    handleRef.current?.abort();
    handleRef.current = null;
    setUpload(null);
  };

  const remove = () => {
    cancel();
    onChange("");
  };

  const dropHandlers = {
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      if (!dragging) setDragging(true);
    },
    onDragLeave: (event: React.DragEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false);
    },
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      handleFile(event.dataTransfer.files?.[0]);
    },
  };

  const input = (
    <input
      ref={inputRef}
      id={id}
      type="file"
      accept={accept}
      className="peer sr-only"
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      onChange={(event) => handleFile(event.target.files?.[0])}
    />
  );

  /* ---------- Image (logo / photo): round tile ---------- */
  if (imageOnly) {
    const previewUrl = value || localPreview;
    return (
      <div>
        {input}
        <div className="flex items-center gap-4">
          <motion.label
            htmlFor={id}
            {...dropHandlers}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className={`relative flex h-[72px] w-[72px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full text-[#334155] transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-[#C99532]/25 ${
              dragging
                ? "bg-[#FFF3DE] ring-2 ring-[#C99532]"
                : invalid
                  ? "bg-[#EEF2F7] ring-2 ring-red-300"
                  : "bg-[#EEF2F7] hover:bg-[#E2E8F0]"
            }`}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className={`h-full w-full object-cover ${uploading ? "opacity-50" : ""}`} />
            ) : (
              <ImagePlus className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
            )}
            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </span>
            )}
            <span className="sr-only">{value ? "Replace image" : "Upload image"}</span>
          </motion.label>

          <AnimatePresence initial={false}>
            {value && !uploading && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-4 text-sm"
              >
                <label htmlFor={id} className="cursor-pointer font-medium text-[#C99532] hover:underline">
                  Replace
                </label>
                <button type="button" onClick={remove} className="text-[#64748B] hover:underline">
                  Remove
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {upload?.error && <p className="mt-2 text-xs text-red-600">{upload.error}</p>}
      </div>
    );
  }

  /* ---------- Documents: drop zone + file card ---------- */
  // A saved URL with no local upload state still shows as completed: with its
  // name if it was uploaded this session, otherwise (after a reload) generically
  const remembered = value ? uploadedFiles.get(value) : undefined;
  const card: UploadState | "saved" | null =
    upload ??
    (remembered ? { file: remembered, loaded: remembered.size, status: "done" } : value ? "saved" : null);

  return (
    <div>
      {input}
      <label
        htmlFor={id}
        {...dropHandlers}
        className={`group flex cursor-pointer flex-col items-center justify-center rounded-[8px] border-2 border-dashed px-4 py-6 text-center transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-[#C99532]/20 sm:py-7 ${
          dragging
            ? "border-[#C99532] bg-[#FFF9F0]"
            : invalid
              ? "border-red-300 bg-white"
              : "border-[#E2E8F0] bg-white hover:border-[#C99532]/60 hover:bg-[#FFFCF7]"
        }`}
      >
        <motion.span
          animate={dragging ? { y: -4 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition-colors group-hover:text-[#C99532]"
        >
          <Upload className="h-5 w-5" aria-hidden="true" />
        </motion.span>
        <span className="mt-4 text-sm font-medium text-[#11151D] sm:text-base">
          {dragging ? "Drop to upload" : "Drag and Drop Files or Browse"}
        </span>
        {hint && <span className="mt-2 text-xs text-[#64748B] sm:text-sm">{hint}</span>}
      </label>

      <AnimatePresence initial={false}>
        {card && (
          <motion.div
            key={card === "saved" ? "saved" : card.file.name + card.file.lastModified}
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <FileCard card={card} onCancel={cancel} onRemove={remove} onRetry={() => card !== "saved" && start(card.file)} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function FileCard({
  card,
  onCancel,
  onRemove,
  onRetry,
}: {
  card: UploadState | "saved";
  onCancel: () => void;
  onRemove: () => void;
  onRetry: () => void;
}) {
  const saved = card === "saved";
  const file = saved ? undefined : card.file;
  const status = saved ? "done" : card.status;
  // Hold the bar just short of full until the server confirms
  const percent = saved
    ? 100
    : status === "done"
      ? 100
      : Math.min(95, Math.round((card.loaded / Math.max(card.file.size, 1)) * 100));

  return (
    <div
      className={`mt-2 rounded-[8px] border px-4 py-4 sm:px-5 ${
        status === "error" ? "border-red-200 bg-red-50/40" : "border-[#E2E8F0] bg-white"
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <FileTypeIcon label={saved ? "FILE" : extensionOf(file)} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#11151D] sm:text-[15px]">
            {file?.name ?? "Uploaded document"}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[#475569] sm:text-sm">
            {file && (
              <>
                <span>
                  {formatSize(status === "done" ? file.size : card === "saved" ? 0 : card.loaded)} of{" "}
                  {formatSize(file.size)}
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#94A3B8]" />
              </>
            )}
            {status === "uploading" && (
              <span className="flex items-center gap-1.5">
                <Loader className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                Uploading...
              </span>
            )}
            {status === "done" && (
              <span className="flex items-center gap-1.5">
                <CheckCheck className="h-4 w-4 text-[#1F8A4C]" aria-hidden="true" />
                Completed
              </span>
            )}
            {status === "error" && !saved && <span className="text-red-600">{card.error}</span>}
          </p>
        </div>

        {status === "uploading" && (
          <IconButton label="Cancel upload" onClick={onCancel}>
            <X className="h-4 w-4" />
          </IconButton>
        )}
        {status === "done" && (
          <IconButton label="Delete file" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        )}
        {status === "error" && (
          <div className="flex items-center gap-1">
            <IconButton label="Try again" onClick={onRetry}>
              <RotateCcw className="h-4 w-4" />
            </IconButton>
            <IconButton label="Remove" onClick={onCancel}>
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        )}
      </div>

      {status === "uploading" && (
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-[#FBF3E4]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Upload progress"
        >
          <motion.div
            className="h-full rounded-full bg-[#C99532]"
            initial={{ width: "4%" }}
            animate={{ width: `${Math.max(percent, 4)}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#475569] transition-colors hover:bg-[#F1F4F8] hover:text-[#11151D]"
    >
      {children}
    </button>
  );
}

/** Red document outline with the file type, as in the design */
function FileTypeIcon({ label }: { label: string }) {
  return (
    <svg width="40" height="44" viewBox="0 0 40 44" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M8 2h17l11 11v27a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        fill="#FFF5F5"
        stroke="#C2453B"
        strokeWidth="1.6"
      />
      <path d="M25 2v9a2 2 0 0 0 2 2h9" stroke="#C2453B" strokeWidth="1.6" />
      <rect x="1" y="22" width="26" height="13" rx="2" fill="#FDECEC" stroke="#C2453B" strokeWidth="1.4" />
      <text
        x="14"
        y="31.5"
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="600"
        fill="#C2453B"
      >
        {label}
      </text>
    </svg>
  );
}
