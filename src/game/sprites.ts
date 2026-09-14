import type { Dir, Prop } from "./types";
import { COTTAGE, INDOOR, OUTDOOR, SKY_H, TABLE, EXIT_DOOR, TALHA, SCOOTY } from "./world";

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, fill: string) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function shadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number) {
  ctx.globalAlpha = 0.16;
  ellipse(ctx, x, y, rx, rx * 0.38, "#1b2a1c");
  ctx.globalAlpha = 1;
}

/* ---------------- ground & sky ---------------- */

export function drawGround(ctx: CanvasRenderingContext2D, camX: number, camY: number, vw: number, vh: number) {
  const g = ctx.createLinearGradient(0, SKY_H, 0, OUTDOOR.h);
  g.addColorStop(0, "#a9dd94");
  g.addColorStop(0.5, "#93d17f");
  g.addColorStop(1, "#7cc26c");
  ctx.fillStyle = g;
  ctx.fillRect(0, SKY_H - 10, OUTDOOR.w, OUTDOOR.h - SKY_H + 10);

  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#ffffff";
  const startY = Math.max(SKY_H, Math.floor(camY / 60) * 60);
  for (let y = startY; y < camY + vh + 60; y += 60) {
    for (let x = Math.floor(camX / 90) * 90; x < camX + vw + 90; x += 90) {
      ellipse(ctx, x + ((y / 60) % 2) * 45, y, 34, 8, "#ffffff");
    }
  }
  ctx.globalAlpha = 1;
}

export function drawSky(ctx: CanvasRenderingContext2D, t: number) {
  const g = ctx.createLinearGradient(0, 0, 0, SKY_H);
  g.addColorStop(0, "#cbb7f2");
  g.addColorStop(0.55, "#dcd0f7");
  g.addColorStop(1, "#f3e7f6");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, OUTDOOR.w, SKY_H);

  ctx.fillStyle = "#bfe3ae";
  for (let i = 0; i < 12; i++) {
    ellipse(ctx, i * 220 + ((t * 0) % 1), SKY_H + 10, 190, 80, "#bfe3ae");
  }
}

export function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.globalAlpha = 0.85;
  ellipse(ctx, x, y, 46 * s, 24 * s, "#ffffff");
  ellipse(ctx, x + 34 * s, y + 6 * s, 32 * s, 18 * s, "#ffffff");
  ellipse(ctx, x - 34 * s, y + 8 * s, 28 * s, 16 * s, "#fdfdff");
  ctx.globalAlpha = 1;
}

/* ---------------- props ---------------- */

export function drawProp(ctx: CanvasRenderingContext2D, p: Prop, t: number) {
  const sway = Math.sin(t * 1.2 + p.x * 0.01) * 2;
  switch (p.kind) {
    case "tree": {
      const s = p.s;
      shadow(ctx, p.x, p.y + 4, 44 * s);
      roundRect(ctx, p.x - 9 * s, p.y - 70 * s, 18 * s, 72 * s, 7 * s, "#8a5a3b");
      ellipse(ctx, p.x + sway, p.y - 96 * s, 62 * s, 52 * s, "#4e9e5a");
      ellipse(ctx, p.x - 34 * s + sway, p.y - 74 * s, 40 * s, 34 * s, "#57ab63");
      ellipse(ctx, p.x + 34 * s + sway, p.y - 76 * s, 40 * s, 34 * s, "#57ab63");
      ellipse(ctx, p.x - 10 * s + sway, p.y - 116 * s, 34 * s, 26 * s, "#68bd72");
      break;
    }
    case "bush":
      shadow(ctx, p.x, p.y + 2, 30 * p.s);
      ellipse(ctx, p.x, p.y - 14 * p.s, 34 * p.s, 24 * p.s, "#5aac67");
      ellipse(ctx, p.x - 18 * p.s, p.y - 6 * p.s, 22 * p.s, 16 * p.s, "#66b972");
      ellipse(ctx, p.x + 18 * p.s, p.y - 8 * p.s, 22 * p.s, 16 * p.s, "#66b972");
      break;
    case "flower": {
      const s = p.s;
      ctx.strokeStyle = "#5da368";
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(p.x + sway * 0.5, p.y - 8 * s, p.x + sway, p.y - 14 * s);
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ellipse(ctx, p.x + sway + Math.cos(a) * 4 * s, p.y - 14 * s + Math.sin(a) * 4 * s, 3.4 * s, 3.4 * s, "#ffffff");
      }
      ellipse(ctx, p.x + sway, p.y - 14 * s, 2.4 * s, 2.4 * s, "#ffd76a");
      break;
    }
    case "tulip": {
      const s = p.s;
      ctx.strokeStyle = "#4f9a5c";
      ctx.lineWidth = 2.4 * s;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(p.x + sway * 0.6, p.y - 12 * s, p.x + sway, p.y - 20 * s);
      ctx.stroke();
      ellipse(ctx, p.x - 6 * s + sway, p.y - 8 * s, 7 * s, 3 * s, "#4f9a5c");
      const c = p.tint ?? "#f7a8c4";
      ctx.beginPath();
      ctx.ellipse(p.x + sway, p.y - 25 * s, 6 * s, 8 * s, 0, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
      ellipse(ctx, p.x + sway - 4 * s, p.y - 27 * s, 3 * s, 6 * s, c);
      ellipse(ctx, p.x + sway + 4 * s, p.y - 27 * s, 3 * s, 6 * s, c);
      break;
    }
    case "rock":
      shadow(ctx, p.x, p.y + 2, 20 * p.s);
      ellipse(ctx, p.x, p.y - 8 * p.s, 20 * p.s, 13 * p.s, "#b9b4c4");
      ellipse(ctx, p.x - 5 * p.s, p.y - 12 * p.s, 11 * p.s, 7 * p.s, "#d0ccd9");
      break;
  }
}

/* ---------------- scooty ---------------- */

export function drawScooty(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: Dir,
  t: number,
  moving: boolean,
) {
  const flip = dir === "left" ? -1 : 1;
  shadow(ctx, x, y + 4, 36);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip, 1);

  // rear wheel
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(-22, -8, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#333333";
  ctx.beginPath();
  ctx.arc(-22, -8, 10, 0, Math.PI * 2);
  ctx.fill();
  // spokes
  ctx.strokeStyle = "#555555";
  ctx.lineWidth = 1.5;
  const spin = moving ? t * 14 : 0;
  for (let i = 0; i < 4; i++) {
    const a = spin + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(-22, -8);
    ctx.lineTo(-22 + Math.cos(a) * 9, -8 + Math.sin(a) * 9);
    ctx.stroke();
  }

  // front wheel
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(24, -8, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#333333";
  ctx.beginPath();
  ctx.arc(24, -8, 10, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    const a = spin + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(24, -8);
    ctx.lineTo(24 + Math.cos(a) * 9, -8 + Math.sin(a) * 9);
    ctx.stroke();
  }

  // deck / footboard
  roundRect(ctx, -26, -22, 52, 8, 4, "#222222");

  // body / frame
  roundRect(ctx, -14, -34, 30, 16, 6, "#1a1a1a");
  roundRect(ctx, -12, -32, 26, 12, 5, "#2a2a2a");

  // seat
  roundRect(ctx, -20, -40, 22, 8, 4, "#0d0d0d");
  roundRect(ctx, -18, -42, 18, 6, 3, "#1a1a1a");

  // handlebar stem
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(18, -30);
  ctx.lineTo(24, -48);
  ctx.stroke();

  // handlebar
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(16, -50);
  ctx.lineTo(32, -50);
  ctx.stroke();

  // headlight
  ellipse(ctx, 26, -44, 4, 4, "#ffe9a0");
  if (moving) {
    ctx.globalAlpha = 0.3 + Math.sin(t * 8) * 0.1;
    ellipse(ctx, 30, -44, 8, 5, "#fff5b0");
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

/* ---------------- cottage ---------------- */

export function drawCottage(ctx: CanvasRenderingContext2D, t: number) {
  const { x, y, w, h } = COTTAGE;
  const left = x - w / 2;
  const top = y - h / 2;
  ctx.globalAlpha = 0.18;
  ellipse(ctx, x, y + h / 2 + 6, w * 0.5, 34, "#1b2a1c");
  ctx.globalAlpha = 1;

  // walls
  roundRect(ctx, left, top + 90, w, h - 90, 14, "#d8a870");
  for (let i = 0; i < 6; i++) {
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#b98a58";
    ctx.fillRect(left + 6, top + 104 + i * 45, w - 12, 6);
    ctx.globalAlpha = 1;
  }
  // roof
  ctx.beginPath();
  ctx.moveTo(left - 30, top + 100);
  ctx.lineTo(x, top - 30);
  ctx.lineTo(left + w + 30, top + 100);
  ctx.closePath();
  ctx.fillStyle = "#9c5f4e";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(left - 30, top + 100);
  ctx.lineTo(left + w + 30, top + 100);
  ctx.lineTo(left + w + 30, top + 116);
  ctx.lineTo(left - 30, top + 116);
  ctx.closePath();
  ctx.fillStyle = "#844e40";
  ctx.fill();

  // windows
  const win = (wx: number) => {
    roundRect(ctx, wx - 34, top + 150, 68, 62, 8, "#7a4b3a");
    roundRect(ctx, wx - 28, top + 156, 56, 50, 6, "#ffe9b0");
    ctx.fillStyle = "#7a4b3a";
    ctx.fillRect(wx - 2, top + 156, 4, 50);
    ctx.fillRect(wx - 28, top + 179, 56, 4);
  };
  win(left + 90);
  win(left + w - 90);

  // door
  const dx = x;
  const dyTop = top + h - 140;
  roundRect(ctx, dx - 44, dyTop, 88, 140, 40, "#7a4b3a");
  roundRect(ctx, dx - 36, dyTop + 8, 72, 132, 34, "#a5674a");
  ellipse(ctx, dx + 22, dyTop + 78, 5, 5, "#ffd88a");
  const glow = 0.35 + Math.sin(t * 2) * 0.08;
  ctx.globalAlpha = glow;
  ellipse(ctx, dx, dyTop + 150, 78, 26, "#ffdf9e");
  ctx.globalAlpha = 1;
  // flower pots
  roundRect(ctx, dx - 100, dyTop + 96, 34, 34, 8, "#c98c63");
  ellipse(ctx, dx - 83, dyTop + 92, 20, 14, "#66b972");
  ellipse(ctx, dx - 90, dyTop + 86, 5, 5, "#ffffff");
  ellipse(ctx, dx - 76, dyTop + 88, 5, 5, "#f7a8c4");
  roundRect(ctx, dx + 66, dyTop + 96, 34, 34, 8, "#c98c63");
  ellipse(ctx, dx + 83, dyTop + 92, 20, 14, "#66b972");
  ellipse(ctx, dx + 90, dyTop + 86, 5, 5, "#ffffff");
  ellipse(ctx, dx + 76, dyTop + 88, 5, 5, "#f7a8c4");
}

/* ---------------- interior ---------------- */

export function drawInterior(ctx: CanvasRenderingContext2D, t: number) {
  const { w, h } = INDOOR;
  // floor
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#c99a68");
  g.addColorStop(1, "#b3814f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.22;
  for (let y = 240; y < h; y += 46) {
    ctx.fillStyle = "#8f6339";
    ctx.fillRect(0, y, w, 3);
  }
  ctx.globalAlpha = 1;

  // back wall
  ctx.fillStyle = "#a3703f";
  ctx.fillRect(0, 0, w, 240);
  ctx.globalAlpha = 0.25;
  for (let y = 0; y < 240; y += 40) {
    ctx.fillStyle = "#8a5c31";
    ctx.fillRect(0, y, w, 4);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#7d5228";
  ctx.fillRect(0, 236, w, 12);

  // window with dreamy light
  roundRect(ctx, 120, 60, 150, 120, 10, "#6f4622");
  roundRect(ctx, 130, 70, 130, 100, 8, "#e6d5f7");
  ctx.fillStyle = "#6f4622";
  ctx.fillRect(193, 70, 5, 100);
  ctx.fillRect(130, 118, 130, 5);

  // fireplace
  roundRect(ctx, w - 300, 40, 190, 200, 12, "#8d8794");
  roundRect(ctx, w - 282, 110, 154, 130, 10, "#3a2b26");
  const fire = 0.7 + Math.sin(t * 6) * 0.15;
  ctx.globalAlpha = fire;
  ellipse(ctx, w - 205, 200, 46, 34, "#ff9a3c");
  ellipse(ctx, w - 205, 208, 26, 22, "#ffd76a");
  ctx.globalAlpha = 1;
  // mantel
  roundRect(ctx, w - 310, 36, 210, 16, 6, "#7a6e6a");
  // candle on mantel
  roundRect(ctx, w - 240, 18, 10, 22, 3, "#f0e6c8");
  ellipse(ctx, w - 235, 14, 3, 5, "#ffcc66");
  // photo frame on mantel
  roundRect(ctx, w - 180, 12, 40, 30, 4, "#6f4622");
  roundRect(ctx, w - 176, 16, 32, 22, 3, "#d4c5a0");

  // rug
  ctx.globalAlpha = 0.9;
  ellipse(ctx, w / 2, 560, 320, 150, "#c98ba8");
  ellipse(ctx, w / 2, 560, 260, 118, "#dda6bd");
  ellipse(ctx, w / 2, 560, 190, 84, "#eec2d3");
  ctx.globalAlpha = 1;

  // table
  const { x, y, w: tw, h: th } = TABLE;
  ctx.globalAlpha = 0.18;
  ellipse(ctx, x, y + th / 2 + 26, tw * 0.5, 26, "#3a2b26");
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#8a5a34";
  ctx.fillRect(x - tw / 2 + 26, y + th / 2 - 10, 18, 60);
  ctx.fillRect(x + tw / 2 - 44, y + th / 2 - 10, 18, 60);
  roundRect(ctx, x - tw / 2, y - th / 2, tw, th, 16, "#b5793f");
  roundRect(ctx, x - tw / 2 + 8, y - th / 2 + 8, tw - 16, th - 20, 12, "#cf9256");

  // bouquet of white flowers in vase
  const vx = x - 80;
  const vy = y - 20;
  roundRect(ctx, vx - 20, vy - 34, 40, 56, 12, "#dfe9f2");
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.32;
    const fx = vx + Math.cos(a) * 34;
    const fy = vy - 34 + Math.sin(a) * 30;
    ctx.strokeStyle = "#5da368";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(vx, vy - 30);
    ctx.quadraticCurveTo((vx + fx) / 2, (vy + fy) / 2 - 20, fx, fy);
    ctx.stroke();
    for (let k = 0; k < 5; k++) {
      const aa = (k / 5) * Math.PI * 2 + t * 0.2;
      ellipse(ctx, fx + Math.cos(aa) * 6, fy + Math.sin(aa) * 6, 5, 5, "#ffffff");
    }
    ellipse(ctx, fx, fy, 4, 4, "#ffd76a");
  }

  // chairs with backs and legs
  const drawChair = (cx: number, cy: number) => {
    // backrest
    roundRect(ctx, cx - 22, cy - 50, 44, 56, 8, "#7a4f30");
    roundRect(ctx, cx - 18, cy - 46, 36, 48, 6, "#9a6a40");
    // seat
    roundRect(ctx, cx - 26, cy + 2, 52, 14, 6, "#8a5a34");
    // legs
    ctx.fillStyle = "#6a4228";
    ctx.fillRect(cx - 24, cy + 14, 6, 28);
    ctx.fillRect(cx + 18, cy + 14, 6, 28);
  };
  drawChair(x - 250, y + 10);
  drawChair(x + 190, y + 10);

  // bed in corner (top-left area)
  const bx = 70;
  const by = 620;
  shadow(ctx, bx + 70, by + 50, 90);
  // bed frame
  roundRect(ctx, bx, by, 140, 100, 8, "#7a5238");
  // mattress
  roundRect(ctx, bx + 8, by + 6, 124, 88, 6, "#e8dcc8");
  // pillow
  roundRect(ctx, bx + 14, by + 10, 40, 28, 8, "#f5f0e8");
  roundRect(ctx, bx + 14, by + 10, 40, 28, 8, "#ede6d8");
  // blanket
  roundRect(ctx, bx + 8, by + 44, 124, 50, 6, "#c9a0a8");
  roundRect(ctx, bx + 8, by + 44, 124, 14, 6, "#b88a92");
  // blanket pattern stripes
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#d4b0b8";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(bx + 14 + i * 30, by + 48, 18, 42);
  }
  ctx.globalAlpha = 1;

  // bedside table with glowing lamp
  const ntx = 230;
  const nty = 640;
  roundRect(ctx, ntx, nty, 50, 50, 6, "#7a5238");
  roundRect(ctx, ntx + 4, nty + 4, 42, 42, 4, "#8a6240");
  // lamp base
  roundRect(ctx, ntx + 18, nty - 20, 14, 22, 4, "#5a4030");
  // lamp shade
  ctx.beginPath();
  ctx.moveTo(ntx + 10, nty - 20);
  ctx.lineTo(ntx + 40, nty - 20);
  ctx.lineTo(ntx + 34, nty - 44);
  ctx.lineTo(ntx + 16, nty - 44);
  ctx.closePath();
  ctx.fillStyle = "#fff5d0";
  ctx.fill();
  // lamp glow
  const lampGlow = 0.25 + Math.sin(t * 2.5) * 0.06;
  ctx.globalAlpha = lampGlow;
  ellipse(ctx, ntx + 25, nty - 32, 40, 30, "#ffe9a0");
  ctx.globalAlpha = 1;

  // bookshelf on the right wall
  const sx = w - 200;
  const sy = 250;
  roundRect(ctx, sx, sy, 120, 180, 6, "#6a4228");
  roundRect(ctx, sx + 4, sy + 4, 112, 172, 4, "#7a5238");
  // shelves
  ctx.fillStyle = "#5a3818";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(sx + 4, sy + 4 + i * 44, 112, 4);
  }
  // books on shelves
  const bookColors = ["#a04040", "#4060a0", "#50a060", "#a08040", "#8040a0", "#40a0a0"];
  for (let row = 0; row < 4; row++) {
    let bx2 = sx + 8;
    for (let col = 0; col < 5; col++) {
      const bh = 34 + ((row * 3 + col * 7) % 6);
      const bw = 12 + ((row * 5 + col * 3) % 6);
      const bc = bookColors[(row * 5 + col) % bookColors.length] ?? "#a04040";
      roundRect(ctx, bx2, sy + 8 + row * 44 + (38 - bh), bw, bh, 2, bc);
      bx2 += bw + 2;
      if (bx2 > sx + 112 - 12) break;
    }
  }

  // storage chest near bed
  const cx2 = 70;
  const cy2 = 740;
  shadow(ctx, cx2 + 45, cy2 + 30, 55);
  roundRect(ctx, cx2, cy2, 90, 50, 6, "#6a4228");
  roundRect(ctx, cx2 + 4, cy2 + 4, 82, 42, 4, "#7a5238");
  // lid
  roundRect(ctx, cx2, cy2 - 8, 90, 16, 6, "#5a3818");
  roundRect(ctx, cx2 + 4, cy2 - 6, 82, 12, 4, "#6a4228");
  // lock
  roundRect(ctx, cx2 + 38, cy2 + 16, 14, 14, 3, "#c0a060");
  ellipse(ctx, cx2 + 45, cy2 + 23, 3, 3, "#5a4030");

  // wall decor - framed picture
  roundRect(ctx, w - 380, 50, 60, 50, 4, "#6f4622");
  roundRect(ctx, w - 376, 54, 52, 42, 3, "#d4c5a0");
  // simple heart in picture
  ctx.fillStyle = "#c45a6a";
  ctx.font = "700 28px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("\u2665", w - 350, 76);

  // potted plant near window
  roundRect(ctx, 300, 180, 34, 34, 8, "#c98c63");
  ellipse(ctx, 317, 176, 20, 14, "#66b972");
  ellipse(ctx, 310, 168, 8, 10, "#57ab63");
  ellipse(ctx, 324, 170, 8, 10, "#57ab63");
  ellipse(ctx, 317, 162, 7, 9, "#68bd72");

  // exit door (bottom)
  roundRect(ctx, EXIT_DOOR.x - 60, INDOOR.h - 40, 120, 40, 12, "#7a4b3a");
  ctx.fillStyle = "rgba(255,236,190,0.5)";
  ctx.font = "600 20px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("exit", EXIT_DOOR.x, INDOOR.h - 12);

  // warm vignette light
  const rg = ctx.createRadialGradient(w / 2, 300, 60, w / 2, 400, 780);
  rg.addColorStop(0, "rgba(255,206,140,0.10)");
  rg.addColorStop(1, "rgba(48,22,10,0.52)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);
}

/* ---------------- Talha (kneeling proposal) ---------------- */

export function drawTalha(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  shadow(ctx, x, y + 2, 24);
  ctx.save();
  ctx.translate(x, y);

  const breathe = Math.sin(t * 2) * 0.8;

  // kneeling body — lowered
  // back knee (right leg, folded under)
  roundRect(ctx, 8, -16, 18, 20, 6, "#2a3548");
  // front knee (left leg, on one knee)
  roundRect(ctx, -20, -12, 16, 16, 6, "#2a3548");
  // shoe
  roundRect(ctx, -24, -2, 18, 7, 3, "#1a1a2a");
  roundRect(ctx, 10, 0, 16, 7, 3, "#1a1a2a");

  // body / torso (leaning forward slightly)
  ctx.save();
  ctx.translate(0, -breathe);
  roundRect(ctx, -16, -52, 32, 38, 12, "#3b5c7a");
  roundRect(ctx, -14, -44, 28, 28, 10, "#4a6e8e");
  // shirt collar
  roundRect(ctx, -8, -52, 16, 8, 4, "#2a4560");

  // arms — both hands extended forward holding the letter
  roundRect(ctx, -24, -46, 10, 28, 4, "#e8c4a0");
  roundRect(ctx, 14, -46, 10, 28, 4, "#e8c4a0");
  // hands
  ellipse(ctx, -22, -20, 7, 7, "#e8c4a0");
  ellipse(ctx, 22, -20, 7, 7, "#e8c4a0");

  // the letter held in hands
  const letterFloat = Math.sin(t * 1.5) * 1.5;
  ctx.save();
  ctx.translate(0, -26 + letterFloat);
  // letter glow
  const lglow = 0.2 + Math.sin(t * 3) * 0.1;
  ctx.globalAlpha = lglow;
  ellipse(ctx, 0, 0, 44, 30, "#ffe9b0");
  ctx.globalAlpha = 1;
  // letter paper
  roundRect(ctx, -24, -16, 48, 32, 4, "#fff8ee");
  ctx.strokeStyle = "#e6cfae";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-24, -16, 48, 32);
  // wax seal
  ellipse(ctx, 0, 0, 7, 7, "#c45a6a");
  ctx.fillStyle = "#e08090";
  ctx.font = "700 8px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("L", 0, 0);
  ctx.restore();

  // head
  ellipse(ctx, 0, -66, 16, 16, "#e8c4a0");
  // hair — distinct from player (shorter, warmer tone)
  ctx.beginPath();
  ctx.ellipse(0, -73, 17, 13, 0, Math.PI, 0);
  ctx.fillStyle = "#2a1a10";
  ctx.fill();
  // side hair
  ellipse(ctx, -13, -66, 5, 10, "#2a1a10");
  ellipse(ctx, 13, -66, 5, 10, "#2a1a10");
  // face — looking up at player
  ellipse(ctx, -5, -64, 2.4, 3, "#1a1a2a");
  ellipse(ctx, 5, -64, 2.4, 3, "#1a1a2a");
  // blush
  ellipse(ctx, -9, -59, 3, 2, "#e8a0a0");
  ellipse(ctx, 9, -59, 3, 2, "#e8a0a0");
  // hopeful smile
  ctx.strokeStyle = "#8a5040";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, -60, 4, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  ctx.restore();
  ctx.restore();

  drawNameTag(ctx, x, y - 92, "Talha", "rgba(30,40,60,0.72)", "#ffffff");
}

/* ---------------- characters ---------------- */

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: Dir,
  walkT: number,
  moving: boolean,
  name: string,
) {
  const swing = moving ? Math.sin(walkT * 10) : 0;
  const bob = moving ? Math.abs(Math.sin(walkT * 10)) * 2.5 : Math.sin(walkT * 2) * 1.2;
  const flip = dir === "left" ? -1 : 1;

  shadow(ctx, x, y + 2, 20);
  ctx.save();
  ctx.translate(x, y - bob);
  ctx.scale(flip, 1);

  // legs
  ctx.fillStyle = "#4b3f6b";
  roundRect(ctx, -11 + swing * 4, -22, 9, 24, 4, "#4b3f6b");
  roundRect(ctx, 2 - swing * 4, -22, 9, 24, 4, "#584a7e");
  // shoes
  roundRect(ctx, -12 + swing * 4, -4, 11, 7, 3, "#2f2745");
  roundRect(ctx, 1 - swing * 4, -4, 11, 7, 3, "#2f2745");
  // body
  roundRect(ctx, -15, -52, 30, 34, 12, "#f2f2fa");
  roundRect(ctx, -15, -40, 30, 22, 10, "#cbb7f2");
  // arms
  roundRect(ctx, -21, -50 - swing * 3, 8, 24, 4, "#f7d9c4");
  roundRect(ctx, 13, -50 + swing * 3, 8, 24, 4, "#f7d9c4");
  // head
  ellipse(ctx, 0, -66, 17, 17, "#f7d9c4");
  // hair
  ctx.beginPath();
  ctx.ellipse(0, -74, 18, 15, 0, Math.PI, 0);
  ctx.fillStyle = "#3b2f4d";
  ctx.fill();
  ellipse(ctx, -14, -66, 6, 12, "#3b2f4d");
  ellipse(ctx, 14, -66, 6, 12, "#3b2f4d");
  // face
  if (dir !== "up") {
    ellipse(ctx, -6, -64, 2.4, 3, "#2f2745");
    ellipse(ctx, 6, -64, 2.4, 3, "#2f2745");
    ellipse(ctx, -10, -59, 3.4, 2.4, "#f7b7c2");
    ellipse(ctx, 10, -59, 3.4, 2.4, "#f7b7c2");
    ctx.strokeStyle = "#a56a63";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, -60, 4, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();

  drawNameTag(ctx, x, y - 96, name, "rgba(45,32,64,0.72)", "#ffffff");
}

export function drawPlayerOnScooty(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: Dir,
  name: string,
  t: number,
  moving: boolean,
) {
  const flip = dir === "left" ? -1 : 1;
  shadow(ctx, x, y + 4, 36);

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip, 1);

  // scooty (drawn without its own shadow since we already cast one)
  // rear wheel
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(-22, -8, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#333333";
  ctx.beginPath();
  ctx.arc(-22, -8, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#555555";
  ctx.lineWidth = 1.5;
  const spin = moving ? t * 14 : 0;
  for (let i = 0; i < 4; i++) {
    const a = spin + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(-22, -8);
    ctx.lineTo(-22 + Math.cos(a) * 9, -8 + Math.sin(a) * 9);
    ctx.stroke();
  }
  // front wheel
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(24, -8, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#333333";
  ctx.beginPath();
  ctx.arc(24, -8, 10, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    const a = spin + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(24, -8);
    ctx.lineTo(24 + Math.cos(a) * 9, -8 + Math.sin(a) * 9);
    ctx.stroke();
  }
  // deck
  roundRect(ctx, -26, -22, 52, 8, 4, "#222222");
  // body
  roundRect(ctx, -14, -34, 30, 16, 6, "#1a1a1a");
  roundRect(ctx, -12, -32, 26, 12, 5, "#2a2a2a");
  // seat
  roundRect(ctx, -20, -40, 22, 8, 4, "#0d0d0d");
  // handlebar stem
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(18, -30);
  ctx.lineTo(24, -48);
  ctx.stroke();
  // handlebar
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(16, -50);
  ctx.lineTo(32, -50);
  ctx.stroke();
  // headlight
  ellipse(ctx, 26, -44, 4, 4, "#ffe9a0");

  // player sitting on scooty — legs positioned on footboard
  const bob = moving ? Math.abs(Math.sin(t * 8)) * 1.5 : Math.sin(t * 2) * 0.6;
  ctx.translate(0, -bob);
  // legs (sitting, feet on deck)
  roundRect(ctx, -18, -22, 10, 14, 4, "#4b3f6b");
  roundRect(ctx, 6, -22, 10, 14, 4, "#584a7e");
  // shoes on footboard
  roundRect(ctx, -20, -12, 12, 6, 3, "#2f2745");
  roundRect(ctx, 6, -12, 12, 6, 3, "#2f2745");
  // body (sitting upright)
  roundRect(ctx, -15, -54, 30, 34, 12, "#f2f2fa");
  roundRect(ctx, -15, -42, 30, 22, 10, "#cbb7f2");
  // arms reaching to handlebar
  roundRect(ctx, 10, -48, 8, 18, 4, "#f7d9c4");
  roundRect(ctx, -18, -50, 8, 14, 4, "#f7d9c4");
  // head
  ellipse(ctx, 0, -68, 17, 17, "#f7d9c4");
  // hair
  ctx.beginPath();
  ctx.ellipse(0, -76, 18, 15, 0, Math.PI, 0);
  ctx.fillStyle = "#3b2f4d";
  ctx.fill();
  ellipse(ctx, -14, -68, 6, 12, "#3b2f4d");
  ellipse(ctx, 14, -68, 6, 12, "#3b2f4d");
  // face
  if (dir !== "up") {
    ellipse(ctx, -6, -66, 2.4, 3, "#2f2745");
    ellipse(ctx, 6, -66, 2.4, 3, "#2f2745");
    ellipse(ctx, -10, -61, 3.4, 2.4, "#f7b7c2");
    ellipse(ctx, 10, -61, 3.4, 2.4, "#f7b7c2");
    ctx.strokeStyle = "#a56a63";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, -62, 4, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  ctx.restore();

  // Pillow sitting behind player on the scooty
  ctx.save();
  ctx.translate(x - 30 * flip, y - 6);
  ctx.scale(flip, 1);
  // cat body sitting
  ellipse(ctx, 0, -18, 16, 11, "#ffffff");
  // head
  ellipse(ctx, -10, -28, 11, 10, "#ffffff");
  // ears
  ctx.beginPath();
  ctx.moveTo(-18, -33);
  ctx.lineTo(-15, -42);
  ctx.lineTo(-11, -34);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-8, -35);
  ctx.lineTo(-4, -43);
  ctx.lineTo(-1, -35);
  ctx.closePath();
  ctx.fill();
  // eyes
  ellipse(ctx, -14, -29, 2, 2.6, "#3b3546");
  ellipse(ctx, -7, -29, 2, 2.6, "#3b3546");
  ellipse(ctx, -11, -25, 2.2, 1.6, "#f2a3b8");
  // tail hanging
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(12, -16);
  ctx.quadraticCurveTo(20, -10 + Math.sin(t * 3) * 4, 16, -2 + Math.sin(t * 3) * 3);
  ctx.stroke();
  ctx.restore();

  drawNameTag(ctx, x, y - 100, name, "rgba(45,32,64,0.72)", "#ffffff");
}

export function drawCat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: Dir,
  walkT: number,
  moving: boolean,
  sleeping: boolean,
  t: number,
) {
  const flip = dir === "left" ? -1 : 1;
  shadow(ctx, x, y + 2, 16);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip, 1);

  if (sleeping) {
    const breathe = Math.sin(t * 2) * 1.2;
    ellipse(ctx, 0, -10 + breathe * 0.2, 26, 13 + breathe * 0.2, "#ffffff");
    ellipse(ctx, -18, -14, 12, 10, "#fdfdff");
    // curled tail
    ctx.strokeStyle = "#f2f2f7";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(20, -10, 12, Math.PI * 0.2, Math.PI * 1.4);
    ctx.stroke();
    // ears
    ctx.beginPath();
    ctx.moveTo(-24, -20);
    ctx.lineTo(-20, -28);
    ctx.lineTo(-15, -20);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-13, -21);
    ctx.lineTo(-9, -29);
    ctx.lineTo(-5, -21);
    ctx.closePath();
    ctx.fill();
    // closed eyes
    ctx.strokeStyle = "#6b6472";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(-22, -15, 3, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.arc(-14, -15, 3, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  } else {
    const swing = moving ? Math.sin(walkT * 12) : 0;
    const bob = moving ? Math.abs(Math.sin(walkT * 12)) * 1.6 : Math.sin(t * 2) * 0.8;
    ctx.translate(0, -bob);
    // legs
    roundRect(ctx, -12 + swing * 3, -12, 6, 13, 3, "#eceaf2");
    roundRect(ctx, 5 - swing * 3, -12, 6, 13, 3, "#eceaf2");
    // tail
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(14, -18);
    ctx.quadraticCurveTo(26, -26 + Math.sin(t * 5) * 6, 20, -38 + Math.sin(t * 5) * 4);
    ctx.stroke();
    // body
    ellipse(ctx, 0, -20, 18, 12, "#ffffff");
    // head
    ellipse(ctx, -14, -30, 12, 11, "#ffffff");
    ctx.beginPath();
    ctx.moveTo(-24, -36);
    ctx.lineTo(-21, -45);
    ctx.lineTo(-15, -37);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-12, -38);
    ctx.lineTo(-7, -46);
    ctx.lineTo(-4, -37);
    ctx.closePath();
    ctx.fill();
    ellipse(ctx, -18, -31, 2, 2.6, "#3b3546");
    ellipse(ctx, -10, -31, 2, 2.6, "#3b3546");
    ellipse(ctx, -14, -27, 2.2, 1.6, "#f2a3b8");
  }
  ctx.restore();

  drawNameTag(ctx, x, y - (sleeping ? 46 : 62), "Pillow", "rgba(64,44,86,0.6)", "#ffe9f3");

  if (sleeping) {
    for (let i = 0; i < 4; i++) {
      const p = ((t * 0.45 + i * 0.25) % 1);
      const alpha = Math.sin(p * Math.PI);
      ctx.globalAlpha = alpha * 0.95;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(70,50,95,0.55)";
      ctx.lineWidth = 3;
      const size = 13 + p * 12;
      ctx.font = `700 ${size}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const zx = x + 26 + p * 26 + Math.sin(p * 6 + i) * 6;
      const zy = y - 40 - p * 60;
      ctx.strokeText("z", zx, zy);
      ctx.fillText("z", zx, zy);
      ctx.globalAlpha = 1;
    }
  }
}

function drawNameTag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  bg: string,
  fg: string,
) {
  ctx.font = "600 13px ui-rounded, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const w = Math.max(38, ctx.measureText(text).width + 18);
  roundRect(ctx, x - w / 2, y - 11, w, 22, 11, bg);
  ctx.fillStyle = fg;
  ctx.fillText(text, x, y + 1);
}
