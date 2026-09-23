import Image from "next/image";
export function FeatureCard({
  feature,
}: {
  feature: {
    title: string;
    description: string;
    image: string;
  };
}) {
  return (
    <article className="w-[260px] shrink-0 md:w-[300px] lg:w-[320px]">
      {/* Image */}
      <div className="relative mb-4 aspect-[1.65/1] w-full overflow-hidden rounded-[5px] bg-[#E9D8FF]">
        <Image
          src={feature.image}
          alt={feature.title}
          fill
          className="object-cover"
          sizes="320px"
        />
      </div>

      {/* Content */}
      <h3 className="sm:text-[24px] mb-2 text-[#171A20]">
        {feature.title}
      </h3>

      <p className="mx-auto max-w-[560px]  text-[#060D18] text-[14px] sm:text-base">
        {feature.description}
      </p>
    </article>
  );
}
