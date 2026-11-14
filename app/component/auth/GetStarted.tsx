"use client";

import { type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { GOOGLE_AUTH_URL, useRequestMagicLinkMutation } from "@/app/services/api";
import { getErrorMessage, isWakingError, wakeBackend } from "@/app/services/baseQuery";
import { ROUTES } from "@/app/lib/routes";
import { PENDING_EMAIL_KEY } from "./CheckEmail";

/** Each slide drives both the image on the right and the heading on the left */
const CAROUSEL_SLIDES = [
  {
    id: 1,
    src: "/get-started-couple.jpg",
    alt: "Bride and groom smiling at each other on their wedding day",
    title: "Your love story deserves a beautiful beginning.",
    description:
      "Create a wedding experience that feels entirely yours. From your wedding website and guest list to RSVPs and gifts, bring every detail of your special day together in one beautiful place.",
  },
  {
    id: 2,
    // TODO(design): swap for the calendar image from the design
    src: "/get-started-couple-2.png",
    alt: "Calendar with dates pinned for upcoming weddings",
    title: "Great celebrations begin with great planning.",
    description:
      "Bring your clients' visions to life with less complexity and more control. Manage wedding projects, coordinate guest experiences, and keep every important detail organized from the first conversation to the final celebration.",
  },
  {
    id: 3,
    // TODO(design): swap for the bridal mannequins image from the design
    src: "/get-started-couple-3.png",
    alt: "Wedding gowns on display in a bridal boutique",
    title: "Let your work find its next big moment.",
    description:
      "Your creativity deserves to be seen. Showcase your services, build your professional presence, and connect with couples and planners looking for the people who make extraordinary celebrations possible.",
  },
  {
    id: 4,
    // TODO(design): swap for the guest list dashboard image from the design
    src: "/get-started-couple-4.png",
    alt: "Canto guest list dashboard showing confirmed and pending guests",
    title: "Know who's coming. Plan with confidence.",
    description:
      "Manage your guest list, track responses, and keep every invitation accounted for. A more organized way to bring your people together.",
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "Remember me" keeps only the email address on this device, so it's pre-filled next time */
const REMEMBERED_EMAIL_KEY = "cantox:remembered-email";

export default function GetStarted() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  /** True while waiting for a sleeping backend to start before retrying */
  const [waking, setWaking] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
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

  // Wake a sleeping backend while the user is still typing
  useEffect(() => {
    wakeBackend();
  }, []);

  // Pre-fill a remembered email (after mount, so the first render matches the server)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (saved) setEmail(saved);
    } catch {
      // Storage blocked: start with an empty field
    }
  }, []);

  const saveRememberedEmail = (address: string) => {
    try {
      if (rememberMe) window.localStorage.setItem(REMEMBERED_EMAIL_KEY, address);
      else window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    } catch {
      // Storage blocked: nothing to remember
    }
  };

  const sendLink = async (address: string) => {
    try {
      try {
        await requestMagicLink({ email: address }).unwrap();
      } catch (error) {
        // Server was asleep: wait for it to wake, then try once more
        if (!isWakingError(error)) throw error;
        setWaking(true);
        await wakeBackend();
        reset();
        await requestMagicLink({ email: address }).unwrap();
      } finally {
        setWaking(false);
      }
      try {
        sessionStorage.setItem(PENDING_EMAIL_KEY, address);
      } catch {
        // Storage blocked: the next page falls back to "your email"
      }
      router.push(ROUTES.checkEmail);
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
    saveRememberedEmail(trimmed);
    sendLink(trimmed);
  };

  const apiError = requestError ? getErrorMessage(requestError) : null;
  const slide = CAROUSEL_SLIDES[currentSlide];

  return (
    <div className="py-4">
      <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden maxContainer bg-white px-5 sm:px-[5%]">
        <Link href="/" aria-label="Canto home" className="absolute left-5 top-6 z-20 sm:left-[5vw] sm:top-8">
          <Image src="/logo.svg" alt="Canto" width={150} height={20} priority className="h-auto w-[96px] sm:w-[150px]" />
        </Link>

        <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 lg:grid-cols-[45%_55%]">
          {/* LEFT — FORM */}
          <section className="relative z-10 flex items-center pb-16 pt-20 lg:pt-28">
            <div className="w-full max-w-[467px]">
              {/* Heading: changes with the carousel slide (min height stops the form jumping) */}
              <div className="mb-5 min-h-[150px] sm:min-h-[170px]" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <h1 className="max-w-[440px] text-[24px] leading-tight tracking-[-0.01em] text-[#060D18] sm:text-[32px]">
                      {slide.title}
                    </h1>
                    <p className="mt-3 text-[12px] leading-5 text-[#6B7280]">{slide.description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ---------- Sign-in options ---------- */}
              <div>
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
                      placeholder="youremail@gmail.com"
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
                    disabled={isLoading || waking}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#C99532] text-xs font-medium text-white transition-all hover:bg-[#B78628] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {(isLoading || waking) && <Spinner />}
                    {waking ? "Connecting, this can take a moment…" : isLoading ? "Sending link…" : "Continue"}
                  </button>

                  <label className="flex w-fit cursor-pointer select-none items-center gap-2 pt-1 text-[11px] text-[#5B616B]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-[#D9DDE3] bg-white text-white transition-colors peer-checked:border-[#90A1B9] peer-checked:bg-[#90A1B9] peer-focus-visible:ring-2 peer-focus-visible:ring-[#90A1B9]/30"
                    >
                      {rememberMe && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    Remember me
                  </label>
                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                  <span className="text-[14px] text-[#9CA1A9] font-medium">or</span>
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
              </div>
            </div>
          </section>

          {/* RIGHT — ANIMATED CAROUSEL */}
          <section
            aria-roledescription="carousel"
            aria-label="What you can do with Canto"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative hidden h-full overflow-hidden rounded-md lg:block"
          >
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {CAROUSEL_SLIDES.map((item, index) => (
                <div key={item.id} aria-hidden={index !== currentSlide} className="relative h-full w-full flex-shrink-0">
                  <Image
                    src={item.src}
                    alt={item.alt}
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
