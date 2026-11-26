"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";
import { AlertTriangle, ChevronLeft, Download, Upload } from "lucide-react";
import { useAddGuestsMutation, useGetGuestListQuery } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import { useToast } from "../Toast";
import { Panel } from "../ui";
import { TEMPLATE_CSV, parseCsv, rowsToGuests, type UploadRow } from "./csv";
import { GuestAvatar, TableChip } from "./shared";

const MAX_FILE_MB = 2;

function downloadTemplate() {
  const url = URL.createObjectURL(new Blob([TEMPLATE_CSV], { type: "text/csv" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "canto-guest-list-template.csv" });
  a.click();
  URL.revokeObjectURL(url);
}

export default function BulkUpload({ id }: { id: string }) {
  const router = useRouter();
  const notify = useToast();
  const { data: list, isLoading } = useGetGuestListQuery(id);
  const [addGuests, { isLoading: saving }] = useAddGuestsMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<UploadRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const back = `/dashboard/guests/${encodeURIComponent(id)}`;

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress size={28} aria-label="Loading guest list" />
      </div>
    );
  }
  if (!list) {
    return (
      <Panel className="flex flex-col items-center px-6 py-16 text-center">
        <p className="text-[16px] font-semibold">This guest list doesn&apos;t exist</p>
        <Button component={Link} href="/dashboard/guests" variant="contained" sx={{ mt: 3 }}>
          Back to guests
        </Button>
      </Panel>
    );
  }

  const read = async (file: File | undefined) => {
    setFileError("");
    if (!file) return;
    if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
      setFileError("Please upload a .csv file. In Excel or Google Sheets, use File › Save as / Download › CSV.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`The file must be ${MAX_FILE_MB}MB or smaller.`);
      return;
    }
    const parsed = rowsToGuests(parseCsv(await file.text()), list);
    if (parsed.length === 0) {
      setFileError("We couldn't find any guests in that file. Check it has a name and contact column.");
      return;
    }
    setFileName(file.name);
    setRows(parsed);
  };

  const ok = rows?.filter((r) => !r.error) ?? [];
  const bad = rows?.filter((r) => r.error) ?? [];
  const spaceLeft = list.expectedGuests - list.guests.length;
  const overCapacity = ok.length > spaceLeft;

  const submit = async () => {
    try {
      await addGuests({ id, guests: ok.map((r) => r.guest) }).unwrap();
      notify(`${ok.length} guest${ok.length === 1 ? "" : "s"} added`);
      router.push(back);
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  return (
    <>
      <Button component={Link} href={back} startIcon={<ChevronLeft size={16} />} sx={{ bgcolor: "#F1F4F8", color: "#0F0F0F", "&:hover": { bgcolor: "#E5EAF1" } }}>
        Back
      </Button>
      <h1 className="mb-6 mt-6 text-[22px] text-[#0F0F0F] sm:text-[24px]">Bulk upload guests</h1>

      <div className="max-w-[940px]">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[14px] font-medium text-[#0F0F0F]">
            Guest list <span className="font-normal text-[#6B7280]">(CSV)</span>
          </p>
          <button type="button" onClick={downloadTemplate} className="flex items-center gap-1.5 text-[13px] font-medium text-[#C99532] hover:underline">
            <Download size={14} /> Download template
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), inputRef.current?.click())}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            read(e.dataTransfer.files[0]);
          }}
          aria-describedby="upload-hint"
          className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed px-4 py-7 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532] ${
            dragging ? "border-[#C99532] bg-[#FFFBF3]" : "border-[#E2E5EA] hover:bg-[#F8F9FB]"
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E2E5EA] bg-white">
            <Upload size={18} />
          </span>
          <p className="mt-3 text-[15px] font-medium text-[#0F0F0F]">{fileName ? `${fileName} · choose another file` : "Drag and Drop Files or Browse"}</p>
          <p id="upload-hint" className="mt-1.5 text-[13px] text-[#6B7280]">
            CSV with columns: name, contact (phone or email), table and side (optional)
          </p>
          <input ref={inputRef} type="file" accept=".csv,text/csv" hidden onChange={(e) => (read(e.target.files?.[0]), (e.target.value = ""))} />
        </div>
        {fileError && (
          <p role="alert" className="mt-2 text-[13px] text-[#D32F2F]">
            {fileError}
          </p>
        )}

        {rows && (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px]">
              <span className="font-medium text-[#0F0F0F]">
                {ok.length} guest{ok.length === 1 ? "" : "s"} ready
              </span>
              {bad.length > 0 && (
                <span className="text-[#B91C1C]">
                  {bad.length} row{bad.length === 1 ? "" : "s"} will be skipped
                </span>
              )}
              <span className="text-[#6B7280]">
                {spaceLeft} space{spaceLeft === 1 ? "" : "s"} left of {list.expectedGuests}
              </span>
            </div>
            {overCapacity && (
              <p role="alert" className="mt-3 rounded-md bg-[#FDE8E8] px-3 py-2 text-[13px] text-[#B91C1C]">
                This file has {ok.length} guests but only {spaceLeft} fit your capacity. Edit capacity on the guest list, or remove rows from the file.
              </p>
            )}

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8F9FB] text-[14px] text-[#374151]">
                    <th scope="col" className="px-4 py-4 font-medium">Guest[s]</th>
                    <th scope="col" className="px-2 py-4 font-medium">Contact</th>
                    <th scope="col" className="px-2 py-4 font-medium">Table</th>
                    <th scope="col" className="px-2 py-4 font-medium">
                      <span className="sr-only">Notes</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.line} className={`border-b border-[#E8E8EC] text-[14px] ${r.error ? "bg-[#FFF7F7] text-[#9CA3AF]" : ""}`}>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-3">
                          <GuestAvatar name={r.guest.name || "?"} />
                          <span className={r.error ? "" : "text-[#0F0F0F]"}>{r.guest.name || <em>No name</em>}</span>
                        </span>
                      </td>
                      <td className="px-2 py-4">{r.guest.contact || "—"}</td>
                      <td className="px-2 py-4">{r.guest.tableId ? <TableChip name={r.tableLabel} /> : <span className="text-[13px] text-[#9CA3AF]">Not assigned</span>}</td>
                      <td className="px-2 py-4 text-[12px]">
                        {(r.error || r.warning) && (
                          <span className={`flex items-start gap-1.5 ${r.error ? "text-[#B91C1C]" : "text-[#B45309]"}`}>
                            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                            Row {r.line}: {r.error ?? r.warning}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button component={Link} href={back} variant="outlined" color="inherit" sx={{ borderColor: "#D1D5DB" }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={submit} disabled={saving || ok.length === 0 || overCapacity}>
                {saving ? "Adding…" : `Add ${ok.length} guest${ok.length === 1 ? "" : "s"}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
