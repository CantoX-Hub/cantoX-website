import { API_BASE } from "./baseQuery";

/**
 * POST /upload with real progress events.
 *
 * RTK Query's fetch-based `uploadFile` can't report upload progress, so this
 * uses XMLHttpRequest. It sends the auth cookies like the base query does and,
 * on a 401, refreshes the session once and retries.
 *
 * Errors are thrown as `{ status, data }`, the same shape RTK Query uses, so
 * `getErrorMessage` and `hasStatus` from baseQuery work on them.
 */

export interface UploadProgressHandle {
  promise: Promise<{ url: string }>;
  /** Cancels the upload; the promise rejects with status "ABORTED" */
  abort: () => void;
}

interface Options {
  folder?: string;
  onProgress?: (loaded: number, total: number) => void;
}

type RawResponse = { status: number; body: unknown };

function parseBody(text: string): unknown {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

/** Set NEXT_PUBLIC_MOCK_API=true in .env.local to test the UI without the backend */
const MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === "true";

/** Fake upload: fills the progress bar over ~2s and returns a local preview URL */
function mockUpload(file: File, onProgress?: Options["onProgress"]): UploadProgressHandle {
  let timer: ReturnType<typeof setInterval> | undefined;
  let rejectFn: ((reason: unknown) => void) | undefined;

  const promise = new Promise<{ url: string }>((resolve, reject) => {
    rejectFn = reject;
    let loaded = 0;
    const step = Math.max(file.size / 20, 1);
    timer = setInterval(() => {
      loaded = Math.min(file.size, loaded + step);
      onProgress?.(loaded, file.size);
      if (loaded >= file.size) {
        clearInterval(timer);
        resolve({ url: URL.createObjectURL(file) });
      }
    }, 100);
  });

  return {
    promise,
    abort: () => {
      clearInterval(timer);
      rejectFn?.({ status: "ABORTED" });
    },
  };
}

export function uploadWithProgress(file: File, { folder, onProgress }: Options = {}): UploadProgressHandle {
  if (MOCK_API) return mockUpload(file, onProgress);

  let current: XMLHttpRequest | null = null;
  let aborted = false;

  const attempt = () =>
    new Promise<RawResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      current = xhr;
      xhr.open("POST", `${API_BASE}/upload`);
      xhr.withCredentials = true;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress?.(event.loaded, event.total);
      };
      xhr.onload = () => resolve({ status: xhr.status, body: parseBody(xhr.responseText) });
      xhr.onerror = () => reject({ status: "FETCH_ERROR", error: "Network error" });
      xhr.onabort = () => reject({ status: "ABORTED" });

      const formData = new FormData();
      formData.append("file", file);
      if (folder) formData.append("folder", folder);
      xhr.send(formData);
    });

  const promise = (async () => {
    let response = await attempt();

    if (response.status === 401) {
      const refreshed = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })
        .then((r) => r.ok)
        .catch(() => false);

      if (!refreshed) throw { status: 401, data: response.body };
      if (aborted) throw { status: "ABORTED" };
      response = await attempt();
    }

    if (response.status < 200 || response.status >= 300) {
      throw { status: response.status, data: response.body };
    }

    const url = (response.body as { url?: unknown } | null)?.url;
    if (typeof url !== "string") throw { status: "PARSING_ERROR", data: response.body };
    return { url };
  })();

  return {
    promise,
    abort: () => {
      aborted = true;
      current?.abort();
    },
  };
}
