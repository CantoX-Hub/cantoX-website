"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Apple } from "lucide-react";

export default function GetStarted() {
  return (
    <main className="min-h-screen">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[calc(100vh-2rem)] max-w-[1400px] overflow-hidden rounded-sm bg-white">
          
          {/* Gold decorative shape */}
          {/* <div className="pointer-events-none absolute bottom-[-100px] left-[-40px] h-[180px] w-[300px] rounded-[50%] border-[45px] border-[#C99532] opacity-90" /> */}

          {/* Back */}
          <Link
            href="/"
            className="absolute left-6 top-6 z-20 flex items-center gap-1.5 text-xs font-medium text-[#11151D] transition-colors hover:text-[#C99532] sm:left-8 sm:top-7"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>

          <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 lg:grid-cols-[45%_55%]">
            
            {/* LEFT — FORM */}
            <section className="relative z-10 flex items-center justify-center px-6 pb-16 pt-20 sm:px-10 lg:px-14 lg:pt-10">
              <div className="w-full max-w-[390px]">
                
                {/* Logo */}
                

                {/* Heading */}
                <div className="mb-7">
                <div><div className="flex gap-1"> <h1 className="text-[24px] sm:text-[32px] font-semibold leading-tight tracking-[-0.005em]">
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
                </div></div>
                 

                  <p className="mt-2 max-w-[340px] text-[12px] leading-5 text-[#777D87]">
                    Create beautiful wedding invitations and manage your
                    special moments with Canto.
                  </p>
                </div>

                {/* Email */}
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
                  <span className="text-xs text-[#9CA1A9]">
                    or
                  </span>
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
                  By continuing, you agree to Canto's{" "}
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

            {/* RIGHT — IMAGE */}
            <section className="relative hidden h-full overflow-hidden lg:block rounded-lg">
              
              {/* Wedding image */}
              <Image
                src="/get-started-couple.jpg"
                alt="Happy couple celebrating their wedding"
                fill
                priority
                className="object-cover bg-center"
                sizes="750px"
              />

              {/* Slight overlay */}
              <div className="absolute inset-0 bg-black/[0.03]" />

              {/* Bottom image frame/detail */}
              <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-black/[0.07]" />
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}