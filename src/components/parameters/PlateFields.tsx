import type { InsertParameters } from '../../lib/types'
import { insertDimension } from '../../lib/types'
import { Num } from './fields'

interface Props {
  params: InsertParameters
  patch: (p: Partial<InsertParameters>) => void
}

export function PlateFields({ params, patch }: Props) {
  const onGridX = (gridX: number) =>
    patch({ gridX, width: insertDimension(gridX) })
  const onGridY = (gridY: number) =>
    patch({ gridY, depth: insertDimension(gridY) })

  return (
    <>
      <div className="flex gap-2">
        <Num label="Grid X" value={params.gridX} step={1} onChange={onGridX} />
        <Num label="Grid Y" value={params.gridY} step={1} onChange={onGridY} />
      </div>

      <div className="flex gap-2">
        <Num
          label="Width (mm)"
          value={params.width}
          step={1}
          onChange={(w) => patch({ width: w })}
        />
        <Num
          label="Depth (mm)"
          value={params.depth}
          step={1}
          onChange={(d) => patch({ depth: d })}
        />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-[12px] text-muted">Height (U)</label>
        <div className="flex items-center gap-2 rounded-md border border-border bg-panel-2 px-2 py-[6px]">
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={params.heightUnits}
            onChange={(e) =>
              patch({ heightUnits: parseFloat(e.target.value) || 1 })
            }
            className="min-w-0 flex-1 accent-[#4f8cff]"
          />
          <output
            className="w-7 text-center text-[13px] font-semibold text-accent-2"
          >
            {params.heightUnits}
          </output>
        </div>
      </div>

      <div className="flex gap-2">
        <Num
          label="Plate Thickness (mm)"
          value={params.plateThickness}
          step={0.1}
          onChange={(t) => patch({ plateThickness: t })}
        />
        <Num
          label="Support Width (mm)"
          value={params.supportThickness}
          step={0.1}
          onChange={(v) => patch({ supportThickness: v })}
        />
      </div>
    </>
  )
}