export type CutoutType =
  | 'circle'
  | 'capsule'
  | 'rounded-rect'
  | 'rectangle'
  | 'triangle'
  | 'diamond'
  | 'hexagon'

export type ViewMode = 'print' | 'preview'

export interface BaseCutout {
  id: string
  type: CutoutType
  x: number
  y: number
  rotation: number
  clearance: number
  scale: number
}

export interface CircleCutout extends BaseCutout {
  type: 'circle'
  diameter: number
}

export interface CapsuleCutout extends BaseCutout {
  type: 'capsule'
  width: number
  height: number
}

export interface RoundedRectCutout extends BaseCutout {
  type: 'rounded-rect'
  width: number
  height: number
  radius: number
}

export interface RectangleCutout extends BaseCutout {
  type: 'rectangle'
  width: number
  height: number
}

export interface TriangleCutout extends BaseCutout {
  type: 'triangle'
  width: number
  height: number
}

export interface DiamondCutout extends BaseCutout {
  type: 'diamond'
  width: number
  height: number
}

export interface HexagonCutout extends BaseCutout {
  type: 'hexagon'
  width: number
  height: number
}

export type Cutout =
  | CircleCutout
  | CapsuleCutout
  | RoundedRectCutout
  | RectangleCutout
  | TriangleCutout
  | DiamondCutout
  | HexagonCutout

export interface GridfinityDefaults {
  gridPitch: number
  wallInset: number
  gridfinityUnitHeight: number
}

export const defaults = {
  width: 38,
  depth: 38,

  gridX: 1,
  gridY: 1,

  heightUnits: 3,
  gridfinityUnitHeight: 7,

  plateThickness: 2.4,

  supportThickness: 1.4,
  supportLength: 7,
  supportInset: 0.8
}

export interface InsertParameters {
  gridX: number
  gridY: number
  width: number
  depth: number
  heightUnits: number
  plateThickness: number

  supportThickness: number
  supportLength: number
  supportInset: number

  cutouts: Cutout[]
}

export function insertDimension(units: number): number {
  return units * 42 - 4
}

export function supportHeight(params: InsertParameters): number {
  return Math.max(
    0,
    params.heightUnits * defaults.gridfinityUnitHeight - params.plateThickness
  )
}

export function makeCutout(type: CutoutType, counter: number): Cutout {
  const seed = {
    id: `${Date.now()}_${counter}`,
    x: 0,
    y: 0,
    rotation: 0,
    clearance: 0.25,
    scale: 1
  }
  switch (type) {
    case 'circle':
      return { ...seed, type: 'circle', diameter: 12 }
    case 'capsule':
      return { ...seed, type: 'capsule', width: 10, height: 28 }
    case 'rounded-rect':
      return { ...seed, type: 'rounded-rect', width: 16, height: 30, radius: 2 }
    case 'rectangle':
      return { ...seed, type: 'rectangle', width: 16, height: 30 }
    case 'triangle':
      return { ...seed, type: 'triangle', width: 20, height: 18 }
    case 'diamond':
      return { ...seed, type: 'diamond', width: 18, height: 18 }
    case 'hexagon':
      return { ...seed, type: 'hexagon', width: 18, height: 20 }
  }
}
