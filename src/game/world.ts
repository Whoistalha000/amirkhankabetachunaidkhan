import type { Prop } from "./types";

export const OUTDOOR = { w: 2200, h: 1500 };
export const INDOOR = { w: 1200, h: 900 };

export const SKY_H = 260;

export const COTTAGE = { x: 1770, y: 720, w: 460, h: 380 };
export const DOOR = { x: COTTAGE.x, y: COTTAGE.y + 150, r: 70 };

export const INDOOR_SPAWN = { x: INDOOR.w / 2, y: INDOOR.h - 140 };
export const EXIT_DOOR = { x: INDOOR.w / 2, y: INDOOR.h - 40, r: 70 };
export const TABLE = { x: INDOOR.w / 2, y: 430, w: 320, h: 130 };
export const ENVELOPE = { x: INDOOR.w / 2 + 70, y: 400, r: 110 };

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TULIP_TINTS = ["#f7a8c4", "#fbc7db", "#ffffff", "#f28fb1"];

export function buildProps(): Prop[] {
  const rnd = mulberry(20260911);
  const props: Prop[] = [];
  const top = SKY_H + 40;

  for (let i = 0; i < 22; i++) {
    const x = 120 + rnd() * (OUTDOOR.w - 240);
    const y = top + rnd() * (OUTDOOR.h - top - 80);
    if (Math.abs(x - COTTAGE.x) < 420 && Math.abs(y - COTTAGE.y) < 380) continue;
    props.push({ kind: "tree", x, y, s: 0.85 + rnd() * 0.5 });
  }
  for (let i = 0; i < 14; i++) {
    props.push({
      kind: "bush",
      x: 80 + rnd() * (OUTDOOR.w - 160),
      y: top + rnd() * (OUTDOOR.h - top - 60),
      s: 0.8 + rnd() * 0.5,
    });
  }
  for (let i = 0; i < 150; i++) {
    props.push({
      kind: "flower",
      x: 40 + rnd() * (OUTDOOR.w - 80),
      y: top + rnd() * (OUTDOOR.h - top - 30),
      s: 0.7 + rnd() * 0.6,
    });
  }
  for (let i = 0; i < 90; i++) {
    props.push({
      kind: "tulip",
      x: 40 + rnd() * (OUTDOOR.w - 80),
      y: top + rnd() * (OUTDOOR.h - top - 30),
      s: 0.8 + rnd() * 0.6,
      tint: TULIP_TINTS[Math.floor(rnd() * TULIP_TINTS.length)] ?? "#f7a8c4",
    });
  }
  for (let i = 0; i < 10; i++) {
    props.push({
      kind: "rock",
      x: 60 + rnd() * (OUTDOOR.w - 120),
      y: top + rnd() * (OUTDOOR.h - top - 40),
      s: 0.7 + rnd() * 0.7,
    });
  }
  return props.sort((a, b) => a.y - b.y);
}

export const CLOUDS = Array.from({ length: 9 }, (_, i) => {
  const rnd = mulberry(1000 + i * 37);
  return { x: rnd() * OUTDOOR.w, y: 40 + rnd() * (SKY_H - 110), s: 0.7 + rnd() * 0.9, v: 4 + rnd() * 8 };
});

export function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}
