import * as THREE from 'three'
import { STLExporter } from 'three-stdlib'
import { insertDimension, supportHeight, type Cutout, type InsertParameters } from './types'

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

function localPolygon(c: Cutout): Vec2[] {
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
      const arc = (ca: number, cb: number, cy2: number) =>
        sampleArc(0, cy2, r, ca, cb, 16)
      const pts: Vec2[] = []
      // right side going down
      pts.push({ x: r, y: ys }, { x: r, y: -ys })
      // bottom semicircle (CCW)
      pts.push(...arc(Math.PI / 2, -Math.PI / 2, -ys))
      // left side going up
      pts.push({ x: -r, y: -ys }, { x: -r, y: ys })
      // top semicircle (CCW)
      pts.push(...arc(-Math.PI / 2, Math.PI / 2, ys))
      return pts
    }
    case 'rounded-rect': {
      const w = c.width * s + 2 * cl
      const h = c.height * s + 2 * cl
      const r = Math.min((c.radius * s + cl) || 1, w / 2, h / 2)
      const hw = w / 2
      const hh = h / 2
      const pts: Vec2[] = []
      // start at top-right, walk clockwise to produce CCW polygon
      const arc = (cx: number, cy: number, from: number, to: number) =>
        sampleArc(cx, cy, r, from, to, 8)
      pts.push(
        ...arc(hw - r, hh - r, 0, Math.PI / 2), // top-right
        ...arc(hw - r, -hh + r, Math.PI / 2, Math.PI), // bottom-right
        ...arc(-hw + r, -hh + r, Math.PI, (3 * Math.PI) / 2), // bottom-left
        ...arc(-hw + r, hh - r, (3 * Math.PI) / 2, Math.PI * 2) // top-left
      )
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
  }
}

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

export function buildScene(params: InsertParameters): THREE.Group {
  const group = new THREE.Group()

  const w = params.width
  const d = params.depth
  const sH = supportHeight(params)
  const plateThickness = params.plateThickness

  const hs = params.supportThickness
  const ins = params.supportInset
  const len = params.supportLength

  // ---- Plate (with cutout holes) ----
  const shape = new THREE.Shape()
  const hw = w / 2
  const hd = d / 2
  shape.moveTo(hw, hd)
  shape.lineTo(hw, -hd)
  shape.lineTo(-hw, -hd)
  shape.lineTo(-hw, hd)
  shape.closePath()

  for (const cutout of params.cutouts) {
    let pts = cutoutPoints(cutout)
    if (signedArea(pts) > 0) pts = pts.slice().reverse()
    const hole = new THREE.Path()
    hole.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) hole.lineTo(pts[i].x, pts[i].y)
    hole.closePath()
    shape.holes.push(hole)
  }

  const plateGeo = new THREE.ExtrudeGeometry(shape, {
    depth: plateThickness,
    bevelEnabled: false,
    curveSegments: 32
  })
  const plate = new THREE.Mesh(plateGeo)
  plate.position.y = sH
  plate.matrixAutoUpdate = true
  group.add(plate)

  // ---- Supports (L-shaped corner walls) ----
  const corners: Array<[number, number]> = [
    [-1, 1],
    [1, 1],
    [1, -1],
    [-1, -1]
  ]

  for (const [sx, sy] of corners) {
    // horizontal wall (along X)
    const hwBox = new THREE.Mesh(
      new THREE.BoxGeometry(len, sH, hs)
    )
    hwBox.position.set(sx * (hw - ins - len / 2), sH / 2, sy * (hd - ins - hs / 2))
    group.add(hwBox)

    // vertical wall (along Z)
    const vwBox = new THREE.Mesh(
      new THREE.BoxGeometry(hs, sH, len)
    )
    vwBox.position.set(sx * (hw - ins - hs / 2), sH / 2, sy * (hd - ins - len / 2))
    group.add(vwBox)
  }

  return group
}

export function exportSTL(group: THREE.Group): Blob {
  const exporter = new STLExporter()
  const result = exporter.parse(group, { binary: true }) as DataView
  const buffer = result.buffer as ArrayBuffer
  return new Blob([buffer], { type: 'application/octet-stream' })
}

export function typeLabel(c: Cutout): string {
  switch (c.type) {
    case 'circle':
      return `circle_${c.diameter}mm`
    case 'capsule':
      return `capsule_${c.width}x${c.height}mm`
    case 'rounded-rect':
      return `roundedrect_${c.width}x${c.height}mm`
    case 'rectangle':
      return `rect_${c.width}x${c.height}mm`
  }
}

export function defaultFilename(params: InsertParameters): string {
  const grid = `${params.gridX}x${params.gridY}`
  const u = `${params.heightUnits}u`
  const parts = params.cutouts.map(typeLabel)
  const suffix = parts.length === 1 ? parts[0] : `${parts.length}x_${parts[0]}`
  return `gmci_${grid}_${u}_${suffix}.stl`
}

export { insertDimension }
