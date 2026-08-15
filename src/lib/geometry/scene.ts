import * as THREE from 'three'
import type { InsertParameters } from '../types'
import { supportHeight } from '../types'
import { unitedCutouts } from './polygons'

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

  for (const pts of unitedCutouts(params)) {
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
  plate.rotation.x = -Math.PI / 2
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
    hwBox.position.set(sx * (hw - len / 2), plateThickness + sH / 2, sy * (hd - ins - hs / 2))
    group.add(hwBox)

    // vertical wall (along Z)
    const vwBox = new THREE.Mesh(
      new THREE.BoxGeometry(hs, sH, len)
    )
    vwBox.position.set(sx * (hw - ins - hs / 2), plateThickness + sH / 2, sy * (hd - len / 2))
    group.add(vwBox)
  }

  return group
}