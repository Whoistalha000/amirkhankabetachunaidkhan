import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { Mail } from "lucide-react";
import IntroScreen from "@/components/game/IntroScreen";
import GameCanvas from "@/components/game/GameCanvas";
import Joystick from "@/components/game/Joystick";
import LetterModal from "@/components/game/LetterModal";
import QuestCleared from "@/components/game/QuestCleared";
import type { Scene } from "@/game/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little Letter - An Interactive Romantic Story Game" },
      {
        name: "description",
        content:
          "Walk through a dreamy storybook meadow with Pillow the cat, find the cottage, and open the letter waiting inside.",
      },
      { property: "og:title", content: "A Little Letter - Interactive Romantic Story Game" },
      {
        property: "og:description",
        content:
          "A mobile-first 2D story game: explore the meadow, follow the glow, and read the letter in the cottage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

type Phase = "intro" | "fading" | "playing" | "quest";

function Game() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("Guest");
  const [scene, setScene] = useState<Scene>("outdoor");
  const [nearTalha, setNearTalha] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [wipe, setWipe] = useState(false);
  const [riding, setRiding] = useState(false);
  const inputRef = useRef({ x: 0, y: 0 });
  const ridingRef = useRef(false);

  const start = useCallback((n: string) => {
    setName(n);
    setPhase("fading");
    window.setTimeout(() => setPhase("playing"), 700);
  }, []);

  const changeScene = useCallback((next: Scene) => {
    setWipe(true);
    window.setTimeout(() => {
      setScene(next);
      setNearTalha(false);
      setRiding(false);
      ridingRef.current = false;
      window.setTimeout(() => setWipe(false), 60);
    }, 420);
  }, []);

  const onDoor = useCallback(() => changeScene("indoor"), [changeScene]);
  const onExit = useCallback(() => changeScene("outdoor"), [changeScene]);
  const onTalhaNear = useCallback((near: boolean) => setNearTalha(near), []);

  const toggleRide = useCallback(() => {
    setRiding((r) => {
      const next = !r;
      ridingRef.current = next;
      return next;
    });
  }, []);

  const replay = useCallback(() => {
    setLetterOpen(false);
    setScene("outdoor");
    setNearTalha(false);
    setRiding(false);
    ridingRef.current = false;
    setPhase("intro");
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#140f28] select-none">
      {phase !== "playing" && phase !== "quest" ? (
        <IntroScreen onStart={start} fading={phase === "fading"} />
      ) : (
        <>
          <div className="absolute inset-0 animate-[fade-in_700ms_ease-out]">
            <GameCanvas
              name={name}
              scene={scene}
              inputRef={inputRef}
              paused={letterOpen || phase === "quest"}
              onDoor={onDoor}
              onExit={onExit}
              onTalhaNear={onTalhaNear}
              ridingRef={ridingRef}
            />
          </div>

          {/* hints */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-2 px-4 pt-5">
            {scene === "outdoor" && (
              <p className="rounded-full bg-black/35 px-4 py-2 text-center text-xs text-white/85 backdrop-blur-sm">
                Head right to the cottage
              </p>
            )}
            {scene === "indoor" && !nearTalha && (
              <p className="rounded-full bg-black/35 px-4 py-2 text-center text-xs text-white/85 backdrop-blur-sm">
                Walk up to Talha
              </p>
            )}
          </div>

          {/* Talha / letter prompt */}
          {scene === "indoor" && nearTalha && !letterOpen && (
            <div className="absolute inset-x-0 bottom-56 flex justify-center px-6">
              <button
                onClick={() => setLetterOpen(true)}
                className="pointer-events-auto flex animate-[pulse-soft_1.8s_ease-in-out_infinite] items-center gap-2 rounded-full bg-gradient-to-b from-[#ffe6a8] to-[#f3c15f] px-6 py-3 text-sm font-semibold text-[#5a3d16] shadow-[0_0_34px_-4px_rgba(255,214,130,0.9)] active:scale-95"
              >
                <Mail className="h-4 w-4" strokeWidth={2} />
                Tap the letter
              </button>
            </div>
          )}

          {/* scooty toggle button */}
          {scene === "outdoor" && !letterOpen && phase === "playing" && (
            <button
              onClick={toggleRide}
              className={`pointer-events-auto absolute right-6 bottom-10 z-20 flex h-16 w-16 items-center justify-center rounded-full border-2 text-xs font-bold backdrop-blur-sm transition-all active:scale-90 ${
                riding
                  ? "border-amber-300 bg-amber-500/80 text-white"
                  : "border-white/30 bg-white/15 text-white/80"
              }`}
              aria-label={riding ? "Get off scooty" : "Ride scooty"}
            >
              {riding ? "OFF" : "RIDE"}
            </button>
          )}

          {/* joystick */}
          {!letterOpen && phase === "playing" && (
            <div className="pointer-events-none absolute bottom-8 left-6 z-20">
              <Joystick inputRef={inputRef} />
            </div>
          )}

          {letterOpen && phase === "playing" && (
            <LetterModal name={name} onYes={() => setPhase("quest")} />
          )}

          {phase === "quest" && <QuestCleared name={name} onReplay={replay} />}

          {/* scene transition wipe */}
          <div
            className="pointer-events-none absolute inset-0 z-30 bg-[#140f28] transition-opacity duration-400"
            style={{ opacity: wipe ? 1 : 0 }}
          />
        </>
      )}

      <style>{`
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>
    </main>
  );
}
