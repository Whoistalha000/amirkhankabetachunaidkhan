import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { Bike, ChevronRight, Mail } from "lucide-react";
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
  const [nearEnvelope, setNearEnvelope] = useState(false);
  const [nearScooty, setNearScooty] = useState(false);
  const [riding, setRiding] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [wipe, setWipe] = useState(false);
  const inputRef = useRef({ x: 0, y: 0 });
  const rideRef = useRef({ toggle: 0 });

  const start = useCallback((n: string) => {
    setName(n);
    setPhase("fading");
    window.setTimeout(() => setPhase("playing"), 700);
  }, []);

  const changeScene = useCallback((next: Scene) => {
    setWipe(true);
    window.setTimeout(() => {
      setScene(next);
      setNearEnvelope(false);
      window.setTimeout(() => setWipe(false), 60);
    }, 420);
  }, []);

  const onDoor = useCallback(() => changeScene("indoor"), [changeScene]);
  const onExit = useCallback(() => changeScene("outdoor"), [changeScene]);
  const onTalhaNear = useCallback((near: boolean) => setNearEnvelope(near), []);
  const onScootyNear = useCallback((near: boolean) => setNearScooty(near), []);
  const onRidingChange = useCallback((r: boolean) => setRiding(r), []);
  const toggleRide = useCallback(() => {
    rideRef.current.toggle += 1;
  }, []);

  const replay = useCallback(() => {
    setLetterOpen(false);
    setScene("outdoor");
    setNearEnvelope(false);
    setNearScooty(false);
    setRiding(false);
    setPhase("intro");
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#140f28] select-none">
      {phase !== "playing" && phase !== "quest" ? (
        <IntroScreen onStart={start} fading={phase === "fading"} />
      ) : (
        <>
          <div
            className="absolute inset-0 animate-[fade-in_700ms_ease-out]"
            style={{ visibility: letterOpen ? "hidden" : "visible" }}
          >
            <GameCanvas
              name={name}
              scene={scene}
              inputRef={inputRef}
              rideRef={rideRef}
              paused={letterOpen || phase === "quest"}
              onDoor={onDoor}
              onExit={onExit}
              onTalhaNear={onTalhaNear}
              onScootyNear={onScootyNear}
              onRidingChange={onRidingChange}
            />
          </div>

          {/* hints */}
          {!letterOpen && (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-2 px-4 pt-5">
              {scene === "outdoor" && (
                <p className="flex items-center gap-1.5 rounded-full bg-black/35 px-4 py-2 text-center text-xs font-medium text-white/90 backdrop-blur-sm">
                  Head to the cottage
                  <ChevronRight className="h-3.5 w-3.5 animate-pulse" strokeWidth={3} />
                </p>
              )}

            </div>
          )}

          {/* Talha proposal prompt */}
          {scene === "indoor" && nearEnvelope && !letterOpen && (
            <div className="absolute inset-x-0 bottom-56 flex justify-center px-6">
              <button
                onClick={() => setLetterOpen(true)}
                className="pointer-events-auto flex animate-[pulse-soft_1.8s_ease-in-out_infinite] items-center gap-2 rounded-full bg-gradient-to-b from-[#ffe6a8] to-[#f3c15f] px-6 py-3 text-sm font-semibold text-[#5a3d16] shadow-[0_0_34px_-4px_rgba(255,214,130,0.9)] active:scale-95"
              >
                <Mail className="h-4 w-4" strokeWidth={2} />
                Read the letter
              </button>
            </div>
          )}

          {/* scooty mount / dismount button */}
          {scene === "outdoor" && (nearScooty || riding) && !letterOpen && phase === "playing" && (
            <div className="absolute inset-x-0 bottom-8 z-20 flex justify-end px-6">
              <button
                onClick={toggleRide}
                className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3a3a44] to-[#161619] px-6 py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7)] ring-1 ring-white/15 active:scale-95"
              >
                <Bike className="h-5 w-5" strokeWidth={2} />
                {riding ? "Get off" : "Ride the scooty"}
              </button>
            </div>
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
