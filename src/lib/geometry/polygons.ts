import polygonClipping from 'polygon-clipping'
import type { Cutout, InsertParameters } from '../types'
import type { Vec2 } from './shapes'
import { localPolygon } from './shapes'

function transformPolygon(pts: Vec2[], c: Cutout): Vec2[] {
  const rad = (c.rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return pts.map((p) => ({
    x: p.x * cos - p.y * sin + c.x,
    y: p.x * sin + p.y * cos + c.y
  }))
}

export function plateRect(params: Pick<InsertParameters, 'width' | 'depth'>): Vec2[] {
  const hw = params.width / 2
  const hd = params.depth / 2
  return [
    { x: hw, y: hd },
    { x: hw, y: -hd },
    { x: -hw, y: -hd },
    { x: -hw, y: hd }
  ]
}

export function cutoutPoints(c: Cutout): Vec2[] {
  return transformPolygon(localPolygon(c), c)
}

function signedArea(pts: Vec2[]): number {
  let sum = 0
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    const q = pts[(i + 1) % pts.length]
    sum += p.x * q.y - q.x * p.y
  }
  return sum / 2
}

// Compute the boolean union of all cutout polygons so that overlapping
// cutouts merge into a single (possibly multi-contour) hole shape. Returns
// rings wound in the same direction as the plate outline (clockwise).
export function unitedCutouts(params: InsertParameters): Vec2[][] {
  const polys = params.cutouts.map((c) => [
    cutoutPoints(c).map((p) => [p.x, p.y] as [number, number])
  ])
  const result = polygonClipping.union(polys) as Array<Array<Array<[number, number]>>>
  const rings: Vec2[][] = []
  for (const poly of result) {
    for (const ring of poly) {
      const pts = ring.map(([x, y]) => ({ x, y }))
      if (signedArea(pts) > 0) pts.reverse()
      rings.push(pts)
    }
  }
  return rings
}