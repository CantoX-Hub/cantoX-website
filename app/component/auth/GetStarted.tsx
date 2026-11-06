"use client";

import { type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { GOOGLE_AUTH_URL, useRequestMagicLinkMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";

const CAROUSEL_SLIDES = [
  { id: 1, src: "/get-started-couple.jpg", alt: "Happy couple celebrating their wedding" },
  { id: 2, src: "/get-started-couple-2.jpg", alt: "Bride and groom smiling on their wedding day" },
  { id: 3, src: "/get-started-couple-3.jpg", alt: "Wedding guests celebrating at the reception" },
  { id: 4, src: "/get-started-couple-4.jpg", alt: "Wedding venue decorated for the celebration" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Seconds before "Resend link" can be pressed again */
const RESEND_COOLDOWN = 30;

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

export default function GetStarted() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [requestMagicLink, { isLoading, error: requestError, reset }] = useRequestMagicLinkMutation();

  /* ---------- Carousel (pauses on hover and for reduced motion) ---------- */
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduceMotion) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  /* ---------- Resend countdown ---------- */
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // Back to the previous page; home if there isn't one (opened in a new tab or from a link)
  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const sendLink = async (address: string) => {
    try {
      await requestMagicLink({ email: address }).unwrap();
      setSentTo(address);
      setCooldown(RESEND_COOLDOWN);
    } catch {
      // Shown below from requestError
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError(trimmed ? "Enter a valid email address." : "Enter your email address.");
      return;
    }
    setEmailError(null);
    sendLink(trimmed);
  };

  const switchEmail = () => {
    setSentTo(null);
    setCooldown(0);
    reset();
  };

  const apiError = requestError ? getErrorMessage(requestError) : null;

  return (
    <div className="py-4">
      <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden maxContainer bg-white px-5 sm:px-[5%]">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back to previous page"
          className="group absolute left-5 top-6 z-20 flex items-center gap-1.5 text-[#11151D] transition-colors hover:text-[#11151d80] sm:left-[5vw] sm:top-7"
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          <span className="font-['Cal_Sans',sans-serif] md:text-[24px]">Back</span>
        </button>

        <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 lg:grid-cols-[45%_55%]">
          {/* LEFT — FORM */}
          <section className="relative z-10 flex items-center pb-16 pt-20 lg:pt-10">
            <div className="w-full max-w-[467px]">
              {/* Heading */}
              <div className="mb-7">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-[24px] leading-tight tracking-[-0.005em] sm:text-[32px]">Do more with</h1>
                  <Link href="/">
                    <Image src="/logo.svg" alt="Canto" width={194} height={32} priority />
                  </Link>
                </div>
                <p className="mt-2 max-w-[447px] text-[12px] leading-5 text-[#060D18]">
                  Create beautiful wedding invitations and manage your special moments with Canto.
                </p>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {sentTo ? (
                  /* ---------- Link sent ---------- */
                  <motion.div key="sent" {...fade} aria-live="polite">
                    <div className="rounded-[6px] border border-[#F1E4CC] bg-[#FFF9F0] p-5">
                      <motion.span
                        initial={{ scale: 0.6, rotate: -12 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C99532]/15"
                      >
                        <Mail className="h-5 w-5 text-[#C99532]" aria-hidden="true" />
                      </motion.span>
                      <h2 className="mt-3 text-lg text-[#11151D]">Check your email</h2>
                      <p className="mt-1 text-[12px] leading-5 text-[#4B5563]">
                        We sent a sign-in link to <span className="font-medium text-[#11151D]">{sentTo}</span>. Open it
                        on this device to continue. It can take a minute to arrive, so check your spam folder too.
                      </p>
                    </div>

                    {apiError && (
                      <p role="alert" className="mt-3 text-xs text-red-600">
                        {apiError}
                      </p>
                    )}

                    <button
                      type="button"
                      disabled={cooldown > 0 || isLoading}
                      onClick={() => sendLink(sentTo)}
                      className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#C99532] text-xs font-medium text-white transition-all hover:bg-[#B78628] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading && <Spinner />}
                      {isLoading ? "Sending…" : cooldown > 0 ? `Resend link in ${cooldown}s` : "Resend link"}
                    </button>
                    <button
                      type="button"
                      onClick={switchEmail}
                      className="mt-2 h-10 w-full rounded-[4px] bg-[#F2F5F8] text-xs font-bold text-[#11151D] transition-colors hover:bg-[#E9EDF2]"
                    >
                      Use a different email
                    </button>
                  </motion.div>
                ) : (
                  /* ---------- Sign-in options ---------- */
                  <motion.div key="form" {...fade}>
                    <form onSubmit={handleSubmit} noValidate className="space-y-3">
                      <div>
                        <label htmlFor="email" className="mb-1.5 block text-[11px] font-medium text-[#252A33]">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            if (emailError) setEmailError(null);
                            if (requestError) reset();
                          }}
                          aria-invalid={!!(emailError || apiError) || undefined}
                          aria-describedby={emailError || apiError ? "email-error" : undefined}
                          className={`h-10 w-full rounded-[4px] border bg-white px-3 text-base text-[#11151D] outline-none transition-all placeholder:text-[#A7ACB4] focus:border-[#C99532] focus:ring-2 focus:ring-[#C99532]/10 sm:text-xs ${
                            emailError || apiError ? "border-red-400" : "border-[#D9DDE3]"
                          }`}
                        />
                        <AnimatePresence initial={false}>
                          {(emailError || apiError) && (
                            <motion.p
                              id="email-error"
                              role="alert"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="mt-1.5 text-xs text-red-600"
                            >
                              {emailError ?? apiError}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#C99532] text-xs font-medium text-white transition-all hover:bg-[#B78628] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoading && <Spinner />}
                        {isLoading ? "Sending link…" : "Continue"}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="my-5 flex items-center gap-3">
                      <div className="h-px flex-1 bg-[#E5E7EB]" />
                      <span className="text-xs text-[#9CA1A9]">or</span>
                      <div className="h-px flex-1 bg-[#E5E7EB]" />
                    </div>

                    {/* Google: full-page redirect to the backend OAuth route */}
                    <a
                      href={GOOGLE_AUTH_URL}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#F2F5F8] text-xs font-bold text-[#11151D] transition-colors hover:bg-[#E9EDF2]"
                    >
                      <Image src="/google.svg" alt="" width={18} height={18} />
                      Continue with Google
                    </a>

                    {/* No Apple endpoint on the backend yet */}
                    <button
                      type="button"
                      disabled
                      title="Apple sign-in is coming soon"
                      className="mt-2 flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-[4px] bg-[#F2F5F8] text-xs font-bold text-[#11151D] opacity-50"
                    >
                      <Image src="/apple.svg" alt="" width={18} height={18} />
                      Continue with Apple
                      <span className="font-normal text-[#6B7280]">(soon)</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* RIGHT — ANIMATED CAROUSEL */}
          <section
            aria-roledescription="carousel"
            aria-label="Wedding moments"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative hidden h-full overflow-hidden rounded-md lg:block"
          >
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {CAROUSEL_SLIDES.map((slide, index) => (
                <div key={slide.id} aria-hidden={index !== currentSlide} className="relative h-full w-full flex-shrink-0">
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

            {/* Bottom gradient for indicator readability */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Carousel indicators */}
            <div className="absolute bottom-8 left-1/2 z-20 flex w-full -translate-x-1/2 justify-center px-12">
              <div className="flex w-full max-w-[360px] items-center gap-2">
                {CAROUSEL_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={currentSlide === index ? "true" : undefined}
                    className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/30 transition-all hover:bg-white/50"
                  >
                    <div
                      className={`h-full w-full rounded-full bg-[#C99532] transition-transform duration-500 ease-out ${
                        currentSlide === index ? "translate-x-0" : "-translate-x-full"
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
  );
}

function Spinner() {
  return (
    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
  );
}
