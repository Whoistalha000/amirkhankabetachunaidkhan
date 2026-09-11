import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  inputRef: React.RefObject<{ x: number; y: number }>;
}

const RADIUS = 56;

export default function Joystick({ inputRef }: Props) {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const pointerId = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      const el = baseRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > RADIUS) {
        dx = (dx / d) * RADIUS;
        dy = (dy / d) * RADIUS;
      }
      setKnob({ x: dx, y: dy });
      inputRef.current.x = dx / RADIUS;
      inputRef.current.y = dy / RADIUS;
    },
    [inputRef],
  );

  const reset = useCallback(() => {
    pointerId.current = null;
    setActive(false);
    setKnob({ x: 0, y: 0 });
    inputRef.current.x = 0;
    inputRef.current.y = 0;
  }, [inputRef]);

  useEffect(() => reset, [reset]);

  return (
    <div
      ref={baseRef}
      onPointerDown={(e) => {
        e.preventDefault();
        pointerId.current = e.pointerId;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setActive(true);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (pointerId.current !== e.pointerId) return;
        update(e.clientX, e.clientY);
      }}
      onPointerUp={reset}
      onPointerCancel={reset}
      className="pointer-events-auto relative h-36 w-36 touch-none select-none rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition-opacity"
      style={{ opacity: active ? 0.95 : 0.62 }}
      aria-label="Movement joystick"
    >
      <div className="absolute inset-3 rounded-full border border-white/15" />
      <div
        className="absolute left-1/2 top-1/2 h-16 w-16 rounded-full border border-white/40 bg-white/45 shadow-lg backdrop-blur"
        style={{
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
          transition: active ? "none" : "transform 160ms ease-out",
        }}
      />
    </div>
  );
}
