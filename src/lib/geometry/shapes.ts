import type { Cutout } from '../types'

export interface Vec2 {
  x: number
  y: number
}

function sampleArc(
  cx: number,
  cy: number,
  r: number,
  startRad: number,
  endRad: number,
  segments: number
): Vec2[] {
  const pts: Vec2[] = []
  for (let i = 0; i <= segments; i++) {
    const a = startRad + ((endRad - startRad) * i) / segments
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) })
  }
  return pts
}

export function localPolygon(c: Cutout): Vec2[] {
  const cl = c.clearance || 0
  const s = c.scale || 1
  switch (c.type) {
    case 'circle': {
      const r = (c.diameter / 2) * s + cl
      const pts: Vec2[] = []
      const N = 64
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2
        pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) })
      }
      return pts
    }
    case 'capsule': {
      const w = c.width * s + 2 * cl
      const h = c.height * s + 2 * cl
      const r = w / 2
      const ys = h / 2 - r
      const pts: Vec2[] = [
        { x: r, y: ys },
        { x: r, y: -ys }
      ]
      const bot = sampleArc(0, -ys, r, 0, -Math.PI, 16)
      for (let i = 1; i < bot.length; i++) pts.push(bot[i])
      pts.push({ x: -r, y: ys })
      const top = sampleArc(0, ys, r, Math.PI, 0, 16)
      for (let i = 1; i < top.length; i++) pts.push(top[i])
      return pts
    }
    case 'rounded-rect': {
      const w = c.width * s + 2 * cl
      const h = c.height * s + 2 * cl
      const r = Math.min((c.radius * s + cl) || 1, w / 2, h / 2)
      const hw = w / 2
      const hh = h / 2
      const pts: Vec2[] = [{ x: -hw + r, y: hh }]
      const topRight = sampleArc(hw - r, hh - r, r, Math.PI / 2, 0, 8)
      const bottomRight = sampleArc(hw - r, -hh + r, r, 0, -Math.PI / 2, 8)
      const bottomLeft = sampleArc(-hw + r, -hh + r, r, -Math.PI / 2, -Math.PI, 8)
      const topLeft = sampleArc(-hw + r, hh - r, r, Math.PI, Math.PI / 2, 8)
      pts.push({ x: hw - r, y: hh })
      for (let i = 1; i < topRight.length; i++) pts.push(topRight[i])
      pts.push({ x: hw, y: -hh + r })
      for (let i = 1; i < bottomRight.length; i++) pts.push(bottomRight[i])
      pts.push({ x: -hw + r, y: -hh })
      for (let i = 1; i < bottomLeft.length; i++) pts.push(bottomLeft[i])
      pts.push({ x: -hw, y: hh - r })
      for (let i = 1; i < topLeft.length; i++) pts.push(topLeft[i])
      return pts
    }
    case 'rectangle': {
      const w = c.width * s + 2 * cl
      const h = c.height * s + 2 * cl
      const hw = w / 2
      const hh = h / 2
      return [
        { x: hw, y: hh },
        { x: hw, y: -hh },
        { x: -hw, y: -hh },
        { x: -hw, y: hh }
      ]
    }
    case 'triangle': {
      const w = c.width * s + 2 * cl
      const h = c.height * s + 2 * cl
      const hw = w / 2
      const hh = h / 2
      return [
        { x: -hw, y: hh },
        { x: hw, y: hh },
        { x: 0, y: -hh }
      ]
    }
    case 'diamond': {
      const w = c.width * s + 2 * cl
      const h = c.height * s + 2 * cl
      const hw = w / 2
      const hh = h / 2
      return [
        { x: 0, y: hh },
        { x: hw, y: 0 },
        { x: 0, y: -hh },
        { x: -hw, y: 0 }
      ]
    }
    case 'hexagon': {
      const w = c.width * s + 2 * cl
      const h = c.height * s + 2 * cl
      const hw = w / 2
      const hh = h / 2
      const qw = w / 4
      return [
        { x: qw, y: hh },
        { x: hw, y: 0 },
        { x: qw, y: -hh },
        { x: -qw, y: -hh },
        { x: -hw, y: 0 },
        { x: -qw, y: hh }
      ]
    }
  }
}