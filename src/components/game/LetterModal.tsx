import { useCallback, useRef, useState } from "react";

interface Props {
  name: string;
  onYes: () => void;
}

export default function LetterModal({ name, onYes }: Props) {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);

  const dodge = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const r = area.getBoundingClientRect();
    const bw = 96;
    const bh = 48;
    const maxX = Math.max(10, r.width - bw - 10);
    const maxY = Math.max(10, r.height - bh - 10);
    let x = 0;
    let y = 0;
    for (let i = 0; i < 12; i++) {
      x = 10 + Math.random() * maxX;
      y = 10 + Math.random() * maxY;
      if (!noPos || Math.hypot(x - noPos.x, y - noPos.y) > 90) break;
    }
    setNoPos({ x, y });
  }, [noPos]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#140f28]/80 px-5 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-[letter-in_500ms_cubic-bezier(0.2,0.9,0.25,1)]">
        <div
          className="relative overflow-hidden rounded-[22px] border border-[#e6d7bd] p-7 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
          style={{
            background: "linear-gradient(160deg,#fffaf0 0%,#fdf2e2 60%,#f8e9d5 100%)",
          }}
        >
          <div className="pointer-events-none absolute inset-3 rounded-[16px] border border-[#e0cdae]/70" />
          <p className="text-center text-[13px] uppercase tracking-[0.25em] text-[#a98763]">
            For {name}
          </p>
          <div className="mx-auto mt-4 h-px w-16 bg-[#dcc4a3]" />

          <div ref={areaRef} className="relative mt-7 min-h-[240px]">
            <h2 className="px-2 text-center text-2xl leading-snug text-[#4a3524]">
              May I be your boyfriend?
            </h2>

            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={onYes}
                className="rounded-full bg-gradient-to-b from-[#f07fa5] to-[#d84d7c] px-9 py-3 text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(216,77,124,0.9)] transition-transform active:scale-95"
              >
                YES
              </button>
              <button
                onMouseEnter={dodge}
                onPointerDown={(e) => {
                  e.preventDefault();
                  dodge();
                }}
                onClick={dodge}
                className="rounded-full border border-[#d9c3a4] bg-white/70 px-9 py-3 text-base font-semibold text-[#8a6b4e] transition-transform"
                style={
                  noPos
                    ? { position: "absolute", left: noPos.x, top: noPos.y, transition: "left 220ms ease, top 220ms ease" }
                    : undefined
                }
              >
                NO
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes letter-in {
          0% { transform: translateY(24px) scale(0.86) rotate(-2deg); opacity: 0; }
          60% { transform: translateY(0) scale(1.03) rotate(0deg); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
