import { useEffect, useRef } from "react";
import type { Actor, Camera, Dir, Scene } from "@/game/types";
import {
  CLOUDS,
  COTTAGE,
  DOOR,
  ENVELOPE,
  EXIT_DOOR,
  INDOOR,
  INDOOR_SPAWN,
  OUTDOOR,
  SCOOTY_SPAWN,
  SKY_H,
  buildProps,
  clamp,
} from "@/game/world";
import {
  drawCat,
  drawCatRiding,
  drawCloud,
  drawCottage,
  drawEnvelope,
  drawGround,
  drawInterior,
  drawPlayer,
  drawPlayerRiding,
  drawProp,
  drawScooty,
  drawSky,
} from "@/game/sprites";

const PLAYER_SPEED = 205;
const SCOOTER_SPEED = 340;
const CAT_SPEED = 245;
const IDLE_SLEEP = 10; // seconds
const SCOOTY_REACH = 96; // how close the player must be to mount

interface Props {
  name: string;
  scene: Scene;
  inputRef: React.RefObject<{ x: number; y: number }>;
  rideRef: React.RefObject<{ toggle: number }>;
  paused: boolean;
  onDoor: () => void;
  onExit: () => void;
  onTalhaNear: (near: boolean) => void;
  onScootyNear: (near: boolean) => void;
  onRidingChange: (riding: boolean) => void;
}

const props = buildProps();

export default function GameCanvas({
  name,
  scene,
  inputRef,
  rideRef,
  paused,
  onDoor,
  onExit,
  onTalhaNear,
  onScootyNear,
  onRidingChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const player = useRef<Actor>({ x: 420, y: 1050, dir: "right", walkT: 0, moving: false });
  const cat = useRef<Actor & { sleeping: boolean }>({
    x: 340,
    y: 1090,
    dir: "right",
    walkT: 0,
    moving: false,
    sleeping: false,
  });
  const scooty = useRef<Actor>({
    x: SCOOTY_SPAWN.x,
    y: SCOOTY_SPAWN.y,
    dir: "right",
    walkT: 0,
    moving: false,
  });
  const riding = useRef(false);
  const lastToggle = useRef(0);
  const nearScooty = useRef(false);
  const cam = useRef<Camera>({ x: 0, y: 0 });
  const idle = useRef(0);
  const lastPlayerPosition = useRef({ x: 420, y: 1050 });
  const keys = useRef<Record<string, boolean>>({});
  const lockout = useRef(0);
  const nearEnv = useRef(false);
  const inDoorZone = useRef(true);
  const sceneRef = useRef<Scene>(scene);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // place actors when the scene changes (the meadow spawn is kept on first mount)
  const lastScene = useRef<Scene | null>(null);
  useEffect(() => {
    sceneRef.current = scene;
    lockout.current = 0.5;
    idle.current = 0;
    lastPlayerPosition.current = { x: player.current.x, y: player.current.y };
    cat.current.sleeping = false;
    inDoorZone.current = true;
    // you always dismount when moving between scenes
    if (riding.current) {
      riding.current = false;
      onRidingChange(false);
    }
    nearScooty.current = false;
    onScootyNear(false);
    if (lastScene.current === scene) return;
    const first = lastScene.current === null;
    lastScene.current = scene;
    if (first) {
      cam.current.x = -1;
      return;
    }
    if (scene === "indoor") {
      player.current.x = INDOOR_SPAWN.x;
      player.current.y = INDOOR_SPAWN.y;
      player.current.dir = "up";
      cat.current.x = INDOOR_SPAWN.x - 80;
      cat.current.y = INDOOR_SPAWN.y + 20;
    } else {
      player.current.x = DOOR.x;
      player.current.y = DOOR.y + 200;
      player.current.dir = "down";
      cat.current.x = DOOR.x - 90;
      cat.current.y = DOOR.y + 220;
    }
    lastPlayerPosition.current = { x: player.current.x, y: player.current.y };
    cam.current.x = -1;
  }, [scene]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let vw = 0;
    let vh = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      vw = rect.width;
      vh = rect.height;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      const sc = sceneRef.current;
      const world = sc === "outdoor" ? OUTDOOR : INDOOR;
      if (lockout.current > 0) lockout.current -= dt;

      /* ---- mount / dismount the scooty ---- */
      if (rideRef.current && rideRef.current.toggle !== lastToggle.current) {
        lastToggle.current = rideRef.current.toggle;
        if (sc === "outdoor") {
          if (riding.current) {
            // step off next to the scooty
            riding.current = false;
            player.current.x = scooty.current.x - 46;
            player.current.y = scooty.current.y + 8;
            onRidingChange(false);
          } else if (nearScooty.current) {
            riding.current = true;
            idle.current = 0;
            cat.current.sleeping = false;
            onRidingChange(true);
          }
        }
      }

      /* ---- input ---- */
      let ix = inputRef.current?.x ?? 0;
      let iy = inputRef.current?.y ?? 0;
      const k = keys.current;
      if (k["arrowleft"] || k["a"]) ix -= 1;
      if (k["arrowright"] || k["d"]) ix += 1;
      if (k["arrowup"] || k["w"]) iy -= 1;
      if (k["arrowdown"] || k["s"]) iy += 1;
      let mag = Math.hypot(ix, iy);
      if (mag > 1) {
        ix /= mag;
        iy /= mag;
        mag = 1;
      }
      if (pausedRef.current) {
        ix = 0;
        iy = 0;
        mag = 0;
      }

      /* ---- player ---- */
      const p = player.current;
      const isRiding = riding.current && sc === "outdoor";
      const speed = isRiding ? SCOOTER_SPEED : PLAYER_SPEED;
      p.moving = mag > 0.08;
      if (p.moving) {
        p.x += ix * speed * mag * dt;
        p.y += iy * speed * mag * dt;
        p.walkT += dt;
        const dir: Dir =
          Math.abs(ix) > Math.abs(iy) ? (ix > 0 ? "right" : "left") : iy > 0 ? "down" : "up";
        p.dir = dir;
      } else {
        p.walkT += dt;
      }
      // the scooty carries the player, so it stays locked to the player pose
      if (isRiding) {
        scooty.current.x = p.x;
        scooty.current.y = p.y;
        scooty.current.dir = p.dir;
        scooty.current.moving = p.moving;
      }

      // bounds
      const topLimit = sc === "outdoor" ? SKY_H + 30 : 268;
      p.x = clamp(p.x, 40, world.w - 40);
      p.y = clamp(p.y, topLimit, world.h - (sc === "outdoor" ? 40 : 30));

      // Inactivity is based on real position changes, not merely input state.
      const movedDistance = Math.hypot(
        p.x - lastPlayerPosition.current.x,
        p.y - lastPlayerPosition.current.y,
      );
      if (movedDistance > 0.35) {
        idle.current = 0;
        cat.current.sleeping = false;
        lastPlayerPosition.current = { x: p.x, y: p.y };
      } else if (!pausedRef.current) {
        idle.current += dt;
      }

      // cottage collision (solid, except the doorstep zone)
      if (sc === "outdoor") {
        const l = COTTAGE.x - COTTAGE.w / 2;
        const r = COTTAGE.x + COTTAGE.w / 2;
        const tp = COTTAGE.y - COTTAGE.h / 2;
        const b = COTTAGE.y + COTTAGE.h / 2;
        if (p.x > l && p.x < r && p.y > tp && p.y < b) {
          const dl = Math.abs(p.x - l);
          const dr = Math.abs(p.x - r);
          const dt2 = Math.abs(p.y - tp);
          const db = Math.abs(p.y - b);
          const m = Math.min(dl, dr, dt2, db);
          if (m === db) p.y = b;
          else if (m === dt2) p.y = tp;
          else if (m === dl) p.x = l;
          else p.x = r;
        }
      }

      /* ---- interactions ---- */
      if (sc === "outdoor") {
        const atDoor =
          Math.abs(p.x - DOOR.x) < DOOR.r && p.y > DOOR.y + 20 && p.y < DOOR.y + 230;
        if (atDoor && !inDoorZone.current && lockout.current <= 0) {
          lockout.current = 1;
          onDoor();
        }
        inDoorZone.current = atDoor;

        // scooty proximity (only offer to mount while on foot)
        const dScooty = Math.hypot(p.x - scooty.current.x, p.y - scooty.current.y);
        const near = !riding.current && dScooty < SCOOTY_REACH;
        if (near !== nearScooty.current) {
          nearScooty.current = near;
          onScootyNear(near);
        }
      } else {
        const atExit = Math.hypot(p.x - EXIT_DOOR.x, p.y - EXIT_DOOR.y) < EXIT_DOOR.r;
        if (atExit && !inDoorZone.current && lockout.current <= 0) {
          lockout.current = 1;
          onExit();
        }
        inDoorZone.current = atExit;
        const near = Math.hypot(p.x - ENVELOPE.x, p.y - (ENVELOPE.y + 60)) < ENVELOPE.r;
        if (near !== nearEnv.current) {
          nearEnv.current = near;
          onTalhaNear(near);
        }
      }

      /* ---- cat ---- */
      const c = cat.current;
      if (c.sleeping) {
        c.moving = false;
      } else {
        const followDist = 74;
        const settling = idle.current >= IDLE_SLEEP;
        const targetX = settling ? p.x - 52 : p.x;
        const targetY = settling ? p.y + 24 : p.y + 18;
        const dx = targetX - c.x;
        const dy = targetY - c.y;
        const d = Math.hypot(dx, dy);
        const target = settling ? 7 : followDist;
        if (d > target) {
          const speed = Math.min(CAT_SPEED, 90 + (d - target) * 3.2);
          c.x += (dx / d) * speed * dt;
          c.y += (dy / d) * speed * dt;
          c.moving = true;
          c.walkT += dt;
          c.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
        } else {
          c.moving = false;
          if (settling) c.sleeping = true;
        }
      }
      c.x = clamp(c.x, 30, world.w - 30);
      c.y = clamp(c.y, topLimit, world.h - 20);

      /* ---- camera ---- */
      const targetX = world.w <= vw ? (world.w - vw) / 2 : clamp(p.x - vw / 2, 0, world.w - vw);
      const targetY = world.h <= vh ? (world.h - vh) / 2 : clamp(p.y - vh * 0.58, 0, world.h - vh);
      if (cam.current.x < 0) {
        cam.current.x = targetX;
        cam.current.y = targetY;
      } else {
        const ease = 1 - Math.pow(0.0015, dt);
        cam.current.x += (targetX - cam.current.x) * ease;
        cam.current.y += (targetY - cam.current.y) * ease;
      }

      /* ---- render ---- */
      ctx.save();
      ctx.fillStyle = sc === "outdoor" ? "#93d17f" : "#b3814f";
      ctx.fillRect(0, 0, vw, vh);
      ctx.translate(-Math.round(cam.current.x), -Math.round(cam.current.y));

      if (sc === "outdoor") {
        if (cam.current.y < SKY_H + 120) {
          drawSky(ctx, t);
          for (const cl of CLOUDS) {
            const cx = (cl.x + t * cl.v) % (OUTDOOR.w + 200);
            drawCloud(ctx, cx - 100, cl.y, cl.s);
          }
        }
        drawGround(ctx, cam.current.x, cam.current.y, vw, vh);

        const view = {
          x0: cam.current.x - 160,
          x1: cam.current.x + vw + 160,
          y0: cam.current.y - 220,
          y1: cam.current.y + vh + 200,
        };
        const drawn: Array<{ y: number; fn: () => void }> = [];
        for (const pr of props) {
          if (pr.x < view.x0 || pr.x > view.x1 || pr.y < view.y0 || pr.y > view.y1) continue;
          drawn.push({ y: pr.y, fn: () => drawProp(ctx, pr, t) });
        }
        drawn.push({ y: COTTAGE.y + COTTAGE.h / 2, fn: () => drawCottage(ctx, t) });
        if (isRiding) {
          // scooty + rider + cat move together as one group
          const gy = p.y;
          const rearOffset =
            p.dir === "up"
              ? { x: 0, y: 26 }
              : p.dir === "down"
                ? { x: 0, y: 26 }
                : { x: p.dir === "left" ? 40 : -40, y: 10 };
          drawn.push({
            y: gy + 40,
            fn: () => {
              drawScooty(ctx, scooty.current.x, scooty.current.y, p.dir, p.moving, t);
              drawCatRiding(ctx, p.x + rearOffset.x, p.y + rearOffset.y, p.dir, c.sleeping, t);
              drawPlayerRiding(ctx, p.x, p.y, p.dir, name, t);
            },
          });
        } else {
          drawn.push({
            y: scooty.current.y,
            fn: () =>
              drawScooty(ctx, scooty.current.x, scooty.current.y, scooty.current.dir, false, t),
          });
          drawn.push({
            y: c.y,
            fn: () => drawCat(ctx, c.x, c.y, c.dir, c.walkT, c.moving, c.sleeping, t),
          });
          drawn.push({
            y: p.y,
            fn: () => drawPlayer(ctx, p.x, p.y, p.dir, p.walkT, p.moving, name),
          });
        }
        drawn.sort((a, b) => a.y - b.y);
        for (const d of drawn) d.fn();
      } else {
        drawInterior(ctx, t);
        const items: Array<{ y: number; fn: () => void }> = [
          { y: ENVELOPE.y, fn: () => drawEnvelope(ctx, t) },
          { y: c.y, fn: () => drawCat(ctx, c.x, c.y, c.dir, c.walkT, c.moving, c.sleeping, t) },
          { y: p.y, fn: () => drawPlayer(ctx, p.x, p.y, p.dir, p.walkT, p.moving, name) },
        ];
        items.sort((a, b) => a.y - b.y);
        for (const it of items) it.fn();
      }
      ctx.restore();
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, [name, inputRef, rideRef, onDoor, onExit, onTalhaNear, onScootyNear, onRidingChange]);

  return <canvas ref={canvasRef} className="block h-full w-full touch-none" />;
}
