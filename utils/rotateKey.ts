export interface Point {
  x: number
  y: number
}

export interface RectPoint {
  topL: Point
  topR: Point
  bottomL: Point
  bottomR: Point
}

function rotatePoint(
  { x, y }: Point,
  { rx, ry, r }: { rx: number; ry: number; r: number }
): Point {
  function radian(deg: number) {
    return deg * (Math.PI / 180)
  }

  const rad = radian(r)
  return {
    x: rx + (x - rx) * Math.cos(rad) - (y - ry) * Math.sin(rad),
    y: ry + (x - rx) * Math.sin(rad) + (y - ry) * Math.cos(rad),
  }
}

export function rotateRect(
  { x, y }: Point,
  { width, height }: { width: number; height: number },
  rotateParam: { rx: number; ry: number; r: number }
): RectPoint {
  return {
    topL: rotatePoint({ x, y }, rotateParam),
    topR: rotatePoint({ x: x + width, y }, rotateParam),
    bottomL: rotatePoint({ x, y: y + height }, rotateParam),
    bottomR: rotatePoint({ x: x + width, y: y + height }, rotateParam),
  }
}
