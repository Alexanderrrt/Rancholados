import Image from "next/image";

export default function ImmersiveHero({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-crema min-h-[calc(100svh-9rem)] md:min-h-[calc(100svh-8rem)]">
      <div className="absolute inset-0">
        <Image
          src="/Cholado.png"
          alt=""
          fill
          preload
          quality={90}
          sizes="100vw"
          className="object-cover object-[65%_52%] md:object-[78%_50%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,240,0.98)_0%,rgba(255,248,240,0.9)_34%,rgba(255,248,240,0.35)_66%,rgba(255,248,240,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,248,240,0.08)_32%,rgba(255,248,240,0.76)_100%)] md:bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,248,240,0)_42%,rgba(255,248,240,0.48)_100%)]" />
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
