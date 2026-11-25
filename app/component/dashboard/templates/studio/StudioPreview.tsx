"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PreviewMessage, ThemeOverrides, WeddingContent } from "@/app/types/wedding.types";

export type PreviewMode = "mobile" | "web";

/** Virtual screen sizes the template is laid out at, then scaled to the space available */
const SCREEN = { mobile: { width: 402 }, web: { width: 1024 } };

/** Iframe so Mobile / Web are real breakpoints; edits reach it through postMessage */
export default function StudioPreview({
  slug,
  mode,
  content,
  overrides,
}: {
  slug: string;
  mode: PreviewMode;
  content: Partial<WeddingContent>;
  overrides: ThemeOverrides | null;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [area, setArea] = useState({ width: 0, height: 0 });
  const [frameReady, setFrameReady] = useState(false);

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setArea({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const send = () => {
    const message: PreviewMessage = { type: "canto:preview", content, overrides };
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  };

  // The frame announces itself once its page has mounted
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === "canto:preview-ready") setFrameReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Reloading the iframe (mode switch) resets it
  useEffect(() => setFrameReady(false), [mode, slug]);

  useEffect(() => {
    if (frameReady) send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameReady, content, overrides]);

  const virtualWidth = SCREEN[mode].width;
  const padding = mode === "mobile" ? 16 : 0;
  const available = Math.max(0, area.width - padding * 2);
  const scale = mode === "web" ? available / virtualWidth : Math.min(1, available / virtualWidth);
  const availableHeight = Math.max(0, area.height - padding * 2);
  const virtualHeight = scale > 0 ? availableHeight / scale : 0;

  return (
    <div ref={areaRef} className="flex h-full w-full items-start justify-center overflow-hidden bg-[#E9EDF3]">
      {area.width > 0 && scale > 0 && (
        <div
          className={`relative overflow-hidden bg-white ${
            mode === "mobile" ? "mt-4 rounded-[18px] shadow-[0_8px_30px_rgba(6,13,24,0.18)]" : ""
          }`}
          style={{ width: virtualWidth * scale, height: mode === "mobile" ? availableHeight : area.height }}
        >
          <iframe
            key={`${mode}-${slug}`}
            ref={frameRef}
            src={`/preview/${slug}`}
            title="Live preview of your wedding website"
            style={{
              width: virtualWidth,
              height: mode === "mobile" ? virtualHeight : area.height / scale,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
