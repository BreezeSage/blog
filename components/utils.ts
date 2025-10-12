import { PALETTES } from "./constant";

/**
 * HashConsumer
 *
 * 一个小工具，用于消费十六进制字符串（通常是像 SHA-256 这样的哈希），
 * 并返回在 [0, 1] 范围内的确定性伪随机数。
 *
 * 使用示例：
 *   const consumer = new HashConsumer(hexHash)
 *   const value = consumer.getValue() // 返回一个 0 到 1 之间的数
 *   const twoHexDigitsValue = consumer.getValue(2) // 消费 2 个十六进制字符
 *
 * 实现说明：
 * - 内部维护一个游标（`index`），每次消费 t 个十六进制字符后，游标前进 t
 *   个字符；当到达末尾时会环回到开头。
 * - getValue(t) 会读取 t 个十六进制字符，将其解析为 16 进制整数，
 *   然后除以 (16^t - 1) 进行归一化，从而返回 [0,1] 范围内的数值。
 */
export class HashConsumer {
  private hash: string;
  private index: number;

  /**
   * 创建一个 HashConsumer 实例。
   * @param hexHash - 十六进制字符串（例如 SHA-256 的十六进制表示）
   */
  constructor(hexHash: string) {
    this.hash = hexHash;
    this.index = 0;
  }

  /**
   * 从哈希中消费 t 个十六进制字符并返回归一化后的值（0 到 1）。
   * @param t - 要消费的十六进制字符数量（默认：1）
   * @returns 返回一个位于 [0, 1] 的数字
   */
  getValue(t = 1) {
    const chunk = this.hash.substring(this.index, this.index + t);
    // 前进游标并在末尾回绕
    this.index = (this.index + t) % this.hash.length;
    return parseInt(chunk, 16) / (Math.pow(16, t) - 1);
  }
}

export async function generateHash(t: string) {
  const e = new TextEncoder(),
    s = e.encode(t),
    i = await crypto.subtle.digest("SHA-256", s);
  return Array.from(new Uint8Array(i))
    .map((t) => t.toString(16).padStart(2, "0"))
    .join("");
}

function drawMosaicAvatar(t: CanvasRenderingContext2D, e: string) {
  const s = new HashConsumer(e),
    i = t.canvas.width,
    a = PALETTES[Math.floor(s.getValue(2) * PALETTES.length)];
  (t.fillStyle = a.bg), t.fillRect(0, 0, i, i);
  const o = 4 + Math.floor(8 * s.getValue(1)),
    l = i / o;
  for (let e = 0; e < Math.ceil(o / 2); e++)
    for (let r = 0; r < o; r++) {
      const n = s.getValue(1),
        c = a.fg[Math.floor(s.getValue(1) * a.fg.length)];
      if (
        ((t.fillStyle = c), (t.strokeStyle = c), (t.lineWidth = 1), n < 0.33)
      ) {
        const s = e * l,
          n = r * l;
        t.beginPath(),
          t.moveTo(s, n),
          t.lineTo(s + l, n),
          t.lineTo(s, n + l),
          t.closePath(),
          t.fill(),
          t.beginPath(),
          t.moveTo(i - s, n),
          t.lineTo(i - s - l, n),
          t.lineTo(i - s, n + l),
          t.closePath(),
          t.fill();
      } else if (n < 0.66) {
        const a = e * l + l / 2,
          o = r * l + l / 2,
          n = 0.45 * l * s.getValue(1);
        t.beginPath(),
          t.arc(a, o, n, 0, 2 * Math.PI),
          t.fill(),
          t.beginPath(),
          t.arc(i - a, o, n, 0, 2 * Math.PI),
          t.fill();
      } else
        t.fillRect(e * l, r * l, l, l), t.fillRect(i - e * l - l, r * l, l, l);
    }
}
function drawWeaveAvatar(t: CanvasRenderingContext2D, e: string) {
  const s = new HashConsumer(e),
    i = t.canvas.width,
    a = i / 2,
    o = PALETTES[Math.floor(s.getValue(2) * PALETTES.length)];
  (t.fillStyle = o.bg), t.fillRect(0, 0, i, i);
  const l = 3 + Math.floor(4 * s.getValue(1));
  t.lineCap = "round";
  for (let e = 0; e < l; e++) {
    const l = o.fg[Math.floor(s.getValue(1) * o.fg.length)],
      r = 1 + s.getValue(1) * (i / 30),
      n = a * (0.2 + 0.7 * s.getValue(1)),
      c = s.getValue(2) * Math.PI * 2,
      h = s.getValue(2) * Math.PI * 2,
      d = a * (0.2 + 0.7 * s.getValue(1)),
      u = s.getValue(2) * Math.PI * 2,
      g = s.getValue(2) * Math.PI * 2;
    (t.strokeStyle = `${l}b3`), (t.lineWidth = r), t.beginPath();
    const m = n * Math.cos(c) + a,
      v = n * Math.sin(c) + a,
      p = d * Math.cos(u) + a,
      f = d * Math.sin(u) + a,
      x = n * Math.cos(h) + a,
      y = n * Math.sin(h) + a,
      b = d * Math.cos(g) + a,
      M = d * Math.sin(g) + a;
    t.moveTo(m, v), t.bezierCurveTo(x, y, b, M, p, f), t.stroke();
  }
}
function drawSigilAvatar(t: CanvasRenderingContext2D, e: string) {
  const s = new HashConsumer(e),
    i = t.canvas.width,
    a = 7,
    o = PALETTES[Math.floor(s.getValue(2) * PALETTES.length)];
  (t.fillStyle = o.bg), t.fillRect(0, 0, i, i);
  const l = 2 + Math.floor(3 * s.getValue(1)),
    r = 3 + Math.floor(4 * s.getValue(1)),
    n = i / 2;
  for (let c = 0; c < l; c++) {
    let l = { x: n, y: n };
    for (let h = 0; h < r; h++) {
      const r = 1 + s.getValue(1) * (i / 30),
        c = Math.round(255 * (0.4 + s.getValue(1) * 0.6))
          .toString(16)
          .padStart(2, "0"),
        d = o.fg[Math.floor(s.getValue(1) * o.fg.length)],
        u = {
          x: Math.floor(s.getValue(1) * (a / 2 + 1)) * (i / a),
          y: Math.floor(s.getValue(1) * a) * (i / a),
        };
      (t.lineWidth = r),
        (t.strokeStyle = `${d}${c}`),
        (t.lineCap = "round"),
        (t.lineJoin = "round"),
        t.beginPath(),
        t.moveTo(l.x, l.y),
        t.lineTo(u.x, u.y),
        t.stroke(),
        t.beginPath(),
        t.moveTo(i - l.x, l.y),
        t.lineTo(i - u.x, u.y),
        t.stroke(),
        (l = u);
    }
  }
}
function drawRadialAvatar(t: CanvasRenderingContext2D, e: string) {
  const s = new HashConsumer(e),
    i = t.canvas.width,
    a = i / 2,
    o = PALETTES[Math.floor(s.getValue(2) * PALETTES.length)];
  (t.fillStyle = o.bg), t.fillRect(0, 0, i, i);
  const l = 5 + Math.floor(10 * s.getValue(1));
  t.lineCap = "round";
  for (let e = 0; e < l; e++) {
    const l = a * 0.9 * s.getValue(2),
      r = 1 + s.getValue(1) * (i / 20),
      n = o.fg[Math.floor(s.getValue(1) * o.fg.length)],
      c = s.getValue(2) * Math.PI * 2,
      h = c + (1.5 * s.getValue(2) + 0.2) * Math.PI;
    (t.strokeStyle = n),
      (t.lineWidth = r),
      t.beginPath(),
      t.arc(a, a, l, c, h),
      t.stroke();
  }
}
function drawPixelAvatar(ctx: CanvasRenderingContext2D, hexHash: string) {
  const consumer = new HashConsumer(hexHash);
  const C_WIDTH = ctx.canvas.width;
  const GRID_SIZE = 5;

  const palette = PALETTES[Math.floor(consumer.getValue(2) * PALETTES.length)];
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, C_WIDTH, C_WIDTH);

  // This was the fix: Use a specific color from the palette, not a new random one.
  const fgColor =
    palette.fg[Math.floor(consumer.getValue(1) * palette.fg.length)];
  ctx.fillStyle = fgColor;

  const blockSize = C_WIDTH / GRID_SIZE;
  const midPoint = Math.ceil(GRID_SIZE / 2);

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < midPoint; x++) {
      if (consumer.getValue(1) > 0.5) {
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        ctx.fillRect(
          (GRID_SIZE - 1 - x) * blockSize,
          y * blockSize,
          blockSize,
          blockSize
        );
      }
    }
  }
}

export const ALGORITHMS = {
  mosaic: drawMosaicAvatar,
  weave: drawWeaveAvatar,
  sigil: drawSigilAvatar,
  radial: drawRadialAvatar,
  pixel: drawPixelAvatar,
};
