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
    const bw = 92;
    const bh = 46;
    const maxX = Math.max(8, r.width - bw - 8);
    const maxY = Math.max(8, r.height - bh - 8);
    let x = 0;
    let y = 0;
    for (let i = 0; i < 12; i++) {
      x = 8 + Math.random() * Math.max(0, maxX - 8);
      y = 8 + Math.random() * Math.max(0, maxY - 8);
      if (!noPos || Math.hypot(x - noPos.x, y - noPos.y) > 90) break;
    }
    setNoPos({ x, y });
  }, [noPos]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-story-overlay px-4 py-6 backdrop-blur-sm">
      <article className="letter-paper relative flex max-h-[88dvh] w-full max-w-md animate-[letter-in_500ms_cubic-bezier(0.2,0.9,0.25,1)] flex-col overflow-hidden rounded-md border border-letter-edge shadow-letter">
        <div className="letter-grain pointer-events-none absolute inset-0" />
        <div className="relative overflow-y-auto overscroll-contain px-6 py-7 sm:px-9 sm:py-9">
          <p className="text-center font-serif text-xs uppercase text-letter-muted">For {name}</p>
          <div className="mx-auto mt-4 h-px w-14 bg-letter-line" />

          <div className="mt-7 space-y-5 font-serif text-[15px] leading-7 text-letter-ink sm:text-base">
            <p>Being your friend has been the best part of my life lately. Talking to you is the best part of my day, and it makes me really happy to talk to you. I love every second i spend chatting with you. We've only known each other for 4-5 months, and yet in that short amount of time you've become someone who I admire, and love a lot. Honestly when we first started talking i didn't think we'd become suchhh good friends, and honestly I'm so happy we became friends. It was lwk the best thing i have ever done. The more we talked, the deeper i fell in love. I love your voice message or your simple text messages. You have started sending me voice messages more frequently now, and I love em sm. I love listening to you talk. Your voice is like music to my ears.</p>

            <p>I'm not sure if you'd accept my confession of love💔. You are a woman of many qualities. You're kind, smart, caring, respectful, warm and lwk funny (not more than me though 😝😝) You're like the sun  to me, you make my whole world light up. You're kind to animals (just start feeding willow the goat on time and you'd be all good😍 ) and people. You forgive others even if they're in the wrong, you resisted your temptation to noch that girl's hair, or hit that girl who pushed you because of a misunderstanding. That just shows what kind of a person you are. You're also the "CR" of your class 😍. I just wanna tell u one thing, with great power comes gr-</p>

            <p>You're genuinely the prettiest women i have ever laid eyes on. Your beauty knows no bounds. You're beautiful, not just by your face, but also by your heart and soul. But your beauty is the last thing which made me fall in love with you.</p>

            <p>My heart is pounding like crazy rn, and my hands are sweating. Ik I've got bad convo skills, and i don't have much to offer, lekin still i love u so much, and I just wanted to confess my feelings to you. I just wanted you tell you how i felt before it was too late.</p>

            <p>I'm not the best version of myself yet, but i swear ill try to become the best version of myself for you because that's what you deserve, and that's the least i can do.</p>

            <p>I will try my best to be the person you can count on when things get tough and the one you can talk to freely about literally anything. I'll always be here for you. You can physically or verbally abuse me too, i won't mind 😝😝.</p>

            <p>And at last, i just wanna ask you question.</p>
          </div>

          <h2 className="mt-9 text-center font-serif text-3xl leading-snug text-letter-heading">
            May I be your boyfriend?
          </h2>

          <div ref={areaRef} className="relative mt-6 h-32 w-full">
            <div className="flex justify-center gap-5">
              <button
                onClick={onYes}
                className="min-w-24 rounded-full bg-letter-yes px-7 py-3 text-sm font-semibold text-letter-yes-foreground shadow-letter-button transition-transform active:scale-95"
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
                className="min-w-24 rounded-full border border-letter-line bg-letter-button px-7 py-3 text-sm font-semibold text-letter-muted transition-[left,top,transform] active:scale-95"
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
      </article>

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
