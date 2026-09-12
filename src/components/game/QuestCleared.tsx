import { useMemo } from "react";

interface Props {
  name: string;
  onReplay: () => void;
}

export default function QuestCleared({ name, onReplay }: Props) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: (i * 29) % 100,
        top: (i * 47) % 100,
        size: 2 + ((i * 11) % 6),
        delay: ((i * 5) % 20) / 10,
        dur: 2 + ((i * 7) % 25) / 10,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-achievement px-6">
      {sparks.map((s, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-achievement-spark"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `spark ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-sm animate-[quest-reveal_900ms_ease-out] text-center">
          <p className="text-[11px] uppercase text-achievement-muted">Complete</p>
          <h2 className="mt-5 font-serif text-4xl font-normal text-achievement-title [text-shadow:0_0_24px_var(--achievement-glow)]">
            QUEST CLEARED
          </h2>
          <div className="mx-auto mt-7 h-px w-20 bg-achievement-line" />
          <p className="mt-7 text-base text-achievement-ink">Reward : +1 bf</p>
          <p className="mt-3 text-sm text-achievement-muted">Congratulations, {name}</p>

          <button
            onClick={onReplay}
            className="mt-12 border-b border-achievement-line px-4 py-2 text-sm text-achievement-ink transition-opacity hover:opacity-70 active:opacity-50"
          >
            Play again
          </button>
      </div>

      <style>{`
        @keyframes quest-reveal {
          0% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes spark {
          0%, 100% { transform: scale(0.4); opacity: 0.15; }
          50% { transform: scale(1.5); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}
