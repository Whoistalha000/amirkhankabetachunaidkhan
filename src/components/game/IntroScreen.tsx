import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  onStart: (name: string) => void;
  fading: boolean;
}

export default function IntroScreen({ onStart, fading }: Props) {
  const [name, setName] = useState("");

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: (i * 37) % 100,
        size: 2 + ((i * 13) % 5),
        delay: (i * 0.7) % 9,
        duration: 9 + ((i * 3) % 9),
        opacity: 0.25 + ((i * 7) % 5) / 10,
      })),
    [],
  );

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-7 transition-opacity duration-700"
      style={{
        opacity: fading ? 0 : 1,
        background:
          "radial-gradient(120% 80% at 50% 10%, #3a2a63 0%, #241a42 45%, #140f28 100%)",
      }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-[#e6d5ff] blur-[0.5px]"
          style={{
            left: `${p.left}%`,
            bottom: "-10%",
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-sm text-center">
        <Sparkles className="mx-auto mb-5 h-7 w-7 text-[#d9c6ff] opacity-80" strokeWidth={1.5} />
        <h1 className="text-3xl font-light tracking-wide text-[#f0e8ff]">Before we begin...</h1>
        <p className="mt-3 text-sm text-[#b7a6d9]">A small story is waiting for you.</p>

        <div className="mt-9 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 14))}
            onKeyDown={(e) => {
              if (e.key === "Enter") onStart(name.trim() || "Guest");
            }}
            placeholder="Enter your name"
            aria-label="Enter your name"
            className="w-full rounded-2xl border border-white/15 bg-white/8 px-5 py-4 text-center text-base text-[#f4eeff] placeholder:text-[#8f81b5] outline-none backdrop-blur focus:border-[#b79bff]/60 focus:bg-white/12"
          />
          <button
            type="button"
            onClick={() => onStart(name.trim() || "Guest")}
            className="w-full rounded-2xl bg-gradient-to-b from-[#a98cf5] to-[#7a5cd6] px-5 py-4 text-base font-medium text-white shadow-[0_10px_30px_-10px_rgba(150,110,255,0.9)] transition-transform active:scale-95"
          >
            Enter
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(-110vh) scale(1.25); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
