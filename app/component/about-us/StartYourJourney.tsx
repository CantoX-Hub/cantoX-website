
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Button from "../common/Button";

export default function ReadyToStart() {
  return (
    <section
      className={`relative min-h-[350px] overflow-hidden`}
    >
      {/* Background Image */}
      <Image
        src={"/page-hero-banner.png"}
        alt="ready-banner"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
 {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#07101C]/25" />
      
      <div className="grid min-h-[420px] w-full maxContainer grid-cols-1 items-center gap-10 px-[5%] pt-14 sm:pt-16 md:grid-cols-2 md:gap-8 md:pt-16 lg:min-h-[440px] lg:pt-20">
        {/* Left: Heading and actions */}
        <div className="relative z-10 flex flex-col items-start justify-center pb-2 md:pb-12 lg:pb-16">
           <h2 className="text-[24px] leading-[1.15] text-white sm:text-[32px]">
            Ready to start your Canto?
          </h2>

          <p className="mt-3 max-w-[420px] text-sm leading-6 text-white/85 sm:text-base">
            <span className="mr-1 text-[#C99532]">|</span>
            Canto is your chapter. CantoX is how you experience it.
          </p>

          
          <div className="mt-5 md:mt-12 flex flex-wrap items-center gap-3">
                      <Button
                        href="/templates"
                        // variant="primary"  
                       className="bg-[#C9933A] text-white"
                        icon={<ArrowUpRight size={18} className="ml-1 text-gray-300" />}
                      >
                        Browse templates
                      </Button>
                      <Button variant="outline"  href="/get-started">Get started</Button>
        
          </div>
        </div>

        {/* Right: Dashboard image anchored to the bottom */}
        <div className="relative flex h-full min-h-[260px] items-end justify-end md:min-h-[360px] lg:min-h-[420px]">
          <div className="relative aspect-[1.48/1] w-full max-w-[650px] translate-y-px overflow-hidden rounded-t-xl border border-white/70 bg-[#F8FAFC] shadow-[0_0_40px_rgba(0,0,0,0.2)]">
            <Image
              src="/ready-to-start-dashboard.png"
              alt="CantoX dashboard showing wedding templates, upcoming tasks, and planning tools"
              fill
              priority
              sizes="(max-width: 767px) 90vw, (max-width: 1023px) 48vw, 650px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
