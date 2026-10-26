"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CAROUSEL_SLIDES = [
  {
    id: 1,
    src: "/get-started-couple.jpg",
    alt: "Happy couple celebrating their wedding",
  },
  {
    id: 2,
    src: "/get-started-couple-2.jpg",
    alt: "Bride and groom smiling on their wedding day",
  },
  {
    id: 3,
    src: "/get-started-couple-3.jpg",
    alt: "Wedding venue and celebration details",
  },
  {
    id: 4,
    src: "/get-started-couple-4.jpg",
    alt: "Wedding venue and celebration details",
  },
];

export default function GetStarted() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <main className="min-h-screen">
      <div className="py-4">
        <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden maxContainer px-5 sm:px-[5%] bg-white">
          {/* Back Button */}
          <Link
            href="/"
            aria-label="Go back to home"
            className="absolute left-6 top-6 z-20 flex items-center gap-1.5 text-xs font-medium text-[#11151D] transition-colors hover:text-[#C99532] sm:left-8 sm:top-7"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>

          <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 lg:grid-cols-[45%_55%]">
            {/* LEFT — FORM */}
            <section className="relative z-10 flex items-center px-6 pb-16 pt-20 sm:px-10 lg:pt-10">
              <div className="w-full max-w-[390px]">
                {/* Heading */}
                <div className="mb-7">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-[24px] leading-tight tracking-[-0.005em] sm:text-[32px]">
                      Do more with
                    </h1>
                    <Link href="/">
                      <Image
                        src="/logo.svg"
                        alt="Canto"
                        width={105}
                        height={32}
                        priority
                      />
                    </Link>
                  </div>

                  <p className="mt-2 max-w-[340px] text-[12px] leading-5 text-[#777D87]">
                    Create beautiful wedding invitations and manage your special
                    moments with Canto.
                  </p>
                </div>

                {/* Email Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: move to next authentication step
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-[11px] font-medium text-[#252A33]"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="
                        h-10
                        w-full
                        rounded-[4px]
                        border
                        border-[#D9DDE3]
                        bg-white
                        px-3
                        text-xs
                        text-[#11151D]
                        outline-none
                        transition-all
                        placeholder:text-[#A7ACB4]
                        focus:border-[#C99532]
                        focus:ring-2
                        focus:ring-[#C99532]/10
                      "
                    />
                  </div>

                  {/* Continue */}
                  <button
                    type="submit"
                    className="
                      h-10
                      w-full
                      rounded-[4px]
                      bg-[#C99532]
                      text-xs
                      font-medium
                      text-white
                      transition-all
                      hover:bg-[#B78628]
                      active:scale-[0.99]
                    "
                  >
                    Continue
                  </button>
                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                  <span className="text-xs text-[#9CA1A9]">or</span>
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  className="
                    flex
                    h-10
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[4px]
                    bg-[#F2F5F8]
                    text-xs
                    font-bold
                    transition-colors
                    hover:bg-[#E9EDF2]
                  "
                >
                  <Image
                    src="/google.svg"
                    alt="google"
                    width={18}
                    height={18}
                    priority
                  />
                  Continue with Google
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="
                    mt-2
                    flex
                    h-10
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[4px]
                    bg-[#F2F5F8]
                    text-xs
                    font-bold
                    transition-colors
                    hover:bg-[#E9EDF2]
                  "
                >
                  <Image
                    src="/apple.svg"
                    alt="apple"
                    width={18}
                    height={18}
                    priority
                  />
                  Continue with Apple
                </button>

                {/* Terms */}
                <p className="mt-6 text-center text-[9px] leading-4 text-[#A0A5AD]">
                  By continuing, you agree to Canto&apos;s{" "}
                  <Link
                    href="/terms"
                    className="underline underline-offset-2 hover:text-[#C99532]"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-2 hover:text-[#C99532]"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* RIGHT — ANIMATED CAROUSEL */}
            <section className="relative hidden h-full overflow-hidden rounded-md lg:block">
              {/* Sliding Track */}
              <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {CAROUSEL_SLIDES.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="relative h-full w-full flex-shrink-0"
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 0vw, 55vw"
                    />
                  </div>
                ))}
              </div>

              {/* Bottom Gradient for indicator readability */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Carousel Indicators */}
              <div className="absolute bottom-8 left-1/2 z-20 flex w-full -translate-x-1/2 justify-center px-12">
                <div className="flex w-full max-w-[360px] items-center gap-2">
                  {CAROUSEL_SLIDES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className="group relative h-1 flex-1 overflow-hidden rounded-full bg-white/30 transition-all hover:bg-white/50"
                    >
                      <div
                        className={`h-full w-full rounded-full bg-[#C99532] transition-transform duration-500 ease-out ${
                          currentSlide === index
                            ? "translate-x-0"
                            : "-translate-x-full"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}