"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle } from "lucide-react";
import { useLookupRsvpQuery, useRespondRsvpMutation } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";

/** Page guests open from the shared RSVP link: find yourself, then accept or decline */
export default function PublicRsvp({ id }: { id: string }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const { data, isFetching, error } = useLookupRsvpQuery({ id, query }, { skip: !query });
  // Fetch the list name even before searching
  const { data: intro, error: introError } = useLookupRsvpQuery({ id, query: "" });
  const [respond, { isLoading: saving, error: respondError }] = useRespondRsvpMutation();
  const [answered, setAnswered] = useState<"confirmed" | "declined" | null>(null);

  const guest = data?.guest;
  const info = data ?? intro;
  const missing = hasStatus(introError, 404) || hasStatus(error, 404);

  const answer = async (status: "confirmed" | "declined") => {
    if (!guest) return;
    try {
      await respond({ id, guestId: guest.id, status }).unwrap();
      setAnswered(status);
    } catch {
      /* shown below */
    }
  };

  return (
    <main className="min-h-screen bg-white px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[760px]">
        <header className="relative flex items-center justify-between overflow-hidden rounded-xl bg-[#060D18] px-6 py-6 sm:px-10 sm:py-8">
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(115deg,transparent_45%,rgba(255,255,255,0.08)_52%,transparent_58%,rgba(255,255,255,0.05)_66%,transparent_72%)]" />
          <h1 className="relative text-[52px] leading-none text-white sm:text-[76px]" style={{ fontFamily: '"Carattere", cursive' }}>
            RSVP
          </h1>
          <div className="relative text-right">
            <p className="text-[11px] text-white/80 sm:text-[13px]">Powered by:</p>
            <Image src="/canto-white.svg" alt="canto" width={146} height={40} className="mt-1 h-auto w-[84px] sm:w-[130px]" />
          </div>
        </header>

        <section className="mt-6 rounded-2xl bg-[#F3F8FC] px-5 py-10 text-center sm:px-10">
          {missing ? (
            <>
              <p className="text-[18px] font-semibold text-[#0F0F0F]">This RSVP link isn&apos;t available</p>
              <p className="mt-2 text-[14px] text-[#6B7280]">The link may be wrong, or the guest list was removed. Please check with your hosts.</p>
            </>
          ) : answered ? (
            <div className="flex flex-col items-center">
              {answered === "confirmed" ? <CheckCircle2 size={44} className="text-[#16A34A]" /> : <XCircle size={44} className="text-[#9CA3AF]" />}
              <p className="mt-4 text-[20px] font-semibold text-[#0F0F0F]">{answered === "confirmed" ? "See you there!" : "Thanks for letting us know"}</p>
              <p className="mt-2 text-[14px] text-[#4B5563]">
                {answered === "confirmed" ? `We've saved your seat${guest?.table ? ` at ${guest.table}` : ""}.` : "Your hosts will miss you. Your reply has been saved."}
              </p>
              <button type="button" onClick={() => setAnswered(null)} className="mt-5 text-[13px] font-medium text-[#C99532] hover:underline">
                Change my answer
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-[24px] font-semibold text-[#0F0F0F]" style={{ fontFamily: '"Cal Sans", "DM Sans", sans-serif' }}>
                {info?.eventLabel ?? info?.listName ?? "You're invited"}
              </h2>
              <p className="mx-auto mt-2 max-w-[440px] text-[14px] text-[#374151]">Enter your full name or the phone number / email your invite was sent to.</p>

              <form
                className="mx-auto mt-6 flex max-w-[460px] flex-col gap-2 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  setQuery(input.trim());
                }}
              >
                <label htmlFor="rsvp-find" className="sr-only">
                  Your name, phone or email
                </label>
                <input
                  id="rsvp-find"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="eg. Precious Abiodun or 0818 829 8033"
                  autoComplete="name"
                  className="h-11 flex-1 rounded-md border border-[#D1D5DB] bg-white px-3 text-[14px] outline-none focus:border-[#C99532] focus:ring-2 focus:ring-[#C99532]/20"
                />
                <button type="submit" disabled={!input.trim() || isFetching} className="h-11 rounded-md bg-[#060D18] px-5 text-[14px] font-semibold text-white disabled:opacity-60">
                  {isFetching ? "Finding…" : "Find my invite"}
                </button>
              </form>

              {query && !isFetching && data && !guest && (
                <p role="status" className="mt-5 text-[14px] text-[#B45309]">
                  We couldn&apos;t find “{query}” on the guest list. Try your full name as written on the invite, or contact your hosts.
                </p>
              )}
              {error && !hasStatus(error, 404) && <p className="mt-5 text-[14px] text-[#B91C1C]">{getErrorMessage(error)}</p>}

              {guest && (
                <div className="mx-auto mt-6 max-w-[460px] rounded-xl bg-white p-6 text-left shadow-sm">
                  <p className="text-[13px] text-[#6B7280]">Invitation for</p>
                  <p className="text-[20px] font-semibold text-[#0F0F0F]">{guest.name}</p>
                  {guest.table && <p className="mt-1 text-[14px] text-[#4B5563]">Seated at {guest.table}</p>}
                  {(guest.status === "confirmed" || guest.status === "declined") && (
                    <p className="mt-3 rounded-md bg-[#F3F4F6] px-3 py-2 text-[13px] text-[#374151]">
                      You already {guest.status === "confirmed" ? "accepted" : "declined"}. You can change your answer below.
                    </p>
                  )}
                  <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => answer("confirmed")} disabled={saving} className="rounded-md bg-[#C99532] py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
                      Joyfully accept
                    </button>
                    <button type="button" onClick={() => answer("declined")} disabled={saving} className="rounded-md bg-[#EAF3FB] py-2.5 text-[14px] font-semibold text-[#0F0F0F] transition-colors hover:bg-[#DDEBF8] disabled:opacity-60">
                      Regretfully decline
                    </button>
                  </div>
                  {respondError && <p className="mt-3 text-[13px] text-[#B91C1C]">{getErrorMessage(respondError)}</p>}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
