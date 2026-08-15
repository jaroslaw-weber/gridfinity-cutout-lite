import * as THREE from 'three'
import { STLExporter } from 'three-stdlib'
import type { Cutout, InsertParameters } from '../types'

export function exportSTL(group: THREE.Group): Blob {
  group.updateMatrixWorld(true)
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
    case 'triangle':
      return `tri_${c.width}x${c.height}mm`
    case 'diamond':
      return `diamond_${c.width}x${c.height}mm`
    case 'hexagon':
      return `hex_${c.width}x${c.height}mm`
  }
}

export function defaultFilename(params: InsertParameters): string {
  const grid = `${params.gridX}x${params.gridY}`
  const u = `${params.heightUnits}u`
  const parts = params.cutouts.map(typeLabel)
  const suffix = parts.length === 1 ? parts[0] : `${parts.length}x_${parts[0]}`
  return `gmci_${grid}_${u}_${suffix}.stl`
}