export enum AVATAR_ALGO {
  MOSAIC = "mosaic",
  WEAVE = "weave",
  SIGIL = "sigil",
  RADIAL = "radial",
  PIXEL = "pixel",
}

export const ALGO_DESCRIPTIONS: Record<AVATAR_ALGO, string> = {
  mosaic: "几何拼图风 — 对称分割与三角/方块构图，视觉活泼。",
  weave: "星轨交织 — 曲线与轨迹，表现流动感与层次。",
  sigil: "生成徽章 — 简洁线条，适合做标识或头像印章。",
  radial: "径向新星 — 同心弧线与放射状笔触，聚焦中心。",
  pixel: "像素方块 — 复古像素风，适合低多边形感头像。",
};

export const PALETTES = [
  {
    bg: "#ffffff",
    fg: ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff"],
  },
  { bg: "#ffffff", fg: ["#00b4d8", "#0077b6", "#03045e"] },
  {
    bg: "#ffffff",
    fg: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
  },
  {
    bg: "#ffffff",
    fg: ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"],
  },
  { bg: "#ffffff", fg: ["#000000", "#14213d", "#fca311", "#e5e5e5"] },
];