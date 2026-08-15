import type { Cutout, CutoutType } from '../lib/types'
import { makeCutout } from '../lib/types'
import { localPolygon } from '../lib/geometry'

interface Pt {
  x: number
  y: number
}

export default function CutoutIcon({
  type,
  cutout,
  size = 18
}: {
  type?: CutoutType
  cutout?: Cutout
  size?: number
}) {
  let c: Cutout
  if (cutout) {
    c = cutout
  } else if (type) {
    c = makeCutout(type, Date.now())
  } else {
    return null
  }

  const pts = localPolygon(c) as Pt[]
  const max = Math.max(1, ...pts.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))))
  const scale = 5 / (max + 0.5)
  const points = pts
    .map((p) => `${(p.x * scale).toFixed(3)},${(p.y * scale).toFixed(3)}`)
    .join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox="-7 -7 14 14"
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