export type Dir = "up" | "down" | "left" | "right";

export interface Actor {
  x: number;
  y: number;
  dir: Dir;
  walkT: number;
  moving: boolean;
}

export interface Prop {
  kind: "tree" | "flower" | "tulip" | "bush" | "rock";
  x: number;
  y: number;
  s: number;
  tint?: string;
}

export interface Camera {
  x: number;
  y: number;
}

export type Scene = "outdoor" | "indoor";
