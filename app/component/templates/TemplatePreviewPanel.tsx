"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Gem, Monitor, Smartphone, Star, X } from "lucide-react";

type ViewMode = "mobile" | "web";

const DESKTOP_QUERY = "(min-width: 768px)";

/** Size of the virtual screen the page is rendered at, then scaled to fit the card */
const VIEWPORT = {
  mobile: { width: 402, height: 875 },
  web: { width: 1024, height: 942 },
};

/** True when the media query matches. Server render assumes mobile. */
function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** Renders `src` at a fixed virtual screen size and scales it to the width available */
function ScaledPreview({ src, title, mode }: { src: string; title: string; mode: ViewMode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const { width: vw, height: vh } = VIEWPORT[mode];

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver(() => setWidth(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = width / vw;

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden bg-[#0A1330]"
      style={{ height: vh * scale }}
    >
      {width > 0 && (
        <iframe
          key={mode}
          src={src}
          title={title}
          style={{
            width: vw,
            height: vh,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: 0,
          }}
        />
      )}
    </div>
  );
}

function ModeButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label} preview`}
      className={`flex items-center gap-2 rounded-full p-0.5 transition-colors ${
        active ? "bg-[#EEF2F8] pr-3" : "hover:bg-[#F4F6FA]"
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1C2A5A] text-[#11151D]">
        {children}
      </span>
      {active && <span className="text-[15px] font-medium text-[#171A20]">{label}</span>}
    </button>
  );
}

export interface PreviewPanelAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface TemplatePreviewPanelProps {
  open: boolean;
  onClose: () => void;
  name: string;
  tier: "Free" | "Premium";
  rating: number;
  previewUrl: string;
  features: string[];
  exclusiveFeatures: string[];
  action: PreviewPanelAction;
}

export function TemplatePreviewPanel({
  open,
  onClose,
  name,
  tier,
  rating,
  previewUrl,
  features,
  exclusiveFeatures,
  action,
}: TemplatePreviewPanelProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [mode, setMode] = useState<ViewMode>("web");
  // The portal target only exists in the browser, so wait for mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Phones only ever get the mobile view
  const activeMode: ViewMode = isDesktop ? mode : "mobile";

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const isPremium = tier === "Premium";
  const featureList = isPremium ? exclusiveFeatures : features;
  const actionClass = `mt-7 flex h-[42px] w-full items-center justify-center rounded-[3px] text-[14px] font-semibold transition-colors ${
    isPremium
      ? "bg-[#C9933A] text-white hover:bg-[#B78628]"
      : "bg-[#F1F5F9] text-[#171A20] hover:bg-[#E7EBEF]"
  }`;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex justify-end bg-[#171A20]/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`${name} template preview`}
            className={`max-h-full w-full self-start overflow-y-auto bg-white px-3 pb-6 transition-[max-width] duration-300 ${
              activeMode === "web" ? "max-w-[750px]" : "max-w-[426px]"
            }`}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E6E6E6] py-5">
              {isDesktop ? (
                <div className="flex items-center gap-2">
                  <ModeButton
                    active={activeMode === "mobile"}
                    label="Mobile"
                    onClick={() => setMode("mobile")}
                  >
                    <Smartphone className="h-5 w-5" />
                  </ModeButton>
                  <ModeButton
                    active={activeMode === "web"}
                    label="Web"
                    onClick={() => setMode("web")}
                  >
                    <Monitor className="h-5 w-5" />
                  </ModeButton>
                </div>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="text-[#11151D] transition-opacity hover:opacity-60"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Live preview of the template */}
            <div className="mt-6">
              <ScaledPreview src={previewUrl} title={`${name} preview`} mode={activeMode} />
            </div>

            {/* Details */}
            <div className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[24px] text-[#171A20]">{name}</h3>
                {isPremium ? (
                  <Gem aria-label="Premium" className="h-4 w-4 fill-[#C9933A] text-[#C9933A]" />
                ) : (
                  <span className="rounded-[2px] border border-[#DDE1E4] bg-[#EAF0F5] px-1.5 py-[2px] text-[12px] font-semibold text-[#62676D]">
                    Essential
                  </span>
                )}
              </div>

              <p className="mt-3 text-[14px] font-medium text-[#857E75]">
                Premium wedding template, personalize it with your pictures, logo, info and gift
                inventory.
              </p>

              <div className="mt-3 flex items-center gap-[2px]">
                {Array.from({ length: rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-[14px] w-[14px] fill-[#FFB800] text-[#FFB800]"
                  />
                ))}
              </div>

              <span className="mt-3 inline-block rounded-[2px] bg-[#EAF0F5] px-1.5 py-[2px] text-[12px] text-[#171A20]">
                Sample images not included
              </span>

              <h4 className="mt-6 text-[16px] text-[#171A20]">
                {isPremium ? "Exclusive features" : "features"}
              </h4>
              <ul className="mt-3 flex flex-col gap-4 text-[14px] text-[#171A20]">
                {featureList.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              {action.href ? (
                <Link href={action.href} onClick={action.onClick} className={actionClass}>
                  {action.label}
                </Link>
              ) : (
                <button type="button" onClick={action.onClick} className={actionClass}>
                  {action.label}
                </button>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
