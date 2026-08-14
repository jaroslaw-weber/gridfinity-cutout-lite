import type { CutoutType } from '../lib/types'

interface Pt {
  x: number
  y: number
}

function circlePts(segments = 16): Pt[] {
  const pts: Pt[] = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push({ x: Math.cos(a), y: Math.sin(a) })
  }
  return pts
}

function rectPts(w: number, h: number): Pt[] {
  const hw = w / 2
  const hh = h / 2
  return [
    { x: hw, y: hh },
    { x: hw, y: -hh },
    { x: -hw, y: -hh },
    { x: -hw, y: hh }
  ]
}

function roundedRectPts(w: number, h: number, r: number): Pt[] {
  const hw = w / 2
  const hh = h / 2
  const rr = Math.min(r, hw, hh)
  const corners: Array<[number, number, number, number]> = [
    [hw - rr, hh - rr, 0, Math.PI / 2],
    [hw - rr, -hh + rr, Math.PI / 2, Math.PI],
    [-hw + rr, -hh + rr, Math.PI, (3 * Math.PI) / 2],
    [-hw + rr, hh - rr, (3 * Math.PI) / 2, Math.PI * 2]
  ]
  const pts: Pt[] = []
  for (const [cx, cy, from, to] of corners) {
    for (let i = 0; i <= 4; i++) {
      const a = from + ((to - from) * i) / 4
      pts.push({ x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) })
    }
  }
  return pts
}

function normalizedPoints(type: CutoutType): Pt[] {
  switch (type) {
    case 'circle':
      return circlePts(16)
    case 'capsule':
      return capsulePts()
    case 'rounded-rect':
      return roundedRectPts(3.2, 5, 1)
    case 'rectangle':
      return rectPts(4, 5)
  }
}

function capsulePts(): Pt[] {
  const w = 3
  const h = 5
  const r = w / 2
  const ys = h / 2 - r
  const arc = (ca: number, cb: number, cy: number) => {
    const pts: Pt[] = []
    for (let i = 0; i <= 8; i++) {
      const a = ca + ((cb - ca) * i) / 8
      pts.push({ x: r * Math.cos(a), y: cy + r * Math.sin(a) })
    }
    return pts
  }
  return [
    { x: r, y: ys },
    { x: r, y: -ys },
    ...arc(Math.PI / 2, -Math.PI / 2, -ys),
    { x: -r, y: -ys },
    { x: -r, y: ys },
    ...arc(-Math.PI / 2, Math.PI / 2, ys)
  ]
}

export default function CutoutIcon({
  type,
  size = 18
}: {
  type: CutoutType
  size?: number
}) {
  const pts = normalizedPoints(type)
  const max = Math.max(...pts.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))))
  const pad = 0.25
  const scale = 5 / (max + pad)
  const points = pts
    .map((p) => `${(p.x * scale).toFixed(3)},${(p.y * scale).toFixed(3)}`)
    .join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox="-6 -6 12 12"
      style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}
      aria-hidden="true"
    >
      <polygon
        points={points}
        fill="currentColor"
        fillOpacity={0.15}
        stroke="currentColor"
        strokeWidth={0.22}
        strokeLinejoin="round"
      />
    </svg>
  )
}
