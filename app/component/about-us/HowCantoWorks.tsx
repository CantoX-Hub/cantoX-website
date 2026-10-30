export default function HowCantoWorks() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <div className=" w-full maxContainer px-5 sm:px-[5%]">
        <div className="relative aspect-video w-full h-full overflow-hidden">
          <video
            src="/how-canto-works-gif.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full max-w-[1440px] w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}