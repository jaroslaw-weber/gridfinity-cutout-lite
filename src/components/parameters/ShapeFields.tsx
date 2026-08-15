import type { Cutout } from '../../lib/types'
import { SliderNum } from './fields'

export function ShapeFields({
  cutout,
  onChange
}: {
  cutout: Cutout
  onChange: (p: Partial<Cutout>) => void
}) {
  switch (cutout.type) {
    case 'circle':
      return (
        <SliderNum
          label="Diameter (mm)"
          value={cutout.diameter}
          min={2}
          max={100}
          step={0.5}
          onChange={(v) => onChange({ diameter: v })}
        />
      )
    case 'capsule':
      return (
        <>
          <SliderNum
            label="Width (mm)"
            value={cutout.width}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ width: v })}
          />
          <SliderNum
            label="Height (mm)"
            value={cutout.height}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ height: v })}
          />
        </>
      )
    case 'rounded-rect':
      return (
        <>
          <SliderNum
            label="Width (mm)"
            value={cutout.width}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ width: v })}
          />
          <SliderNum
            label="Height (mm)"
            value={cutout.height}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ height: v })}
          />
          <SliderNum
            label="Radius (mm)"
            value={cutout.radius}
            min={0}
            max={50}
            step={0.5}
            onChange={(v) => onChange({ radius: v })}
          />
        </>
      )
    case 'rectangle':
    case 'triangle':
    case 'diamond':
    case 'hexagon':
      return (
        <>
          <SliderNum
            label="Width (mm)"
            value={cutout.width}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ width: v })}
          />
          <SliderNum
            label="Height (mm)"
            value={cutout.height}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ height: v })}
          />
        </>
      )
  }
}