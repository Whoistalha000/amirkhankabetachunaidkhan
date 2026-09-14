import { useMemo, useState } from "react";

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
      suppressHydrationWarning
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-story-night px-8 transition-opacity duration-700"
      style={{ opacity: fading ? 0 : 1 }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-story-star blur-[0.5px]"
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

      <div className="relative z-10 w-full max-w-xs text-center">
        <h1 className="text-sm font-normal text-story-muted">Before we begin</h1>
        <div className="mt-12 space-y-7">
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 14))}
            onKeyDown={(e) => {
              if (e.key === "Enter") onStart(name.trim() || "Guest");
            }}
            placeholder="Your name"
            aria-label="Your name"
            className="w-full border-0 border-b border-story-line bg-transparent px-2 py-3 text-center text-lg text-story-ink outline-none transition-colors placeholder:text-story-faint focus:border-story-star"
          />
          <button
            type="button"
            onClick={() => onStart(name.trim() || "Guest")}
            className="mx-auto block border-b border-transparent px-5 py-2 text-sm text-story-ink transition-colors hover:border-story-line hover:text-story-star active:opacity-60"
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
