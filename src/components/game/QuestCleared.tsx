import { useMemo } from "react";

interface Props {
  name: string;
  onReplay: () => void;
}

export default function QuestCleared({ name, onReplay }: Props) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        left: (i * 29) % 100,
        top: (i * 47) % 100,
        size: 2 + ((i * 11) % 6),
        delay: ((i * 5) % 20) / 10,
        dur: 2 + ((i * 7) % 25) / 10,
      })),
    [],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
      style={{
        background: "radial-gradient(110% 70% at 50% 40%, #4a2f6d 0%, #241a42 55%, #100b20 100%)",
      }}
    >
      {sparks.map((s, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-[#ffe6a8]"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `spark ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-sm animate-[quest-pop_700ms_cubic-bezier(0.2,1.3,0.4,1)] text-center">
        <div className="rounded-[26px] border border-[#ffd98a]/40 bg-white/6 px-7 py-10 backdrop-blur-md shadow-[0_0_60px_-10px_rgba(255,208,120,0.45)]">
          <p className="text-xs uppercase tracking-[0.4em] text-[#ffd98a]/80">Complete</p>
          <h2
            className="mt-4 text-3xl font-extrabold tracking-[0.12em] text-[#ffe9b8]"
            style={{ textShadow: "0 0 22px rgba(255,208,120,0.75)" }}
          >
            QUEST CLEARED
          </h2>
          <div className="mx-auto mt-5 h-px w-24 bg-[#ffd98a]/50" />
          <p className="mt-6 text-lg text-[#f3ebff]">Reward : +1 bf</p>
          <p className="mt-2 text-sm text-[#b7a6d9]">Congratulations, {name}</p>

          <button
            onClick={onReplay}
            className="mt-9 w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-[#f0e8ff] transition-transform active:scale-95"
          >
            Play again
          </button>
        </div>
      </div>

      <style>{`
        @keyframes quest-pop {
          0% { transform: scale(0.7); opacity: 0; }
          55% { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes spark {
          0%, 100% { transform: scale(0.4); opacity: 0.15; }
          50% { transform: scale(1.5); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}
