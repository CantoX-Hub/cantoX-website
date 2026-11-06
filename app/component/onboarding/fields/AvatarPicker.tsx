"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus } from "lucide-react";
import { PRESET_AVATARS } from "@/app/data/onboarding";
import { useUploadFileMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import { Spinner } from "../ui";
import { MAX_UPLOAD_BYTES } from "./UploadField";

interface AvatarPickerProps {
  name: string;
  value: string;
  describedBy?: string;
  onChange: (url: string) => void;
}

const tileSize = "h-14 w-14 sm:h-[72px] sm:w-[72px]";

/** Preset avatars are sent as absolute URLs so the backend can store them like uploads. */
export default function AvatarPicker({ name, value, describedBy, onChange }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [upload, { isLoading }] = useUploadFileMutation();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isPreset = (path: string) => !!value && value.endsWith(path);
  const customUrl = value && !PRESET_AVATARS.some(isPreset) ? value : null;

  const choosePreset = (path: string) => {
    onChange(new URL(path, window.location.origin).href);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file (PNG, JPG or WebP).");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError("That image is over 5MB. Choose a smaller one.");
      return;
    }
    try {
      const { url } = await upload({ file, folder: "avatars" }).unwrap();
      onChange(url);
    } catch (error) {
      setUploadError(getErrorMessage(error, "Upload failed. Please try again."));
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        role="radiogroup"
        aria-describedby={describedBy}
        className="flex max-w-[620px] flex-wrap gap-3 sm:gap-4"
      >
        {PRESET_AVATARS.map((path, index) => {
          const active = isPreset(path);
          return (
            <motion.button
              key={path}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`Avatar ${index + 1}`}
              onClick={() => choosePreset(path)}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className={`relative ${tileSize} shrink-0 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#C99532]/30`}
            >
              <span className="absolute inset-0 overflow-hidden rounded-full bg-[#F1F4F8]">
                <Image src={path} alt="" fill sizes="72px" className="object-cover" />
              </span>
              <SelectedRing show={active} />
            </motion.button>
          );
        })}

        {/* Upload your own photo */}
        <input
          ref={inputRef}
          id={`${name}-upload`}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="peer sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <motion.label
          htmlFor={`${name}-upload`}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className={`relative ${tileSize} flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#EEF2F7] text-[#334155] transition-colors hover:bg-[#E2E8F0] peer-focus-visible:ring-4 peer-focus-visible:ring-[#C99532]/30`}
        >
          {isLoading ? (
            <Spinner />
          ) : customUrl ? (
            <span className="absolute inset-0 overflow-hidden rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={customUrl} alt="" className="h-full w-full object-cover" />
            </span>
          ) : (
            <ImagePlus className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
          )}
          <SelectedRing show={!!customUrl && !isLoading} />
          <span className="sr-only">{customUrl ? "Change your photo" : "Upload your own photo"}</span>
        </motion.label>
      </div>
      {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}

/** Gold ring with a white gap, springs in when selected */
function SelectedRing({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="pointer-events-none absolute -inset-[5px] rounded-full border-[1.5px] border-[#C99532]"
        />
      )}
    </AnimatePresence>
  );
}
