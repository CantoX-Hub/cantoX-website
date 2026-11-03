"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Cinzel, Inter, Montez } from "next/font/google";

const script = Montez({ weight: "400", subsets: ["latin"] });
const caps = Cinzel({ weight: ["400", "700"], subsets: ["latin"] });
const heroText = Inter({ weight: ["300", "500"], subsets: ["latin"] });

const ASSET = "/templates/itunu-stephen";

const rsvps = [
  {
    title: "Mrs. Adeniyi",
    phone: "+234 708 153 3518",
    avatar: `${ASSET}/avatar-mrs.png`,
  },
  {
    title: "Mr. Seun",
    phone: "+234 704 744 9565",
    avatar: `${ASSET}/avatar-mr.png`,
  },
];

const gifts = [
  {
    label: "Kuda Bank",
    value: "2006115821",
    note: "Ojosipe Itunu H",
    logo: `${ASSET}/kuda.png`,
  },
  {
    label: "International Transfer",
    sub: "Zelle",
    value: "Stephentemi226@gmail.com",
    logo: `${ASSET}/zelle.png`,
  },
];

const couplePhotos = [
  `${ASSET}/couple-1.jpg`,
  `${ASSET}/couple-2.jpg`,
  `${ASSET}/couple-3.jpg`,
];

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (insecure context / permissions); fail quietly
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      className="shrink-0 text-[#6BB52F] transition-opacity hover:opacity-70"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function Names({ className = "" }: { className?: string }) {
  return (
    <h1
      aria-label="Itunu and Stephen"
      className={`${script.className} flex flex-col items-center leading-none ${className}`}
    >
      <span aria-hidden="true">Itunu</span>
      <span aria-hidden="true" className="text-[0.32em] leading-none">
        &amp;
      </span>
      <span aria-hidden="true">Stephen</span>
    </h1>
  );
}

export default function ItunuStephenInvite() {
  const scrollToDetails = () => {
    document.getElementById("details")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white text-[#121A47]">
      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0D1B3E]">
        <div className="absolute inset-x-0 top-0 h-[55%] md:left-1/2 md:h-[640px] md:w-[900px] md:-translate-x-1/2 md:[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <div className="relative h-full w-full md:[mask-image:linear-gradient(to_bottom,black_78%,transparent)]">
            <Image
              src={`${ASSET}/hero.jpg`}
              alt=""
              fill
              priority
              className="object-cover object-top"
              sizes="(min-width: 768px) 900px, 100vw"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-[40%] to-[#0D1B3E] to-[62%] md:hidden" />

        <div className="relative mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-end px-6 pb-10 pt-24 md:max-w-[1100px] md:items-center md:px-10 md:pb-16">
          <Names className="mb-14 self-center text-[100px] text-white md:mb-20 md:text-[168px]" />

          <div className={`${heroText.className} w-full md:max-w-[640px] md:text-center`}>
            <p className="text-[20px] font-medium italic text-white md:text-[26px]">Hello, 🎉😍</p>
            <p className="mt-1 text-[36px] font-light leading-[1.1] text-white md:text-[52px]">
              We are doing
              <br />
              forever together.
            </p>
            <p className="mt-6 text-[12px] font-light text-white md:text-[16px]">
              If you are seeing this, you have been invited
            </p>

            <button
              type="button"
              onClick={scrollToDetails}
              className="mt-6 flex h-[54px] w-full items-center justify-center rounded-full border border-white/10 bg-white/10 text-[13px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 md:mx-auto md:max-w-[320px]"
            >
              Scroll down
            </button>
          </div>
        </div>
      </section>

      {/* Invitation */}
      <section
        id="details"
        className={`mx-auto flex w-full max-w-[640px] scroll-mt-4 flex-col items-center px-6 pb-8 pt-16 text-center md:pt-24`}
      >
        <p className={`${script.className} text-[14px] md:text-[20px]`}>
          The families of
        </p>
        <p className={`${caps.className} mt-3 text-[12px] font-bold uppercase leading-[1.5] md:text-[16px]`}>
          Mr and Mrs Adewale Olufemi Ojosipe
          <br />
          and Anuoluwapo Latifat Ojosipe
        </p>
        <p className={`${script.className} my-2 text-[14px] md:text-[20px]`}>
          &amp;
        </p>
        <p className={`${caps.className} text-[12px] font-bold uppercase leading-[1.5] md:text-[16px]`}>
          Late Mr Olahipekun Oworeye Smith
          <br />
          Late Deaconess Christiana Folashade Omoniyi
        </p>
        <p className={`${script.className} mt-5 text-[14px] md:text-[20px]`}>
          cordially invites you to the
        </p>
        <p className={`${script.className} text-[18px] md:text-[26px]`}>
          Wedding Ceremony of their children
        </p>

        <Names className="my-14 text-[100px] text-[#121A47] md:my-20 md:text-[150px]" />

        <p className={`${script.className} text-[16px] md:text-[24px]`}>Date</p>
        <p className={`${caps.className} text-[15px] uppercase md:text-[24px]`}>
          Wednesday, March 11th, 2026
        </p>
        <p className={`${script.className} mt-5 text-[16px] md:text-[24px]`}>Time</p>
        <p className={`${caps.className} text-[15px] uppercase md:text-[24px]`}>12:30pm prompt</p>
        <p className={`${script.className} mt-5 text-[16px] md:text-[24px]`}>Venue</p>
        <p className={`${caps.className} text-[12px] font-bold md:text-[17px]`}>
          22 IGBOBI COLLEGE ROAD,
        </p>
        <p className={`${caps.className} text-[10px] uppercase md:text-[14px]`}>
          Along WAEC road Fadeyi Lagos.
        </p>
      </section>

      {/* RSVP + Gifts */}
      <section className="mx-auto grid w-full max-w-[640px] gap-10 px-6 py-12 md:max-w-[1000px] md:grid-cols-2 md:gap-14 md:py-20">
        <div>
          <h2 className="mb-4 text-[18px] font-bold text-[#121A47]">R.S.V.P</h2>
          <div className="flex flex-col gap-3">
            {rsvps.map((person) => (
              <div
                key={person.title}
                className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-[0_4px_18px_rgba(18,26,71,0.08)]"
              >
                <Image
                  src={person.avatar}
                  alt=""
                  width={80}
                  height={80}
                  className="h-[60px] w-[60px] shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium">{person.title}</p>
                  <p className="mt-1 text-[10px] text-[#6B7280]">Contact:</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${person.phone.replace(/\s/g, "")}`}
                      className="text-[15px] font-bold"
                    >
                      {person.phone}
                    </a>
                    <CopyButton value={person.phone} label={`${person.title}'s number`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-[18px] font-bold text-[#121A47]">Send Gifts</h2>
          <div className="flex flex-col gap-3">
            {gifts.map((gift) => (
              <div
                key={gift.label}
                className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-[0_4px_18px_rgba(18,26,71,0.08)]"
              >
                <Image
                  src={gift.logo}
                  alt=""
                  width={72}
                  height={72}
                  className="h-[60px] w-[60px] shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[12px]">{gift.label}</p>
                  {gift.sub && <p className="mt-1 text-[13px] font-medium">{gift.sub}</p>}
                  <div className="flex items-center gap-2">
                    <p className="break-all text-[15px] font-bold">{gift.value}</p>
                    <CopyButton value={gift.value} label={gift.label} />
                  </div>
                  {gift.note && (
                    <p className="mt-1 text-[12px] text-[#6B7280]">{gift.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-2 px-4 pb-16 md:max-w-[1100px] md:flex-row md:items-start md:justify-center md:gap-4 md:pb-24">
        {couplePhotos.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Itunu and Stephen, photo ${index + 1}`}
            width={350}
            height={330}
            className="h-auto w-full max-w-[350px] md:w-1/3"
          />
        ))}
      </section>
    </main>
  );
}
